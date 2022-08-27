<template>
    <div id="background">
        <div id="headerCo">
            <h1>Dodaj nową wycenę</h1>
            <va-divider />
        </div>
        <div v-if="showOrderPicker" id="orderItemPickerCo">
            <div v-if="selectedOrder == '' || selectedOrderItem == ''">
                <h5>Wybierz zamówienie i przedmiot zamówienia, do którego chcesz stworzyć wycenę</h5>
                <div id="orderItemPicker">
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
                    <va-button @click="withoutOrdrItem()" color="info" gradient class="my-3">Wycena bez przedmiotu zamówienia</va-button>
                </div>
            </div>
        </div>
        <div v-if="showValuationPicker" id="valuationPickerCo">
            <div>
                <h5>Wybierz szablon wyceny</h5>
                <div id="valuationPicker">
                    <va-button @click="loadCopiedData()" color="info" gradient class="my-3">Załaduj dane ze schowka</va-button>
                    <va-button @click="blankForm()" color="info" gradient class="my-3">Czysty szablon</va-button>
                </div>
            </div>
        </div>
        <div v-if="showValuationForm" id="preDetailsCo">
            <va-form @submit.prevent="" id="preDetailsform" tag="preDetailsform" ref="preDetailsform" @validation="isPreDetailsFormValidate = $event">
                <div id="preDetails">
                    <va-input
                        class="inputWidth"
                        v-model="authorName"
                        label="Autor"
                        readonly
                    />
                    <va-date-input
                        class="inputWidth"
                        v-model="offerValidity"
                        label="Ważność oferty"
                    />
                    <va-input
                        class="longInputWidth"
                        v-model="valuationName"
                        label="Nazwa wyceny"
                        :rules="[(v) => v .length > 0 || `Pole nie może byc puste.`, (v) => v .length < 101 || `Pole przekroczyło maksymalną ilość znaków.`]"
                        placeholder="Nazwa wyceny"
                    />
                    <va-input
                        class="longInputWidth"
                        v-model="valuationRecipient"
                        label="Odbiorca wyceny"
                        :rules="[(v) => v .length > 0 || `Pole nie może byc puste.`, (v) => v .length < 101 || `Pole przekroczyło maksymalną ilość znaków.`]"
                        placeholder="Odbiorca wyceny"
                    />
                </div>
            </va-form>
        </div>
        <div v-if="showValuationForm" id="detailsInsideCo">
            <div id="detailsMainCo">
                <div>
                    <h5>Szczegóły przedmiotu zamówienia</h5>
                    <va-form @submit.prevent="" id="detailsInsideform" tag="detailsInsideform" ref="detailsInsideform" @validation="isDetailsInsideFormValidate = $event">
                        <div id="detailsInside">
                            <div class="detailsCo">
                                <div id="checkboxCo">
                                    <p>Pokaż szczegóły okładki: </p>
                                    <input v-model="showCoverForm" type="checkbox">
                                </div>
                                <va-input
                                    class="inputWidth"
                                    v-model="insideFormat"
                                    label="Format użytku"
                                    :rules="[(v) => v .length > 0 || `Pole nie może byc puste.`, (v) => v .length < 101 || `Pole przekroczyło maksymalną ilość znaków.`]"
                                    placeholder="Format użytku"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="insideFormatSheet"
                                    label="Format arkusza"
                                    :rules="[(v) => v .length > 0 || `Pole nie może byc puste.`, (v) => v .length < 101 || `Pole przekroczyło maksymalną ilość znaków.`]"
                                    placeholder="Format arkusza"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="insideCirculation"
                                    label="Nakład"
                                    :rules="[(v) => v > 0 || `Wprowadź poprawny nakład.`, (v) => v != '' || `Wprowadź poprawny nakład.`]"
                                    placeholder="Nakład"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="insideCapacity"
                                    label="Objętość (opcjonalnie)"
                                    :rules="[(v) => v >= 0 || `Wprowadź poprawną objętość.`, (v) => v != '' || `Wprowadź poprawną objętość.`]"
                                    placeholder="Objętość"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="insideSheetNumber"
                                    label="Ilość arkuszy"
                                    :rules="[(v) => v > 0 || `Wprowadź poprawną ilość akruszy`, (v) => v != '' || `Wprowadź poprawną ilość akruszy`]"
                                    placeholder="Ilość arkuszy"
                                />
                                <va-select
                                    v-if="showCoverForm"
                                    class="inputWidth"
                                    v-model="selectedBinding"
                                    :options="bindings"
                                    label="Typ szycia"
                                    noOptionsText="Brak typów szycia do wybrania"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="isnideOther"
                                    type="textarea"
                                    label="Inne (opcjonalnie)"
                                    :rules="[(v) => v .length < 201 || `Pole przekroczyło maksymalną ilość znaków.`]"
                                />
                            </div>
                        </div>
                    </va-form>
                </div>
                <div>
                    <h5>Kolorystyka</h5>
                    <div id="insideColorsCo">
                        <va-input
                            class="inputWidth"
                            v-model="insidePlateNumber"
                            label="Liczba blach"
                            :rules="[(v) => v >= 0 || `Wprowadź poprawną ilość blach drukarskich`, (v) => v != '' || `Wprowadź poprawną ilość blach drukarskich`]"
                            placeholder="Liczba blach drukarskich"
                        />
                        <va-list id="insideColorList">
                            <va-list-label>
                                Lista kolorów
                            </va-list-label>

                            <va-list-item
                                v-for="insideColor in insideColors"
                                :key="insideColor.IdColor"
                            >

                                <va-list-item-section avatar>
                                    <va-avatar color="#6B5B95" icon="palette" />
                                </va-list-item-section>

                                <va-list-item-section>
                                    <va-list-item-label>
                                        {{ insideColor.name }}
                                    </va-list-item-label>
                                </va-list-item-section>

                                <va-list-item-section icon>
                                    <va-popover message="Usuń kolor">
                                        <va-button flat icon="delete" @click="deleteInsideColor(insideColor)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                        <va-button class="modalButton" @click="showInsideColorModal=true" type="button" color="success" gradient>Dodaj kolor</va-button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showCoverForm && showValuationForm" id="detailsCoverCo">
            <div id="detailsMainCo">
                <div>
                    <h5>Szczegóły okładki przedmiotu zamówienia</h5>
                    <va-form @submit.prevent="" id="detailsCoverform" tag="detailsCoverform" ref="detailsCoverform" @validation="isDetailsCoverFormValidate = $event">
                        <div id="detailsCover">
                            <div class="detailsCo">
                                <va-input
                                    class="inputWidth"
                                    v-model="coverFormat"
                                    label="Format użytku"
                                    :rules="[(v) => v .length > 0 || `Pole nie może byc puste.`, (v) => v .length < 101 || `Pole przekroczyło maksymalną ilość znaków.`]"
                                    placeholder="Format użytku"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="coverFormatSheet"
                                    label="Format arkusza"
                                    :rules="[(v) => v .length > 0 || `Pole nie może byc puste.`, (v) => v .length < 101 || `Pole przekroczyło maksymalną ilość znaków.`]"
                                    placeholder="Format arkusza"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="coverCirculation"
                                    label="Nakład"
                                    :rules="[(v) => v > 0 || `Wprowadź poprawny nakład.`, (v) => v != '' || `Wprowadź poprawny nakład.`]"
                                    placeholder="Nakład"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="coverSheetNumber"
                                    label="Ilość arkuszy"
                                    :rules="[(v) => v > 0 || `Wprowadź poprawną ilość akruszy`, (v) => v != '' || `Wprowadź poprawną ilość akruszy`]"
                                    placeholder="Ilość arkuszy"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="coverOther"
                                    type="textarea"
                                    label="Inne (opcjonalnie)"
                                    :rules="[(v) => v .length < 201 || `Pole przekroczyło maksymalną ilość znaków.`]"
                                />
                            </div>
                        </div>
                    </va-form>
                </div>
                <div>
                    <h5>Kolorystyka okładki</h5>
                    <div id="coverColorsCo">
                        <va-input
                            class="inputWidth"
                            v-model="coverPlateNumber"
                            label="Liczba blach"
                            :rules="[(v) => v >= 0 || `Wprowadź poprawną ilość blach drukarskich`, (v) => v != '' || `Wprowadź poprawną ilość blach drukarskich`]"
                            placeholder="Liczba blach drukarskich"
                        />
                        <va-list id="coverColorList">
                            <va-list-label>
                                Lista kolorów
                            </va-list-label>

                            <va-list-item
                                v-for="coverColor in coverColors"
                                :key="coverColor.IdColor"
                            >
                                <va-list-item-section avatar>
                                    <va-avatar color="#6B5B95" icon="palette" />
                                </va-list-item-section>

                                <va-list-item-section>
                                    <va-list-item-label>
                                        {{ coverColor.name }}
                                    </va-list-item-label>
                                </va-list-item-section>

                                <va-list-item-section icon>
                                    <va-popover message="Usuń kolor okładki">
                                        <va-button flat icon="delete" @click="deleteCoverColor(coverColor)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                        <va-button class="modalButton" @click="showCoverColorModal=true" type="button" color="success" gradient>Dodaj kolor</va-button>
                    </div>
                </div>
            </div>
        </div>
        <ColorModal v-if="showInsideColorModal" :withSelect="false" @close="closeInsideColorModal()" @createColor="addInsideColor($event)"/>
        <ColorModal v-if="showCoverColorModal" :withSelect="false" @close="closeCoverColorModal()" @createColor="addCoverColor($event)"/>
        <div v-if="showValuationForm" id="papersCo">
            <div>
                <h5>Lista papierów</h5>
                <div id="papers">
                    <va-list id="papersList">
                        <va-list-item
                            v-for="paper in papers"
                            :key="paper.IdPaper"
                        >
                            <va-list-item-section avatar>
                                <va-avatar color="#6B5B95" icon="newspaper" />
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ paper.name }}
                                </va-list-item-label>

                                <va-list-item-label>
                                    {{ paper.kind }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ paper.sheetFormat }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ paper.quantity }} szt.
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section icon>
                                <va-popover message="Edytuj papier">
                                    <va-button flat icon="edit" @click="editPaperInModal(paper)" />
                                </va-popover>
                                <va-popover message="Usuń papier">
                                    <va-button flat icon="delete" @click="deletePaper(paper)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button class="modalButton" @click="showPaperModal=true" type="button" color="success" gradient>Dodaj papier</va-button>
                </div>
            </div>
        </div>
        <PaperModal v-if="showPaperModal" :paper="editedPaper" @close="closePaperModal()" @createPaper="addPaper($event)" @editPaper="editPaper($event)"/>
        <div v-if="showValuationForm" id="servicesCo">
            <div>
                <h5>Usługi i ceny</h5>
                <div id="services">
                    <va-list id="servicesList">
                        <va-list-item
                            v-for="service in services"
                            :key="service.IdService"
                        >
                            <va-list-item-section avatar>
                                <va-avatar color="#6B5B95" icon="receipt_long" />
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ service.serviceName }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ service.price }} zł
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section icon>
                                <va-popover message="Edytuj pozycję">
                                    <va-button flat icon="edit" @click="editServiceInModal(service)" />
                                </va-popover>
                                <va-popover message="Usuń pozycję">
                                    <va-button flat icon="delete" @click="deleteService(service)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button class="modalButton" @click="showServiceModal=true" type="button" color="success" gradient>Dodaj usługę</va-button>
                </div>
            </div>
        </div>
        <ServiceModal v-if="showServiceModal" :service="editedService" @close="closeServiceModal()" @createService="addService($event)" @editService="editService($event)"/>
        <div v-if="showValuationForm" id="summaryCo">
            <div>
                <h5>Podsumowanie cenowe</h5>
                <div id="summary">
                    <va-input
                        class="inputWidth"
                        v-model="finalPrice"
                        label="Cena zbiorcza"
                    />
                    <va-input
                        class="inputWidth"
                        v-model="mainCirculation"
                        label="Nakład"
                    />
                    <va-input
                        class="inputWidth"
                        v-model="unitPrice"
                        label="Cena jednostkowa"
                        readonly
                    />
                </div>
            </div>
        </div>
        <div v-if="showValuationForm" id="addOrderButtonCo">
            <va-button @click="calcPrices()" color="info" gradient class="my-3">Wylicz cenę</va-button>
            <va-button @click="submitForm()" color="info" gradient class="my-3"> {{ saveButtonMessage }} </va-button>
        </div>
    </div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import { useUserStore } from '@/stores/UserStore';
