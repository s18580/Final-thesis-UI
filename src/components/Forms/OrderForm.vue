<template>
    <div id="background">
        <div id="headerCo">
            <h1>Dodaj nowe zamówienie</h1>
            <va-divider />
        </div>
        <div id="orderDetailsCo">
            <h3>Dane zamówienia</h3>
            <va-divider />
            <div id="orderDetailsCoInner">
                <div class="search-input-box">
                    <label>Zamówienie jest przetargiem:</label>
                    <div id="isAuctionCo">
                        <va-icon v-if="isAuction" color="success" class="material-icons">done</va-icon>
                        <va-icon v-if="!isAuction" color="danger" class="material-icons">close</va-icon>
                        <va-icon id="isAuction" @click="isAuction=!isAuction" color="primary" class="material-icons">cached</va-icon>
                    </div> 
                </div>
                <va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
                <va-input
                    id="orderName"
                    class="inputWidth"
                    v-model="orderName"
                    :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 101 || `Pole nazwa przekroczyło limit znaków.`]"
                    label="Nazwa"
                    placeholder="Nazwa zamówienia"
                />
                <va-date-input
                    id="offerValidityDate"
                    class="inputWidth"
                    v-model="offerValidityDate"
                    label="Termin oferty"
                    placeholder="Termin ważności oferty"
                />
                <va-date-input
                    id="expectedDeliveryDate"
                    class="inputWidth"
                    v-model="expectedDeliveryDate"
                    label="Przewidywana data dostawy"
                    placeholder="Pożądana data dostawy"
                />
                <va-select
                    id="customer"
                    class="inputWidth"
                    v-model="selectedClient"
                    :options="clients"
                    label="Klient"
                    noOptionsText="Brak klientów do wybrania"
                    @update:model-value="getRepresentativesData($event)"
                />
                <va-select
                    v-if="isCustomerSelected"
                    id="representative"
                    class="inputWidth"
                    v-model="selectedRepresentative"
                    :options="representatives"
                    label="Osoba kontaktowa"
                    noOptionsText="Brak osób do wybrania"
                />
                <va-select
                    id="orderStatus"
                    class="inputWidth"
                    v-model="selectedOrderStatus"
                    :options="orderStatuses"
                    label="Status zamówienia"
                    noOptionsText="Brak statusów do wybrania"
                />
                <va-input
                    id="orderNote"
                    class="inputWidth"
                    v-model="orderNote"
                    type="textarea"
                    :rules="[(v) => v.length < 256 || `Pole notatka przekroczyło limit znaków.`]"
                    label="Notatka (opcjonalnie)"
                />
            </va-form>
            </div>
        </div>
        <div id="orderItemsCo">
            <h3>Przedmioty zamówienia</h3>
            <va-divider />
            <div id="orderItemsCoInner">
                <va-list>
                    <va-list-label>
                        Przedmioty zamówienia
                    </va-list-label>

                    <va-list-item
                        v-for="(orderItem, index) in orderItems"
                        :key="index"
                    >
                        <va-list-item-section avatar>
                            <va-avatar color="#6B5B95" icon="inventory_2" />
                        </va-list-item-section>

                        <va-list-item-section>
                            <va-list-item-label>
                                {{ orderItem.name }}
                            </va-list-item-label>
                        </va-list-item-section>

                        <va-list-item-section icon>
                            <va-popover message="Edytuj przemiot zamówienia">
                                <va-button flat icon="edit" @click="editOrderItemInModal(index)" />
                            </va-popover>
                            <va-popover message="Usuń przemiot zamówienia">
                                <va-button flat icon="delete" @click="removeItem(orderItems, index)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button id="addOrderItem" @click="showOrderItemModal=true" type="button" color="success" gradient>Dodaj przedmiot zamówienia</va-button>
                <OrderItemModal :orderItem="orderItems[editedOrderItemIndex]" v-if="showOrderItemModal" @close="closeOrderItemModal()" @createOrderItem="addItem(orderItems, $event)" @editOrderItem="editOrderItem($event)"/>
            </div>
        </div>
        <div id="workersCo">
            <h3>Przypisani pracownicy</h3>
            <va-divider />
            <div id="workersCoInner">
                <va-list>
                    <va-list-label>
                        Pracownicy
                    </va-list-label>

                    <va-list-item
                        v-for="(worker, index) in assignmentWorkers"
                        :key="index"
                    >
                        <va-list-item-section avatar>
                            <va-avatar color="#6B5B95" icon="face" />
                        </va-list-item-section>

                        <va-list-item-section>
                            <va-list-item-label>
                                {{ worker.name }}
                            </va-list-item-label>
                        </va-list-item-section>

                        <va-list-item-section icon>
                            <va-popover message="Edytuj przypisanie">
                                <va-button flat icon="edit" @click="editWorkerInModal(index)" />
                            </va-popover>
                            <va-popover message="Usuń przypisanie">
                                <va-button flat icon="delete" @click="removeItem(assignmentWorkers, index)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button id="addWorker" @click="showWorkerModal=true" type="button" color="success" gradient>Przydziel pracownika</va-button>
                <WorkerModal :worker="assignmentWorkers[editedWorkerIndex]" v-if="showWorkerModal" @close="closeWorkerModal()" @createWorker="addItem(assignmentWorkers, $event)" @editWorker="editWorker($event)"/>
            </div>
        </div>
        <div id="addressesCo" v-if="isCustomerSelected">
            <h3>Adresy dostawy zamówienia</h3>
            <va-divider />
            <div id="addressesCoInner">
                <va-list>
                    <va-list-label>
                        Adresy dostawy
                    </va-list-label>

                    <va-list-item
                        v-for="(address, index) in deliveryAddresses"
                        :key="index"
                    >
                        <va-list-item-section avatar>
                            <va-avatar color="#6B5B95" icon="local_shipping" />
                        </va-list-item-section>

                        <va-list-item-section>
                            <va-list-item-label>
                                {{ address.name }}
                            </va-list-item-label>
                        </va-list-item-section>

                        <va-list-item-section icon >
                            <va-popover message="Usuń adres">
                                <va-button flat icon="delete" @click="removeItem(deliveryAddresses, index)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button id="addAddress" @click="showAddressModal=true" type="button" color="success" gradient>Przydziel adres dostawy</va-button>
                <DeliveryAddress :idCustomer="getClientIdByName(this.selectedClient)" v-if="showAddressModal" @createDeliveryAddress="addItem(deliveryAddresses, $event)" @close="closeAddressModal()" />
            </div>
        </div>
        <div id="addOrderButtonCo">
            <va-button id="addOrder" @click="submitForm()" color="info" gradient class="my-3">Dodaj zamówienie</va-button>
        </div>
    </div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import DeliveryAddress from '@/components/ReuseComponents/Modals/DeliveryAddress.vue';
