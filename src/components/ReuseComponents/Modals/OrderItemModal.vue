<template>
    <va-modal
        v-model="showOrderItemModal"
        :title="buttonMessage"
        hide-default-actions
        @click-outside="closeOrderItemModal()"
        max-width="1100px"
    >
        <div id="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalOrderItemForm" tag="form" ref="modalOrderItemForm" @validation="isOrderItemFormValidate = $event">
                <div id="isCover">
                    <va-radio
                        v-for="(option, index) in radioOptions"
                        :key="index"
                        v-model="selectedRadioOption"
                        :option="option"
                    />
                </div>
                <va-input
                    class="some-space mb-4"
                    v-model="orderItemName"
                    :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                    label="Nazwa"
                    placeholder="Nazwa przedmiotu zamówienia"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="insideFormat"
                    :rules="[(v) => v.length > 0 || `Pole format nie może być puste.`, (v) => v.length < 101 || `Pole format przekroczyło limit znaków.`]"
                    label="Format"
                    placeholder="Format przedmiotu zamówienia"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="circulation"
                    :rules="[(v) => v >= 0 || `Nakład nie może być ujmeny.`]"
                    label="Nakład"
                />
                <va-date-input
                    class="some-space mb-4"
                    v-model="expectedCompletionDate"
                    label="Pożądana data ukończenia"
                    placeholder="Pożądana data ukończenia"
                    clearable
                />
                <va-date-input
                    v-if="!newItemMode"
                    class="some-space mb-4"
                    v-model="completionDate"
                    label="Data ukończenia"
                    placeholder="Data ukończenia"
                    clearable
                />
                <va-select
                    class="mb-4 some-space"
                    v-model="selectedOrderItemType"
                    :options="orderItemTypes"
                    label="Typ przedmiotu zamówienia"
                    noOptionsText="Brak typów przedmiotu zamówienia do wybrania"
                />
                <va-select
                    class="mb-4 some-space"
                    v-model="selectedDeliveryType"
                    :options="deliveryTypes"
                    label="Typ dostawy"
                    noOptionsText="Brak typów dostawy do wybrania"
                />
                <va-select
                    v-if="showValuationSelect && !newItemMode"
                    class="mb-4 some-space"
                    v-model="selectedValuation"
                    :options="valuations"
                    label="Wybrana wycena"
                    noOptionsText="Brak wycen do wybrania"
                />
                <va-input
                    class="mb-4 some-space"
                    v-model="comments"
                    type="textarea"
                    :rules="[(v) => v.length < 256 || `Pole notatka przekroczyło limit znaków.`]"
                    label="Notatka (opcjonalnie)"
                />
            </va-form>
            <div id="colorCo">
                <h3>Kolorystyka</h3>
                <va-divider />
                <div>
                    <div class="objects-card-wrapper">
                        <h6>Lista kolorów:</h6>
                        <va-list id="insideColorList">
                            <va-list-item
                                v-for="(color, index) in colors"
                                :key="index"
                            >
                                <va-list-item-section avatar>
                                    <va-avatar color="#6B5B95" icon="palette" />
                                </va-list-item-section>

                                <va-list-item-section>
                                    <va-list-item-label>
                                        {{ color.name }}
                                    </va-list-item-label>
                                </va-list-item-section>

                                <va-list-item-section icon>
                                    <va-popover message="Usuń kolor">
                                        <va-button flat icon="delete" @click="removeItem(colors, index)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                        <va-button @click="showColorModal=true" type="button" color="success" gradient>Dodaj kolor</va-button>
                        <ColorModal v-if="showColorModal" @close="showColorModal=false" @createColor="addItem(colors, $event)"/>
                    </div>
                </div>
            </div>
            <div id="paperCo">
                <h3>Papiery</h3>
                <va-divider />
                <div>
                    <div class="objects-card-wrapper">
                        <h6>Lista papierów:</h6>
                        <va-list id="papersList">
                            <va-list-item
                                v-for="(paper, index) in papers"
                                :key="index"
                            >
                                <va-list-item-section avatar>
                                    <va-avatar color="#6B5B95" icon="newspaper" />
                                </va-list-item-section>

                                <va-list-item-section>
                                    <va-list-item-label>
                                        {{ paper.name }}
                                    </va-list-item-label>
                                </va-list-item-section>

                                <va-list-item-section icon>
                                    <va-popover message="Edytuj papier">
                                        <va-button flat icon="edit" @click="editPaperInModal(index)" />
                                    </va-popover>
                                    <va-popover message="Usuń papier">
                                        <va-button flat icon="delete" @click="removeItem(papers, index)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                        <va-button @click="showPaperModal=true" type="button" color="success" gradient>Dodaj papier</va-button>
                        <PaperModal v-if="showPaperModal" :paper="papers[editedPaperIndex]" @close="closePaperModal()" @createPaper="addItem(papers, $event)" @editPaper="editPaper($event)"/>
                    </div>
                </div>
            </div>
            <div id="serviceCo">
                <h3>Usługi</h3>
                <va-divider />
                <div>
                    <div class="objects-card-wrapper">
                        <h6>Lista usług:</h6>
                        <va-list id="servicesList">
                            <va-list-item
                                v-for="(service, index) in services"
                                :key="index"
                            >
                                <va-list-item-section avatar>
                                    <va-avatar color="#6B5B95" icon="receipt_long" />
                                </va-list-item-section>

                                <va-list-item-section>
                                    <va-list-item-label>
                                        {{ service.serviceName.name }}
                                    </va-list-item-label>
                                </va-list-item-section>

                                <va-list-item-section icon>
                                    <va-popover message="Edytuj pozycję">
                                        <va-button flat icon="edit" @click="editServiceInModal(index)" />
                                    </va-popover>
                                    <va-popover message="Usuń pozycję">
                                        <va-button flat icon="delete" @click="removeItem(services, index)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                        <va-button @click="showServiceModal=true" type="button" color="success" gradient>Dodaj usługę</va-button>
                        <ServiceModal v-if="showServiceModal" :service="services[editedServiceIndex]" @close="closeServiceModal()" @createService="addItem(services, $event)" @editService="editService($event)"/>
                    </div>
                </div>
            </div>
            <va-form v-if="showCoverDetails" @submit.prevent="submitForm()" id="modalOrderItemCoverForm" tag="coverForm" ref="modalOrderItemCoverForm" @validation="isOrderItemCoverFormValidate = $event">
                <div id="someSpace"></div>
                <va-input
                    class="some-space mb-4"
                    v-model="coverFormat"
                    :rules="[(v) => v.length < 101 || `Pole format okładki przekroczyło limit znaków.`]"
                    label="Format okładki"
                    placeholder="Format okładki przedmiotu zamówienia"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="capacity"
                    :rules="[(v) => v >= 0 || `Objętość nie może być ujemna.`]"
                    label="Objętość"
                />
                <va-select
                    class="mb-4 some-space"
                    v-model="selectedBindingTypes"
                    :options="bindingTypes"
                    label="Typ szycia"
                    noOptionsText="Brak typów szycia do wybrania"
                /> 
            </va-form>
            <div id="colorCoCover" v-if="showCoverDetails">
                <h3>Kolorystyka okładki</h3>
                <va-divider />
                <div>
                    <div class="objects-card-wrapper">
                        <h6>Lista kolorów:</h6>
                        <va-list id="insideColorList">
                            <va-list-item
                                v-for="(color, index) in coverColors"
                                :key="index"
                            >
                                <va-list-item-section avatar>
                                    <va-avatar color="#6B5B95" icon="palette" />
                                </va-list-item-section>

                                <va-list-item-section>
                                    <va-list-item-label>
                                        {{ color.name }}
                                    </va-list-item-label>
                                </va-list-item-section>

                                <va-list-item-section icon>
                                    <va-popover message="Usuń kolor">
                                        <va-button flat icon="delete" @click="removeItem(coverColors, index)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                        <va-button @click="showCoverColorModal=true" type="button" color="success" gradient>Dodaj kolor</va-button>
                        <ColorModal v-if="showCoverColorModal" @close="showCoverColorModal=false;" @createColor="addItem(coverColors, $event)"/>
                    </div>
                </div>
            </div>
            <div id="paperCoCover" v-if="showCoverDetails">
                <h3>Papiery okładki</h3>
                <va-divider />
                <div>
                    <div class="objects-card-wrapper">
                        <h6>Lista papierów:</h6>
                        <va-list id="papersList">
                            <va-list-item
                                v-for="(paper, index) in coverPapers"
                                :key="index"
                            >
                                <va-list-item-section avatar>
                                    <va-avatar color="#6B5B95" icon="newspaper" />
                                </va-list-item-section>

                                <va-list-item-section>
                                    <va-list-item-label>
                                        {{ paper.name }}
                                    </va-list-item-label>
                                </va-list-item-section>

                                <va-list-item-section icon>
                                    <va-popover message="Edytuj papier">
                                        <va-button flat icon="edit" @click="editCoverPaperInModal(index)" />
                                    </va-popover>
                                    <va-popover message="Usuń papier">
                                        <va-button flat icon="delete" @click="removeItem(coverPapers, index)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                        <va-button @click="showCoverPaperModal=true" type="button" color="success" gradient>Dodaj papier</va-button>
                        <PaperModal v-if="showCoverPaperModal" :paper="coverPapers[editedCoverPaperIndex]" @close="closeCoverPaperModal()" @createPaper="addItem(coverPapers, $event)" @editPaper="editCoverPaper($event)"/>
                    </div>
                </div>
            </div>
            <div id="serviceCoCover" v-if="showCoverDetails">
                <h3>Usługi okładki</h3>
                <va-divider />
                <div>
                    <div class="objects-card-wrapper">
                        <h6>Lista usług:</h6>
                        <va-list id="servicesList">
                            <va-list-item
                                v-for="(service, index) in coverServices"
                                :key="index"
                            >
                                <va-list-item-section avatar>
                                    <va-avatar color="#6B5B95" icon="receipt_long" />
                                </va-list-item-section>

                                <va-list-item-section>
                                    <va-list-item-label>
                                        {{ service.serviceName.name }}
                                    </va-list-item-label>
                                </va-list-item-section>

                                <va-list-item-section icon>
                                    <va-popover message="Edytuj pozycję">
                                        <va-button flat icon="edit" @click="editCoverServiceInModal(index)" />
                                    </va-popover>
                                    <va-popover message="Usuń pozycję">
                                        <va-button flat icon="delete" @click="removeItem(coverServices, index)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                        <va-button @click="showCoverServiceModal=true" type="button" color="success" gradient>Dodaj usługę</va-button>
                        <ServiceModal v-if="showCoverServiceModal" :service="coverServices[editedCoverServiceIndex]" @close="closeCoverServiceModal()" @createService="addItem(coverServices, $event)" @editService="editCoverService($event)"/>
                    </div>
                </div>
            </div>
            <div id="buttonCo">
                <va-button @click="submitForm()" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </div>
        </div>
    </va-modal>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import ColorModal from '@/components/ReuseComponents/Modals/ColorModal.vue';
