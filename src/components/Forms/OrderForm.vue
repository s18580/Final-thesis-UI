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
                        <va-icon @click="isAuction=!isAuction" color="primary" class="material-icons">cached</va-icon>
                    </div> 
                </div>
                <va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
                <va-input
                    class="inputWidth"
                    v-model="orderName"
                    :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                    label="Nazwa"
                    placeholder="Nazwa zamówienia"
                />
                <va-date-input
                    class="inputWidth"
                    v-model="offerValidityDate"
                    label="Termin oferty"
                    placeholder="Termin ważności oferty"
                />
                <va-date-input
                    class="inputWidth"
                    v-model="expectedDeliveryDate"
                    label="Przewidywana data dostawy"
                    placeholder="Pożądana data dostawy"
                />
                <va-select
                    class="inputWidth"
                    v-model="selectedClient"
                    :options="clients"
                    label="Klient"
                    noOptionsText="Brak klientów do wybrania"
                    @update:model-value="getRepresentativesData($event)"
                />
                <va-select
                    v-if="isCustomerSelected"
                    class="inputWidth"
                    v-model="selectedRepresentative"
                    :options="representatives"
                    label="Osoba kontaktowa"
                    noOptionsText="Brak osób do wybrania"
                />
                <va-select
                    class="inputWidth"
                    v-model="selectedOrderStatus"
                    :options="orderStatuses"
                    label="Status zamówienia"
                    noOptionsText="Brak statusów do wybrania"
                />
                <va-input
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
                        v-for="orderItem in orderItems"
                        :key="orderItem.IdForOrderItemTable"
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
                                <va-button flat icon="edit" @click="editOrderItemInModal(orderItem)" />
                            </va-popover>
                            <va-popover message="Usuń przemiot zamówienia">
                                <va-button flat icon="delete" @click="removeOrderItem(orderItem.IdForOrderItemTable)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button @click="showOrderItemModal=true" type="button" color="success" gradient>Dodaj przedmiot zamówienia</va-button>
                <OrderItemModal :orderItem="editedOrderItem" v-if="showOrderItemModal" @close="closeOrderItemModal()" @createOrderItem="addOrderItem($event)" @editOrderItem="editOrderItem($event)"/>
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
                        v-for="worker in assignmentWorkers"
                        :key="worker.IdForWorkerTable"
                    >
                        <va-list-item-section avatar>
                            <va-avatar color="#6B5B95" icon="face" />
                        </va-list-item-section>

                        <va-list-item-section>
                            <va-list-item-label>
                                {{ worker.name }}
                            </va-list-item-label>
                        </va-list-item-section>

                        <va-list-item-section icon v-if="!readOnlyMode">
                            <va-popover message="Edytuj przypisanie">
                                <va-button flat icon="edit" @click="editWorkerInModal(worker)" />
                            </va-popover>
                            <va-popover message="Usuń przypisanie">
                                <va-button flat icon="delete" @click="removeWorker(worker.IdForWorkerTable)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button @click="showWorkerModal=true" type="button" color="success" gradient>Przydziel pracownika</va-button>
                <WorkerModal :worker="editedWorker" v-if="showWorkerModal" @close="closeWorkerModal()" @createWorker="addWorker($event)" @editWorker="editWorker($event)"/>
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

                        <va-list-item-section icon >
                            <va-popover message="Usuń adres">
                                <va-button flat icon="delete" @click="removeAddress(address.IdAddress)" />
                            </va-popover>
                        </va-list-item-section>
                    </va-list-item>
                </va-list>
                <va-button @click="showAddressModal=true" type="button" color="success" gradient>Przydziel adres dostawy</va-button>
                <DeliveryAddress :idCustomer="getClientIdByName(this.selectedClient)" v-if="showAddressModal" @createDeliveryAddress="addAddress($event)" @close="closeAddressModal()" />
            </div>
        </div>
        <div id="addOrderButtonCo">
            <va-button @click="submitForm()" color="info" gradient class="my-3">Dodaj zamówienie</va-button>
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
            editedWorker: null,
            assignmentWorkers: [],
            workerCounter: 0,
            editedDeliveryAddress: null,
            deliveryAddresses: [],
            addressCounter: 0,
            editedOrderItem: null,
            orderItems: [],
            orderItemsCounter: 0,
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
            let callPath = "/Representative/getRepresentativesByCustomer?id=" + this.getClientIdByName(clientName);
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
                        IdDeliveryType: item["selectedDeliveryType"],
                        IdBindingType: item["selectedBindingTypes"],
                        IdOrderItemType: item["selectedOrderItemType"],
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
                    this.resetData();
                    this.$vaToast.init({ message: 'Zamówienie zostało dodane.', color: 'success', duration: 3000 })
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
            this.editedOrderItem = null;
        },
        resetData() {
            window.location.reload(true);
        },
        addOrderItem(e) {
            e.newOrderItem.IdForOrderItemTable = this.orderItemsCounter;
            this.orderItems.push(e.newOrderItem);
            this.orderItemsCounter++;
        },
        editOrderItem(e) {
            for(const obj of this.orderItems){
                if (obj.IdForOrderItemTable === e.newOrderItem.IdForOrderItemTable) {
                    obj.name = e.newOrderItem.name;
                    obj.comments = e.newOrderItem.comments;
                    obj.insideFormat = e.newOrderItem.insideFormat;
                    obj.coverFormat = e.newOrderItem.coverFormat;
                    obj.capacity = e.newOrderItem.capacity;
                    obj.circulation = e.newOrderItem.circulation;
                    obj.selectedOrderItemType = e.newOrderItem.selectedOrderItemType;
                    obj.selectedDeliveryType = e.newOrderItem.selectedDeliveryType;
                    obj.selectedBindingTypes = e.newOrderItem.selectedBindingTypes;
                    obj.IdForOrderItemTable = e.newOrderItem.IdForOrderItemTable;
                    obj.orderItemColors = e.newOrderItem.orderItemColors;
                    obj.orderItemPapers = e.newOrderItem.orderItemPapers;
                    obj.orderItemService = e.newOrderItem.orderItemService;
                    obj.services = e.newOrderItem.services;
                    obj.papers = e.newOrderItem.papers;
                    obj.colors = e.newOrderItem.colors;
                    break;
                }
            }
        },
        editOrderItemInModal(orderItem) {
            this.editedOrderItem = orderItem;
            this.showOrderItemModal = true;
        },
        removeOrderItem(id) {
            this.orderItems = this.orderItems.filter(item => item.IdForOrderItemTable !== id);
        },
        closeAddressModal() {
            this.showAddressModal = false;
            this.editedDeliveryAddress = null;
        },
        addAddress(e) {
            this.deliveryAddresses.push(e);
        },
        removeAddress(id) {
            this.deliveryAddresses = this.deliveryAddresses.filter(item => item.IdAddress !== id);
        },
        closeWorkerModal() {
            this.showWorkerModal = false;
            this.editedWorker = null;
        },
        addWorker(e) {
            e.newWorker.IdForWorkerTable = this.workerCounter;
            this.assignmentWorkers.push(e.newWorker);
            this.workerCounter++;
        },
        editWorker(e) {
            for(const obj of this.assignmentWorkers){
                if (obj.IdForWorkerTable === e.newWorker.IdForWorkerTable) {
                    obj.worker = e.newWorker.worker;
                    obj.hoursWorker = e.newWorker.hoursWorker;
                    obj.isLeader = e.newWorker.isLeader;
                    break;
                }
            }
        },
        editWorkerInModal(worker) {
            this.editedWorker = worker;
            this.showWorkerModal = true;
        },
        removeWorker(id) {
            this.assignmentWorkers = this.assignmentWorkers.filter(item => item.IdForWorkerTable !== id);
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
