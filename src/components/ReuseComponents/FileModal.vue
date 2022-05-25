<template>
    <va-modal
        v-model="showFileModal"
        :title="buttonMessage"
        hide-default-actions
        @click-outside="closeFileModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalFileForm" tag="form" ref="modalFileForm" @validation="isFileFormValidate = $event">
                <va-input
                    class="some-space mb-4"
                    v-model="fileName"
                    label="Nazwa"
                    placeholder="Nazwa pliku"
                />
                <va-select
                    class="mb-4 some-space"
                    v-model="selectedFileType"
                    :options="fileTypes"
                    label="Rodzaj pliku"
                    noOptionsText="Brak rodzajów do wybrania"
                 />
                 <va-select
                    class="mb-4 some-space"
                    v-model="selectedFileStatus"
                    :options="fileStatus"
                    label="Status pliku"
                    noOptionsText="Brak statusów do wybrania"
                 />
                 <va-file-upload
                    class="mb-4 some-space"
                    v-model="fileUpload"
                    type="single"
                    drop-zone-text="Przeciągnij plik lub"
                    upload-button-text="Załaduj plik"
                    dropzone
                />
                <va-button type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
export default {
  name: 'FileModal',
  props: {
    file: {
        type: Object,
        required: false,
        default: null
    }
  },
  emits: ["createFile", "editFile", "close"],
	data() {
		return {
            buttonMessage: "",
            isFileFormValidate: false,
            showFileModal: true,
            fileUpload: [],
            fileName: "",
            fileTypes: [],
            selectedFileType: null,
            fileStatus: [],
            selectedFileStatus: null,
            IdForFileTable: null,
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    newFile: {
                        name: this.fileName,
                        fileType: this.selectedFileType,
                        fileStatus: this.selectedFileStatus,
                    }
                };

                if(this.IdForFileTable !== null) {
                    data.newFile.IdForFileTable = this.IdForFileTable;
                    this.$emit('editFile', data);
                } else {
                    this.$emit('createFile', data);
                }
                this.closeFileModal();
            }
		},
        validateForm() {
            this.$refs.modalFileForm.validate();

            return this.isFileFormValidate;
        },
        closeFileModal() {
            this.$emit('close');
        }
	},
    mounted() {
        if(this.file === null) {
            this.buttonMessage = "Dodaj plik";
            this.selectedFileType = null;
            this.selectedFileStatus = null;
            this.fileName = "";
            this.IdForFileTable = null;
        }else {
            this.buttonMessage = "Edytuj plik";
            this.selectedFileType = this.newFile.fileType;
            this.selectedFileStatus = this.newFile.fileStatus;
            this.fileName = this.newFile.name;
            this.IdForFileTable = this.file.IdForFileTable;
        }
    }
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