import PaperModal from '@/components/ReuseComponents/Modals/PaperModal.vue';
import ServiceModal from '@/components/ReuseComponents/Modals/ServiceModal.vue';

export default {
  name: 'OrderItemModal',
  components: { ColorModal, PaperModal, ServiceModal },
  props: {
    orderItem: {
        type: Object,
        required: false,
        default: null
    }
  },
  emits: ["createOrderItem", "editOrderItem", "close"],
	data() {
		return {
            orderItemName: "",
            insideFormat: "",
            circulation: 1,
            expectedCompletionDate: new Date(),
            completionDate: new Date(),
            selectedOrderItemType: "",
            selectedDeliveryType: "",
            selectedValuation: "",
            showValuationSelect: false,
            comments: "",

            colors: [],
            showColorModal: false,
            papers: [],
            showPaperModal: false,
            editedPaperIndex: null,
            services: [],
            showServiceModal: false,
            editedServiceIndex: null,


            coverFormat: "",
            capacity: 0,
            selectedBindingTypes: "",

            coverColors: [],
            showCoverColorModal: false,
            coverPapers: [],
            showCoverPaperModal: false,
            editedCoverPaperIndex: null,
            coverServices: [],
            showCoverServiceModal: false,
            editedCoverServiceIndex: null,

            rawBindingTypes: [],
            rawDeliveryTypes: [],
            rawOrderItemTypes: [],

            isOrderItemFormValidate: false,
            isOrderItemCoverFormValidate: false,
            newItemMode: true,
            buttonMessage: "",
            showOrderItemModal: true,
            selectedRadioOption: "Bez okładki",
            radioOptions: ['Bez okładki', 'Z okładką'],
		} 
	},
    computed: {
        showCoverDetails(){
            return this.selectedRadioOption === "Z okładką";
        },
        bindingTypes() {
            let resultArr = this.rawBindingTypes.map(function(item) {
                return item["name"];
            });

            return ["Bez szycia"].concat(resultArr);
        },
        orderItemTypes(){
            let resultArr = this.rawOrderItemTypes.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        deliveryTypes(){
            let resultArr = this.rawDeliveryTypes.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        valuations() {
            let resultArr = this.rawValuations.map(function(item) {
                return item["name"];
            });

            return resultArr;
        }
    },
    async mounted() {
        this.rawBindingTypes = await CallAPI.get("/BindingType/getBindingTypes")
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        this.rawDeliveryTypes = await CallAPI.get("/DeliveryType/getDeliveryTypes")
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        this.rawOrderItemTypes = await CallAPI.get("/OrderItemType/getOrderItemsTypes")
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        this.showColorModal = false;
        this.showPaperModal = false;
        this.showServiceModal = false;
        this.editedServiceIndex = null;
        this.editedPaperIndex = null;
        this.showCoverColorModal = false;
        this.showCoverPaperModal = false;
        this.showCoverServiceModal = false;
        this.editedCoverServiceIndex = null;
        this.editedCoverPaperIndex = null;
        this.isOrderItemFormValidate = false;
        this.isOrderItemCoverFormValidate = false;

        if(this.orderItem === null) {
            this.selectedRadioOption = "Bez okładki";
            this.showValuationSelect = false;
            this.orderItemName = "";
            this.comments = "";
            this.insideFormat = "";
            this.coverFormat = "";
            this.capacity = 0;
            this.circulation = 1;
            this.completionDate = null;
            this.expectedCompletionDate = null;
            this.selectedOrderItemType = "";
            this.selectedDeliveryType = "";
            this.selectedBindingTypes = "Bez szycia";
            this.selectedValuation = "";
            this.colors = [];
            this.papers = [];
            this.services = [];
            this.coverColors = [];
            this.coverPapers = [];
            this.coverServices = [];

            this.newItemMode = true;
            this.buttonMessage = "Dodaj przedmiot zamówienia";
        } else {
            if(this.orderItem.coverFormat === '' || this.orderItem.coverFormat === null || this.orderItem.coverFormat === undefined) { 
                this.selectedRadioOption = "Bez okładki";
            } else {
                this.selectedRadioOption = "Z okładką";
            }
            this.orderItemName = this.orderItem.name;
            this.comments = this.orderItem.comments;
            this.insideFormat = this.orderItem.insideFormat;
            this.coverFormat = this.orderItem.coverFormat;
            this.capacity = this.orderItem.capacity;
            this.circulation = this.orderItem.circulation;
            this.selectedOrderItemType = this.getNameById("orderItemType", this.orderItem.idOrderItemType);
            this.selectedDeliveryType = this.getNameById("deliveryType", this.orderItem.idDeliveryType);
            this.selectedBindingTypes = this.getNameById("bindingType", this.orderItem.idBindingType);
            this.colors = this.getItems("inside", this.orderItem.colors);
            this.papers = this.getItems("inside", this.orderItem.papers);
            this.services = this.getItems("inside", this.orderItem.services);
            this.coverColors = this.getItems("cover", this.orderItem.colors);
            this.coverPapers = this.getItems("cover", this.orderItem.papers);
            this.coverServices = this.getItems("cover", this.orderItem.services);

            if(this.orderItem.completionDate != null) {
                this.completionDate = new Date(Date.parse(this.orderItem.completionDate));
            } else {
                this.completionDate = null;
            }
            if(this.orderItem.expectedCompletionDate != null) {
                this.expectedCompletionDate = new Date(Date.parse(this.orderItem.expectedCompletionDate));
            } else {
                this.expectedCompletionDate = null;
            }

            /*
            if(this.orderItem.idOrderItem !== null && this.orderItem.idOrderItem !== undefined) {
                this.showValuationSelect = true;

                let valuationWithoutOrderItem = await CallAPI.get("/Valuation/getValuationsWithoutOrderItem")
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });

                let callPath = "/Valuation/getValuationsByOrderItem?id=" + this.orderItem.idOrderItem;
                let valuationByOrderItem = await CallAPI.get(callPath)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });

                this.rawValuations = valuationWithoutOrderItem.concat(valuationByOrderItem);
                this.selectedValuation = this.rawValuations.find(element => element.idValuation == this.orderItem.idSelectedValuation).name;
            }else{
                this.showValuationSelect = false;
            }
            */
            this.showValuationSelect = false;
            this.newItemMode = false;
            this.buttonMessage = "Edytuj przedmiot zamówienia";
        }
    },
	methods: {
        addItem(array, e) {
            array.push(e);
        },
        removeItem(array, index) {
            if (index > -1) {
                array.splice(index, 1);
            }
        },
        getNameById(what, id) {
            if(id != null && id != undefined){
                switch(what) {
                case "orderItemType":
                    return this.rawOrderItemTypes.find(element => element.idOrderItemType == id).name;
                case "deliveryType":
                    return this.rawDeliveryTypes.find(element => element.idDeliveryType == id).name;
                case "bindingType":
                    if(id  === null) {
                        return "Bez szycia";
                    } else {
                        return this.rawBindingTypes.find(element => element.idBindingType == id).name;
                    }
            }
            }
        },
        getIdByName(what, objName){
            if(objName !== '' && objName != null && objName != undefined){
                switch(what) {
                case "orderItemType":
                    return this.rawOrderItemTypes.find(element => element.name == objName).idOrderItemType;
                case "deliveryType":
                    return this.rawDeliveryTypes.find(element => element.name == objName).idDeliveryType;
                case "bindingType":
                    if(objName  === "Bez szycia") {
                        return null;
                    } else {
                        return this.rawBindingTypes.find(element => element.name == objName).idBindingType;
                    }
                case "valutaion":
                    return this.rawValuations.find(element => element.name == objName).idValuation;
                }
            }
        },
        getItems(what, array) {
            switch(what) {
                case "inside":
                    return array.filter(element => element.isForCover == false);
                case "cover":
                    return array.filter(element => element.isForCover == true);
            }
        },
        submitForm() {
            if(this.validateForm()) {
                if(this.capacity == 0 || this.capacity == 1) this.capacity == null;

                let allColorsCover = [];
                let allPapersCover = [];
                let allServicesCover = [];

                //create colors, papers, and services
                let allColors = this.colors.map(function(item) {
                    let result = {
                        name: item["name"],
                        isForCover: false,
                    }

                    return result;
                });

                let allPapers = this.papers.map(function(item) {
                    let result = {
                        name: item["name"],
                        kind: item["kind"],
                        sheetFormat: item["sheetFormat"],
                        fiberDirection: item["fiberDirection"],
                        opacity: item["opacity"],
                        pricePerKilogram: item["pricePerKilogram"],
                        quantity: item["quantity"],
                        isForCover: false,
                    }

                    return result;
                });

                let allServices = this.services.map(function(item) {
                    let result = {
                        idServiceName: item["idServiceName"],
                        serviceName: item["serviceName"],
                        name: item["name"],
                        price: item["price"],
                        isForCover: false,
                    }

                    return result;
                });

                if(this.showCoverDetails) {
                    allColorsCover = this.coverColors.map(function(item) {
                        let result = {
                            name: item["name"],
                            isForCover: true,
                        }

                        return result;
                    });

                    allPapersCover = this.coverPapers.map(function(item) {
                        let result = {
                            name: item["name"],
                            kind: item["kind"],
                            sheetFormat: item["sheetFormat"],
                            fiberDirection: item["fiberDirection"],
                            opacity: item["opacity"],
                            pricePerKilogram: item["pricePerKilogram"],
                            quantity: item["quantity"],
                            isForCover: true,
                        }

                        return result;
                    });

                    allServicesCover = this.coverServices.map(function(item) {
                        let result = {
                            idServiceName: item["idServiceName"],
                            serviceName: item["serviceName"],
                            name: item["name"],
                            price: item["price"],
                            isForCover: true,
                        }

                        return result;
                    });
                }

                //create order item
                let data = {
                    name: this.orderItemName,
                    comments: this.comments,
                    insideFormat: this.insideFormat,
                    coverFormat: this.coverFormat,
                    capacity: this.capacity,
                    circulation: this.circulation,
                    completionDate: this.completionDate,
                    expectedCompletionDate: this.expectedCompletionDate,
                    idOrderItemType: this.getIdByName("orderItemType", this.selectedOrderItemType),
                    idDeliveryType: this.getIdByName("deliveryType", this.selectedDeliveryType),
                    idBindingType: this.getIdByName("bindingType", this.selectedBindingTypes),
                    selectedValuation: this.getIdByName("valutaion", this.selectedValuation),
                    colors: allColors.concat(allColorsCover),
                    papers: allPapers.concat(allPapersCover),
                    services: allServices.concat(allServicesCover),
                };

                if(!this.newItemMode) {
                    this.$emit('editOrderItem', data);
                } else {
                    this.$emit('createOrderItem', data);
                }
                this.closeOrderItemModal();
            }
		},
        validateForm() {
            if(this.selectedOrderItemType === "") {
                this.$vaToast.init({ message: 'Wybierz typ przedmiotu zamówienia', color: 'danger', duration: 2000 })
                return false;
            }

            if(this.selectedDeliveryType === "") {
                this.$vaToast.init({ message: 'Wybierz typ dostawy.', color: 'danger', duration: 2000 })
                return false;
            }

            if(!this.showCoverDetails) {
                this.$refs.modalOrderItemForm.validate();
                return this.isOrderItemFormValidate;
            }else{
                this.$refs.modalOrderItemForm.validate();
                this.$refs.modalOrderItemCoverForm.validate();
                return this.isOrderItemFormValidate && this.isOrderItemCoverFormValidate;
            }
        },
        closeOrderItemModal() {
            this.$emit('close');
        },


        editPaperInModal(index) {
            this.editedPaperIndex = index;
            this.showPaperModal = true;
        },
        closePaperModal() {
            this.showPaperModal = false;
            this.editedPaperIndex = null;
        },
        editPaper(e) {
            this.papers[this.editedPaperIndex] = e;

            this.showPaperModal = false;
        },
        editServiceInModal(index){
            this.editedServiceIndex = index;
            this.showServiceModal = true;
        },
        closeServiceModal() {
            this.showServiceModal = false;
            this.editedServiceIndex = null;
        },
        editService(e) {
            this.services[this.editedServiceIndex] = e;

            this.showServiceModal = false;
        },

        editCoverPaperInModal(index) {
            this.editedCoverPaperIndex = index;
            this.showCoverPaperModal = true;
        },
        closeCoverPaperModal() {
            this.showCoverPaperModal = false;
            this.editedCoverPaperIndex = null;
        },
        editCoverPaper(e) {
            this.coverPapers[this.editedCoverPaperIndex] = e;

            this.showCoverPaperModal = false;
        },
        editCoverServiceInModal(index){
            this.editedCoverServiceIndex = index;
            this.showCoverServiceModal = true;
        },
        closeCoverServiceModal() {
            this.showCoverServiceModal = false;
            this.editedCoverServiceIndex = null;
        },
        editCoverService(e) {
            this.coverServices[this.editedCoverServiceIndex] = e

            this.showCoverServiceModal = false;
        }
	},
}
</script>

<style scoped>
#background-modal {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 1fr 50px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". . main . ."
    ". sidebarA sidebarB sidebarC ."
    ". . mainCover . ."
    ". sidebarACover sidebarBCover sidebarCCover ."
    ". . footer . .";
    grid-gap: 30px;
}

#modalOrderItemForm {
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    grid-area: main;
}

#colorCo{
    grid-area: sidebarA;
    text-align: center;
}

#paperCo{
    grid-area: sidebarB;
    text-align: center;
}

#serviceCo{
    grid-area: sidebarC;
    text-align: center;
}

#modalOrderItemCoverForm {
    margin-top: 80px;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    grid-area: mainCover;
}

#colorCoCover{
    grid-area: sidebarACover;
    text-align: center;
}

#paperCoCover{
    grid-area: sidebarBCover;
    text-align: center;
}

#serviceCoCover{
    grid-area: sidebarCCover;
    text-align: center;
}

#buttonCo{
    grid-area: footer;
    text-align: center;
}

#isCover{
    text-align: center;
    margin-bottom: 15px;
}
</style>

