<template>
  <div id="mainCo">
    <div id="headerCo">
            <h1>Dodaj nowego klienta</h1>
            <va-divider />
        </div>
        <div id="mainCoOuter">
            <h3>Dane klienta</h3>
            <va-divider />
            <div id="mainCoInner">
                <div class="gridSpreadC">
                    <va-radio
                        id="customerType"
                        v-for="(option, index) in radioOptions"
                        :key="index"
                        v-model="selectedRadioOption"
                        :option="option"
                    />
                </div>
                <va-form v-if="selectedRadioOption==='Firma'" @submit.prevent="this.submitForm()" id="companyForm" tag="form" ref="formCompany" @validation="isFormCompanyValidate = $event">
                    <va-input
                        id="companyName"
                        class="gridSpreadC gridFirstR inputWidthLong"
                        v-model="companyName"
                        :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                        label="Nazwa"
                        placeholder="Nazwa firmy klienta"
                    />
                    <va-input
                        id="companyNip"
                        class="gridFirstC gridSecondR inputWidth"
                        v-model="nip"
                        :rules="[(v) => v.length === 10 || `Pole nip jest nieprawidłowe.`]"
                        label="NIP"
                        placeholder="NIP klienta"
                    />
                    <va-input
                        id="companyRegon"
                        class="gridSecondC gridSecondR inputWidth"
                        v-model="regon"
                        :rules="[(v) => v.length > 8 || `Pole regon jest nieprawidłowe.`, (v) => v.length < 15 || `Pole regon przekroczyło limit znaków.`]"
                        label="REGON"
                        placeholder="Regon klienta"
                    />
                    <va-input
                        id="companyPhone"
                        class="gridSecondC gridThirdR inputWidth"
                        v-model="companyPhone"
                        :rules="[(v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                        label="Telefon (opcjonalnie)"
                        placeholder="Telefon firmowy klienta"
                    />
                    <va-input
                        id="companyEmail"
                        class="gridFirstC gridThirdR inputWidth"
                        v-model="companyEmail"
                        :rules="[(v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                        label="Email (opcjonalnie)"
                        placeholder="Email firmowy klienta"
                    />
                    <div class="gridSpreadC gridFourthR">
                        <va-button id="addCustomer" type="submit" color="info" gradient class="my-3">Dodaj</va-button>
                    </div>
                </va-form>
                <va-form v-if="selectedRadioOption==='Osoba prywatna'" @submit.prevent="this.submitForm()" id="privateForm" tag="form" ref="formPerson" @validation="isFormPersonValidate = $event">
                    <va-input
                        id="customerName"
                        class="gridFirstC gridFirstR inputWidth"
                        v-model="customerName"
                        :rules="[(v) => v.length > 0 || `Pole imię nie może być puste.`, (v) => v.length < 33 || `Pole imię przekroczyło limit znaków.`]"
                        label="Imię"
                        placeholder="Imię klienta"
                    />
                    <va-input
                        id="customerLastName"
                        class="gridSecondC gridFirstR inputWidth"
                        v-model="customerLastName"
                        :rules="[(v) => v.length > 0 || `Pole nazwisko nie może być puste.`, (v) => v.length < 65 || `Pole nazwisko przekroczyło limit znaków.`]"
                        label="Nazwisko"
                        placeholder="Nazwisko klienta"
                    />
                    <va-input
                        id="customerPhone"
                        class="gridSecondC gridSecondR inputWidth"
                        v-model="customerPhone"
                        :rules="[(v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                        label="Telefon (opcjonalnie)"
                        placeholder="Telefon klienta"
                    />
                    <va-input
                        id="customerEmail"
                        class="gridFirstC gridSecondR inputWidth"
                        v-model="customerEmail"
                        :rules="[(v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                        label="Email (opcjonalnie)"
                        placeholder="Email klienta"
                    />
                    <div class="gridSpreadC gridThirdR">
                        <va-button id="addCustomer" type="submit" color="info" gradient class="my-3">Dodaj</va-button> 
                    </div>
                </va-form>
            </div>
        </div>
        <div id="representativesCoOuter">
            <h3> Osoby kontaktowe klienta  </h3>
            <va-divider />
            <div id="representativesCoInner">
                <va-list>
                    <va-list-label>
                        Lista osób kontaktowych
                    </va-list-label>

                    <va-list-item
                        v-for="person in contactPepole"
                        :key="person.IdForRepresentativeTable"
                    >
                        <va-list-item-section avatar>
                            <va-avatar color="#6B5B95" icon="person" />
                        </va-list-item-section>

                        <va-list-item-section>
                            <va-list-item-label>
                                {{ person.name + ' ' + person.lastName }}
                            </va-list-item-label>

                            <va-list-item-label caption>
                                {{ person.emailAddress }}
                            </va-list-item-label>
                        </va-list-item-section>

                        <va-list-item-section icon>
                            <va-popover message="Edytuj dane osoby" v-if="!readOnlyMode">
                                <va-button flat icon="edit" @click="editContactInModal(person)" />
                            </va-popover>
                            <va-popover message="Usuń osobę" v-if="!readOnlyMode">
                                <va-button flat icon="delete" @click="removeContact(person.IdForRepresentativeTable)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button id="addRepresentative" @click="showContactModal=true" type="button" color="success" gradient>Dodaj osobę</va-button>
                <RepresentativeModal :person="editedContact" v-if="showContactModal" @close="closeContactModal()" @createRepresentative="addContact($event)" @editRepresentative="editContact($event)"/>
            </div>
        </div>
        <div id="adressesCoOuter">
            <h3>Adresy klienta</h3>
            <va-divider />
            <div id="adressesCoInner">
                <va-list>
                    <va-list-label>
                        Lista adresów
                    </va-list-label>

                    <va-list-item
                        v-for="address in customerAddresses"
                        :key="address.IdForAddressTable"
                    >
                        <va-list-item-section avatar>
                            <va-avatar color="#6B5B95" icon="home" />
                        </va-list-item-section>

                        <va-list-item-section>
                            <va-list-item-label>
                                {{ address.name }}
                            </va-list-item-label>

                            <va-list-item-label caption>
                                {{ address.streetName + " " + address.streetNumber + ", " + address.city }}
                            </va-list-item-label>
                        </va-list-item-section>

                        <va-list-item-section icon>
                            <va-popover message="Edytuj dane adresu" v-if="!readOnlyMode">
                                <va-button flat icon="edit" @click="editAddressInModal(address)" />
                            </va-popover>
                            <va-popover message="Usuń adres" v-if="!readOnlyMode">
                                <va-button flat icon="delete" @click="removeAddress(address.IdForAddressTable)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button id="addAddress" @click="showAddressModal=true" type="button" color="success" gradient>Dodaj adres</va-button>
                <AddressModal :addr="editedAddress" v-if="showAddressModal" @close="closeAddressModal()" @createAddress="addAddress($event)" @editAddress="editAddress($event)"/>
            </div>
        </div>
	</div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import AddressModal from '@/components/ReuseComponents/Modals/AddressModal.vue';
