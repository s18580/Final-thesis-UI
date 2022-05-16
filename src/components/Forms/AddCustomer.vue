<template>
  <div id="mainCo">
		<va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
			<h1>Dodaj nowego klienta</h1>
            <div class="radio-box">
                <va-radio
                    v-for="(option, index) in radioOptions"
                    :key="index"
                    v-model="selectedRadioOption"
                    :option="option"
                />
            </div>
            <va-input
                v-if="selectedRadioOption==='Firma'"
                class="some-space mb-4"
                v-model="companyName"
                :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                label="Nazwa"
                placeholder="Nazwa firmy klienta"
            />
            <va-input
                v-if="selectedRadioOption==='Firma'"
                class="some-space mb-4"
                v-model="nip"
                :rules="[(v) => v.length === 10 || `Pole nip jest nieprawidłowe.`]"
                label="NIP"
                placeholder="NIP klienta"
            />
            <va-input
                v-if="selectedRadioOption==='Firma'"
                class="some-space mb-4"
                v-model="regon"
                :rules="[(v) => v.length > 8 || `Pole regon jest nieprawidłowe.`, (v) => v.length < 15 || `Pole regon przekroczyło limit znaków.`]"
                label="REGON"
                placeholder="Regon klienta"
            />
            <va-input
                v-if="selectedRadioOption==='Firma'"
                class="some-space mb-4"
                v-model="companyPhone"
                :rules="[(v) => v.length > 8 || `Pole telefon jest nieprawidłowe.`, (v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                label="Telefon (opcjonalnie)"
                placeholder="Telefon firmowy klienta"
            />
            <va-input
                v-if="selectedRadioOption==='Firma'"
                class="some-space mb-4"
                v-model="companyEmail"
                :rules="[(v) => v.length > 0 || `Pole email nie może być puste.`, (v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                label="Email (opcjonalnie)"
                placeholder="Email firmowy klienta"
            />
            <va-input
                v-if="selectedRadioOption==='Osoba prywatna'"
                class="some-space mb-4"
                v-model="customerName"
                :rules="[(v) => v.length > 0 || `Pole imię nie może być puste.`, (v) => v.length < 33 || `Pole imię przekroczyło limit znaków.`]"
                label="Imię"
                placeholder="Imię klienta"
            />
            <va-input
                v-if="selectedRadioOption==='Osoba prywatna'"
                class="some-space mb-4"
                v-model="customerLastName"
                :rules="[(v) => v.length > 0 || `Pole nazwisko nie może być puste.`, (v) => v.length < 65 || `Pole nazwisko przekroczyło limit znaków.`]"
                label="Nazwisko"
                placeholder="Nazwisko klienta"
            />
            <va-input
                v-if="selectedRadioOption==='Osoba prywatna'"
                class="some-space mb-4"
                v-model="customerPhone"
                :rules="[(v) => v.length > 8 || `Pole telefon jest nieprawidłowe.`, (v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                label="Telefon"
                placeholder="Telefon klienta"
            />
            <va-input
                v-if="selectedRadioOption==='Osoba prywatna'"
                class="some-space mb-4"
                v-model="customerEmail"
                :rules="[(v) => v.length > 0 || `Pole email nie może być puste.`, (v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                label="Email"
                placeholder="Email klienta"
            />
            <va-divider inset />
			<div id="card-container">
				<div class="objects-card-wrapper">
					<h6>Osoby kontaktowe klienta:</h6>
					<div class="objects-card">
						<div v-for="person in contactPepole" :key="person.IdRepresentative" class="card-items">
                            <div>
                                {{ person.Name }}
                            </div>
                            <div class="card-icons">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>

                                <svg @click="removeContact(person.IdRepresentative)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                            </div>
						</div>
					</div>
                    <va-button type="button" color="success" gradient>Dodaj osobę</va-button>
				</div>
                <va-divider vertical />
				<div class="objects-card-wrapper">
					<h6>Adresy klienta:</h6>
					<div class="objects-card">
						<div v-for="address in suplierAddresses" :key="address.IdAddress" class="card-items">
                            <div>
                                {{ address.Name }}
                            </div>
                            <div class="card-icons">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>

                                <svg @click="removeAddress(address.IdAddress)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                            </div>
						</div>
					</div>
                    <va-button @click="AddD()" type="button" color="success" gradient>Dodaj adres</va-button>
				</div>
			</div>
            <va-button type="submit" color="info" gradient class="my-3">Dodaj</va-button>
		</va-form>
	</div>
</template>

<script>
import CallAPI from '../../axios/axios-connection.js';
import CallSeq from '../../logging/seq-logger.js';

export default {
  name: 'AddCustomer',
	data() {
		return {
			customerName: "",
            customerLastName: "",
            customerEmail: "",
            customerPhone: "",
            nip: "",
            regon: "",
            companyName: "",
            companyEmail: "",
            companyPhone: "",
            selectedRadioOption: "Firma",
            radioOptions: ['Firma', 'Osoba prywatna'],
            isFormValidate: false,
			contactPepole: [],
			customerAddresses: [],
		}
	},
	methods: {
		async submitForm() {
            if(this.validateForm()) {
                await CallAPI.get(`/Address/getAddresses`)
                .then(res => {
                    console.log(res); // switch that on the toast message
                    this.$router.push('home');
                })
                .catch(err => {
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
		},
        validateForm() {
            this.$refs.form.validate();
            if(this.contactPepole.length == 0) this.isFormValidate = false;
            if(this.suplierAddresses.length == 0) this.isFormValidate = false;

            return this.isFormValidate;
        },
        removeAddress(id) {
            this.suplierAddresses = this.suplierAddresses.filter(item => item.IdAddress !== id);
        },
        removeContact(id) {
            this.contactPepole = this.contactPepole.filter(item => item.IdAddress !== id);
        }
	},
}
</script>

<style scoped>
#mainCo {
	margin-right: 100px;
	margin-left: 100px;
	padding: 40px;
	background: white;
	border-radius: 25px;
}

h1 {
    margin-bottom: 50px;
}

.some-space {
    padding-bottom: 20px;
}

.some-top-space {
    padding-top: 20px;
}

#form {
	padding-right: 150px;
	padding-left: 150px;
}

.radio-box {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 50px;
}

.input-box {
	padding-top: 50px;
}

.input-box input,
.input-box textarea {
	text-align: center;
	margin-top: 10px;
	margin-bottom: 10px;
    border-radius: 25px;
}

.error-message {
	text-align: left;
	color: red;
}

.error-box {
	display: flex;
	justify-content: center;
}

.error-icon {
	margin-right: 5px;
	color: red;
}

#card-container {
	display: flex;
	justify-content: space-around;
}

.objects-card-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 60px;
	margin-bottom: 60px;
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