import { useValuationStore } from '@/stores/ValuationStore';
import ColorModal from '@/components/ReuseComponents/Modals/ColorModal.vue';
import PaperModal from '@/components/ReuseComponents/Modals/PaperModal.vue';
import ServiceModal from '@/components/ReuseComponents/Modals/ServiceModal.vue';

export default {
  name: 'ValuationForm',
  components: { ColorModal, PaperModal, ServiceModal },
  data() {
		return {
            showOrderPicker: true,
            showValuationPicker: false,
            showValuationForm: false,
            showCoverForm: false,
            selectedOrder: "",
            rawOrders: [],
            selectedOrderItem: "",
            rawOrderItems: [],
            selectedOrderItemData: null,

            isPreDetailsFormValidate: false,
            authorName: "",
            valuationName: "",
            valuationRecipient: "",
            offerValidity: this.addDays(new Date(), 7),

            isDetailsInsideFormValidate: false,
            insideFormat: "",
            insideFormatSheet: "",
            insideCirculation: "",
            insideCapacity: "",
            insideSheetNumber: "",
            isnideOther: "",
            insidePlateNumber: "",
            selectedBinding: "",
            rawBindingType: [],

            isDetailsCoverFormValidate: false,
            coverFormat: "",
            coverFormatSheet: "",
            coverCirculation: "",
            coverSheetNumber: "",
            coverOther: "",
            coverPlateNumber: "",

            finalPrice: "",
            mainCirculation: "",
            unitPrice: "",

            showInsideColorModal: false,
            showCoverColorModal: false,
            showPaperModal: false,
            showServiceModal: false,
            editedPaper: null,
            editedService: null,
            insideColors: [],
            coverColors: [],
            papers: [],
            services: [],
            serviceCounter: 0,
            paperCounter: 0,
            insideColorCounter: 0,
            coverColorCounter: 0,

            saveButtonMessage: "",
		}
	},
    watch: {
        async selectedOrder() {
            if(this.selectedOrder != '') {
                let callPath = "/OrderItem/getOrderItemsByOrder?id=" + this.rawOrders.find(element => element.name == this.selectedOrder).idOrder;
                this.rawOrderItems = await CallAPI.get(callPath)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
        },
        async selectedOrderItem() {
            if(this.selectedOrderItem != '') {
                let callPath = "/OrderItem/getOrderItem?id=" + this.rawOrderItems.find(element => element.name == this.selectedOrderItem).idOrderItem;
                this.selectedOrderItemData = await CallAPI.get(callPath)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
                this.saveButtonMessage = "Zapisz wycenę";
                this.showOrderPicker = false;
                this.showValuationPicker = true;

                this.loadOrderItemData();
            }
        },
    },
    async mounted() {
        const userStore = useUserStore();
        this.authorName = userStore.userName;

        let callPath = "/Order/getOrders";
        this.rawOrders = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        callPath = "/BindingType/getBindingTypes";
        this.rawBindingType = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });
    },
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
        bindings() {
            let resultArr = this.rawBindingType.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
    },
    methods: {
        withoutOrdrItem() {
            this.saveButtonMessage = "Zapisz wycenę bez przedmiotu zamówienia";
            this.showOrderPicker = false;
            this.showValuationPicker = true;
        },
        blankForm() {
            this.showValuationPicker = false;
            this.showValuationForm = true;
        },
        addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        },
        loadOrderItemData(){
            this.insideFormat = this.selectedOrderItemData.insideFormat;
            this.insideCirculation = this.selectedOrderItemData.circulation;
            this.insideCapacity = this.selectedOrderItemData.capacity;
            this.insidePlateNumber = this.selectedOrderItemData.insidePlateNumber;

            if(this.selectedOrderItemData.coverFormat !== '') {
                this.selectedBinding = this.selectedOrderItemData.bindingType.name;
                this.coverPlateNumber = this.selectedOrderItemData.coverPlateNumber;
                this.coverFormat = this.selectedOrderItemData.coverFormat;
                this.coverCirculation = this.selectedOrderItemData.circulation;
                this.showCoverForm = true;
            }

            for(let i=0; i < this.selectedOrderItemData.colors.length; i++) {
                let newColor = {
                    name: this.selectedOrderItemData.colors[i].name,
                };

                this.addInsideColor({ newColor });
            }

            for(let i=0; i < this.selectedOrderItemData.papers.length; i++) {
                let newPaper = {
                    name: this.selectedOrderItemData.papers[i].name,
                    kind: this.selectedOrderItemData.papers[i].kind,
                    sheetFormat: this.selectedOrderItemData.papers[i].sheetFormat,
                    fiberDirection: this.selectedOrderItemData.papers[i].fiberDirection,
                    opacity: this.selectedOrderItemData.papers[i].opacity,
                    pricePerKilogram: this.selectedOrderItemData.papers[i].pricePerKilogram,
                    quantity: this.selectedOrderItemData.papers[i].quantity
                };

                this.addPaper({ newPaper });
            }

            for(let i=0; i < this.selectedOrderItemData.services.length; i++) {
                let newService = {
                    serviceName: this.selectedOrderItemData.services[i].serviceName.name,
                    name: this.selectedOrderItemData.services[i].name,
                    price: this.selectedOrderItemData.services[i].price,
                };

                this.addService({ newService });
            }
        },
        loadCopiedData() {
            const userStore = useValuationStore();
            let savedValuation = userStore.wholeValuation;
            
            this.insidePlateNumber = savedValuation.insidePlateNumber;
            this.coverPlateNumber = savedValuation.coverPlateNumber;
            this.showOrderPicker = savedValuation.showOrderPicker;
            this.showValuationPicker = savedValuation.showValuationPicker;
            this.showValuationForm = savedValuation.showValuationForm;
            this.showCoverForm = savedValuation.showCoverForm;
            this.showCoverColors = savedValuation.showCoverColors;
            this.selectedOrder = savedValuation.selectedOrder;
            this.selectedOrderItem = savedValuation.selectedOrderItem;
            this.valuationName = savedValuation.valuationName;
            this.valuationRecipient = savedValuation.valuationRecipient;
            this.offerValidity = savedValuation.offerValidity;
            this.insideFormat = savedValuation.insideFormat;
            this.insideFormatSheet = savedValuation.insideFormatSheet;
            this.insideCirculation = savedValuation.insideCirculation;
            this.insideCapacity = savedValuation.insideCapacity;
            this.insideSheetNumber = savedValuation.insideSheetNumber;
            this.isnideOther = savedValuation.isnideOther;
            this.coverFormat = savedValuation.coverFormat;
            this.coverFormatSheet = savedValuation.coverFormatSheet;
            this.coverCirculation = savedValuation.coverCirculation;
            this.coverSheetNumber = savedValuation.coverSheetNumber;
            this.coverOther = savedValuation.coverOther;
            this.mainCirculation = savedValuation.mainCirculation;
            this.saveButtonMessage = savedValuation.saveButtonMessage;
            this.insideColors = savedValuation.insideColors;
            this.coverColors = savedValuation.coverColors;
            this.papers = savedValuation.papers;
            this.services = savedValuation.services;
            this.serviceCounter = savedValuation.serviceCounter;
            this.paperCounter = savedValuation.paperCounter;
            this.insideColorCounter = savedValuation.insideColorCounter;
            this.coverColorCounter = savedValuation.coverColorCounter;
            this.selectedBinding = savedValuation.selectedBinding;
        },



        calcPrices() {
            this.finalPrice = 20458; // remove and add some calc flow
            if(this.mainCirculation != '' && this.mainCirculation != null && this.mainCirculation > 0 && this.mainCirculation != undefined) {
                this.unitPrice = this.finalPrice / this.mainCirculation;
            }
        },
        submitForm() {
            
        },



        closeServiceModal() {
            this.showServiceModal = false;
            this.editedService = null;
        },
        addService(e) {
            let newService = {
                IdForServiceTable: this.serviceCounter,
                idServiceName: e.newService.idServiceName,
                serviceName: e.newService.serviceName,
                name: e.newService.name,
                price: e.newService.price,
            };
            this.services.push(newService);
            this.serviceCounter++;
        },
        editService(e) {
            for(const obj of this.services){
                if (obj.IdForServiceTable === e.newService.IdForServiceTable) {
                    obj.serviceName = e.newService.serviceName;
                    obj.price = e.newService.price;
                    obj.name = e.newService.name;
                    break;
                }
            }

            this.showServiceModal = false;
        },
        editServiceInModal(service) {
            this.editedService = service;
            this.showServiceModal = true;
        },
        deleteService(service) {
            this.services = this.services.filter(item => item.IdForServiceTable !== service.IdForServiceTable);
        },
        closePaperModal() {
            this.showPaperModal = false;
            this.editedPaper = null;
        },
        addPaper(e) {
            let newPaper = {
                IdForPaperTable: this.paperCounter,
                idPaper: e.newPaper.IdPaper,
                name: e.newPaper.name,
                kind: e.newPaper.kind,
                sheetFormat: e.newPaper.sheetFormat,
                fiberDirection: e.newPaper.fiberDirection,
                opacity: e.newPaper.opacity,
                pricePerKilogram: e.newPaper.pricePerKilogram,
                quantity: e.newPaper.quantity
            };
            this.papers.push(newPaper);
            this.paperCounter++;
        },
        editPaper(e){
            for(const obj of this.papers){
                if (obj.IdForPaperTable === e.newPaper.IdForPaperTable) {
                    obj.name = e.newPaper.name;
                    obj.kind = e.newPaper.kind;
                    obj.sheetFormat = e.newPaper.sheetFormat;
                    obj.fiberDirection = e.newPaper.fiberDirection;
                    obj.opacity = e.newPaper.opacity;
                    obj.pricePerKilogram = e.newPaper.pricePerKilogram;
                    obj.quantity = e.newPaper.quantity;
                    break;
                }
            }

            this.showPaperModal = false;
        },
        editPaperInModal(paper) {
            this.editedPaper = paper;
            this.showPaperModal = true;
        },
        deletePaper(paper) {
            this.papers = this.papers.filter(item => item.IdForPaperTable !== paper.IdForPaperTable);
        },
        closeInsideColorModal() {
            this.showInsideColorModal = false;
        },
        addInsideColor(e) {
            e.newColor.IdForColorTable = this.insideColorCounter;
            this.insideColors.push(e.newColor);
            this.insideColorCounter++;
            this.showColorModal = false;
        },
        deleteInsideColor(color) {
            this.insideColors = this.insideColors.filter(item => item.IdForColorTable !== color.IdForColorTable);
        },
        closeCoverColorModal() {
            this.showCoverColorModal = false;
        },
        addCoverColor(e) {
            e.newColor.IdForColorTable = this.coverColorCounter;
            this.coverColors.push(e.newColor);
            this.coverColorCounter++;
            this.showColorModal = false;
        },
        deleteCoverColor(color) {
            this.coverColors = this.coverColors.filter(item => item.IdForColorTable !== color.IdForColorTable);
        },
    },
}
</script>

