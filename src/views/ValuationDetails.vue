<template>
    <div id="background">
        <div id="headerCo">
            <h1>Szczegóły wyceny</h1>
            <va-divider />
        </div>
        <div id="preDetailsCo">
            <va-form @submit.prevent="" id="preDetailsform" tag="preDetailsform" ref="preDetailsform" @validation="isPreDetailsFormValidate = $event">
                <div id="preDetails">
                    <va-popover message="Kopiuj wycenę do schowka" style="margin-top: 10px">
                        <va-button flat color="success" icon="content_copy" @click="copyValuation()" />
                    </va-popover>
                    <va-date-input
                        class="inputWidth"
                        v-model="creationDate"
                        label="Data stworzenia"
                        readonly
                    />
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
                        :readonly="isReadOnly"
                    />
                    <va-input
                        class="longInputWidth"
                        v-model="valuationName"
                        label="Nazwa wyceny"
                        :rules="[(v) => v .length > 0 || `Pole nie może byc puste.`, (v) => v .length < 101 || `Pole przekroczyło maksymalną ilość znaków.`]"
                        placeholder="Nazwa wyceny"
                        :readonly="isReadOnly"
                    />
                    <va-input
                        class="longInputWidth"
                        v-model="valuationRecipient"
                        label="Odbiorca wyceny"
                        :rules="[(v) => v .length > 0 || `Pole nie może byc puste.`, (v) => v .length < 101 || `Pole przekroczyło maksymalną ilość znaków.`]"
                        placeholder="Odbiorca wyceny"
                        :readonly="isReadOnly"
                    />
                </div>
            </va-form>
        </div>
        <div id="detailsInsideCo">
            <div id="detailsMainCo">
                <div>
                    <h5>Szczegóły przedmiotu zamówienia</h5>
                    <va-form @submit.prevent="" id="detailsInsideform" tag="detailsInsideform" ref="detailsInsideform" @validation="isDetailsInsideFormValidate = $event">
                        <div id="detailsInside">
                            <div class="detailsCo">
                                <div id="checkboxCo">
                                    <p>Pokaż szczegóły okładki: </p>
                                    <input v-model="showCoverForm" disabled="disabled" type="checkbox">
                                </div>
                                <va-input
                                    class="inputWidth"
                                    v-model="insideFormat"
                                    label="Format użytku (w mm)"
                                    readonly
                                    placeholder="Format użytku (w mm)"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="insideFormatSheet"
                                    label="Format arkusza (w mm)"
                                    readonly
                                    placeholder="Format arkusza (w mm)"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="insideCirculation"
                                    label="Nakład"
                                    readonly
                                    placeholder="Nakład"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="insideCapacity"
                                    label="Objętość (opcjonalnie)"
                                    readonly
                                    placeholder="Objętość"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="insideSheetNumber"
                                    label="Ilość arkuszy"
                                    readonly
                                    placeholder="Ilość arkuszy"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="isnideOther"
                                    type="textarea"
                                    label="Inne (opcjonalnie)"
                                    :rules="[(v) => v .length < 201 || `Pole przekroczyło maksymalną ilość znaków.`]"
                                    :readonly="isReadOnly"
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
                            </va-list-item>
                        </va-list>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showCoverForm" id="detailsCoverCo">
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
                                    readonly
                                    placeholder="Format użytku (w mm)"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="coverFormatSheet"
                                    label="Format arkusza (w mm)"
                                    readonly
                                    placeholder="Format arkusza (w mm)"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="coverCirculation"
                                    label="Nakład"
                                    readonly
                                    placeholder="Nakład"
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="coverSheetNumber"
                                    label="Ilość arkuszy"
                                    readonly
                                    placeholder="Ilość arkuszy"
                                />
                                <va-select
                                    class="inputWidth"
                                    v-model="selectedBinding"
                                    label="Typ szycia"
                                    noOptionsText="Brak typów szycia do wybrania"
                                    readonly
                                />
                                <va-input
                                    class="inputWidth"
                                    v-model="coverOther"
                                    type="textarea"
                                    label="Inne (opcjonalnie)"
                                    :rules="[(v) => v .length < 201 || `Pole przekroczyło maksymalną ilość znaków.`]"
                                    :readonly="isReadOnly"
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
                            readonly
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
                            </va-list-item>
                        </va-list>
                    </div>
                </div>
            </div>
        </div>
        <div id="papersCo">
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
                        </va-list-item>
                    </va-list>
                </div>
            </div>
            <div v-if="showCoverForm">
                <h5>Lista papierów okładki</h5>
                <div id="papers">
                    <va-list id="papersList">
                        <va-list-item
                            v-for="paper in coverPapers"
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
                        </va-list-item>
                    </va-list>
                </div>
            </div>
        </div>
        <div id="servicesCo">
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
                                    {{ service.serviceName.name }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ service.price }} zł
                                </va-list-item-label>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                </div>
            </div>
            <div v-if="showCoverForm">
                <h5>Usługi i ceny okładki</h5>
                <div id="services">
                    <va-list id="servicesList">
                        <va-list-item
                            v-for="service in coverServices"
                            :key="service.IdService"
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
                        </va-list-item>
                    </va-list>
                </div>
            </div>
        </div>
        <div id="summaryCo">
            <div>
                <h5>Podsumowanie cenowe</h5>
                <div id="summary">
                    <va-input
                        class="inputWidth"
                        v-model="finalPrice"
                        label="Cena zbiorcza"
                        readonly
                    />
                    <va-input
                        class="inputWidth"
                        v-model="mainCirculation"
                        label="Nakład"
                        readonly
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
        <FileList v-if="awsData != null" :mode="mode" :awsData="awsData" parentType="valuation" :id="Number(id)"/>
    </div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import { useUserStore } from '@/stores/UserStore';
