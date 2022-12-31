<template>
    <div>
        <div id="background">
            <div id="headerCo">
                <h1>Szczegóły zamówienia</h1>
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
                            <va-icon v-if="!readOnlyMode" @click="isAuction=!isAuction" color="primary" class="material-icons">cached</va-icon>
                        </div> 
                    </div>
                    <va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
                        <va-input
                            class="inputWidth"
                            v-model="orderName"
                            :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                            label="Nazwa"
                            placeholder="Nazwa zamówienia"
                            :readonly = "readOnlyMode"
                        />
                        <va-input
                            class="inputWidth"
                            v-model="orderIdentifier"
                            label="Identyfikator"
                            placeholder="Identyfikator zamówienia"
                            readonly
                        />
                        <va-input
                            class="inputWidth"
                            v-model="orderNote"
                            type="textarea"
                            :rules="[(v) => v.length < 256 || `Pole notatka przekroczyło limit znaków.`]"
                            label="Notatka (opcjonalnie)"
                            :readonly = "readOnlyMode"
                        />
                        <va-date-input
                            class="inputWidth"
                            v-model="expectedDeliveryDate"
                            label="Przewidywana data dostawy"
                            placeholder="Pożądana data dostawy"
                            :readonly = "readOnlyMode"
                        />
                        <va-date-input
                            class="inputWidth"
                            v-model="deliveryDate"
                            label="Data dostawy"
                            placeholder="Data dostawy"
                            :readonly = "readOnlyMode"
                        />
                        <va-date-input
                            class="inputWidth"
                            v-model="creationDate"
                            label="Data stworzenia zamówienia"
                            readonly
                        />
                        <va-date-input
                            class="inputWidth"
                            v-model="offerValidityDate"
                            label="Termin ważności oferty"
                            placeholder="Termin ważności oferty"
                            :readonly = "readOnlyMode"
                        />
                        <va-date-input
                            class="inputWidth"
                            v-model="submissionDate"
                            label="Data złożenia zamówienia"
                            placeholder="Data złożenia zamówienia"
                            :readonly = "readOnlyMode"
                        />
                        <va-input
                            class="inputWidth"
                            v-model="selectedCustomerName"
                            label="Klient"
                            :readonly = "true"
                        />
                        <va-select
                            class="inputWidth"
                            v-model="selectedRepresentative"
                            :options="representatives"
                            label="Osoba kontaktowa"
                            noOptionsText="Brak osób do wybrania"
                            :readonly = "readOnlyMode"
                        />
                        <va-select
                            class="inputWidth"
                            v-model="selectedStatus"
                            :options="orderStatuses"
                            label="Status zamówienia"
                            noOptionsText="Brak statusów do wybrania"
                            :readonly = "readOnlyMode"
                        />
                        <va-button id="editButton" v-if="!readOnlyMode" @click="submitForm()" color="info" gradient class="my-3">Edytuj dane</va-button>
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
                            v-for="item in orderItems"
                            :key="item.idOrderItem"
                        >
                            <va-list-item-section avatar>
                                <va-avatar color="#6B5B95" icon="inventory_2" />
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ item.name }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section icon v-if="!readOnlyMode">
                                <va-popover message="Edytuj przemiot zamówienia">
                                    <va-button flat icon="edit" @click="openEditOrderItem(item)" />
                                </va-popover>
                                <va-popover message="Usuń przemiot zamówienia">
                                    <va-button flat icon="delete" @click="openDeleteOrderItemModal(item)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button v-if="!readOnlyMode" @click="showOrderItemModal=true" type="button" color="success" gradient>Dodaj przedmiot zamówienia</va-button>
                    <OrderItemModal :orderItem="selectedOrderItem" v-if="showOrderItemModal" @close="closeEditOrderItem()" @editOrderItem="editOrderItem($event)" @createOrderItem="addOrderItem($event)" />
                    <va-modal
                        v-model="showDeleteOrderItemModal"
                        message="Czy napewno chcesz usunąć ten przedmiot zamówienia ?"
                        size="small"
                        title="Usuń przedmiot zamówienia"
                        cancel-text="Anuluj"
                        ok-text="Usuń"
                        @cancel="closeDeleteOrderItemModal()"
                        @click-outside="closeDeleteOrderItemModal()"
                        @ok="deleteOrderItem()"
                    />
                </div>
            </div>
            <FileList v-if="awsData != null" :mode="mode" :awsData="awsData" parentType="order" :id="Number(id)"/>
            <div id="workersCo">
                <h3>Przypisani pracownicy</h3>
                <va-divider />
                <div id="workersCoInner">
                    <va-list>
                        <va-list-label>
                            Pracownicy
                        </va-list-label>

                        <va-list-item
                            v-for="assignment in assignments"
                            :key="assignment.IdWorker"
                        >
                            <va-list-item-section avatar>
                                <va-avatar color="#6B5B95" icon="face" />
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ assignment.worker.name + " " + assignment.worker.lastName }}
                                </va-list-item-label>

                                <va-list-item-label caption>
                                    {{ getWorksiteName(assignment) }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section icon v-if="!readOnlyMode">
                                <va-popover message="Edytuj przypisanie">
                                    <va-button flat icon="edit" @click="openEditAssignment(assignment)" />
                                </va-popover>
                                <va-popover message="Usuń przypisanie">
                                    <va-button flat icon="delete" @click="openDeleteAssignmentModal(assignment)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button v-if="!readOnlyMode" @click="showAssignmentsModal=true" type="button" color="success" gradient>Przypisz pracownika</va-button>
                    <WorkerModal :worker="selectedAssignment" v-if="showAssignmentsModal" @close="closeAssignmentModal()" @createWorker="addAssignment($event)" @editWorker="editAssignment($event)"/>
                    <va-modal
                        v-model="showDeleteAssignmentModal"
                        message="Czy napewno chcesz usunąć to przypisanie ?"
                        size="small"
                        title="Usuń przypisanie"
                        cancel-text="Anuluj"
                        ok-text="Usuń"
                        @cancel="closeDeleteAssignmentModal()"
                        @click-outside="closeDeleteAssignmentModal()"
                        @ok="deleteAssignment()"
                    />
                </div>
            </div>
            <div id="addressesCo">
                <h3>Adresy dostawy</h3>
                <va-divider />
                <div id="addressesCoInner">
                    <va-list>
                        <va-list-label>
                            Adresy
                        </va-list-label>

                        <va-list-item
                            v-for="address in addresses"
                            :key="address.idDeliveriesAddresses"
                        >
                            <va-list-item-section avatar>
                                <va-avatar color="#6B5B95" icon="local_shipping" />
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ address.address.name }}
                                </va-list-item-label>

                                <va-list-item-label caption>
                                    {{ address.address.streetName + " " + address.address.streetNumber }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section icon v-if="!readOnlyMode">
                                <va-popover message="Usuń adres">
                                    <va-button flat icon="delete" @click="openDeleteAddressModal(address)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button v-if="!readOnlyMode" @click="showAddressesModal=true" type="button" color="success" gradient>Przydziel adres dostawy</va-button>
                    <DeliveryAddress :idCustomer="idCustomer" v-if="showAddressesModal" @createDeliveryAddress="addAddress($event)" @close="closeAddressModal()" />
                    <va-modal
                        v-model="showDeleteAddressModal"
                        message="Czy napewno chcesz usunąć ten adres ?"
                        size="small"
                        title="Usuń adres"
                        cancel-text="Anuluj"
                        ok-text="Usuń"
                        @cancel="closeDeleteAddressModal()"
                        @click-outside="closeDeleteAddressModal()"
                        @ok="deleteAddress()"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import DeliveryAddress from '@/components/ReuseComponents/Modals/DeliveryAddress.vue';
import FileList from '@/components/ReuseComponents/FileList.vue';
import WorkerModal from '@/components/ReuseComponents/Modals/WorkerModal.vue';
import OrderItemModal from '@/components/ReuseComponents/Modals/OrderItemModal.vue';
import { useUserStore } from '@/stores/UserStore';

export default {
    name: "OrderDetails",
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
    components: { FileList, WorkerModal, DeliveryAddress, OrderItemModal },
    data() {
        return {
            readOnlyMode: false,
            deleteModalMessage: "",
            deleteModalTitle: "",

            awsData: null,

            isAuction: false,
            orderName: "",
            orderIdentifier: "",
            orderNote: "",
            creationDate: null,
            expectedDeliveryDate: null,
            deliveryDate: null,
            offerValidityDate: null,
            submissionDate: null,
            selectedRepresentative: "",
            rawRepresentatives: [],
            idCustomer: null,
            selectedCustomerName: "",
            selectedStatus: "",
            rawOrderStatuses: [],
            isFormValidate: false,

            showDeleteAddressModal: false,
            showAddressesModal: false,
            selectedAddress: null,
            addresses: [],

            showDeleteOrderItemModal: false,
            showOrderItemModal: false,
            selectedOrderItem: null,
            orderItems: [],

            showDeleteAssignmentModal: false,
            showAssignmentsModal: false,
            selectedAssignment: null,
            workers: [],
            assignments: [],

            showFileModal: false,
            files: [],
            albumBucketName: "printingsystemfiles"
        }
    },
    computed: {
        orderStatuses() {
            let resultArr = this.rawOrderStatuses.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        representatives() {
            let resultArr = this.rawRepresentatives.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
    },
    async mounted() {
        let callPath = "/Order/getOrder?id=" + this.id;
        let orderData = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        callPath = "/Representative/getRepresentative?id=" + orderData.idRepresentative;
        let representativeData = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        const userStore = useUserStore();
        callPath = "/Worker/getAWS?id=" + userStore.userId;
        this.awsData = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        this.idCustomer = representativeData.idCustomer;

        if(this.mode === "read") {
            this.readOnlyMode = true;
        } else if(this.mode === "edit") {
            this.readOnlyMode = false;
        }

        this.updateOrderItemList();
        this.updateAssignmentList();
        this.updateAddressList();
        await this.getSelectListData();

        this.isAuction = orderData.isAuction;
        this.orderName = orderData.name;
        this.orderIdentifier = orderData.identifier;
        this.orderNote = orderData.note;
        if(orderData.creationDate != null) {
            this.creationDate = new Date(Date.parse(orderData.creationDate));
        } else{
            this.creationDate = null;
        }
        if(orderData.expectedDeliveryDate != null) {
            this.expectedDeliveryDate = new Date(Date.parse(orderData.expectedDeliveryDate));
        } else{
            this.expectedDeliveryDate = null;
        }
        if(orderData.deliveryDate != null) {
            this.deliveryDate = new Date(Date.parse(orderData.deliveryDate));
        } else{
            this.deliveryDate = null;
        }
        if(orderData.offerValidityDate != null) {
            this.offerValidityDate = new Date(Date.parse(orderData.offerValidityDate));
        } else{
            this.offerValidityDate = null;
        }
        if(orderData.submissionDate != null) {
            this.submissionDate = new Date(Date.parse(orderData.orderSubmissionDate));
        } else{
            this.submissionDate = null;
        }
        this.selectedRepresentative = this.getNameById('representative', orderData.idRepresentative);
        this.selectedCustomerName = this.getNameById('customer', orderData.idRepresentative);
        this.selectedStatus = this.getNameById('status', orderData.idStatus);
    },
    methods: {
        async submitForm() {
            if(this.validateForm) {
                let callPath = "/Order/updateOrder"
                let body = {
                    IdOrder: this.id,
                    Name: this.orderName,
                    OrderSubmissionDate: this.submissionDate,
                    Note: this.orderNote,
                    IsAuction: this.isAuction,
                    ExpectedDeliveryDate: this.expectedDeliveryDate,
                    DeliveryDate: this.deliveryDate,
                    OfferValidityDate: this.offerValidityDate,
                    IdRepresentative: this.getIdByName("representative", this.selectedRepresentative),
                    IdStatus: this.getIdByName("status", this.selectedStatus),
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

            if(this.selectedStatus == "") {
                this.isFormValidate = false;
                this.$vaToast.init({ message: 'Zamówienie musi mieć wybrany status.', color: 'danger', duration: 2000 })
            }
            if(this.selectedRepresentative  == "") {
                this.isFormValidate = false;
                this.$vaToast.init({ message: 'Zamówienie musi mieć wybranego reprezentanta.', color: 'danger', duration: 2000 })
            }
            if(this.readOnlyMode){
                this.isFormValidate = false;
            }

            return this.isFormValidate;
        },
        getWorksiteName(assignment) {
            if(assignment.worker.worksite != null) {
                return assignment.worker.worksite.name;
            } else {
                return "Bez stanowiska";
            }
        },
        getNameById(what, id) {
            switch(what) {
                case "status":
                    return this.rawOrderStatuses.find(element => element.idStatus == id).name;
                case "representative":
                    var representative = this.rawRepresentatives.find(element => element.idRepresentative == id);
                    return representative.name + " " +  representative.lastName;
                case "customer":
                    return this.rawRepresentatives.find(element => element.idRepresentative == id).customer.companyName;
            }
        },
        getIdByName(what, selectedName) {
            switch(what) {
                case "status":
                    return this.rawOrderStatuses.find(element => element.name == selectedName).idStatus;
                case "representative":
                    return this.rawRepresentatives.find(element => element.name + " " + element.lastName == selectedName).idRepresentative;
            }
        },
        async getSelectListData() {
            let callPath = "/OrderStatus/getOrderStatuses";
            this.rawOrderStatuses = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            callPath = "/Worker/getWorkers";
            this.workers = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            callPath = "/Representative/getRepresentativesByCustomer?id=" + this.idCustomer;
            this.rawRepresentatives = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },

        async addAssignment(e) {
            let callPath = "/Assignment/createAssignment";
            let body = {
                IdWorker: e.idWorker,
                IdOrder: this.id,
                OrderLeader: e.isLeader,
                HoursWorked: e.hoursWorker,
            };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Pracownik został przypisany.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd przypisania pracownika.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateAssignmentList();
        },
        async editAssignment(e) {
            let callPath = "/Assignment/updateAssignment";
            let body = {
                IdWorker: e.idWorker,
                IdOrder: this.id,
                OrderLeader: e.isLeader,
                HoursWorked: e.hoursWorker,
            };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Przypisanie zostało edytowane.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd edycji przypisania.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateAssignmentList();
        },
        async deleteAssignment() {
            let callPath = "/Assignment/deleteAssignment";
            let body = { data: {
                IdWorker: this.selectedAssignment.idWorker,
                IdOrder: this.id,
            } };

            await CallAPI.delete(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Przypisanie zostało usunięte.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd usuwania przypisania.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateAssignmentList();
        },
        async updateAssignmentList() {
            let callPath = "/Assignment/getAssignmentsByOrder?orderId=" + this.id;
            this.assignments = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
        openEditAssignment(assignment) {
            this.selectedAssignment = assignment;
            this.showAssignmentsModal = true;
        },
        openDeleteAssignmentModal(assignment) {
            this.selectedAssignment = assignment;
            this.showDeleteAssignmentModal = true;
        },
        closeAssignmentModal() {
            this.selectedAssignment = null;
            this.showAssignmentsModal = false;
        },
        closeDeleteAssignmentModal() {
            this.selectedAssignment = null;
            this.showDeleteAssignmentModal = false;
        },

        async addAddress(e) {
            let callPath = "/DeliveriesAddresses/createDeliveriesAddress";
            let body = {
                IdAddress: e.IdAddress,
                IdOrder: this.id,
                IdSupply: null,
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
            let callPath = "/DeliveriesAddresses/getDeliveriesAddressesByOrder?id=" + this.id;
            this.addresses = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
        openDeleteAddressModal(address) {
            this.selectedAddress = address;
            this.showDeleteAddressModal = true;
        },
        closeAddressModal() {
            this.showAddressesModal = false;
            this.selectedAddress = null;
        },
        closeDeleteAddressModal() {
            this.showDeleteAddressModal = false;
            this.selectedAddress = null;
        },


        async addOrderItem(e) {
            let callPath = "/OrderItem/createOrderItem";
            let body = {
                IdOrder: this.id,
                Circulation: e.circulation,
                Capacity: e.capacity,
                Name: e.name,
                Comments: e.comments,
                ExpectedCompletionDate: e.expectedCompletionDate,
                CompletionDate: e.completionDate,
                InsideFormat: e.insideFormat,
                CoverFormat: e.coverFormat,
                IdDeliveryType: e.idDeliveryType,
                IdBindingType: e.idBindingType,
                IdOrderItemType: e.idOrderItemType,
                Colors: e.colors,
                Services: e.services,
                Papers: e.papers,
            };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Przedmiot zamówienia został dodany.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd dodawania przedmiotu zamówienia.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateOrderItemList();
        },
        async editOrderItem(e) {
            console.log(e);

            let callPath = "/OrderItem/updateOrderItem";
            let body = {
                IdOrderItem: e.idOrderItem,
                Circulation: e.circulation,
                Capacity: e.capacity,
                Name: e.name,
                Comments: e.comments,
                ExpectedCompletionDate: e.expectedCompletionDate,
                CompletionDate: e.completionDate,
                InsideFormat: e.insideFormat,
                CoverFormat: e.coverFormat,
                IdDeliveryType: e.idDeliveryType,
                IdBindingType: e.idBindingType,
                IdOrderItemType: e.idOrderItemType,
                IdSelectedValuation: e.selectedValuation,
                Colors: e.colors,
                Services: e.services,
                Papers: e.papers,
            };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Przedmiot zamówienia został edytowany.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd edycji przedmiotu zamówienia.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateOrderItemList();
        },
        async deleteOrderItem() {
            let callPath = "/OrderItem/deleteOrderItem";
            let body = { data: {
                IdOrderItem: this.selectedOrderItem.idOrderItem
            } };

            await CallAPI.delete(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Przedmiot zamówienia został usunięty.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd usuwania przedmiotu zamówienia.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateOrderItemList();
        },
        async updateOrderItemList() {
            let callPath = "/OrderItem/getOrderItemsByOrder?id=" + this.id;
            this.orderItems = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
        openEditOrderItem(item) {
            this.selectedOrderItem = item;
            this.showOrderItemModal = true;
        },
        openDeleteOrderItemModal(item) {
            this.selectedOrderItem = item;
            this.showDeleteOrderItemModal = true;
        },
        closeEditOrderItem() {
            this.selectedOrderItem = null;
            this.showOrderItemModal = false;
        },
        closeDeleteOrderItemModal() {
            this.selectedOrderItem = null;
            this.showDeleteOrderItemModal = false;
        },
    }
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
    ". sidebarD sidebarD .";
    grid-gap: 30px;
}

#headerCo {
    grid-area: header;
    padding: 20px;
    background: white;
	border-radius: 25px;
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

#filesCo {
    grid-area: sidebarD;
}

#filesCoInner {
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