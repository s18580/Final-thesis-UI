<template>
    <div id="background">
        <div id="headerCo">
            <h1>Zarządzaj kontami</h1>
            <va-divider />
        </div>
        <div id="mainCo">
            <va-list>
                <va-list-label>
                    Użytkownicy
                </va-list-label>

                <va-list-item
                    v-for="user in users"
                    :key="user.Id"
                >
                    <va-list-item-section avatar>
                        <va-avatar color="#6B5B95" icon="face" />
                    </va-list-item-section>

                    <va-list-item-section>
                        <va-list-item-label>
                            {{ user.name + " " + user.lastName }}
                        </va-list-item-label>

                        <va-list-item-label caption>
                            {{ this.getWorksite(user) }}
                        </va-list-item-label>
                    </va-list-item-section>

                    <va-list-item-section icon>
                        <va-popover message="Edytuj uzytkownika">
                            <va-button flat icon="edit" @click="editWorker(user)" />
                        </va-popover>
                        <va-popover message="Dezaktywuj użytkownika">
                            <va-button v-if="!user.isDisabled" flat icon="person_off" @click="disableWorker(user)" />
                        </va-popover>
                        <va-popover message="Aktywuj użytkownika">
                            <va-button v-if="user.isDisabled" flat icon="person" @click="disableWorker(user)" />
                        </va-popover>
                        <va-popover message="Usuń użytkownika">
                            <va-button flat icon="delete" @click="openDeleteModal(user)" />
                        </va-popover>
                    </va-list-item-section>
                </va-list-item>
            </va-list>
        </div>
        <UserDetails v-if="showModal" :worker="selectedWorker" @close="closeDetailsModal()" @editWorker="editWorker()"/>
        <va-modal v-model="showDeleteModal"
            message="Czy napewno chcesz usunąć tego pracownika ?"
            size="small"
            title="Usuń pracownika"
            cancel-text="Anuluj"
            ok-text="Usuń"
            @cancel="closeDeleteModal()"
            @click-outside="closeDeleteModal()"
            @ok="deleteWorker()"
        />
    </div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import UserDetails from '@/components/ReuseComponents/Modals/UserDetails.vue';

export default {
    name: 'UserMenegment',
	data() {
		return {
			users: [],
            selectedWorker: null,
            showModal: false,
            showDeleteModal: false,
		}
	},
    components: { UserDetails },
    async mounted() {
        await this.updateUserList();
    },
    methods: {
        async updateUserList() {
            let callPath = "/Worker/getWorkers";
            this.users = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
        getWorksite(user) {
            if(user.worksite != null){
                return user.worksite.name;
            }else{
                return "Brak stanowiska";
            }
        },
        showDetailsModal(user) {
            this.selectedWorker = user;
            this.showModal = true;
        },
        closeDetailsModal() {
            this.showModal = false;
        },
        editWorker(user) {
            this.$router.push({ name: "WorkerForm", params: { id: user.idWorker }});
        },
        openDeleteModal(user) {
            this.selectedWorker = user;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.showDeleteModal = false;
        },
        async deleteWorker() {
            let callPath = "/Worker/deleteWorker";
            console.log(this.selectedWorker);
            let body = { data: { Id: this.selectedWorker.idWorker} };

            await CallAPI.delete(callPath, body)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
            
            await this.updateUserList();
        },
        async disableWorker(user) {
            let callPath = "/Worker/disableWorker";
            let body = { Id: user.idWorker, IsDisabled: !user.isDisabled };

            await CallAPI.post(callPath, body)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            await this.updateUserList();
        }
    }
}
</script>

<style scoped>
#background {
    display: grid;
    grid-template-columns: 100px 1fr 100px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". header ."
    ". main .";
    grid-gap: 30px;

}

#mainCo {
    grid-area: main;
    margin-top: 20px;
	padding: 0px;
    padding-left: 20px;
    padding-right: 20px;
	background: white;
	border-radius: 25px;
    min-width: 800px;
}

#headerCo {
    grid-area: header;
    padding: 20px;
    background: white;
	border-radius: 25px;
    min-width: 800px;
}
</style>