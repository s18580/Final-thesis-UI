<template>
  <div id="background">
        <div id="headerCo">
            <h1>Dodaj konto użytkownika</h1>
            <va-divider />
        </div>
        <div id="mainCoOuter">
            <h3>Dane uzytkownika</h3>
            <va-divider />
            <div id="mainCoInner">
            <va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
                <va-input
                    class="some-space mb-4"
                    v-model="workerName"
                    :rules="[(v) => v.length > 0 || `Pole imię nie może być puste.`, (v) => v.length < 33 || `Pole imię przekroczyło limit znaków.`]"
                    label="Imię"
                    placeholder="Imię pracownika"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="workerLastName"
                    :rules="[(v) => v.length > 0 || `Pole nazwisko nie może być puste.`, (v) => v.length < 65 || `Pole nazwisko przekroczyło limit znaków.`]"
                    label="Nazwisko"
                    placeholder="Nazwisko pracownika"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="workerEmail"
                    :rules="[(v) => v.length > 0 || `Pole email nie może być puste`, (v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                    label="Email"
                    placeholder="Email pracownika"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="workerPhone"
                    :rules="[(v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                    label="Telefon"
                    placeholder="Telefon pracownika"
                />
                <va-select
                    class="some-space mb-4"
                    v-model="selectedWorksite"
                    :options="worksites"
                    label="Stanowisko"
                    placeholder="Bez stanowiska"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="passwordOne"
                    :rules="[(v) => v.length > 8 || `Hasło jest nieprawidłowe.`, (v) => v.length < 25 || `Hasło przekroczyło limit znaków.`, (v) => v == passwordTwo || `Hasła nie są takie same.`]"
                    label="Hasło"
                    placeholder="Hasło pracownika"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="passwordTwo"
                    :rules="[(v) => v == passwordOne || `Hasła nie są takie same.`]"
                    label="Powtórz hasło"
                    placeholder="Powtórz hasło pracownika"
                />
                <va-button type="submit" color="info" gradient class="my-3">Dodaj</va-button>
            </va-form>
        </div>
        </div>
        <div id="rolesCoOuter">
            <h3>Dostępy uzytkownika</h3>
            <va-divider />
            <div id="rolesCoInner">
                <div class="objects-card-wrapper">
					<h6>Role użytkownika:</h6>
					<div class="objects-card">
						<div v-for="role in workerRoles" :key="role.idRole" class="card-items">
                            <div>
                                {{ role.name }}
                            </div>
                            <div class="card-icons">
                                <svg @click="removeRole(role.idRole)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                            </div>
						</div>
					</div>
                    <va-button @click="showModal=true" type="button" color="success" gradient>Dodaj rolę</va-button>
                    <RoleModal v-if="showModal" @close="showModal=false" @addRole="addRole($event)"/>
				</div>
            </div>
        </div>
    </div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import RoleModal from '@/components/ReuseComponents/Modals/RoleModal.vue';

export default {
  name: 'AddWorker',
	data() {
		return {
			workerName: "",
            workerLastName: "",
            workerEmail: "",
			workerPhone: "",
            passwordOne: "",
            passwordTwo: "",
            workerRoles: [],
            isFormValidate: false,
            selectedWorksite: "Bez stanowiska",
            rawWorksites: [],
            showModal: false,
		}
	},
    components: { RoleModal },
    async mounted() {
        let callPath = "/Worksite/getWorksites";
        this.rawWorksites = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });
    },
    computed: {
        worksites(){
            let resultArr = this.rawWorksites.map(function(item) {
                return item["name"];
            });

            return ["Bez stanowiska"].concat(resultArr);
        }
    },
	methods: {
		async submitForm() {
            if(this.validateForm()) {
                let callPath = "/User/register";
                let body = {
                    name: this.workerName,
                    lastName: this.workerLastName,
                    phoneNumber: this.workerPhone,
                    emailAddres: this.workerEmail,
                    password: this.passwordOne,
                    idWorksite: this.getWorksiteByName(this.selectedWorksite)
                };

                await CallAPI.post(callPath, body)
                .then(res => {
                    this.$vaToast.init({ message: 'Konto zostało dodane.', color: 'success', duration: 3000 })
                    return res.data;
                })
                .catch(err => {
                    if(err.message.includes("422")) {
                        this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                    }else{
                        this.$vaToast.init({ message: 'Błąd dodawania konta.', color: 'danger', duration: 3000 })
                    }

                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
		},
        getWorksiteByName(worksiteName){
            if(worksiteName == "Bez stanowiska") {
                return null;
            } else {
                return this.rawWorksites.find(element => element.name == worksiteName).idWorksite;
            }
        },  
        validateForm() {
            this.$refs.form.validate();

            return this.isFormValidate;
        },
        addRole(e) {
            if(this.workerRoles.find(element => element.name == e.name) == undefined) {
                this.workerRoles.push(e);
            }
        }
	},
}
</script>

<style scoped>
.some-space {
    padding-bottom: 20px;
}

#form {
	padding-right: 150px;
	padding-left: 150px;
}

#background {
    display: grid;
    grid-template-columns: 100px 1fr 1fr 1fr 1fr 100px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". header header header header ."
    ". main main main sidebar .";
    grid-gap: 30px;
}

#mainCoOuter {
    grid-area: main;
}

#mainCoInner {
	padding-top: 50px;
    padding-left: 20px;
    padding-right: 20px;
	background: white;
	border-radius: 25px;
}

#rolesCoOuter {
    grid-area: sidebar;
}

#rolesCoInner {
    padding-top: 5px;
    background: white;
	border-radius: 25px;
}

#headerCo {
    padding: 20px;
    grid-area: header;
    background: white;
	border-radius: 25px;
}





.objects-card-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 20px;
	padding-bottom: 20px;
}

.objects-card {
	border-color: rgb(226, 226, 226);
	border-style: solid;
    border-radius: 10px;
	width: 250px;
	max-height: 300px;
	margin-bottom: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
    max-height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.card-items {
    background: #ffcc80;
    padding: 5px;
    margin: 5px;
    width: 100%;
    border-radius: 50px;
    border-color:burlywood;
    border-style: solid;
    border-width: 3px;
    display: flex;
    justify-content: space-between;
}

.card-icons svg{
    margin-left: 5px;
}

.objects-card::-webkit-scrollbar {
    width: 0.25rem;
}

.objects-card::-webkit-scrollbar-thumb {
    background: burlywood;
    border-radius: 100vw;
}

.objects-card::-webkit-scrollbar-thumb:hover {
    background: rgb(214, 145, 54);
}

</style>
