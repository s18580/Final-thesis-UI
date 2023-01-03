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
                        @update:model-value="getOrderItems($event)"
                    />
                    <va-select
                        v-if="selectedOrder != ''"
                        class="inputWidth"
                        v-model="selectedOrderItem"
                        :options="orderItems"
                        label="Przedmiot zamówienia"
                        noOptionsText="Brak przedmiotów do wybrania"
                        @update:model-value="getOrderItemDetails($event)"
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
                                    label="Format użytku (w mm)"
                                    :rules="[(v) => v.length > 0 || `Pole nie może byc puste.`, (v) => v.length < 101 || `Pole przekroczyło maksymalną ilość znaków.`]"
                                    placeholder="Format użytku (w mm)"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="insideFormatSheet"
                                    label="Format arkusza (w mm)"
                                    :rules="[(v) => v.length > 0 || `Pole nie może byc puste.`, (v) => v.length < 101 || `Pole przekroczyło maksymalną ilość znaków.`]"
                                    placeholder="Format arkusza (w mm)"
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
                                    label="Objętość"
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
                                v-for="(insideColor, index) in insideColors"
                                :key="index"
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
                                        <va-button flat icon="delete" @click="removeItem(insideColors, index)" />
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
                                    label="Format użytku (w mm)"
                                    :rules="[(v) => v .length > 0 || `Pole nie może byc puste.`, (v) => v .length < 101 || `Pole przekroczyło maksymalną ilość znaków.`]"
                                    placeholder="Format użytku (w mm)"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="coverFormatSheet"
                                    label="Format arkusza (w mm)"
                                    :rules="[(v) => v .length > 0 || `Pole nie może byc puste.`, (v) => v .length < 101 || `Pole przekroczyło maksymalną ilość znaków.`]"
                                    placeholder="Format arkusza (w mm)"
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
                                <va-select
                                    class="inputWidth"
                                    v-model="selectedBinding"
                                    :options="bindings"
                                    label="Typ szycia"
                                    noOptionsText="Brak typów szycia do wybrania"
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
                                v-for="(coverColor, index) in coverColors"
                                :key="index"
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
                                        <va-button flat icon="delete" @click="removeItem(coverColors, index)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                        <va-button class="modalButton" @click="showCoverColorModal=true" type="button" color="success" gradient>Dodaj kolor</va-button>
                    </div>
                </div>
            </div>
        </div>
        <ColorModal v-if="showInsideColorModal" :withSelect="false" @close="showInsideColorModal=false" @createColor="addItem(insideColors, $event)"/>
        <ColorModal v-if="showCoverColorModal" :withSelect="false" @close="showCoverColorModal=false" @createColor="addItem(coverColors, $event)"/>
        <div v-if="showValuationForm" id="papersCo">
            <div>
                <h5>Lista papierów</h5>
                <div id="papers">
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
                                    <va-button flat icon="edit" @click="editPaperInModal(index)" />
                                </va-popover>
                                <va-popover message="Usuń papier">
                                    <va-button flat icon="delete" @click="removeItem(papers, index)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button class="modalButton" @click="showPaperModal=true" type="button" color="success" gradient>Dodaj papier</va-button>
                </div>
            </div>
            <div v-if="showCoverForm">
                <h5>Lista papierów okładki</h5>
                <div id="papers">
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
                                    <va-button flat icon="edit" @click="editCoverPaperInModal(index)" />
                                </va-popover>
                                <va-popover message="Usuń papier">
                                    <va-button flat icon="delete" @click="removeItem(coverPapers, index)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button class="modalButton" @click="showCoverPaperModal=true" type="button" color="success" gradient>Dodaj papier</va-button>
                </div>
            </div>
        </div>
        <PaperModal v-if="showPaperModal" :paper="papers[editedPaperIndex]" @close="closePaperModal()" @createPaper="addItem(papers, $event)" @editPaper="editPaper($event)"/>
        <PaperModal v-if="showCoverPaperModal" :paper="coverPapers[editedCoverPaperIndex]" @close="closeCoverPaperModal()" @createPaper="addItem(coverPapers, $event)" @editPaper="editCoverPaper($event)"/>
        <div v-if="showValuationForm" id="servicesCo">
            <div>
                <h5>Usługi i ceny</h5>
                <div id="services">
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

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ service.price }} zł
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
                    <va-button class="modalButton" @click="showServiceModal=true" type="button" color="success" gradient>Dodaj usługę</va-button>
                </div>
            </div>
            <div v-if="showCoverForm">
                <h5>Usługi i ceny okładki</h5>
                <div id="services">
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

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ service.price }} zł
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
                    <va-button class="modalButton" @click="showCoverServiceModal=true" type="button" color="success" gradient>Dodaj usługę</va-button>
                </div>
            </div>
        </div>
        <ServiceModal v-if="showServiceModal" :service="services[editedServiceIndex]" @close="closeServiceModal()" @createService="addItem(services, $event)" @editService="editService($event)"/>
        <ServiceModal v-if="showCoverServiceModal" :service="coverServices[editedCoverServiceIndex]" @close="closeCoverServiceModal()" @createService="addItem(coverServices, $event)" @editService="editCoverService($event)"/>
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
            showCoverPaperModal: false,
            showServiceModal: false,
            showCoverServiceModal: false,
            editedPaperIndex: null,
            editedCoverPaperIndex: null,
            editedServiceIndex: null,
            editedCoverServiceIndex: null,
            insideColors: [],
            coverColors: [],
            papers: [],
            coverPapers: [],
            services: [],
            coverServices: [],

            printCalcConstant: 0.015,
            platePrice: 0,
            saveButtonMessage: "",
		}
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

        callPath = "/PriceList/getPriceList?id=1";
        this.platePrice = await CallAPI.get(callPath)
        .then(res => {
            return res.data.price;
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
        addItem(array, e) {
            array.push(e);
        },
        removeItem(array, index) {
            if (index > -1) {
                array.splice(index, 1);
            }
        },
        closePaperModal() {
            this.showPaperModal = false;
            this.editedPaperIndex = null;
        },
        closeCoverPaperModal() {
            this.showCoverPaperModal = false;
            this.editedCoverPaperIndex = null;
        },
        closeServiceModal() {
            this.showServiceModal = false;
            this.editedServiceIndex = null;
        },
        closeCoverServiceModal() {
            this.showCoverServiceModal = false;
            this.editedCoverServiceIndex = null;
        },
        editPaperInModal(index) {
            this.editedPaperIndex = index;
            this.showPaperModal = true;
        },
        editCoverPaperInModal(index) {
            this.editedCoverPaperIndex = index;
            this.showCoverPaperModal = true;
        },
        editServiceInModal(index) {
            this.editedServiceIndex = index;
            this.showServiceModal = true;
        },
        editCoverServiceInModal(index) {
            this.editedCoverServiceIndex = index;
            this.showCoverServiceModal = true;
        },
        editPaper(e){
            this.papers[this.editedPaperIndex].name = e.name;
            this.papers[this.editedPaperIndex].kind = e.kind;
            this.papers[this.editedPaperIndex].sheetFormat = e.sheetFormat;
            this.papers[this.editedPaperIndex].fiberDirection = e.fiberDirection;
            this.papers[this.editedPaperIndex].opacity = e.opacity;
            this.papers[this.editedPaperIndex].pricePerKilogram = e.pricePerKilogram;
            this.papers[this.editedPaperIndex].quantity = e.quantity;
        },
        editCoverPaper(e) {
            this.coverPapers[this.editedCoverPaperIndex].name = e.name;
            this.coverPapers[this.editedCoverPaperIndex].kind = e.kind;
            this.coverPapers[this.editedCoverPaperIndex].sheetFormat = e.sheetFormat;
            this.coverPapers[this.editedCoverPaperIndex].fiberDirection = e.fiberDirection;
            this.coverPapers[this.editedCoverPaperIndex].opacity = e.opacity;
            this.coverPapers[this.editedCoverPaperIndex].pricePerKilogram = e.pricePerKilogram;
            this.coverPapers[this.editedCoverPaperIndex].quantity = e.quantity;
        },
        editService(e) {
            this.services[this.editedServiceIndex].serviceName = e.serviceName;
            this.services[this.editedServiceIndex].price = e.price;
            this.services[this.editedServiceIndex].name = e.name;
        },
        editCoverService(e) {
            this.coverServices[this.editedCoverServiceIndex].serviceName = e.serviceName;
            this.coverServices[this.editedCoverServiceIndex].price = e.price;
            this.coverServices[this.editedCoverServiceIndex].name = e.name;
        },
        async getOrderItems(selectedName) {
            if(this.selectedOrder != '') {
                let callPath = "/OrderItem/getOrderItemsByOrder?id=" + this.rawOrders.find(element => element.name == selectedName).idOrder;
                this.rawOrderItems = await CallAPI.get(callPath)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
        },
        async getOrderItemDetails(selectedName) {
            if(this.selectedOrderItem != '') {
                let callPath = "/OrderItem/getOrderItem?id=" + this.rawOrderItems.find(element => element.name == selectedName).idOrderItem;
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

                if(this.selectedOrderItemData.colors[i].isForCover) {
                    this.addItem(this.coverColors, newColor);
                }else{
                    this.addItem(this.insideColors, newColor);
                }
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

                if(this.selectedOrderItemData.papers[i].isForCover) {
                    this.addItem(this.coverPapers, newPaper);
                }else{
                    this.addItem(this.papers, newPaper);
                }
            }

            for(let i=0; i < this.selectedOrderItemData.services.length; i++) {
                let newService = {
                    idServiceName: this.selectedOrderItemData.services[i].idServiceName,
                    serviceName: this.selectedOrderItemData.services[i].serviceName,
                    name: this.selectedOrderItemData.services[i].name,
                    price: this.selectedOrderItemData.services[i].price,
                };

                if(this.selectedOrderItemData.services[i].isForCover) {
                    this.addItem(this.coverServices, newService);
                }else{
                    this.addItem(this.services, newService);
                }
            }
        },
        loadCopiedData() {
            const valuationStore = useValuationStore();
            let savedValuation = valuationStore.wholeValuation;
            
            this.insidePlateNumber = savedValuation.insidePlateNumber;
            this.coverPlateNumber = savedValuation.coverPlateNumber;
            this.showCoverForm = savedValuation.showCoverForm;
            this.valuationName = savedValuation.valuationName;
            this.valuationRecipient = savedValuation.valuationRecipient;
            this.offerValidity = new Date(Date.parse(savedValuation.offerValidity));
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
            this.selectedBinding = savedValuation.selectedBinding;

            this.insideColors = savedValuation.insideColors;
            this.coverColors = savedValuation.coverColors;
            this.papers = savedValuation.papers;
            this.coverPapers = savedValuation.coverPapers;
            this.services = savedValuation.services;
            this.coverServices = savedValuation.coverServices;

            this.showValuationPicker = false;
            this.showValuationForm = true;
        },
        calcPrices() {
            let resultPrice = 0;

            // color price
            resultPrice += parseFloat(this.insidePlateNumber) * parseFloat(this.platePrice);

            // cover color price
            if(this.showCoverForm && this.coverColors.length !== 0) resultPrice += parseFloat(this.coverPlateNumber) * parseFloat(this.platePrice);

            // paper and print price
            for(let i=0; i<this.papers.length; i++){
                let paper = this.papers[i];

                let paperFormats = paper.sheetFormat.split('x');
                let sheetArea = paperFormats[0] * paperFormats[1];

                //paper price
                resultPrice += sheetArea * paper.opacity * paper.pricePerKilogram * paper.quantity;

                //print price
                resultPrice += parseFloat(paper.quantity) * parseFloat(this.insidePlateNumber) * this.printCalcConstant;
            }

            // cover paper print price
            if(this.showCoverForm && this.coverPapers.length !== 0){
                for(let i=0; i<this.coverPapers.length; i++){
                    let paper = this.coverPapers[i];

                    let paperFormats = paper.sheetFormat.split('x');
                    let sheetArea = paperFormats[0] * paperFormats[1];

                    //paper price
                    resultPrice += sheetArea * paper.opacity * paper.pricePerKilogram * paper.quantity;

                    //print price
                    resultPrice += parseFloat(paper.quantity) * parseFloat(this.insidePlateNumber) * this.printCalcConstant;
                }
            }

            // services price
            for(let i=0; i<this.services.length; i++){
                resultPrice += parseFloat(this.services[i].price);
            }

            // cover services price
            if(this.showCoverForm && this.coverServices.length !== 0) {
                for(let i=0; i<this.coverServices.length; i++){
                    resultPrice += parseFloat(this.coverServices[i].price);
                }
            }

            this.finalPrice = resultPrice.toFixed(4);
            if(this.mainCirculation != '' && this.mainCirculation != null && this.mainCirculation > 0 && this.mainCirculation != undefined) {
                this.unitPrice = this.finalPrice / this.mainCirculation;
            }
        },
        validateForm(){
            this.$refs.preDetailsform.validate();
            this.$refs.detailsInsideform.validate();
            this.$refs.detailsCoverform.validate();
            
            if(this.showCoverForm && this.selectedBinding == '') {
                this.$vaToast.init({ message: 'Wybierz typ szycia.', color: 'danger', duration: 3000 })
                return false;
            }

            return (this.isPreDetailsFormValidate && this.isDetailsInsideFormValidate && this.isDetailsCoverFormValidate);
        },
        async submitForm() {
            if(this.validateForm) {
                const userStore = useUserStore();

                let orderItemId = "";
                if(this.saveButtonMessage == 'Zapisz wycenę bez przedmiotu zamówienia') {
                    orderItemId = null;
                } else {
                    orderItemId = this.rawOrderItems.find(element => element.name == this.selectedOrderItem).idOrderItem;
                }

                let callPath = "/Valuation/createValuation";
                let body = {};
                let allColorsCover = [];
                let allPapersCover = [];
                let allServicesCover = [];

                //create colors, papers, and services
                let allColors = this.insideColors.map(function(item) {
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

                if(this.showCoverForm) {
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

                if(this.showCoverForm) {
                    body = {
                        Name: this.valuationName,
                        Recipient: this.valuationRecipient,
                        OfferValidityDate: this.offerValidity,
                        InsideCirculation: this.insideCirculation,
                        Capacity: parseFloat(this.insideCapacity),
                        InsideFormat: this.insideFormat,
                        CoverFormat: this.coverFormat,
                        InsideSheetFormat: this.insideFormatSheet,
                        CoverSheetFormat: this.coverFormatSheet,
                        InsideSheetNumber: this.insideSheetNumber,
                        CoverSheetNumber: this.coverSheetNumber,
                        InsideOther: this.isnideOther,
                        CoverOther: this.coverOther,
                        CoverCirculation: this.coverCirculation,
                        InsidePlateNumber: this.insidePlateNumber,
                        CoverPlateNumber: this.coverPlateNumber,
                        MainCirculation: this.mainCirculation,
                        FinalPrice: this.finalPrice,
                        IdAuthor: userStore.userId,
                        IdOrderItem: orderItemId,
                        IdBindingType: this.rawBindingType.find(element => element.name == this.selectedBinding).idBindingType,
                        Colors: allColors.concat(allColorsCover),
                        Papers: allPapers.concat(allPapersCover),
                        Services: allServices.concat(allServicesCover),
                        ValuationPriceLists: [{ IdPriceList: 1, UsedPrice: this.platePrice }, { IdPriceList: 2, UsedPrice: this.printCalcConstant }],
                    };
                } else {
                    body = {
                        Name: this.valuationName,
                        Recipient: this.valuationRecipient,
                        OfferValidityDate: this.offerValidity,
                        InsideCirculation: this.insideCirculation,
                        Capacity: parseFloat(this.insideCapacity),
                        InsideFormat: this.insideFormat,
                        CoverFormat: "",
                        InsideSheetFormat: this.insideFormatSheet,
                        CoverSheetFormat: "",
                        InsideSheetNumber: this.insideSheetNumber,
                        CoverSheetNumber: null,
                        InsideOther: this.isnideOther,
                        CoverOther: "",
                        CoverCirculation: null,
                        InsidePlateNumber: this.insidePlateNumber,
                        CoverPlateNumber: null,
                        MainCirculation: this.mainCirculation,
                        FinalPrice: this.finalPrice,
                        IdAuthor: userStore.userId,
                        IdOrderItem: orderItemId,
                        IdBindingType: null,
                        Colors: allColors,
                        Papers: allPapers,
                        Services: allServices,
                        ValuationPriceLists: [{ IdPriceList: 1, UsedPrice: this.platePrice }, { IdPriceList: 2, UsedPrice: this.printCalcConstant }],
                    };
                }

                await CallAPI.post(callPath, body)
                .then(res => {
                    this.$vaToast.init({ message: 'Wycena została zapisana.', color: 'success', duration: 3000 });
                    this.$router.push({ name: "ValuationDetails", params: { id: res.data, mode: 'edit' } });
                    return res.data;
                })
                .catch(err => {
                    if(err.message.includes("422")) {
                        this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                    }else{
                        this.$vaToast.init({ message: 'Błąd zapisu wyceny.', color: 'danger', duration: 3000 })
                    }

                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
        },
    },
}
</script>

<style scoped>
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

#orderItemsCo {
    grid-area: sidebarC;
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
</style>