import RepresentativeModal from '@/components/ReuseComponents/Modals/RepresentativeModal.vue';
import { useUserStore } from '@/stores/UserStore';

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
                var contactPeopleAPI = this.contactPepole.map(function(item) {
                    let result = {
                        name: item["name"],
                        lastName: item["lastName"],
                        phoneNumber: item["phoneNumber"],
                        emailAddress: item["emailAddress"]
                    }

                    return result;
                });
                var customerAddressesAPI = this.customerAddresses.map(function(item) {
                    let result = {
                        name: item["name"],
                        country: item["country"],
                        city: item["city"],
                        postCode: item["postCode"],
                        streetName: item["streetName"],
                        streetNumber: item["streetNumber"],
                        apartmentNumber: item["apartmentNumber"]
                    }

                    return result;
                });

                const userStore = useUserStore();

                if(this.selectedRadioOption === 'Firma') {
                    let callPath = "/Customer/createCompanyCustomerWithData";
                    let body = {
                        companyName: this.companyName,
                        nip: this.nip,
                        regon: this.regon,
                        companyPhoneNumber: this.companyPhone,
                        companyEmailAddress: this.companyEmail,
                        idWorker: userStore.userId,
                        representatives: contactPeopleAPI,
                        addresses: customerAddressesAPI
                    };

                    await CallAPI.post(callPath, body)
                    .then(res => {
                        this.resetData();
                        this.$vaToast.init({ message: 'Klient został dodany.', color: 'success', duration: 5000 })
                        return res.data;
                    })
                    .catch(err => {
                        if(err.message.includes("422")) {
                            this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                        }else{
                            this.$vaToast.init({ message: 'Błąd dodawania klienta.', color: 'danger', duration: 3000 })
                        }

                        CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                    });
                } else {
                    let callPath = "/Customer/createPersonCustomerWithData";
                    let body = {
                        name: this.customerName,
                        lastName: this.customerLastName,
                        companyEmailAddress: this.customerEmail,
                        companyPhoneNumber: this.customerPhone,
                        idWorker: userStore.userId,
                        representatives: contactPeopleAPI,
                        addresses: customerAddressesAPI
                    };

                    await CallAPI.post(callPath, body)
                    .then(res => {
                        this.resetData();
                        this.$vaToast.init({ message: 'Klient został dodany.', color: 'success', duration: 5000 })
                        return res.data;
                    })
                    .catch(err => {
                        if(err.message.includes("422")) {
                            this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                        }else{
                            this.$vaToast.init({ message: 'Błąd dodawania klienta.', color: 'danger', duration: 3000 })
                        }

                        CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                    });
                }
            }
        },
        validateForm(isCompany) {
            if(isCompany) {
                this.$refs.formCompany.validate();
                if(this.contactPepole.length === 0){ 
                    this.isFormCompanyValidate = false;
                    this.$vaToast.init({ message: 'Potrzebna jest minimum jedna osoba kontaktowa.', color: 'danger', duration: 3000 })
                }
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
        resetData() {
            window.location.reload(true);
        },
	},
}
</script>

