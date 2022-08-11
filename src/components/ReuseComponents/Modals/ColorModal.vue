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
                    label="Nazwa"
                    placeholder="Nazwa koloru"
                />
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
    }
  },
  emits: ["createColor", "editColor", "close"],
	data() {
		return {
            buttonMessage: "",
            isColorFormValidate: false,
            showColorModal: true,
            colorName: "",
            IdForColorTable: null,
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    newColor: {
                        name: this.colorName,
                    }
                };

                if(this.IdForColorTable !== null) {
                    data.newColor.IdForColorTable = this.IdForColorTable;
                    this.$emit('editColor', data);
                } else {
                    this.$emit('createColor', data);
                }
                this.closeFileModal();
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
            this.IdForFileTable = null;
        }else {
            this.buttonMessage = "Edytuj kolorystykę";
            this.colorName = this.color.name;
            this.IdForColorTable = this.file.IdForColorTable;
        }
    }
}
</script>

<style scoped>
#modalColorForm {
    min-width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