import WorkerModal from '@/components/ReuseComponents/Modals/WorkerModal.vue';
import OrderItemModal from '@/components/ReuseComponents/Modals/OrderItemModal.vue';

export default {
  name: 'OrderForm',
  components: { WorkerModal, OrderItemModal, DeliveryAddress },
  data() {
		return {
            isAuction: false,
            rawClients: [],
            selectedClient: "",
            rawOrderStatuses: [],
            selectedOrderStatus: "",
            rawReprsentatives: [],
            selectedRepresentative: "",
            orderName: "",
            expectedDeliveryDate: new Date(),
            offerValidityDate: this.addDays(new Date(), 7),
            showWorkerModal: false,
            showAddressModal: false,
            showOrderItemModal: false,
            editedWorkerIndex: null,
            assignmentWorkers: [],
            deliveryAddresses: [],
            editedOrderItemIndex: null,
            orderItems: [],
            orderNote: "",
            isCustomerSelected: false,
		}
	},
    watch: {
        selectedClient() {
            if(this.selectedClient !== ""){
                this.isCustomerSelected = true;
            }
        },
    },
    async mounted() {
        let callPath = "/Customer/getCustomers";
        this.rawClients = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        callPath = "/OrderStatus/getOrderStatuses";
        this.rawOrderStatuses = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });
    },
    computed: {
        clients() {
            let resultArr = this.rawClients.map(function(item) {
                return item["companyName"];
            });

            return resultArr;
        },
        representatives() {
            let resultArr = this.rawReprsentatives.map(function(item) {
                return item["name"] + " " + item["lastName"];
            });

            return resultArr;
        },
        orderStatuses(){
            let resultArr = this.rawOrderStatuses.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
    },
    methods: {
        addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        },
        async getRepresentativesData(clientName) {
            let callPath = "/Representative/getCustomerActiveRepresentatives?id=" + this.getClientIdByName(clientName);
            this.rawReprsentatives = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
        async submitForm() {
            if(this.validateForm()) {
                let assignedWorkersAPI = this.assignmentWorkers.map(function(item) {
                    let result = {
                        IdWorker: item["idWorker"],
                        orderLeader: item["isLeader"],
                        hoursWorked: item["hoursWorker"],
                    }

                    return result;
                });
                let orderItemsAPI = this.orderItems.map(function(item) {
                    let result = {
                        Circulation: item["circulation"],
                        Capacity: item["capacity"],
                        Name: item["name"],
                        Comments: item["comments"],
                        ExpectedCompletionDate: item["expectedCompletionDate"],
                        CompletionDate: item["completionDate"],
                        InsideFormat: item["insideFormat"],
                        CoverFormat: item["coverFormat"],
                        IdDeliveryType: item["idDeliveryType"],
                        IdBindingType: item["idBindingType"],
                        IdOrderItemType: item["idOrderItemType"],
                        Colors : item["colors"],
                        Services : item["services"],
                        Papers : item["papers"],
                    }

                    return result;
                });
                let deliveryAddressesAPI = this.deliveryAddresses.map(function(item) {
                    let result = {
                        IdAddress: item["IdAddress"],
                        IdOrder: null,
                        IdSupply: null
                    }

                    return result;
                });

                let callPath = "/Order/createOrderWithData";
                let body = {
                    Name: this.orderName,
                    Note: this.orderNote,
                    IsAuction: this.isAuction,
                    ExpectedDeliveryDate: this.expectedDeliveryDate,
                    OfferValidityDate: this.offerValidityDate,
                    IdRepresentative: this.getRepresentativeIdByName(this.selectedRepresentative),
                    IdStatus: this.getOrderStatusIdByName(this.selectedOrderStatus),
                    IdCustomer: this.getClientIdByName(this.selectedClient),
                    WorkersToAssign: assignedWorkersAPI,
                    DeliveryAddresses: deliveryAddressesAPI,
                    OrderItems: orderItemsAPI,
                };

                await CallAPI.post(callPath, body)
                .then(res => {
                    this.$vaToast.init({ message: 'Zamówienie zostało dodane.', color: 'success', duration: 3000 });
                    this.$router.push({ name: "OrderDetails", params: { id: res.data, mode: 'edit' } });
                    return res.data;
                })
                .catch(err => {
                    if(err.message.includes("422")) {
                        this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                    }else{
                        this.$vaToast.init({ message: 'Błąd dodawania zamówienia.', color: 'danger', duration: 3000 })
                    }

                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
        },
        validateForm() {
            this.$refs.form.validate();
            if(this.orderItems.length == 0) {
                this.isFormValidate = false;
                this.$vaToast.init({ message: 'Zamówienie musi mieć przynajmniej jeden przedmiot zamówienia.', color: 'danger', duration: 2000 })
            }
            if(this.selectedClient == "") {
                this.isFormValidate = false;
                this.$vaToast.init({ message: 'Zamówienie musi mieć wybranego klienta.', color: 'danger', duration: 2000 })
            }
            if(this.selectedOrderStatus == "") {
                this.isFormValidate = false;
                this.$vaToast.init({ message: 'Zamówienie musi mieć wybrany status.', color: 'danger', duration: 2000 })
            }
            if(this.selectedRepresentative  == "") {
                this.isFormValidate = false;
                this.$vaToast.init({ message: 'Zamówienie musi mieć wybranego reprezentanta.', color: 'danger', duration: 2000 })
            }

            return this.isFormValidate;
        },
        getClientIdByName(name){
            return this.rawClients.find(element => element.companyName == name).idCustomer;
        },
        getOrderStatusIdByName(name){
            return this.rawOrderStatuses.find(element => element.name == name).idStatus;
        },
        getRepresentativeIdByName(name){
            return this.rawReprsentatives.find(element => (element.name + " " + element.lastName) == name).idRepresentative;
        },
        closeOrderItemModal() {
            this.showOrderItemModal = false;
            this.editedOrderItemIndex = null;
        },
        editOrderItem(e) {
            this.orderItems[this.editedOrderItemIndex].name = e.name;
            this.orderItems[this.editedOrderItemIndex].comments = e.comments;
            this.orderItems[this.editedOrderItemIndex].insideFormat = e.insideFormat;
            this.orderItems[this.editedOrderItemIndex].coverFormat = e.coverFormat;
            this.orderItems[this.editedOrderItemIndex].capacity = e.capacity;
            this.orderItems[this.editedOrderItemIndex].circulation = e.circulation;
            this.orderItems[this.editedOrderItemIndex].selectedOrderItemType = e.selectedOrderItemType;
            this.orderItems[this.editedOrderItemIndex].selectedDeliveryType = e.selectedDeliveryType;
            this.orderItems[this.editedOrderItemIndex].selectedBindingTypes = e.selectedBindingTypes;
            this.orderItems[this.editedOrderItemIndex].orderItemColors = e.orderItemColors;
            this.orderItems[this.editedOrderItemIndex].orderItemPapers = e.orderItemPapers;
            this.orderItems[this.editedOrderItemIndex].orderItemService = e.orderItemService;
            this.orderItems[this.editedOrderItemIndex].services = e.services;
            this.orderItems[this.editedOrderItemIndex].papers = e.papers;
            this.orderItems[this.editedOrderItemIndex].colors = e.colors;
        },
        editOrderItemInModal(index) {
            this.editedOrderItemIndex = index;
            this.showOrderItemModal = true;
        },
        closeAddressModal() {
            this.showAddressModal = false;
        },
        closeWorkerModal() {
            this.showWorkerModal = false;
            this.editedWorkerIndex = null;
        },
        addItem(array, e) {
            array.push(e);
        },
        editWorker(e) {
            this.assignmentWorkers[this.editedWorkerIndex].worker = e.worker
            this.assignmentWorkers[this.editedWorkerIndex].isLeader = e.isLeader
        },
        editWorkerInModal(index) {
            this.editedWorkerIndex = index;
            this.showWorkerModal = true;
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
#background {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 50px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". header header ."
    ". main sidebarA ."
    ". main sidebarB ."
    ". sidebarC sidebarC ."
    ". footer footer .";
    grid-gap: 30px;
}

#headerCo {
    grid-area: header;
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#addOrderButtonCo{
    grid-area: footer;
}

#orderDetailsCo {
    grid-area: main;
}

#orderDetailsCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#orderItemsCo {
    grid-area: sidebarC;
}

#orderItemsCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#workersCo {
    grid-area: sidebarA;
}

#workersCoInner {
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

#isAuctionCo {
    display: inline;
}

#isAuctionCo i {
    margin: 10px;
}

#form {
    display: flex;
    flex-direction: column;
}

.inputWidth {
    margin: 10px;
    width: 300px;
    align-self: center;
}

#editButton{
    width: 150px;
    align-self: center;
}
</style>
