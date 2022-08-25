<template>
    <div id="mainCo">
        <div id="headerCo">
            <h1>Szczegóły dostawy</h1>
            <va-divider />
        </div>
        <div id="mainCoOuter">
            <h3>Dane dostawy</h3>
            <va-divider />
            <div id="mainCoInner">
                <div class="search-input-box">
                    <label>Dostawa została odebrana:</label>
                    <div id="isReceivedCo">
                        <va-icon v-if="isReceived" color="success" class="material-icons">done</va-icon>
                        <va-icon v-if="!isReceived" color="danger" class="material-icons">close</va-icon>
                        <va-icon v-if="!readOnlyMode" @click="isReceived=!isReceived" color="primary" class="material-icons">cached</va-icon>
                    </div>
                </div>
                <va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
                    <va-input
                        class="gridFirstC gridFirstR inputWidth"
                        v-model="price"
                        label="Cena"
                        :rules="[(v) => v >= 0 || `Wprowadź poprawną cenę`, (v) => v != '' || `Wprowadź poprawną cenę`]"
                        placeholder="Cena zamówionych produktów"
                        :readonly="readOnlyMode"
                    />
                    <va-input
                        class="gridFirstC gridSecondR inputWidth"
                        v-model="quantity"
                        label="Ilość"
                        :rules="[(v) => v > 0 || `Wprowadź poprawną ilość`, (v) => v != '' || `Wprowadź poprawną ilość`]"
                        placeholder="Ilość zamówionych produktów"
                        :readonly="readOnlyMode"
                    />
                    <va-select
                        class="gridFirstC gridThirdR inputWidth"
                        v-model="selectedType"
                        :options="supplyItemTypes"
                        :rules="[(v) => v != '' || `Typ musi byc wybrany`]"
                        label="Typ przedmiotu dostawy"
                        noOptionsText="Brak typów do wybrania"
                        :readonly="readOnlyMode"
                    />
                    <va-input
                        class="gridFirstC gridFourthR inputWidth"
                        v-model="selectedRepresentative"
                        label="Reprezentant dostawcy"
                        readonly
                    />
                    <va-date-input
                        class="gridSecondC gridFirstR inputWidth"
                        v-model="supplyDate"
                        :rules="[(v) => v != null || `Data musi być wybrana.`]"
                        label="Data realizacji dostawy"
                        placeholder="Data realizacji dostawy"
                        :readonly="readOnlyMode"
                    />
                    <va-input
                        class="gridSecondC gridSpreadR inputWidth"
                        v-model="itemDescription"
                        :rules="[(v) => v.length > 0 || `Pole opis nie może być puste.`, (v) => v.length < 256 || `Pole opis przekroczyło limit znaków.`]"
                        label="Opis"
                        type="textarea"
                        :readonly="readOnlyMode"
                        placeholder="Opis zamawianych przedmiotów"
                        :min-rows="7"
                    />
                    <div id="submitButtonContainer" v-if="!readOnlyMode">
                        <va-button type="submit" color="info" gradient class="my-3">Edytuj dane</va-button>
                    </div>
                </va-form>
            </div>
        </div>
        <div id="adressesCoOuter">
            <h3>Adresy odbioru</h3>
            <va-divider />
            <div id="adressesCoInner">
                <va-list id="addressList">
                    <va-list-label>
                        Lista adresów
                    </va-list-label>

                    <va-list-item
                        v-for="address in deliveryAddresses"
                        :key="address.IdAddress"
                    >
                        <va-list-item-section avatar>
                            <va-avatar color="#6B5B95" icon="local_shipping" />
                        </va-list-item-section>

                        <va-list-item-section>
                            <va-list-item-label>
                                {{ address.name }}
                            </va-list-item-label>
                        </va-list-item-section>

                        <va-list-item-section icon>
                            <va-popover message="Usuń przydział adresu" v-if="!readOnlyMode">
                                <va-button flat icon="delete" @click="deleteDeliveryAddress(address)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button v-if="!readOnlyMode" @click="showAddressModal=true" type="button" color="success" gradient>Przydziel adres odbioru</va-button>
                <DeliveryAddress :idSupplier="getSupplierIdByName(this.selectedRepresentative)" v-if="showAddressModal" @createDeliveryAddress="addAddress($event)" @close="showAddressModal=false" />
            </div>
        </div>
	</div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import DeliveryAddress from '@/components/ReuseComponents/Modals/DeliveryAddress.vue';

