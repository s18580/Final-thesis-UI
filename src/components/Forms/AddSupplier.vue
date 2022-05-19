<template>
  <div id="mainCo">
		<va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
			<h1>Dodaj nowego dostawcę</h1>
            <va-input
                class="some-space mb-4"
                v-model="supplierName"
                :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                label="Nazwa"
                placeholder="Nazwa dostawcy"
            />
            <va-input
                class="some-space mb-4"
                v-model="supplierEmail"
                :rules="[(v) => v.length > 0 || `Pole email nie może być puste`, (v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                label="Email"
                placeholder="Email dostawcy"
            />
            <va-input
                class="some-space mb-4"
                v-model="supplierPhone"
                :rules="[(v) => v.length > 8 || `Pole telefon jest nieprawidłowe.`, (v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                label="Telefon"
                placeholder="Telefon dostawcy"
            />
            <va-divider inset />
			<div id="card-container">
				<div class="objects-card-wrapper">
					<h6>Osoby kontaktowe dostawcy:</h6>
					<div class="objects-card">
						<div v-for="person in contactPepole" :key="person.IdForRepresentativeTable" class="card-items">
                            <div>
                                {{ person.name }}
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
					<h6>Adresy dostawcy:</h6>
					<div class="objects-card">
						<div v-for="address in suplierAddresses" :key="address.IdForAddressTable" class="card-items">
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
            <va-input
                class="mb-4 some-top-space"
                v-model="supplierDescription"
                type="textarea"
                :rules="[ (v) => v.length < 255 || `Pole opis przekroczyło limit znaków.`]"
                label="Opis (opcjonalnie)"
            />
            <va-button type="submit" color="info" gradient class="my-3">Dodaj</va-button>
		</va-form>
	</div>
</template>

<script>
import CallAPI from '../../axios/axios-connection.js';
import CallSeq from '../../logging/seq-logger.js';
import AddressModal from '../ReuseComponents/AddressModal.vue';
import RepresentativeModal from '../ReuseComponents/RepresentativeModal.vue';

export default {
  name: 'AddSupplier',
	data() {
		return {
            addressCounter: 0,
            contactCounter: 0,
			supplierName: "",
            supplierEmail: "",
            supplierPhone: "",
			supplierDescription: "",
            isFormValidate: false,
			contactPepole: [],
			suplierAddresses: [],
            showAddressModal: false,
            editedAddress: null,
            showContactModal: false,
            editedContact: null,
		}
	},
    components: {AddressModal, RepresentativeModal},
	methods: {
		async submitForm() {
            if(this.validateForm()) {
                // delete ids before sent -> delete address.IdForAddressTable;

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
        closeAddressModal() {
            this.showAddressModal=false;
            this.editedAddress=null;
        },
        addAddress(e) {
            e.newAddress.IdForAddressTable = this.addressCounter;
            this.suplierAddresses.push(e.newAddress);
            this.addressCounter++;
        },
        editAddress(e) {
            for(const obj of this.suplierAddresses){
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
            this.suplierAddresses = this.suplierAddresses.filter(item => item.IdForAddressTable !== id);
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

.background-modal {
    min-height: 600px;
    min-width: 600px;
}
</style>
