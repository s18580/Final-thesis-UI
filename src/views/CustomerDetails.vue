<template>
    <div>
        <div id="background">
            <div id="headerCo">
                <h1>Szczegóły klienta</h1>
                <va-divider />
            </div>
            <div id="customerDetailsCo">
                <h3>Dane klienta</h3>
                <va-divider />
                <div id="customerDetailsCoInner">
                    <va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
                        <va-input
                            class="inputWidth"
                            v-if="!isCompanyCustomer"
                            v-model="customerName"
                            :rules="[(v) => v.length > 0 || `Pole imię nie może być puste.`, (v) => v.length < 33 || `Pole imię przekroczyło limit znaków.`]"
                            label="Imię"
                            placeholder="Imię klienta"
                            :readonly="readOnlyMode"
                        />
                        <va-input
                            class="inputWidth"
                            v-if="!isCompanyCustomer"
                            v-model="customerLastName"
                            :rules="[(v) => v.length > 0 || `Pole nazwisko nie może być puste.`, (v) => v.length < 65 || `Pole nazwisko przekroczyło limit znaków.`]"
                            label="Nazwisko"
                            placeholder="Nazwisko klienta"
                            :readonly="readOnlyMode"
                        />
                        <va-input
                            class="inputWidth"
                            v-if="isCompanyCustomer"
                            v-model="companyName"
                            :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 101 || `Pole nazwa przekroczyło limit znaków.`]"
                            label="Nazwa"
                            placeholder="Nazwa firmy klienta"
                            :readonly="readOnlyMode"
                        />
                        <va-input
                            class="inputWidth"
                            v-if="isCompanyCustomer"
                            v-model="nip"
                            :rules="[(v) => v.length === 10 || `Pole nip jest nieprawidłowe.`]"
                            label="NIP"
                            placeholder="NIP klienta"
                            :readonly="readOnlyMode"
                        />
                        <va-input
                            class="inputWidth"
                            v-if="isCompanyCustomer"
                            v-model="regon"
                            :rules="[(v) => v.length > 8 || `Pole regon jest nieprawidłowe.`, (v) => v.length < 15 || `Pole regon przekroczyło limit znaków.`]"
                            label="REGON"
                            placeholder="Regon klienta"
                            :readonly="readOnlyMode"
                        />
                        <va-input
                            class="inputWidth"
                            v-model="companyPhone"
                            :rules="[(v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                            label="Telefon"
                            placeholder="Telefon firmowy klienta"
                            :readonly="readOnlyMode"
                        />
                        <va-input
                            class="inputWidth"
                            v-model="companyEmail"
                            :rules="[(v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                            label="Email"
                            placeholder="Email firmowy klienta"
                            :readonly="readOnlyMode"
                        />
                        <va-select
                            class="inputWidth"
                            v-model="selectedWorker"
                            :options="workers"
                            label="Pracownik"
                            noOptionsText="Brak pracowniów do wybrania"
                            :readonly="readOnlyMode"
                        />
                        <va-button id="editButton" v-if="!readOnlyMode" @click="submitForm()" color="info" gradient class="my-3">Edytuj dane</va-button>
                    </va-form>
                </div>
            </div>
            <div id="representativesCo">
                <h3> Osoby kontaktowe klienta</h3>
                <va-divider />
                <div id="representativesCoInner">
                    <va-list>
                        <va-list-label>
                            Osoby kontaktowe
                        </va-list-label>

                        <va-list-item
                            v-for="representative in activedRepresentatives"
                            :key="representative.idRepresentative"
                        >
                            <va-list-item-section avatar>
                                <va-avatar color="#6B5B95" icon="person"/>
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ representative.name + ' ' + representative.lastName }}
                                </va-list-item-label>

                                <va-list-item-label caption>
                                    {{ representative.emailAddress }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section icon>
                                <va-popover message="Edytuj dane osoby" v-if="!readOnlyMode">
                                    <va-button flat icon="edit" @click="openEditRepresentative(representative)" />
                                </va-popover>
                                <va-popover message="Dezaktywuj osobę" v-if="!readOnlyMode">
                                    <va-button flat icon="delete" @click="disableRepresentative(representative)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button v-if="!readOnlyMode" @click="showContactModal=true" type="button" color="success" gradient>Dodaj osobę</va-button>
                </div>
                <div v-if= "!showDisabledRepresentatives">
                    <p class="showMoreDetails" @click="showDisabledRepresentatives = !showDisabledRepresentatives">Pokaż dezaktywowane osoby kontaktowe</p>
                </div>
            </div>
            <div id="representativesCoDisable">
                <div v-if= "showDisabledRepresentatives">
                    <h3> Dezaktywowane osoby kontaktowe klienta</h3>
                    <va-divider />
                    <div id="representativesCoInner">
                        <va-list>
                            <va-list-label>
                                Dezaktywowane osoby kontaktowe
                            </va-list-label>

                            <va-list-item
                                v-for="representative in disabledRepresentatives"
                                :key="representative.idRepresentative"
                            >
                                <va-list-item-section avatar>
                                    <va-avatar color="#6B5B95" icon="person" />
                                </va-list-item-section>

                                <va-list-item-section>
                                    <va-list-item-label>
                                        {{ representative.name + ' ' + representative.lastName }}
                                    </va-list-item-label>

                                    <va-list-item-label caption>
                                        {{ representative.emailAddress }}
                                    </va-list-item-label>
                                </va-list-item-section>

                                <va-list-item-section icon>
                                    <va-popover message="Aktywuj osobę" v-if="!readOnlyMode">
                                        <va-button flat icon="restore_from_trash" @click="activateRepresentative(representative)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                    </div>
                    <p class="showMoreDetails" @click="showDisabledRepresentatives = !showDisabledRepresentatives">Ukryj dezaktywowane osoby kontaktowe</p>
                </div>
            </div>
            <div id="addressesCo">
                <h3> Adresy klienta </h3>
                <va-divider />
                <div id="addressesCoInner">
                    <va-list>
                        <va-list-label>
                            Adresy
                        </va-list-label>

                        <va-list-item
                            v-for="address in activedAddresses"
                            :key="address.idAddress"
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
                                    <va-button flat icon="edit" @click="openEditAddress(address)" />
                                </va-popover>
                                <va-popover message="Dezaktywuj adres" v-if="!readOnlyMode">
                                    <va-button flat icon="delete" @click="disableAddress(address)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button v-if="!readOnlyMode" @click="showAddressModal=true" type="button" color="success" gradient>Dodaj adres</va-button>
                </div>
                <div v-if= "!showDisabledAddresses">
                    <p class="showMoreDetails" @click="showDisabledAddresses = !showDisabledAddresses">Pokaż dezaktywowane adresy</p>
                </div>
            </div>
            <div id="addressesCoDisable">
                <div v-if= "showDisabledAddresses">
                    <h3> Dezaktywowane adresy klienta </h3>
                    <va-divider />
                    <div id="addressesCoInner">
                        <va-list>
                            <va-list-label>
                                Dezaktywowane adresy
                            </va-list-label>

                            <va-list-item
                                v-for="address in disabledAddresses"
                                :key="address.idAddress"
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
                                    <va-popover message="Aktywuj adres" v-if="!readOnlyMode">
                                        <va-button flat icon="restore_from_trash" @click="activateAddress(address)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                    </div>
                    <p class="showMoreDetails" @click="showDisabledAddresses = !showDisabledAddresses">Ukryj dezaktywowane adresy</p>
                </div>
            </div>
            <RepresentativeModal :person="editedContact" v-if="showContactModal" @close="closeContactModal()" @createRepresentative="addContact($event)" @editRepresentative="editContact($event)"/>
            <AddressModal :addr="editedAddress" v-if="showAddressModal" @close="closeAddressModal()" @createAddress="addAddress($event)" @editAddress="editAddress($event)"/>
        </div>
    </div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import AddressModal from '@/components/ReuseComponents/Modals/AddressModal.vue';
import RepresentativeModal from '@/components/ReuseComponents/Modals/RepresentativeModal.vue';

export default {
    name: "CustomerDetails",
    props: {
        id: {
            type: String,
            required: true,
        },
        mode: {
            type: String,
            required: false,
            default: "read"
        },
    },
    components: { AddressModal, RepresentativeModal },
    data() {
        return {
            nip: "",
            regon: "",
            customerName: "",
            customerLastName: "",
            companyName: "",
            companyEmail: "",
            companyPhone: "",
            selectedWorker: "",
            rawWorkers: [],
            addresses: [],
            representatives: [],

            showDisabledAddresses: false,
            showDisabledRepresentatives: false,

            showContactModal: false,
            editedContact: null,
            showAddressModal: false,
            editedAddress: null,

            readOnlyMode: false,
            isFormValidate: false,
            isCompanyCustomer: false,
        }
    },
    async mounted() {
        if(this.mode === "read") {
            this.readOnlyMode = true;
        } else if(this.mode === "edit") {
            this.readOnlyMode = false;
        }

        let callPath = "/Customer/getCustomer?id=" + this.id;
        let customerData = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        callPath = "/Worker/getWorkers";
        this.rawWorkers = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        if(customerData.nip != '' && customerData.regon != '') {
            this.isCompanyCustomer = true;
        } else { 
            this.isCompanyCustomer = false;
        }

        if(this.isCompanyCustomer) {
            this.companyName = customerData.companyName;
            this.companyEmail = customerData.companyEmailAddress;
            this.companyPhone = customerData.companyPhoneNumber;
            this.regon = customerData.regon;
            this.nip = customerData.nip;
            this.selectedWorker = this.getNameById(customerData.idWorker);
        } else {
            for(let i=0; i < customerData.representatives.length; i++) {
                if((customerData.representatives[i].name + " " + customerData.representatives[i].lastName) === customerData.companyName) {
                    this.customerName = customerData.representatives[i].name;
                    this.customerLastName = customerData.representatives[i].lastName;
                }
            }
            this.companyEmail = customerData.companyEmailAddress;
            this.companyPhone = customerData.companyPhoneNumber;
            this.selectedWorker = this.getNameById(customerData.idWorker);
        }

        await this.updateAddressList();
        await this.updateContactList();
    },
    computed: {
        workers() {
            let resultArr = this.rawWorkers.map(function(item) {
                return item["name"] + " " + item["lastName"];
            });

            return resultArr;
        },
        disabledAddresses() {
            return this.addresses.filter(address => address.isDisabled == true)
        },
        activedAddresses() {
            return this.addresses.filter(address => address.isDisabled == false)
        },
        disabledRepresentatives() {
            return this.representatives.filter(representative => representative.isDisabled == true)
        },
        activedRepresentatives() {
            return this.representatives.filter(representative => representative.isDisabled == false)
        },
    },
    methods: {
        async submitForm() {
            if(this.validateForm) {
                let callPath = "";
                let body = {};

                if(this.isCompanyCustomer) {
                    callPath = "/Customer/updateCompanyCustomer";
                    body = {
                        IdCustomer: this.id,
                        CompanyName: this.companyName,
                        NIP: this.nip,
                        Regon: this.regon,
                        CompanyPhoneNumber: this.companyPhone,
                        CompanyEmailAddress: this.companyEmail,
                        IdWorker: this.getIdByName(this.selectedWorker),
                    };
                } else {
                    callPath = "/Customer/updatePersonCustomer";
                    body = {
                        IdCustomer: this.id,
                        Name: this.customerName,
                        LastName: this.customerLastName, 
                        CompanyPhoneNumber: this.companyPhone,
                        CompanyEmailAddress: this.companyEmail,
                        IdWorker: this.getIdByName(this.selectedWorker),
                    };
                }
                
                await CallAPI.post(callPath, body)
                .then(res => {
                    this.$vaToast.init({ message: 'Dane zostały edytowane.', color: 'success', duration: 3000 })
                    return res.data;
                })
                .catch(err => {
                    if(err.message.includes("422")) {
                        this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                    }else{
                        this.$vaToast.init({ message: 'Błąd edycji danych.', color: 'danger', duration: 3000 })
                    }
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
        },
        validateForm() {
            this.$refs.form.validate();

            return this.isFormValidate;
        },
        getIdByName(givenName) {
            return this.rawWorkers.find(element => element.name + " " + element.lastName == givenName).idWorker;
        },
        getNameById(givenId){
            let foundWorker = this.rawWorkers.find(element => element.idWorker == givenId);
            return foundWorker.name + " " + foundWorker.lastName;
        },
        openEditAddress(address) {
            this.editedAddress = address;
            this.showAddressModal = true;
        },
        closeAddressModal() {
            this.editedAddress = null;
            this.showAddressModal = false;
        },
        openEditRepresentative(contactPerson) {
            this.editedContact = contactPerson;
            this.showContactModal = true;
        },
        closeContactModal() {
            this.editedContact = null;
            this.showContactModal = false;
        },


        async disableAddress(e){
            let callPath = "/Address/disableAddress";
            let body = { Id: e.idAddress, IsDisabled: true };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Dezaktywowano adres.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                this.$vaToast.init({ message: 'Błąd dezaktywacji adresu.', color: 'danger', duration: 3000 })
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            await this.updateAddressList();
        },
        async disableRepresentative(e){
            let callPath = "/Representative/disableRepresentative";
            let body = { Id: e.idRepresentative, IsDisabled: true };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Dezaktywowano osobę.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                this.$vaToast.init({ message: 'Błąd dezaktywacji osoby kontaktowej klienta.', color: 'danger', duration: 3000 })
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            await this.updateContactList();
        },
        async activateAddress(e){
            let callPath = "/Address/disableAddress";
            let body = { Id: e.idAddress, IsDisabled: false };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Aktywowano adres.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                this.$vaToast.init({ message: 'Błąd aktywacji adresu.', color: 'danger', duration: 3000 })
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            await this.updateAddressList();
        },
        async activateRepresentative(e){
            let callPath = "/Representative/disableRepresentative";
            let body = { Id: e.idRepresentative, IsDisabled: false };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Aktywowano osobę.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                this.$vaToast.init({ message: 'Błąd aktywacji osoby kontaktowej klienta.', color: 'danger', duration: 3000 })
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            await this.updateContactList();
        },


        async addContact(e) {
            let callPath = "/Representative/createRepresentative";
            let body = {
                Name: e.name,
                LastName: e.lastName,
                PhoneNumber: e.phoneNumber,
                EmailAddress: e.emailAddress,
                IdSupplier: null,
                IdCustomer: this.id,
            };
            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Osoba kontaktowa została dodana.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd dodawania osoby kontaktowej.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        
            await this.updateContactList();
        },
        async editContact(e) {
            let callPath = "/Representative/updateRepresentative";
            let body = {
                IdRepresentative: e.idRepresentative,
                Name: e.name,
                LastName: e.lastName,
                PhoneNumber: e.phoneNumber,
                EmailAddress: e.emailAddress,
            };
            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Osoba kontaktowa została edytowana.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd edycji osoby kontaktowej.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        
            await this.updateContactList();
        },
        async updateContactList() {
            let callPath = "/Representative/getRepresentativesByCustomer?id=" + this.id;
            this.representatives = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
        async addAddress(e) {
            let callPath = "/Address/createAddress";
            let body = {
                Name: e.name,
                City: e.city,
                Country: e.country,
                PostCode: e.postCode,
                StreetName: e.streetName,
                StreetNumber: e.streetNumber,
                ApartmentNumber: e.apartmentNumber,
                IdSupplier: null,
                IdCustomer: this.id,
            };
            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Adres został dodany.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd dodawania adresu.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        
            await this.updateAddressList();
        },
        async editAddress(e) {
            let callPath = "/Address/updateAddress";
            let body = {
                IdAddress: e.idAddress,
                Name: e.name,
                City: e.city,
                Country: e.country,
                PostCode: e.postCode,
                StreetName: e.streetName,
                StreetNumber: e.streetNumber,
                ApartmentNumber: e.apartmentNumber,
            };
            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Adres został edytowany.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd edycji adresu.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        
            await this.updateAddressList();
        },
        async updateAddressList() {
            let callPath = "/Address/getAddressesByCustomer?id=" + this.id;
            this.addresses = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
    }
}
</script>

<style scoped>
#background {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 1fr 50px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". header header header ."
    ". main sidebarA sidebarB ."
    ". main sidebarAc sidebarBc .";
    grid-gap: 30px;
}

#headerCo {
    grid-area: header;
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#customerDetailsCo {
    grid-area: main;
}

#customerDetailsCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#representativesCo {
    grid-area: sidebarA;
}

#representativesCoDisable {
    grid-area: sidebarAc;
}

#representativesCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
    margin-bottom: 20px;
}

#addressesCo {
    grid-area: sidebarB;
}

#addressesCoDisable {
    grid-area: sidebarBc;
}

#addressesCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
    margin-bottom: 20px;
}

#form {
    display: flex;
    flex-direction: column;
}

.inputWidth {
    margin: 10px;
    width: 250px;
    align-self: center;
}

#editButton{
    width: 150px;
    align-self: center;
}

.showMoreDetails {
    color: #217cde;
    font-style: oblique;
}

.showMoreDetails:hover {
    cursor: pointer;
    text-decoration: underline;
}
</style>