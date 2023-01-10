<template>
    <div id="background">
        <div id="headerCo">
            <h1>Zarządzaj kontami</h1>
            <va-divider />
        </div>
        <div id="mainCo">
            <va-list>
                <va-list-label>
                    Aktywni Użytkownicy
                </va-list-label>

                <va-list-item
                    v-for="user in activeUsers"
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
                        <va-popover message="Zawieś użytkownika">
                            <va-button flat icon="person_off" @click="disableWorker(user)" />
                        </va-popover>
                    </va-list-item-section>
                </va-list-item>
            </va-list>
        </div>
        <div id="mainCo2">
            <va-list>
                <va-list-label>
                    Zawieszeni Użytkownicy
                </va-list-label>

                <va-list-item
                    v-for="user in inActiveUsers"
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
                        <va-popover message="Aktywuj użytkownika">
                            <va-button flat icon="person" @click="disableWorker(user)" />
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
            activeUsers: [],
            inActiveUsers: [],
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
            let users = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.inActiveUsers = users.filter(user => user.isDisabled);

            this.activeUsers = users.filter(user => !user.isDisabled);
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
        async disableWorker(user) {
            let callPath = "/Worker/disableWorker";
            let body = { Id: user.idWorker, IsDisabled: !user.isDisabled };

            await CallAPI.post(callPath, body)
            .then(res => {
                if(user.isDisabled){
                    this.$vaToast.init({ message: 'Aktywowano użytkownika.', color: 'success', duration: 3000 })
                } else {
                    this.$vaToast.init({ message: 'Dezaktywowano użytkownika.', color: 'success', duration: 3000 })
                }
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
    ". mainActive ."
    ". mainInActive .";
    grid-gap: 30px;

}

#mainCo {
    grid-area: mainActive;
    margin-top: 20px;
	padding: 0px;
    padding-left: 20px;
    padding-right: 20px;
	background: white;
	border-radius: 25px;
    min-width: 800px;
}

#mainCo2 {
    grid-area: mainInActive;
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