import { useValuationStore } from '@/stores/ValuationStore';
import FileList from '@/components/ReuseComponents/FileList.vue';

export default {
  name: 'ValuationDetails',
  props: {
    id: {
        type: String,
        required: true,
    },
  },
  components: { FileList },
  data() {
		return {
            isReadOnly: false,
            showCoverForm: false,
            awsData: null,

            isPreDetailsFormValidate: false,
            creationDate: null,
            authorName: "",
            valuationName: "",
            valuationRecipient: "",
            offerValidity: null,

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

            insideColors: [],
            coverColors: [],
            papers: [],
            coverPapers: [],
            services: [],
            coverServices: [],
		}
	},
    async mounted() {
        const userStore = useUserStore();
        let callPath = "/Worker/getAWS?id=" + userStore.userId;
        this.awsData = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        callPath = "/Valuation/getValuation?id=" + this.id;
        let valuationData = await CallAPI.get(callPath)
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

        this.authorName = valuationData.author.name + " " + valuationData.author.lastName;
        this.insidePlateNumber = valuationData.insidePlateNumber;
        this.coverPlateNumber = valuationData.coverPlateNumber ?? '';
        this.valuationName = valuationData.name;
        this.valuationRecipient = valuationData.recipient;
        this.offerValidity = new Date(Date.parse(valuationData.offerValidityDate));
        this.insideFormat = valuationData.insideFormat;
        this.insideFormatSheet = valuationData.insideSheetFormat;
        this.insideCirculation = valuationData.insideCirculation ?? '';
        this.insideCapacity = valuationData.capacity;
        this.insideSheetNumber = valuationData.insideSheetNumber;
        this.isnideOther = valuationData.insideOther;
        this.coverFormat = valuationData.coverFormat;
        this.coverFormatSheet = valuationData.coverSheetFormat;
        this.coverCirculation = valuationData.coverCirculation ?? '';
        this.coverSheetNumber = valuationData.coverSheetNumber;
        this.coverOther = valuationData.coverOther;
        this.mainCirculation = valuationData.mainCirculation;
        this.insideColors = valuationData.colors.filter(element => element.isForCover == false);
        this.coverColors = valuationData.colors.filter(element => element.isForCover == true);
        this.papers = valuationData.papers.filter(element => element.isForCover == false);
        this.coverPapers = valuationData.papers.filter(element => element.isForCover == true);
        this.services = valuationData.services.filter(element => element.isForCover == false);
        this.coverServices = valuationData.services.filter(element => element.isForCover == true);
        this.showCoverForm = valuationData.coverFormat != '';
        this.finalPrice = valuationData.finalPrice;
        this.creationDate = new Date(Date.parse(valuationData.creationDate));

        if(valuationData.idBindingType !== null){
            this.selectedBinding = this.rawBindingType.find(element => element.idBindingType == valuationData.idBindingType).name;
        } else {
            this.selectedBinding = "";
        }
    },
    methods: {
        copyValuation() {
            const valuationStore = useValuationStore();
            valuationStore.resetData();

            valuationStore.$patch({
                insidePlateNumber: this.insidePlateNumber,
                coverPlateNumber: this.coverPlateNumber,
                showCoverForm: this.showCoverForm,
                valuationName: this.valuationName,
                valuationRecipient: this.valuationRecipient,
                offerValidity: this.offerValidity,
                insideFormat: this.insideFormat,
                insideFormatSheet: this.insideFormatSheet,
                insideCirculation: this.insideCirculation,
                insideCapacity: this.insideCapacity,
                insideSheetNumber: this.insideSheetNumber,
                isnideOther: this.isnideOther,
                coverFormat: this.coverFormat,
                coverFormatSheet: this.coverFormatSheet,
                coverCirculation: this.coverCirculation,
                coverSheetNumber: this.coverSheetNumber,
                coverOther: this.coverOther,
                mainCirculation: this.mainCirculation,
                insideColors: this.insideColors,
                coverColors: this.coverColors,
                papers: this.papers,
                services: this.services,
                coverPapers: this.coverPapers,
                coverServices: this.coverServices,
                selectedBinding: this.selectedBinding,
                finalPrice: this.finalPrice,
            });

            this.$vaToast.init({ message: 'Wycena została skopiowana do schowka.', color: 'success', duration: 3000 })
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
    ". footer footer footer ."
    ". files files files .";
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

#deleteFile {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99999;
    border-radius: 25px;
}

#deleteFile:hover {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99999;
    border: solid 1px red;
}

#filesCo {
    margin-top: 20px;
    grid-area: files;
}

#filesCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}
</style>
