<template>
    <div>
        <div id="background">
            <div id="headerCo">
                <h1>Szczegóły dostawcy</h1>
                <va-divider />
            </div>
            <div id="supplierDetailsCo">
                <h3>Dane dostawcy</h3>
                <va-divider />
                <div id="supplierDetailsCoInner">
                    <va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
                        <va-input
                            class="inputWidth"
                            v-model="supplierName"
                            :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                            label="Nazwa"
                            placeholder="Nazwa dostawcy"
                            :readonly="readOnlyMode"
                        />
                        <va-input
                            class="inputWidth"
                            v-model="supplierPhone"
                            :rules="[(v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                            label="Telefon"
                            placeholder="Telefon dostawcy"
                            :readonly="readOnlyMode"
                        />
                        <va-input
                            class="inputWidth"
                            v-model="supplierEmail"
                            :rules="[(v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                            label="Email"
                            placeholder="Email dostawcy"
                            :readonly="readOnlyMode"
                        />
                        <va-input
                            class="inputWidth"
                            v-model="supplierDescription"
                            :rules="[(v) => v.length < 256 || `Pole opis przekroczyło limit znaków.`]"
                            label="Opis"
                            type="textarea"
                            placeholder="Opis dostawcy"
                            :readonly="readOnlyMode"
                        />
                        <va-button id="editButton" v-if="!readOnlyMode" @click="submitForm()" color="info" gradient class="my-3">Edytuj dane</va-button>
                    </va-form>
                </div>
            </div>
            <div id="representativesCo">
                <h3> Osoby kontaktowe dostawcy  </h3>
                <va-divider />
                <div id="representativesCoInner">
                    <va-list>
                        <va-list-label>
                            Osoby kontaktowe
                        </va-list-label>

                        <va-list-item
                            v-for="representative in representatives"
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
                                <va-popover message="Edytuj dane osoby" v-if="!readOnlyMode">
                                    <va-button flat icon="edit" @click="openEditRepresentative(representative)" />
                                </va-popover>
                                <va-popover message="Usuń osobę" v-if="!readOnlyMode">
                                    <va-button flat icon="delete" @click="openDeleteRepresentativeModal(representative)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button v-if="!readOnlyMode" @click="showContactModal=true" type="button" color="success" gradient>Dodaj osobę</va-button>
                </div>
            </div>
            <div id="addressesCo">
                <h3> Adresy dostawcy </h3>
                <va-divider />
                <div id="addressesCoInner">
                    <va-list>
                        <va-list-label>
                            Adresy
                        </va-list-label>

                        <va-list-item
                            v-for="address in addresses"
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
                                <va-popover message="Usuń adres" v-if="!readOnlyMode">
                                    <va-button flat icon="delete" @click="openDeleteAddressModal(address)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button v-if="!readOnlyMode" @click="showAddressModal=true" type="button" color="success" gradient>Dodaj adres</va-button>
                </div>
            </div>
            <RepresentativeModal :person="editedContact" v-if="showContactModal" @close="closeContactModal()" @createRepresentative="addContact($event)" @editRepresentative="editContact($event)"/>
            <AddressModal :addr="editedAddress" v-if="showAddressModal" @close="closeAddressModal()" @createAddress="addAddress($event)" @editAddress="editAddress($event)"/>
        </div>
        <va-modal v-model="showDeleteAddressModal"
            message="Czy napewno chcesz usunąć ten adres ?"
            size="small"
            title="Usuń adres"
            cancel-text="Anuluj"
            ok-text="Usuń"
            @cancel="closeDeleteAddressModal()"
            @click-outside="closeDeleteAddressModal()"
            @ok="deleteAddress()"
        />
        <va-modal v-model="showDeleteRepresentativeModal"
            message="Czy napewno chcesz usunąć tą osobę ?"
            size="small"
            title="Usuń osobę"
            cancel-text="Anuluj"
            ok-text="Usuń"
            @cancel="closeDeleteRepresentativeModal()"
            @click-outside="closeDeleteRepresentativeModal()"
            @ok="deleteRepresentative()"
        />
    </div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import AddressModal from '@/components/ReuseComponents/Modals/AddressModal.vue';
import RepresentativeModal from '@/components/ReuseComponents/Modals/RepresentativeModal.vue';