export default {
    name: "SupplyDetails",
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
    components: { DeliveryAddress },
    data() {
        return {
            isReceived: false,
            itemDescription: "",
            price: "",
            quantity: "",
            supplyDate: null,
            orderItemName: "",
            selectedRepresentative: "",
            selectedRepresentativeId: null,
            selectedType: "",
            rawSupplyItemTypes: [],
            supplierId: null,

            readOnlyMode: false,
            isFormValidate: false,
            deliveryAddresses: [],
            showAddressModal: false,
        }
    },
    computed: {
        supplyItemTypes() {
            let resultArr = this.rawSupplyItemTypes.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
    },
    async mounted() {
        if(this.mode === "read") {
            this.readOnlyMode = true;
        } else if(this.mode === "edit") {
            this.readOnlyMode = false;
        }

        let callPath = "/Supply/getSupply?id=" + this.id;
        let supplyData = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        this.supplierId = supplyData.representative.idSupplier;
        this.isReceived = supplyData.isReceived;
        this.itemDescription = supplyData.itemDescription;
        this.price = supplyData.price;
        this.quantity = supplyData.quantity;
        this.orderItemName = supplyData.orderItem.name;
        this.selectedRepresentative = supplyData.representative.name + " " + supplyData.representative.lastName;
        this.selectedRepresentativeId = supplyData.idRepresentative;
        this.selectedType = supplyData.supplyItemType.name;
        this.supplyDate = new Date(Date.parse(supplyData.supplyDate));

        await this.updateAddressList();
        
        callPath = "/SupplyItemType/getSupplyItemsTypes";
        this.rawSupplyItemTypes = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });
    },
    methods: {
        async submitForm() {
            if(this.validateForm) {
                let callPath = "/Supply/updateSupply"
                let body = {
                    IdSupply: this.id,
                    ItemDescription: this.itemDescription,
                    Price: this.price,
                    Quantity: this.quantity,
                    SupplyDate: this.supplyDate,
                    IsReceived: this.isReceived,
                    IdSupplyItemType: this.getTypeIdByName(this.selectedType),
                    IdRepresentative: this.selectedRepresentativeId,
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

            if(this.selectedType == "") {
                this.isFormValidate = false;
                this.$vaToast.init({ message: 'Dostawa musi mieć wybrany typ.', color: 'danger', duration: 2000 })
            }
            if(this.readOnlyMode){
                this.isFormValidate = false;
            }

            return this.isFormValidate;
        },
        getTypeIdByName(selectedName) {
            return this.rawSupplyItemTypes.find(element => element.name == selectedName).idSupplyItemType;
        },

        async addAddress(e) {
            let callPath = "/DeliveriesAddresses/createDeliveriesAddress";
            let body = {
                IdAddress: e.IdAddress,
                IdOrder: null,
                IdSupply: this.id,
            };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Adres został przydzielony.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd przydzielenia adresu dostawy.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateAddressList();
        },
        async deleteAddress() {
            let callPath = "/DeliveriesAddresses/deleteDeliveriesAddress";
            let body = { data: {
                IdDeliveriesAddresses: this.selectedAddress.idDeliveriesAddresses
            } };

            await CallAPI.delete(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Przydzielenie zostało usunięte.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd usuwania przydzielenia adresu.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateAddressList();
        },
        async updateAddressList() {
            let callPath = "/DeliveriesAddresses/getDeliveriesAddressesBySupply?id=" + this.id;
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
#mainCo {
    display: grid;
    grid-template-columns: 100px 1fr 1fr 1fr 100px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". header header header ."
    ". main main sidebarB .";
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

#addressList {
    padding: 20px;
}

#adressesCoOuter {
    grid-area: sidebarB;
}

#adressesCoInner {
    padding-top: 5px;
    padding-bottom: 15px;
    background: white;
	border-radius: 25px;
}

#orderItemSelection {
    margin: 20px;
    padding-bottom: 20px;
    display: flex;
    justify-content: space-evenly;
}

#form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;
    height: 360px;
}

.gridSpreadC {
    grid-column-start: 1;
    grid-column-end: end;
}

.gridSpreadR {
    grid-row-start: 2;
    grid-row-end: 5;
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

.inputWidth {
    width: 250px;
}

.background-modal {
    min-height: 600px;
    min-width: 600px;
}

</style>