<style scoped>
#backgroundd {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 1fr 50px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". header header header ."
    ". preDetailsCo preDetailsCo preDetailsCo ."
    ". detailsA detailsA detailsA ."
    ". detailsB detailsB detailsB ."
    ". papers papers papers ."
    ". service service service ."
    ". summary summary summary ."
    ". footer footer footer .";
    grid-gap: 30px;
}

#headerCo {
    grid-area: header;
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#orderItemPickerCo,
#valuationPickerCo {
    grid-area: detailsA;
    padding-top: 20px;
    margin-top: 30px;
    background: white;
	border-radius: 25px;
}

#orderItemPicker,
#valuationPicker {
    margin: 20px;
    padding-bottom: 20px;
    display: flex;
    justify-content: space-evenly;
}

#selectValuationCo {
    grid-area: detailsA;
    padding-top: 20px;
    margin-top: 30px;
    background: white;
	border-radius: 25px;
}

#preDetailsCo {
    margin-top: 20px;
    grid-area: preDetails;
}

#preDetails {
    display: flex;
    justify-content: space-around;
    padding: 20px;
    margin-top: 10px;
    background: white;
	border-radius: 25px;
}

#detailsInsideCo {
    margin-top: 20px;
    grid-area: detailsA;
}

#detailsMainCo {
    display: flex;
    justify-content: center;
    gap: 20px;
}

