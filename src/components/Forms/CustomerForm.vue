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
                        :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 101 || `Pole nazwa przekroczyło limit znaków.`]"
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
                        v-for="(person, index) in contactPepole"
                        :key="index"
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
                            <va-popover message="Edytuj dane osoby">
                                <va-button flat icon="edit" @click="editContactInModal(index)" />
                            </va-popover>
                            <va-popover message="Usuń osobę">
                                <va-button flat icon="delete" @click="removeItem(contactPepole, index)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button id="addRepresentative" @click="showContactModal=true" type="button" color="success" gradient>Dodaj osobę</va-button>
                <RepresentativeModal :person="contactPepole[editedContactIndex]" v-if="showContactModal" @close="closeContactModal()" @createRepresentative="addItem(contactPepole, $event)" @editRepresentative="editContact($event)"/>
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
                        v-for="(address, index) in customerAddresses"
                        :key="index"
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
                            <va-popover message="Edytuj dane adresu">
                                <va-button flat icon="edit" @click="editAddressInModal(index)" />
                            </va-popover>
                            <va-popover message="Usuń adres">
                                <va-button flat icon="delete" @click="removeItem(customerAddresses, index)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button id="addAddress" @click="showAddressModal=true" type="button" color="success" gradient>Dodaj adres</va-button>
                <AddressModal :addr="customerAddresses[editedAddressIndex]" v-if="showAddressModal" @close="closeAddressModal()" @createAddress="addItem(customerAddresses, $event)" @editAddress="editAddress($event)"/>
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
            editedAddressIndex: null,
            showContactModal: false,
            editedContactIndex: null,
		}
	},
    components: { AddressModal, RepresentativeModal },
	methods: {
        addItem(array, e) {
            array.push(e);
        },
        removeItem(array, index) {
            if (index > -1) {
                array.splice(index, 1);
            }
        },
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
                        this.$vaToast.init({ message: 'Klient został dodany.', color: 'success', duration: 5000 });
                        this.$router.push({ name: "CustomerDetails", params: { id: res.data, mode: 'edit' } });
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
                        this.$vaToast.init({ message: 'Klient został dodany.', color: 'success', duration: 5000 });
                        this.$router.push({ name: "CustomerDetails", params: { id: res.data, mode: 'edit' } });
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
            this.editedAddressIndex=null;
        },
        editAddress(e) {
            this.customerAddresses[this.editedAddressIndex] = e;
            this.closeAddressModal();
        },
        editAddressInModal(index) {
            this.editedAddressIndex = index;
            this.showAddressModal = true;
        },
        closeContactModal() {
            this.showContactModal = false;
            this.editedContactIndex = null;
        },
        editContact(e) {
            this.contactPepole[this.editedContactIndex] = e;
            this.closeContactModal();
        },
        editContactInModal(index) {
            this.editedContactIndex = index;
            this.showContactModal = true;
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
</style>
