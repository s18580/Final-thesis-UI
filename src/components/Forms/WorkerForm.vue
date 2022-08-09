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
                    class="gridFirstC gridFirstR inputWidth"
                    v-model="workerName"
                    :rules="[(v) => v.length > 0 || `Pole imię nie może być puste.`, (v) => v.length < 33 || `Pole imię przekroczyło limit znaków.`]"
                    label="Imię"
                    placeholder="Imię pracownika"
                />
                <va-input
                    class="gridSecondC gridFirstR inputWidth"
                    v-model="workerLastName"
                    :rules="[(v) => v.length > 0 || `Pole nazwisko nie może być puste.`, (v) => v.length < 65 || `Pole nazwisko przekroczyło limit znaków.`]"
                    label="Nazwisko"
                    placeholder="Nazwisko pracownika"
                />
                <va-input
                    class="gridFirstC gridSecondR inputWidth"
                    v-model="workerEmail"
                    :rules="[(v) => v.length > 0 || `Pole email nie może być puste`, (v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                    label="Email"
                    placeholder="Email pracownika"
                />
                <va-input
                    class="gridSecondC gridSecondR inputWidth"
                    v-model="workerPhone"
                    :rules="[(v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                    label="Telefon"
                    placeholder="Telefon pracownika"
                />
                <div class="gridSpreadC gridFourthR inputWidth">
                    <va-select
                        class=""
                        v-model="selectedWorksite"
                        :options="worksites"
                        label="Stanowisko"
                        placeholder="Bez stanowiska"
                    />
                </div>
                <va-input
                    class="gridFirstC gridThirdR inputWidth"
                    v-model="passwordOne"
                    :rules="[(v) => v.length > 8 || `Hasło musi mieć min. 8 znaków.`, (v) => v.length < 25 || `Hasło przekroczyło limit znaków.`, (v) => v == passwordTwo || `Hasła nie są takie same.`]"
                    label="Hasło"
                    placeholder="Hasło pracownika"
                />
                <va-input
                    class="gridSecondC gridThirdR inputWidth"
                    v-model="passwordTwo"
                    :rules="[(v) => v == passwordOne || `Hasła nie są takie same.`]"
                    label="Powtórz hasło"
                    placeholder="Powtórz hasło pracownika"
                />
                <div id="submitButtonContainer">
                    <va-button id="submitButton" type="submit" color="info" gradient class="my-3">Dodaj</va-button>
                </div>
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
                            <div id="roleNameCo" class="my-1">
                                {{ role.name }}
                            </div>
                            <div class="card-icons">
                                <va-icon @click="removeRole(role)" color="#1b63b1" class="material-icons">delete</va-icon>
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
            workerRoles: [{name: "Basic"}, {name: "Admin"}, {name: "Office"}, {name: "Accountant"}, {name: "Manager"}],
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
        },
        removeRole(roleToDelete) {
            const index = this.workerRoles.indexOf(roleToDelete);
            if (index > -1) {
                this.workerRoles.splice(index, 1);
            }
        }
	},
}
</script>

<style scoped>
.inputWidth {
    min-width: 300px;
}

#form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;
}

.gridSpreadC {
    grid-column-start: 1;
    grid-column-end: end;
}

.gridFirstC {
    grid-column-start: 1;
    grid-column-end: 1;
}

.gridFirstR {
    grid-row-start: 1;
    grid-row-end: 1;
}

.gridSecondC {
    grid-column-start: 2;
    grid-column-end: 2;
}

.gridSecondR {
    grid-row-start: 2;
    grid-row-end: 2;
}

.gridThirdR {
    grid-row-start: 3;
    grid-row-end: 3;
}

.gridFourthR {
    grid-row-start: 4;
    grid-row-end: 4;
}

#submitButtonContainer {
    grid-column-start: 1;
    grid-column-end: end;
    grid-row-start: 5;
    grid-row-end: 5;
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
    background: #d3e5f8;
    padding: 10px;
    margin: 5px;
    width: 100%;
    border-radius: 50px;
    border: solid 1px #1b63b1;
    display: grid;
    grid-template-columns: 1fr 40px;
    grid-template-rows: 1fr;
}

.card-icons svg{
    margin-left: 5px;
    cursor: pointer;
}

</style>
