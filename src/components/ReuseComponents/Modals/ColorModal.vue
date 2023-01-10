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
                <va-button type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
export default {
  name: 'ColorModal',
  emits: ["createColor", "close"],
	data() {
		return {
            buttonMessage: "",
            isColorFormValidate: false,
            showColorModal: true,
            colorName: "",
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    name: this.colorName,
                };

                this.$emit('createColor', data);
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
        this.buttonMessage = "Dodaj kolorystykę";
        this.colorName = "";
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

</style>