export default {
    name: "SupplierDetails",
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
            supplierName: "",
            supplierPhone: "",
            supplierEmail: "",
            supplierDescription: "",
            addresses: [],
            representatives: [],

            selectedAddressToDelete: null,
            selectedRepresentativeToDelete: null,
            showDeleteAddressModal: false,
            showDeleteRepresentativeModal: false,

            showContactModal: false,
            editedContact: null,
            showAddressModal: false,
            editedAddress: null,

            readOnlyMode: false,
            isFormValidate: false,
        }
    },
    async mounted() {
        if(this.mode === "read") {
            this.readOnlyMode = true;
        } else if(this.mode === "edit") {
            this.readOnlyMode = false;
        }

        let callPath = "/Supplier/getSupplier?id=" + this.id;
        let supplierData = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        this.supplierName = supplierData.name;
        this.supplierPhone = supplierData.phoneNumber;
        this.supplierEmail = supplierData.emailAddress;
        this.supplierDescription = supplierData.description;

        await this.updateAddressList();
        await this.updateContactList();
    },
    methods: {
        async submitForm() {
            if(this.validateForm) {
                let callPath = "/Supplier/updateSupplier";
                let body = {
                    IdSupplier: this.id,
                    Name: this.supplierName,
                    Description: this.supplierDescription,
                    PhoneNumber: this.supplierPhone,
                    EmailAddress: this.supplierEmail
                };
                
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


        openDeleteAddressModal(address){
            this.selectedAddressToDelete = address;
            this.showDeleteAddressModal = true;
        },
        openDeleteRepresentativeModal(representative){
            this.selectedRepresentativeToDelete = representative;
            this.showDeleteRepresentativeModal = true;
        },
        closeDeleteAddressModal(){
            this.showDeleteAddressModal = false;
        },
        closeDeleteRepresentativeModal(){
            this.showDeleteRepresentativeModal = false;
        },
        async deleteAddress(){
            let callPath = "/Address/deleteAddress";
            let body = { data: { IdAddress: this.selectedAddressToDelete.idAddress} };

            await CallAPI.delete(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Usunięto adres.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                this.$vaToast.init({ message: 'Nie można usunąć adresu póki jest używany w dostawach od tego dostawcy.', color: 'danger', duration: 3000 })
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            await this.updateAddressList();
        },
        async deleteRepresentative(){
            let callPath = "/Representative/deleteRepresentative";
            let body = { data: { IdRepresentative: this.selectedRepresentativeToDelete.idRepresentative} };

            await CallAPI.delete(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Usunięto osobę.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                this.$vaToast.init({ message: 'Nie można usunąć osoby póki jest ona kontaktem, w dostawach od tego dostawcy.', color: 'danger', duration: 3000 })
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            await this.updateContactList();
        },



        async addContact(e) {
            let callPath = "/Representative/createRepresentative";
            let body = {
                Name: e.newRepresentative.name,
                LastName: e.newRepresentative.lastName,
                PhoneNumber: e.newRepresentative.phoneNumber,
                EmailAddress: e.newRepresentative.emailAddress,
                IdSupplier: this.id,
                IdCustomer: null,
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
                IdRepresentative: e.newRepresentative.idRepresentative,
                Name: e.newRepresentative.name,
                LastName: e.newRepresentative.lastName,
                PhoneNumber: e.newRepresentative.phoneNumber,
                EmailAddress: e.newRepresentative.emailAddress,
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
            let callPath = "/Representative/getSupplierRepresentatives?id=" + this.id;
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
                Name: e.newAddress.name,
                City: e.newAddress.city,
                Country: e.newAddress.country,
                PostCode: e.newAddress.postCode,
                StreetName: e.newAddress.streetName,
                StreetNumber: e.newAddress.streetNumber,
                ApartmentNumber: e.newAddress.apartmentNumber,
                IdSupplier: this.id,
                IdCustomer: null,
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
                IdAddress: e.newAddress.idAddress,
                Name: e.newAddress.name,
                City: e.newAddress.city,
                Country: e.newAddress.country,
                PostCode: e.newAddress.postCode,
                StreetName: e.newAddress.streetName,
                StreetNumber: e.newAddress.streetNumber,
                ApartmentNumber: e.newAddress.apartmentNumber,
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
            let callPath = "/Address/getAddressesBySupplier?id=" + this.id;
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
    ". main sidebarA sidebarB .";
    grid-gap: 30px;
}

#headerCo {
    grid-area: header;
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#form {
    display: flex;
    flex-direction: column;
}

#supplierDetailsCo {
    grid-area: main;
}

#supplierDetailsCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#representativesCo {
    grid-area: sidebarA;
}

#representativesCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#addressesCo {
    grid-area: sidebarB;
}

#addressesCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
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
</style>