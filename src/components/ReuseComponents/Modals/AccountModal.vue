<template>
    <va-modal
        v-model="showModal"
        title="Moje dane"
        hide-default-actions
        @click-outside="closeModal()"
    >
        <div class="background-modal">
            <div id="mainContent">
                <va-input
                    class="some-space mb-4"
                    v-model="userName"
                    label="Imię i nazwisko"
                    readonly
                />
                <va-input
                    class="some-space mb-4"
                    v-model="email"
                    label="Email"
                    readonly
                />
                <va-input
                    class="some-space mb-4"
                    v-model="phoneNumber"
                    label="Telefon"
                    readonly
                />
                <va-input
                    class="some-space mb-4"
                    v-model="userWorksite"
                    label="Stanowisko"
                    readonly
                />
                <va-button id="okButton" @click="closeModal()" color="info" gradient class="my-3 sub">Ok</va-button>
            </div>
        </div>
    </va-modal>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import { useUserStore } from '@/stores/UserStore';

export default {
  name: 'AccountModal',
  emits: ["close"],
	data() {
		return {
            userName: "",
            email: "",
            phoneNumber: "",
            userWorksite: "",
            showModal: true,
		}
	},
	methods: {
        closeModal() {
            this.$emit('close');
        }
	},
    async updated() {
        const userStore = useUserStore();
        let callPath = "/Worker/getWorker?id=" + userStore.userId;

        var userData = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        this.userName = userData.name + " " + userData.lastName;
        this.email = userData.emailAddres;
        this.phoneNumber = userData.phoneNumber;
        if(userData.worksite == null) {
            this.userWorksite = 'Brak stanowiska';
        }else {
            this.userWorksite = userData.worksite.name;
        }
    }
}
</script>

<style scoped>
#mainContent {
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 80px;
    margin-top: 40px;
    margin-bottom: 0px;
}

.search-input-box label {
	color: #2C82E0;
}

.search-input-box {
	text-align: center;
    min-width: 250px;
    margin-bottom: 20px;
}

.buttonCo {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    align-content: center;
}
</style>