#detailsInside,
#detailsCover {
    display: flex;
    flex-direction:  column;
    justify-content: space-evenly;
}

.detailsCo {
    padding: 20px;
    padding-left: 40px;
    padding-right: 40px;
    margin-top: 10px;
    background: white;
	border-radius: 25px;
}

#detailsCoverCo {
    margin-top: 20px;
    grid-area: detailsB;
}

#papersCo {
    padding-top: 20px;
    grid-area: papers;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

#insideColorsCo,
#coverColorsCo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 400px;
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 10px;
    background: white;
	border-radius: 25px;
}

#papers {
    min-width: 800px;
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 10px;
    background: white;
	border-radius: 25px;
}

#checkboxCo {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.modalButton { 
    margin-bottom: 20px;
}





#servicesCo {
    grid-area: service;
    padding-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

#services {
    min-width: 800px;
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 10px;
    background: white;
	border-radius: 25px;
}

#summaryCo {
    grid-area: summary;
    padding-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

#summary {
    min-width: 800px;
    padding: 20px;
    padding-left: 40px;
    padding-right: 40px;
    margin-top: 10px;
    background: white;
	border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

#addOrderButtonCo {
    grid-area: footer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 100px;
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

#form {
    display: flex;
    flex-direction: column;
}

.inputWidth {
    margin: 10px;
    width: 300px;
    align-self: center;
}

.longInputWidth {
    margin: 10px;
    width: 500px;
    align-self: center;
}

#editButton{
    width: 150px;
    align-self: center;
}
</style>
