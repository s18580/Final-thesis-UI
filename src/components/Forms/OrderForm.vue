<template>
  <div id="mainCo">
        <h1>Dodaj nowe zamówienie</h1>
		<va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
            <div class="search-input-box">
                <label>Zamówienie jest przetargiem:</label>
                <div>
                    <input v-model="isAuction" type="checkbox"> 
                </div> 
            </div>
            <va-input
                class="some-space mb-4"
                v-model="orderName"
                :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                label="Nazwa"
                placeholder="Nazwa zamówienia"
            />
            <va-date-input
                class="some-space mb-4"
                v-model="orderSubmissionDate"
                label="Data złożenia"
                placeholder="Data złożenia zamówienia"
            />
            <va-date-input
                class="some-space mb-4"
                v-model="expectedDeliveryDate"
                label="Przewidywana data dostawy"
                placeholder="Pożądana data dostawy"
            />
            <va-date-input
                class="some-space mb-4"
                v-model="offerValidityDate"
                label="Termin oferty"
                placeholder="Termin ważności oferty"
            />
            <va-select
                class="mb-4 some-space"
                v-model="selectedClient"
                :options="clients"
                label="Klient"
                noOptionsText="Brak klientów do wybrania"
                @update:model-value="getRepresentativesData($event)"
            />
            <va-select
                class="mb-4 some-space"
                v-model="selectedRepresentative"
                :options="representatives"
                label="Osoba kontaktowa"
                noOptionsText="Brak osób do wybrania"
            />
            <va-select
                class="mb-4 some-space"
                v-model="selectedOrderStatus"
                :options="orderStatuses"
                label="Status zamówienia"
                noOptionsText="Brak statusów do wybrania"
            />
            <va-input
                class="mb-4 some-space"
                v-model="orderNote"
                type="textarea"
                :rules="[(v) => v.length < 256 || `Pole notatka przekroczyło limit znaków.`]"
                label="Notatka (opcjonalnie)"
            />
            <va-divider inset />
			<div id="card-container">
				<div class="objects-card-wrapper">
					<h6>Przydzieleni pracownicy:</h6>
					<div class="objects-card">
						<div v-for="worker in assignmentWorkers" :key="worker.IdForWorkerTable" class="card-items">
                            <div>
                                {{ worker.name }}
                            </div>
                            <div class="card-icons">
                                <svg @click="editWorkerInModal(worker)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>

                                <svg @click="removeWorker(worker.IdForWorkerTable)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                            </div>
						</div>
					</div>
                    <va-button @click="showWorkerModal=true" type="button" color="success" gradient>Przydziel pracownika</va-button>
                    <WorkerModal :worker="editedWorker" v-if="showWorkerModal" @close="closeWorkerModal()" @createWorker="addWorker($event)" @editWorker="editWorker($event)"/>
				</div>
                <va-divider vertical />
				<div class="objects-card-wrapper">
					<h6>Adresy dostawy zamówienia:</h6>
					<div class="objects-card">
						<div v-for="address in deliveryAddresses" :key="address.IdForAddressTable" class="card-items">
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
                    <va-button @click="showAddressModal=true" type="button" color="success" gradient>Przydziel adres klienta</va-button>
                    <AddressModal :addr="editedDeliveryAddress" v-if="showAddressModal" @close="closeAddressModal()" @createAddress="addAddress($event)" @editAddress="editAddress($event)"/>
				</div>
			</div>
            <va-divider inset />
                <div class="objects-card-wrapper">
					<h6>Przedmioty zamówienia:</h6>
					<div class="objects-card">
						<div v-for="orderItem in orderItems" :key="orderItem.IdForOrderItemTable" class="card-items">
                            <div>
                                {{ orderItem.name }}
                            </div>
                            <div class="card-icons">
                                <svg @click="editOrderItemInModal(orderItem)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>

                                <svg @click="removeOrderItem(orderItem.IdForOrderItemTable)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                            </div>
						</div>
					</div>
                    <va-button @click="showOrderItemModal=true" type="button" color="success" gradient>Dodaj przedmiot zamówienia</va-button>
                    <OrderItemModal :orderItem="editedOrderItem" v-if="showOrderItemModal" @close="closeOrderItemModal()" @createOrderItem="addOrderItem($event)" @editOrderItem="editOrderItem($event)"/>
				</div>
            <va-button @click="submitForm()" color="info" gradient class="my-3">Dodaj</va-button>
		</va-form>
	</div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import AddressModal from '@/components/ReuseComponents/Modals/AddressModal.vue';
import WorkerModal from '@/components/ReuseComponents/Modals/WorkerModal.vue';
import OrderItemModal from '@/components/ReuseComponents/Modals/OrderItemModal.vue';

export default {
  name: 'OrderForm',
  components: { AddressModal, WorkerModal, OrderItemModal },
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
            orderSubmissionDate: new Date(),
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
		}
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

                let callPath = "/Order/createOrderWithData";
                let body = {
                    Name: this.orderName,
                    OrderSubmissionDate: this.orderSubmissionDate,
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
            e.newAddress.IdForAddressTable = this.addressCounter;
            this.deliveryAddresses.push(e.newAddress);
            this.addressCounter++;
        },
        editAddress(e) {
            for(const obj of this.deliveryAddresses){
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
            this.editedDeliveryAddress = address;
            this.showAddressModal = true;
        },
        removeAddress(id) {
            this.deliveryAddresses = this.deliveryAddresses.filter(item => item.IdForAddressTable !== id);
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
#mainCo {
	margin-right: 100px;
	margin-left: 100px;
	padding: 40px;
	background: white;
	border-radius: 25px;
    padding-right: 190px;
	padding-left: 190px;
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

.radio-box {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 50px;
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
</style>
