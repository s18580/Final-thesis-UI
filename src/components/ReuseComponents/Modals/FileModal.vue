<template>
    <va-modal
        v-model="showFileModal"
        :title="buttonMessage"
        hide-default-actions
        @click-outside="closeFileModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalFileForm" tag="form" ref="modalFileForm" @validation="isFileFormValidate = $event">
                <input @input="uploadFile($event)" type="file" ref="fileUpload" />
                <va-button type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>

export default {
  name: 'FileModal',
  emits: ["createFile", "close"],
	data() {
		return {
            buttonMessage: "Dodaj plik",
            isFileFormValidate: false,
            showFileModal: true,
            fileUpload: [],
            selectedFile: null,
		}
	},
	methods: {
		async submitForm() {
            if(this.validateForm()) {
                let data = {
                    selectedFile: this.selectedFile,
                };

                this.$emit('createFile', data);
                this.closeFileModal();
            }
		},
        uploadFile(e) {
            this.selectedFile = e.target.files[0]; 
        },
        validateForm() {
            this.$refs.modalFileForm.validate();
            if(this.selectedFile == null){
                this.isFileFormValidate = false;
                this.$vaToast.init({ message: 'Wybierz plik.', color: 'danger', duration: 2000 });
            }

            return this.isFileFormValidate;
        },
        closeFileModal() {
            this.$emit('close');
        }
	},
}
</script>

<style scoped>
#modalFileForm {
    min-width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