<style scoped>
#mainCo {
    display: grid;
    grid-template-columns: 100px 1fr 1fr 1fr 1fr 100px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". header header header header ."
    ". main main sidebarA sidebarB .";
    grid-gap: 30px;
}

#headerCo {
    padding: 20px;
    grid-area: header;
    background: white;
	border-radius: 25px;
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

#representativesCoOuter {
    grid-area: sidebarA;
}

#representativesCoInner {
    padding-top: 5px;
    padding: 15px;
    background: white;
	border-radius: 25px;
}

#adressesCoOuter {
    grid-area: sidebarB;
}

#adressesCoInner {
    padding-top: 5px;
    padding: 15px;
    background: white;
	border-radius: 25px;
}

#companyForm {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;
    height: 360px;
    margin-top: 20px
}

#privateForm {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;
    height: 360px;
    margin-top: 20px
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

.inputWidth {
    width: 250px;
}

.inputWidthLong {
    width: 350px;
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
    padding-bottom: 10px;
    padding-top: 10px;
    margin: 5px;
    width: 240px;
    border-radius: 50px;
    border: solid 1px #1b63b1;
    display: grid;
    grid-template-columns: 1fr 80px;
    grid-template-rows: 1fr;
}

.card-icons svg{
    margin-left: 5px;
    cursor: pointer;
}

.objects-card::-webkit-scrollbar {
    width: 0.25rem;
}

.objects-card::-webkit-scrollbar-thumb {
    background: #1b63b1;
    border-radius: 100vw;
}

.objects-card::-webkit-scrollbar-thumb:hover {
    background: #217cde;
}

.background-modal {
    min-height: 600px;
    min-width: 600px;
}

</style>
