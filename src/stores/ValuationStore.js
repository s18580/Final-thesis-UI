import { defineStore } from 'pinia'

export const useValuationStore = defineStore('ValuationStore', {
    state: () => {
        return {
            showCoverForm: false,

            valuationName: "",
            valuationRecipient: "",
            offerValidity: new Date(),

            insideFormat: "",
            insideFormatSheet: "",
            insideCirculation: "",
            insideCapacity: "",
            insideSheetNumber: "",
            isnideOther: "",
            insidePlateNumber: "",
            selectedBinding: "",

            coverFormat: "",
            coverFormatSheet: "",
            coverCirculation: "",
            coverSheetNumber: "",
            coverOther: "",
            coverPlateNumber: "",

            mainCirculation: "",
            finalPrice: "",

            insideColors: [],
            coverColors: [],
            papers: [],
            coverPapers: [],
            services: [],
            coverServices: [],
        }
    },

    getters: {
        wholeValuation() {
            return {
                insidePlateNumber: this.insidePlateNumber,
                coverPlateNumber: this.coverPlateNumber,
                selectedBinding: this.selectedBinding,
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
                coverPapers: this.coverPapers,
                services: this.services,
                coverServices: this.coverServices,
                finalPrice: this.finalPrice,
            }
        }
    },

    actions: {
        resetData() {
            this.insidePlateNumber = "";
            this.coverPlateNumber = "";
            this.selectedBinding = "";
            this.showCoverForm = false;
            this.valuationName = "";
            this.valuationRecipient = "";
            this.offerValidity = new Date();
            this.insideFormat = "";
            this.insideFormatSheet = "";
            this.insideCirculation = "";
            this.insideCapacity = "";
            this.insideSheetNumber = "";
            this.isnideOther = "";
            this.coverFormat = "";
            this.coverFormatSheet = "";
            this.coverCirculation = "";
            this.coverSheetNumber = "";
            this.coverOther = "";
            this.mainCirculation = "";
            this.insideColors = [];
            this.coverColors = [];
            this.papers = [];
            this.coverPapers = [];
            this.services = [];
            this.coverServices = [],
            this.finalPrice = "";
        }
    },
    persist: true,
  })