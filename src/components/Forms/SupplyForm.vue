<template>
  <div id="mainCo">
        <div id="headerCo">
            <h1>Dodaj nową dostawę</h1>
            <va-divider />
        </div>
        <div id="mainCoOuter">
            <h3>Dane dostawy</h3>
            <va-divider />
            <div id="mainCoInner">
                <div v-if="selectedOrder == '' || selectedOrderItem == ''">
                    <h5>Wybierz zamówienie i przedmiot zamówienia, do którego chcesz dodać dostawę</h5>
                    <div id="orderItemSelection">
                        <va-select
                            class="inputWidth"
                            v-model="selectedOrder"
                            :options="orders"
                            label="Zamówienie"
                            noOptionsText="Brak zamówień do wybrania"
                        />
                        <va-select
                            v-if="selectedOrder != ''"
                            class="inputWidth"
                            v-model="selectedOrderItem"
                            :options="orderItems"
                            label="Przedmiot zamówienia"
                            noOptionsText="Brak przedmiotów do wybrania"
                        />
                    </div>
                </div>
                <div v-if="selectedOrder != '' && selectedOrderItem != ''">
                    <div class="search-input-box">
                        <label>Dostawa została odebrana:</label>
                        <div id="isReceivedCo">
                            <va-icon v-if="isReceived" color="success" class="material-icons">done</va-icon>
                            <va-icon v-if="!isReceived" color="danger" class="material-icons">close</va-icon>
                            <va-icon @click="isReceived=!isReceived" color="primary" class="material-icons">cached</va-icon>
                        </div>
                    </div>
                    <va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
                        <va-input
                            class="gridFirstC gridFirstR inputWidth"
                            v-model="price"
                            label="Cena"
                            :rules="[(v) => v >= 0 || `Wprowadź poprawną cenę`, (v) => v != '' || `Wprowadź poprawną cenę`]"
                            placeholder="Cena zamówionych produktów"
                        />
                        <va-input
                            class="gridFirstC gridSecondR inputWidth"
                            v-model="quantity"
                            label="Ilość"
                            :rules="[(v) => v > 0 || `Wprowadź poprawną ilość`, (v) => v != '' || `Wprowadź poprawną ilość`]"
                            placeholder="Ilość zamówionych produktów"
                        />
                        <va-select
                            class="gridFirstC gridThirdR inputWidth"
                            v-model="selectedType"
                            :options="supplyItemTypes"
                            :rules="[(v) => v != '' || `Typ musi byc wybrany`]"
                            label="Typ przedmiotu dostawy"
                            noOptionsText="Brak typów do wybrania"
                        />
                        <va-select
                            class="gridFirstC gridFourthR inputWidth"
                            v-model="selectedRepresentative"
                            :options="representatives"
                            :rules="[(v) => v != '' || `Reprezentant musi byc wybrany`]"
                            label="Reprezentant dostawcy"
                            noOptionsText="Brak osób do wybrania"
                        />
                        <va-date-input
                            class="gridSecondC gridFirstR inputWidth"
                            v-model="supplyDate"
                            :rules="[(v) => v != null || `Data musi być wybrana.`]"
                            label="Data realizacji dostawy"
                            placeholder="Data realizacji dostawy"
                        />
                        <va-input
                            class="gridSecondC gridSpreadR inputWidth"
                            v-model="itemDescription"
                            :rules="[(v) => v.length > 0 || `Pole opis nie może być puste.`, (v) => v.length < 256 || `Pole opis przekroczyło limit znaków.`]"
                            label="Opis"
                            type="textarea"
                            placeholder="Opis zamawianych przedmiotów"
                            :min-rows="7"
                        />
                        <div id="submitButtonContainer">
                            <va-button type="submit" color="info" gradient class="my-3">Dodaj</va-button>
                        </div>
                    </va-form>
                </div>
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
                            <va-popover message="Usuń przydział adresu">
                                <va-button flat icon="delete" @click="deleteDeliveryAddress(address)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button v-if="selectedRepresentative != ''" @click="showAddressModal=true" type="button" color="success" gradient>Przydziel adres odbioru</va-button>
                <DeliveryAddress :idSupplier="getSupplierIdByName(this.selectedRepresentative)" v-if="showAddressModal" @createDeliveryAddress="addAddress($event)" @close="closeAddressModal()" />
            </div>
        </div>
	</div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import DeliveryAddress from '@/components/ReuseComponents/Modals/DeliveryAddress.vue';

