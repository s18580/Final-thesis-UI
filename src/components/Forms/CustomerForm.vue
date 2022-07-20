<template>
  <div id="mainCo">
        <h1>Dodaj nowego klienta</h1>
        <div class="radio-box">
            <va-radio
                v-for="(option, index) in radioOptions"
                :key="index"
                v-model="selectedRadioOption"
                :option="option"
            />
        </div>
		<va-form @submit.prevent="this.submitFormCompany()" tag="form" ref="formCompany" @validation="isFormCompanyValidate = $event">
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
                :rules="[(v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                label="Telefon (opcjonalnie)"
                placeholder="Telefon firmowy klienta"
            />
            <va-input
                v-if="selectedRadioOption==='Firma'"
                class="some-space mb-4"
                v-model="companyEmail"
                :rules="[(v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                label="Email (opcjonalnie)"
                placeholder="Email firmowy klienta"
            />
        </va-form>
        <va-form @submit.prevent="this.submitFormPerson()" tag="form" ref="formPerson" @validation="isFormPersonValidate = $event">
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
                :rules="[(v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                label="Telefon (opcjonalnie)"
                placeholder="Telefon klienta"
            />
            <va-input
                v-if="selectedRadioOption==='Osoba prywatna'"
                class="some-space mb-4"
                v-model="customerEmail"
                :rules="[(v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                label="Email (opcjonalnie)"
                placeholder="Email klienta"
            />
        </va-form>
        <va-divider inset />
        <div id="card-container">
            <div class="objects-card-wrapper">
                <h6>Osoby kontaktowe klienta:</h6>
                <div class="objects-card">
                    <div v-for="person in contactPepole" :key="person.IdForRepresentativeTable" class="card-items">
                        <div>
                            {{ person.name + ' ' + person.lastName }}
                        </div>
                        <div class="card-icons">
                            <svg @click="editContactInModal(person)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>

                            <svg @click="removeContact(person.IdForRepresentativeTable)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <va-button @click="showContactModal=true" type="button" color="success" gradient>Dodaj osobę</va-button>
                <RepresentativeModal :person="editedContact" v-if="showContactModal" @close="closeContactModal()" @createRepresentative="addContact($event)" @editRepresentative="editContact($event)"/>
            </div>
            <va-divider vertical />
            <div class="objects-card-wrapper">
                <h6>Adresy klienta:</h6>
                <div class="objects-card">
                    <div v-for="address in customerAddresses" :key="address.IdForAddressTable" class="card-items">
                        <div>
                            {{ address.name }}
                        </div>
                        <div class="card-icons">
                            <svg @click="editAddressInModal(address)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>

                            <svg @click="removeAddress(address.IdForAddressTable)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <va-button @click="showAddressModal=true" type="button" color="success" gradient>Dodaj adres</va-button>
                <AddressModal :addr="editedAddress" v-if="showAddressModal" @close="closeAddressModal()" @createAddress="addAddress($event)" @editAddress="editAddress($event)"/>
            </div>
        </div>
        <va-button @click="submitForm()" type="submit" color="info" gradient class="my-3">Dodaj</va-button>
	</div>
</template>

<script>
import CallAPI from '../../axios/axios-connection.js';
import CallSeq from '../../logging/seq-logger.js';
import AddressModal from '../ReuseComponents/AddressModal.vue';
import RepresentativeModal from '../ReuseComponents/RepresentativeModal.vue';

