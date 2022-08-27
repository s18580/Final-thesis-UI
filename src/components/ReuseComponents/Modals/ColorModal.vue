<template>
    <va-modal
        v-model="showColorModal"
        :title="buttonMessage"
        hide-default-actions
        @click-outside="closeColorModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalColorForm" tag="form" ref="modalColorForm" @validation="isColorFormValidate = $event">
                <va-input
                    class="some-space mb-4"
                    v-model="colorName"
                    :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 11 || `Pole nazwa przekroczyło limit znaków.`]"
                    label="Nazwa"
                    placeholder="Nazwa koloru"
                />
                <div id="checkboxCo" v-if="withSelect">
                    <p>Traktuj jako kolorystyka okładki: </p>
                    <input v-model="isForCover" type="checkbox">
                </div>
                <va-button type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
export default {
  name: 'ColorModal',
  props: {
    color: {
        type: Object,
        required: false,
        default: null
    },
    withSelect: {
        type: Boolean,
        required: false,
        default: true
    }
  },
  emits: ["createColor", "editColor", "close"],
	data() {
		return {
            buttonMessage: "",
            isColorFormValidate: false,
            showColorModal: true,
            colorName: "",
            isForCover: false,
            IdForColorTable: null,
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    newColor: {
                        name: this.colorName,
                        isForCover: this.isForCover,
                    }
                };

                if(this.IdForColorTable !== null) {
                    data.newColor.IdForColorTable = this.IdForColorTable;
                    this.$emit('editColor', data);
                } else {
                    this.$emit('createColor', data);
                }
                this.closeColorModal();
            }
		},
        validateForm() {
            this.$refs.modalColorForm.validate();

            return this.isColorFormValidate;
        },
        closeColorModal() {
            this.$emit('close');
        }
	},
    mounted() {
        if(this.color === null) {
            this.buttonMessage = "Dodaj kolorystykę";
            this.colorName = "";
            this.isForCover = false;
            this.IdForColorTable = null;
        }else {
            this.buttonMessage = "Edytuj kolorystykę";
            this.isForCover = this.color.isForCover;
            this.colorName = this.color.name;
            this.IdForColorTable = this.color.IdForColorTable;
        }
    }
}
</script>

<style scoped>
#modalColorForm {
    min-width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

#checkboxCo {
    display: flex;
    justify-content: center;
    gap: 10px;
}
</style>

