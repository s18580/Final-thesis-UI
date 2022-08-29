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
                    :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                    label="Nazwa"
                    placeholder="Nazwa papieru"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="paperKind"
                    :rules="[(v) => v.length < 51 || `Pole nazwa przekroczyło limit znaków.`]"
                    label="Rodzaj"
                    placeholder="Rodzaj papieru"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="sheetFormat"
                    :rules="[(v) => v.length > 0 || `Pole format arkusza nie może być puste.`, (v) => v.length < 101 || `Pole nazwa przekroczyło limit znaków.`]"
                    label="Format arkusza (w mm)"
                    placeholder="Format arkusza (w mm)"
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
                    :rules="[ (v) => v >= 0 || `Grubość nie może być ujemna.`]"
                    label="Grubość papieru (w gramach)"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="paperQuantity"
                    :rules="[ (v) => v >= 0 || `Nakład nie może być ujemny.`]"
                    label="Nakład papieru"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="pricePerKilogram"
                    :rules="[ (v) => v >= 0 || `Cena nie może być ujemna.`]"
                    label="Cena za kilogram"
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
            fiberDirections: ["Pionowy", "Poziomy"],
            selectedFiberDirection: "Pionowy",
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
            this.buttonMessage = "Dodaj papier";
            this.paperName = "",
            this.paperKind = "",
            this.sheetFormat = "",
            this.selectedFiberDirection = "Pionowy",
            this.paperOpacity = 0,
            this.paperQuantity = 0,
            this.pricePerKilogram = 0.0,
            this.IdForPaperTable = null;
        }else {
            this.buttonMessage = "Edytuj papier";
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
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

