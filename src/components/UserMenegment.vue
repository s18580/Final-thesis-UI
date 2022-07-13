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
                            {{ user.Name }}
                        </va-list-item-label>

                        <va-list-item-label caption>
                            {{ user.WorksiteName }}
                        </va-list-item-label>
                    </va-list-item-section>

                    <va-list-item-section icon>
                        <va-button flat icon="edit" @click="showDetailsModal(user)" />
                        <va-button flat icon="delete" @click="openDeleteModal(user)" />
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
import UserDetails from './ReuseComponents/Modals/UserDetails.vue';

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
    mounted() {
        //api calls for an arrays
        this.users = [];
    },
    methods: {
        showDetailsModal(user) {
            this.selectedWorker = user;
            this.showModal = true;
        },
        closeDetailsModal() {
            this.showModal = false;
        },
        editWorker() {
            //edit
        },
        openDeleteModal(user) {
            this.selectedWorker = user;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.showDeleteModal = false;
        },
        deleteWorker() {
            //delete
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