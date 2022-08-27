import { defineStore } from 'pinia'

export const useValuationStore = defineStore('ValuationStore', {
    state: () => {
        return {
            showOrderPicker: true,
            showValuationPicker: false,
            showValuationForm: false,
            showCoverForm: false,
            selectedOrder: "",
            selectedOrderItem: "",

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
            saveButtonMessage: "",

            insideColors: [],
            coverColors: [],
            papers: [],
            services: [],
            serviceCounter: 0,
            paperCounter: 0,
            insideColorCounter: 0,
            coverColorCounter: 0,
        }
    },

    getters: {
        wholeValuation() {
            return {
                insidePlateNumber: this.insidePlateNumber,
                coverPlateNumber: this.coverPlateNumber,
                selectedBinding: this.selectedBinding,
                showOrderPicker: this.showOrderPicker,
                showValuationPicker: this.showValuationPicker,
                showValuationForm: this.showValuationForm,
                showCoverForm: this.showCoverForm,
                showCoverColors: this.showCoverColors,
                selectedOrder: this.selectedOrder,
                selectedOrderItem: this.selectedOrderItem,
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
                saveButtonMessage: this.saveButtonMessage,
                insideColors: this.insideColors,
                coverColors: this.coverColors,
                papers: this.papers,
                services: this.services,
                serviceCounter: this.serviceCounter,
                paperCounter: this.paperCounter,
                insideColorCounter: this.insideColorCounter,
                coverColorCounter: this.coverColorCounter,
            }
        }
    },

    actions: {
        
    },
    persist: true,
  })