export default {
  name: 'AddCustomer',
	data() {
		return {
            addressCounter: 0,
            contactCounter: 0,
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
            isFormCompanyValidate: false,
            isFormPersonValidate: false,
			contactPepole: [],
			customerAddresses: [],
            showAddressModal: false,
            editedAddress: null,
            showContactModal: false,
            editedContact: null,
		}
	},
    components: { AddressModal, RepresentativeModal },
	methods: {
        async submitForm() {
            if(this.validateForm(this.selectedRadioOption === 'Firma')){
                let customerId = await this.createClient(this.selectedRadioOption === 'Firma');
                //further validation needed
                await this.createClientAddresses(customerId);
                await this.createClientRepresentatives(customerId);
                // delete after unsucces ?
                this.$router.push('home');
            }
        },
        async createClientAddresses(customerId) {
            for(var i=0; i < this.customerAddresses.length; i++) {
                console.log(this.customerAddresses[i]);
                let callPath = "/Address/createAddress"
                let body = {
                    Name: this.customerAddresses[i].name,
                    City: this.customerAddresses[i].city,
                    Country: this.customerAddresses[i].country,
                    PostCode: this.customerAddresses[i].postCode,
                    StreetName: this.customerAddresses[i].streetName,
                    StreetNumber: this.customerAddresses[i].streetNumber,
                    ApartmentNumber: this.customerAddresses[i].apartmentNumber,
                    IdSupplier: null,
                    IdCustomer: customerId
                }

                await CallAPI.post(callPath, body)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
        },
        async createClientRepresentatives(customerId) {
            for(var i=0; i < this.contactPepole.length; i++) {
                console.log(this.contactPepole[i]);
                let callPath = "/Representative/createRepresentative"
                let body = {
                    Name: this.contactPepole[i].name,
                    LastName: this.contactPepole[i].lastName,
                    PhoneNumber: this.contactPepole[i].phoneNumber,
                    EmailAddress: this.contactPepole[i].addressEmail,
                    IdSupplier: null,
                    IdCustomer: customerId
                }

                await CallAPI.post(callPath, body)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            } 
        },
        async createClient(isCompany) {
            if(isCompany) { //to add WorkerId
                let callPath = "/Customer/createCompanyCustomer"
                let body = {
                    CompanyName: this.companyName,
                    NIP: this.nip,
                    Regon: this.regon,
                    CompanyPhoneNumber: this.companyPhone,
                    CompanyEmailAddress: this.companyEmail,
                    IdWorker: null
                }

                return await CallAPI.post(callPath, body)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });

            } else {
                let callPath = "/Customer/createPersonCustomer"
                let body = {
                    Name: this.customerName,
                    LastName: this.customerLastName,
                    CompanyPhoneNumber: this.customerPhone,
                    CompanyEmailAddress: this.customerEmail,
                    IdWorker: null
                }

                return await CallAPI.post(callPath, body)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
        },
        validateForm(isCompany) {
            if(isCompany) {
                this.$refs.formCompany.validate();
                if(this.contactPepole.length === 0) this.isFormCompanyValidate = false;
                //popup info -> min 1 contact person
                return this.isFormCompanyValidate;
            } else {
                this.$refs.formPerson.validate();
                return this.isFormPersonValidate;
            }
        },
        closeAddressModal() {
            this.showAddressModal=false;
            this.editedAddress=null;
        },
        addAddress(e) {
            e.newAddress.IdForAddressTable = this.addressCounter;
            this.customerAddresses.push(e.newAddress);
            this.addressCounter++;
        },
        editAddress(e) {
            for(const obj of this.customerAddresses){
                if (obj.IdForAddressTable === e.newAddress.IdForAddressTable) {
                    obj.name = e.newAddress.name;
                    obj.country = e.newAddress.country;
                    obj.city = e.newAddress.city;
                    obj.postCode = e.newAddress.postCode;
                    obj.streetName = e.newAddress.streetName;
                    obj.streetNumber = e.newAddress.streetNumber;
                    obj.apartmentNumber = e.newAddress.apartmentNumber;
                    break;
                }
            }
        },
        editAddressInModal(address) {
            this.editedAddress = address;
            this.showAddressModal = true;
        },
        removeAddress(id) {
            this.customerAddresses = this.customerAddresses.filter(item => item.IdForAddressTable !== id);
        },
        closeContactModal() {
            this.showContactModal = false;
            this.editedContact = null;
        },
        addContact(e) {
            e.newRepresentative.IdForRepresentativeTable = this.contactCounter;
            this.contactPepole.push(e.newRepresentative);
            this.contactCounter++;
        },
        editContact(e) {
            for(const obj of this.contactPepole){
                if (obj.IdForRepresentativeTable === e.newRepresentative.IdForRepresentativeTable) {
                    obj.name = e.newRepresentative.name;
                    obj.lastName = e.newRepresentative.lastName;
                    obj.phoneNumber = e.newRepresentative.phoneNumber;
                    obj.addressEmail = e.newRepresentative.addressEmail;
                    break;
                }
            }
        },
        editContactInModal(contact) {
            this.editedContact = contact;
            this.showContactModal = true;
        },
        removeContact(id) {
            this.contactPepole = this.contactPepole.filter(item => item.IdForRepresentativeTable !== id);
        },
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
    padding-right: 190px;
	padding-left: 190px;
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
