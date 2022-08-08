<template>
    <div id="mainBackground">
        <div id="loginBackground">
            <div id="content">
                <div id="mainContent">
                    <div id="headerContainer">
                        <div>
                            <h4 class="display-4">Logowanie</h4>
                        </div>
                        <div>
                            <p>Wprowadź swoje dane logowania:</p>
                        </div>
                    </div>
                    <div id="inputsContainer">
                        <va-form @submit.prevent="this.submitForm()" tag="form" ref="formLogin" @validation="isFormValidate = $event">
                        <va-input
                            class="some-space mb-4"
                            v-model="login"
                            :rules="[(v) => v.length > 0 || `Pole nazwa użytkownika nie może być puste.`, (v) => v.length < 256 || `Nazwa użytkownika przekroczyła limit znaków.`]"
                            label="Nazwa użytkownika"
                            placeholder="Nazwa użytkownika"
                        />
                        <va-input
                            class="some-space mb-4"
                            v-model="password"
                            type="password"
                            :rules="[(v) => v.length > 0 || `Pole hasło nie może być puste.`, (v) => v.length < 100 || `Hasło przekroczyło limit znaków.`]"
                            label="Hasło"
                            placeholder="Hasło"
                        />
                        <va-button type="submit" color="info">Zaloguj</va-button>
                    </va-form>
                    </div>
                </div>
            </div>
            <div id="loginFooter">
                    
            </div>
        </div>
    </div>
</template>

<script>
import CallAPI from '../../axios/axios-connection.js';
import CallSeq from '../../logging/seq-logger.js';
import { useUserStore } from '@/stores/UserStore';

export default {
    name: 'ErrorPage',
    data() {
        return {
            login: "",
            password: "",
            isFormValidate: false,
        }
    },
    methods: {
        async submitForm() {
            if(this.validateForm()) {
                let body = { email : this.login, password: this.password };
                let callPath = "/User/login";

                await CallAPI.post(callPath, body)
                .then(res => {
                    const userStore = useUserStore();
                    userStore.$patch({
                        id: res.data.userId,
                        name: res.data.userName,
                        token: res.data.userToken,
                        roles: res.data.userRoles,
                    })

                    CallAPI.defaults.headers.common['Authorization'] = "bearer " + userStore.token;

                    this.$router.push({ name: 'home' });
                })
                .catch(err => {
                    if(err.message.includes("401")) {
                        this.$vaToast.init({ message: 'Nieprawidłowe dane logowania.', color: 'danger', duration: 3000 })
                    }else{
                        this.$vaToast.init({ message: 'Błąd logowania.', color: 'danger', duration: 3000 })
                    }
                    
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
        },
        validateForm() {
            this.$refs.formLogin.validate();
            return this.isFormValidate;
        },
    }
}
</script>

<style scoped>
#mainBackground {
    background-image: url('@/assets/login-background.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}

#loginBackground {
    display: grid;
    grid-template-columns: 1fr 500px 1fr;
    grid-template-rows: 100px 600px 50px 1fr;
    grid-template-areas: 
    ". . ."
    ". main ."
    ". footer ."
    ". . .";
}

#content {
    grid-area: main;
    
    display: grid;
    grid-template-columns: 30px 1fr 30px;
    grid-template-rows: 30px 1fr 30px;
    grid-template-areas: 
    ". . ."
    ". main ."
    ". . .";

    box-shadow: 10px 10px 50px 10px black;
    border-radius: 20px;
}

#mainContent {
  margin-left: 0;
  grid-area: main;
}

#headerContainer {
 margin-bottom: 80px;
}

#loginFooter {
 grid-area: footer;
}

h4 {
    padding-bottom: 20px;
    color: lightgray;
}

p{
    color: gray;
}
</style>