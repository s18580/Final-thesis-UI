<template>
    <div>
        <h1 class="display-1">Logowanie</h1>
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
            <button> Zaloguj </button>
        </va-form>
    </div>
</template>

<script>
import CallAPI from '../../axios/axios-connection.js';
import CallSeq from '../../logging/seq-logger.js';
import * as jose from 'jose'

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
            if(this.validateForm) {
                let body = { email : this.login, password: this.password };
                let callPath = "/User/login";

                var userData = await CallAPI.post(callPath, body)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });

                console.log(userData);

                const claims = jose.decodeJwt(userData);
                console.log(claims);
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
h1 {
    padding-bottom: 50px;
}

h6 {
    padding-bottom: 20px;
}
</style>