<template>
    <va-modal
        v-model="showPaperModal"
        :title="buttonMessage"
        hide-default-actions
        @click-outside="closePaperModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalPaperForm" tag="form" ref="modalPaperForm" @validation="isPaperFormValidate = $event">
                <va-input
                    class="some-space mb-4"
                    v-model="paperName"
                    label="Nazwa"
                    placeholder="Nazwa papieru"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="paperKind"
                    label="Rodzaj"
                    placeholder="Rodzaj papieru"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="sheetFormat"
                    label="Format arkusza"
                    placeholder="Format arkusza"
                />
                <va-select
                    class="mb-4 some-space"
                    v-model="selectedFiberDirection"
                    :options="fiberDirections"
                    label="Kierunek włókien"
                    noOptionsText="Brak kierunków do wybrania"
                 />
                <va-input
                    class="some-space mb-4"
                    v-model="paperOpacity"
                    label="Grubość"
                    placeholder="Grubość papieru"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="paperQuantity"
                    label="Nakład"
                    placeholder="Nazwa papieru"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="pricePerKilogram"
                    label="Cena"
                    placeholder="Cena za kilogram"
                />
                <va-button type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
export default {
  name: 'PaperModal',
  props: {
    paper: {
        type: Object,
        required: false,
        default: null
    }
  },
  emits: ["createPaper", "editPaper", "close"],
	data() {
		return {
            buttonMessage: "",
            isPaperFormValidate: false,
            showPaperModal: true,
            paperName: "",
            paperKind: "",
            sheetFormat: "",
            fiberDirections: [],
            selectedFiberDirection: null,
            paperOpacity: 0,
            paperQuantity: 0,
            pricePerKilogram: 0.0,
            IdForPaperTable: null,
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    newPaper: {
                        name: this.paperName,
                        kind: this.paperKind,
                        sheetFormat: this.sheetFormat,
                        fiberDirection: this.selectedFiberDirection,
                        opacity: this.paperOpacity,
                        pricePerKilogram: this.pricePerKilogram,
                        quantity: this.paperQuantity
                    }
                };

                if(this.IdForPaperTable !== null) {
                    data.newPaper.IdForPaperTable = this.IdForPaperTable;
                    this.$emit('editPaper', data);
                } else {
                    this.$emit('createPaper', data);
                }
                this.closePaperModal();
            }
		},
        validateForm() {
            this.$refs.modalPaperForm.validate();

            return this.isPaperFormValidate;
        },
        closePaperModal() {
            this.$emit('close');
        }
	},
    mounted() {
        if(this.paper === null) {
            this.buttonMessage = "Dodaj plik";
            this.paperName = "",
            this.paperKind = "",
            this.sheetFormat = "",
            this.fiberDirections = [],
            this.selectedFiberDirection = null,
            this.paperOpacity = 0,
            this.paperQuantity = 0,
            this.pricePerKilogram = 0.0,
            this.IdForPaperTable = null;
        }else {
            this.buttonMessage = "Edytuj plik";
            this.paperName = this.paper.name,
            this.paperKind = this.paper.kind,
            this.sheetFormat = this.paper.sheetFormat,
            this.selectedFiberDirection = this.paper.fiberDirection,
            this.paperOpacity = this.paper.opacity,
            this.paperQuantity = this.paper.quantity,
            this.pricePerKilogram = this.paper.pricePerKilogram,
            this.IdForPaperTable = this.paper.IdForPaperTable;
        }
    }
}
</script>

<style scoped>
#modalPaperForm {
    min-width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