export default {
  name: 'SupplyForm',
	data() {
		return {
            isReceived: false,
            itemDescription: "",
            price: 1,
            quantity: 1,
            supplyDate: null,
            selectedType: "",
            rawSupplyItemTypes: [],
            selectedRepresentative: "",
            rawRepresentatives: [],
            selectedOrder: "",
            rawOrders: [],
            selectedOrderItem: "",
            rawOrderItems: [],

            deliveryAddresses: [],
            showAddressModal: false,
		}
	},
    components: { DeliveryAddress },
    computed: {
        orders() {
            let resultArr = this.rawOrders.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        orderItems() {
            let resultArr = this.rawOrderItems.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        supplyItemTypes(){
            let resultArr = this.rawSupplyItemTypes.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        representatives() {
            let resultArr = this.rawRepresentatives.map(function(item) {
                return item["name"] + " " + item["lastName"];
            });

            return resultArr;
        }
    },
    watch: {
        async selectedOrder() {
            let callPath = "/OrderItem/getOrderItemsByOrder?id=" + this.getIdByName("order", this.selectedOrder);
            this.rawOrderItems = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
    },
    async mounted() {
        let callPath = "/Order/getOrders";
        this.rawOrders = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });
        
        callPath = "/Representative/getSupplierRepresentatives";
        this.rawRepresentatives = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

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
            if(this.validateForm()) { 
                let addressesAPI = this.deliveryAddresses.map(function(item) {
                    let result = {
                        IdAddress: item["IdAddress"],
                        IdOrder: null,
                        IdSupply: null,
                    }

                    return result;
                });

                let callPath = "/Supply/createSupplyWithAddresses";
                let body = {
                    ItemDescription: this.itemDescription,
                    Price: this.price,
                    Quantity: this.quantity,
                    SupplyDate: this.supplyDate,
                    IsReceived: this.isReceived,
                    IdSupplyItemType: this.getIdByName("supplyItemType", this.selectedType),
                    IdRepresentative: this.getIdByName("representative", this.selectedRepresentative),
                    IdOrderItem: this.getIdByName("orderItem", this.selectedOrderItem),
                    DeliveriesAddresses: addressesAPI,
                };

                await CallAPI.post(callPath, body)
                .then(res => {
                    this.$vaToast.init({ message: 'Dostawca został dodany.', color: 'success', duration: 3000 });
                    this.$router.push({ name: "SupplyDetails", params: { id: res.data, mode: 'edit' } });
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

            if(this.selectedType == "") {
                this.isFormValidate = false;
                this.$vaToast.init({ message: 'Dostawa musi mieć wybrany typ.', color: 'danger', duration: 2000 })
            }
            if(this.selectedRepresentative  == "") {
                this.isFormValidate = false;
                this.$vaToast.init({ message: 'Dostawa musi mieć wybranego reprezentanta.', color: 'danger', duration: 2000 })
            }

            return this.isFormValidate;
        },
        getSupplierIdByName(givenName) {
            return this.rawRepresentatives.find(element => (element.name + " " + element.lastName) == givenName).idSupplier;
        },
        getIdByName(what, name) {
            switch(what){
                case "supplyItemType":
                    return this.rawSupplyItemTypes.find(element => element.name == name).idSupplyItemType;
                case "representative":
                    return this.rawRepresentatives.find(element => (element.name + " " + element.lastName) == name).idRepresentative;
                case "orderItem":
                    return this.rawOrderItems.find(element => element.name == name).idOrderItem;
                case "order":
                    return this.rawOrders.find(element => element.name == name).idOrder;
            }
        },
        closeAddressModal() {
            this.showAddressModal = false;
        },
        addAddress(e) {
            this.deliveryAddresses.push(e);
        },
        deleteDeliveryAddress(address) {
            const index = this.deliveryAddresses.indexOf(address);
            if (index > -1) {
                this.deliveryAddresses.splice(index, 1);
            }
        }
	},
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
