<template>
  <div id="mainCo">
        <div id="headerCo">
            <h1>Dodaj nowego dostawcę</h1>
            <va-divider />
        </div>
        <div id="mainCoOuter">
            <h3>Dane dostawcy</h3>
            <va-divider />
            <div id="mainCoInner">
                <va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
                    <va-input
                        class="gridFirstC gridFirstR inputWidth"
                        v-model="supplierName"
                        :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                        label="Nazwa"
                        placeholder="Nazwa dostawcy"
                    />
                    <va-input
                        class="gridFirstC gridSecondR inputWidth"
                        v-model="supplierEmail"
                        :rules="[(v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                        label="Email (opcjonalnie)"
                        placeholder="Email dostawcy"
                    />
                    <va-input
                        class="gridFirstC gridThirdR inputWidth"
                        v-model="supplierPhone"
                        :rules="[(v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                        label="Telefon (opcjonalnie)"
                        placeholder="Telefon dostawcy"
                    />
                    <va-input
                        class="gridSecondC gridSpreadR inputWidth"
                        v-model="supplierDescription"
                        type="textarea"
                        :rules="[ (v) => v.length < 255 || `Pole opis przekroczyło limit znaków.`]"
                        label="Opis (opcjonalnie)"
                        :min-rows="7"
                    />
                    <div id="submitButtonContainer">
                        <va-button type="submit" color="info" gradient class="my-3">Dodaj</va-button>
                    </div>
                </va-form>
            </div>
        </div>
        <div id="representativesCoOuter">
            <h3>Osoby kontaktowe dostawcy</h3>
            <va-divider />
            <div id="representativesCoInner">
                <va-list id="representativeList">
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
                        </va-list-item-section>

                        <va-list-item-section icon>
                            <va-popover message="Edytuj osobę kontaktową">
                                <va-button flat icon="edit" @click="editContactInModal(index)" />
                            </va-popover>
                            <va-popover message="Usuń osobę kontaktową">
                                <va-button flat icon="delete" @click="removeItem(contactPepole, index)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button @click="showContactModal=true" type="button" color="success" gradient>Dodaj osobę</va-button>
                <RepresentativeModal :person="contactPepole[editedContactIndex]" v-if="showContactModal" @close="closeContactModal()" @createRepresentative="addItem(contactPepole, $event)" @editRepresentative="editContact($event)"/>
            </div>
        </div>
        <div id="adressesCoOuter">
            <h3>Adresy dostawcy</h3>
            <va-divider />
            <div id="adressesCoInner">
                <va-list id="addressList">
                    <va-list-label>
                        Lista adresów
                    </va-list-label>

                    <va-list-item
                        v-for="(address, index) in suplierAddresses"
                        :key="index"
                    >
                        <va-list-item-section avatar>
                            <va-avatar color="#6B5B95" icon="home" />
                        </va-list-item-section>

                        <va-list-item-section>
                            <va-list-item-label>
                                {{ address.name }}
                            </va-list-item-label>
                        </va-list-item-section>

                        <va-list-item-section icon>
                            <va-popover message="Edytuj adres">
                                <va-button flat icon="edit" @click="editAddressInModal(index)" />
                            </va-popover>
                            <va-popover message="Usuń adres">
                                <va-button flat icon="delete" @click="removeItem(suplierAddresses, index)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button @click="showAddressModal=true" type="button" color="success" gradient>Dodaj adres</va-button>
                    <AddressModal :addr="suplierAddresses[editedAddressIndex]" v-if="showAddressModal" @close="closeAddressModal()" @createAddress="addItem(suplierAddresses, $event)" @editAddress="editAddress($event)"/>
            </div>
        </div>
	</div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import AddressModal from '@/components/ReuseComponents/Modals/AddressModal.vue';
import RepresentativeModal from '@/components/ReuseComponents/Modals/RepresentativeModal.vue';

export default {
  name: 'SupplierForm',
	data() {
		return {
			supplierName: "",
            supplierEmail: "",
            supplierPhone: "",
			supplierDescription: "",
            isFormValidate: false,
			contactPepole: [],
			suplierAddresses: [],
            showAddressModal: false,
            editedAddressIndex: null,
            showContactModal: false,
            editedContactIndex: null,
		}
	},
    components: { AddressModal, RepresentativeModal },
	methods: {
		async submitForm() {
            if(this.validateForm()) {
                let contactPeopleAPI = this.contactPepole.map(function(item) {
                    let result = {
                        name: item["name"],
                        lastName: item["lastName"],
                        phoneNumber: item["phoneNumber"],
                        emailAddress: item["emailAddress"]
                    }

                    return result;
                });
                let suplierAddressesAPI = this.suplierAddresses.map(function(item) {
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

                let callPath = "/Supplier/createSupplierWithData";
                let body = {
                    name: this.supplierName,
                    emailAddress: this.supplierEmail,
                    phoneNumber: this.supplierPhone,
                    description: this.supplierDescription,
                    representatives: contactPeopleAPI,
                    addresses: suplierAddressesAPI
                };

                await CallAPI.post(callPath, body)
                .then(res => {
                    this.$vaToast.init({ message: 'Dostawca został dodany.', color: 'success', duration: 3000 });
                    this.$router.push({ name: "SupplierDetails", params: { id: res.data, mode: 'edit' } });
                    return res.data;
                })
                .catch(err => {
                    if(err.message.includes("422")) {
                        this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                    }else{
                        this.$vaToast.init({ message: 'Błąd dodawania dostawcy.', color: 'danger', duration: 3000 })
                    }

                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
		},
        validateForm() {
            this.$refs.form.validate();
            if(this.contactPepole.length === 0){
                this.isFormValidate = false;
                this.$vaToast.init({ message: 'Potrzebna jest minimum jedna osoba kontaktowa.', color: 'danger', duration: 3000 })
            }
            return this.isFormValidate;
        },
        closeAddressModal() {
            this.showAddressModal=false;
            this.editedAddressIndex=null;
        },
        editAddress(e) {
            this.suplierAddresses[this.editedAddressIndex] = e;
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
        addItem(array, e) {
            array.push(e);
        },
        removeItem(array, index) {
            if (index > -1) {
                array.splice(index, 1);
            }
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
    background: white;
    padding-bottom: 15px;
	border-radius: 25px;
}

#adressesCoOuter {
    grid-area: sidebarB;
}

#adressesCoInner {
    padding-top: 5px;
    background: white;
    padding-bottom: 15px;
	border-radius: 25px;
}

#form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;
    height: 360px;
}

#addressList {
    padding: 20px;
}

#representativeList {
    padding: 20px;
}

.gridSpreadR {
    grid-row-start: 1;
    grid-row-end: 4;
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

#submitButtonContainer {
    grid-column-start: 1;
    grid-column-end: end;
    grid-row-start: 4;
    grid-row-end: 4;
}

.inputWidth {
    width: 250px;
}
</style>
