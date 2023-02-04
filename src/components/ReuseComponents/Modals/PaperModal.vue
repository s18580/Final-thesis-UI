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
                    id="paperName"
                    class="some-space mb-4"
                    v-model="paperName"
                    :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 101 || `Pole nazwa przekroczyło limit znaków.`]"
                    label="Nazwa"
                    placeholder="Nazwa papieru"
                />
                <va-input
                    id="paperKind"
                    class="some-space mb-4"
                    v-model="paperKind"
                    :rules="[(v) => v.length < 101 || `Pole nazwa przekroczyło limit znaków.`]"
                    label="Rodzaj"
                    placeholder="Rodzaj papieru"
                />
                <va-input
                    id="sheetFormat"
                    class="some-space mb-4"
                    v-model="sheetFormat"
                    :rules="[(v) => v.length > 0 || `Pole format arkusza nie może być puste.`, (v) => v.length < 21 || `Pole nazwa przekroczyło limit znaków.`,
                            (v) => formatRegex.test(v) || `Niepoprawny format.`]"
                    label="Format arkusza (w mm)"
                    placeholder="Format arkusza (w mm)"
                />
                <va-select
                    id="fibers"
                    class="mb-4 some-space"
                    v-model="selectedFiberDirection"
                    :options="fiberDirections"
                    label="Kierunek włókien"
                    noOptionsText="Brak kierunków do wybrania"
                 />
                <va-input
                    id="paperOpacity"
                    class="some-space mb-4"
                    v-model="paperOpacity"
                    :rules="[ (v) => v >= 0 || `Grubość nie może być ujemna.`]"
                    label="Grubość papieru (w gramach)"
                />
                <va-input
                    id="paperQuantity"
                    class="some-space mb-4"
                    v-model="paperQuantity"
                    :rules="[ (v) => v >= 0 || `Nakład nie może być ujemny.`]"
                    label="Nakład do druku"
                />
                <va-input
                    id="pricePerKilogram"
                    class="some-space mb-4"
                    v-model="pricePerKilogram"
                    :rules="[ (v) => v >= 0 || `Cena nie może być ujemna.`]"
                    label="Cena za kilogram"
                />
                <va-button id="addNewPaper" type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
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
            formatRegex: /^\d+x\d+$/,
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
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    name: this.paperName,
                    kind: this.paperKind,
                    sheetFormat: this.sheetFormat,
                    opacity: this.paperOpacity,
                    pricePerKilogram: this.pricePerKilogram,
                    quantity: this.paperQuantity
                };

                if(this.selectedFiberDirection === "Pionowy"){
                    data.fiberDirection = 0;
                }else{
                    data.fiberDirection = 1;
                }

                if(this.paper !== null) {
                    if(this.paper.idPaper !== null || this.paper.idPaper !== undefined) data.IdPaper = this.paper.idPaper;
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
            this.paperName = "";
            this.paperKind = "";
            this.sheetFormat = "";
            this.selectedFiberDirection = "Pionowy";
            this.paperOpacity = 0;
            this.paperQuantity = 0;
            this.pricePerKilogram = 0.0;
        }else {
            this.buttonMessage = "Edytuj papier";
            this.paperName = this.paper.name;
            this.paperKind = this.paper.kind;
            this.sheetFormat = this.paper.sheetFormat;
            this.paperOpacity = this.paper.opacity;
            this.paperQuantity = this.paper.quantity;
            this.pricePerKilogram = this.paper.pricePerKilogram;

            if(this.paper.fiberDirection === 0){
                this.selectedFiberDirection = "Pionowy";
            }else{
                this.selectedFiberDirection = "Poziomy";
            }
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

