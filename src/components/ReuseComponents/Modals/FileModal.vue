<template>
    <va-modal
        v-model="showFileModal"
        :title="buttonMessage"
        hide-default-actions
        @click-outside="closeFileModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalFileForm" tag="form" ref="modalFileForm" @validation="isFileFormValidate = $event">
                <va-select
                    class="mb-4 some-space"
                    v-model="selectedFileType"
                    :options="fileTypes"
                    label="Rodzaj pliku"
                    noOptionsText="Brak rodzajów do wybrania"
                />
                <va-select
                    v-if="isGraphicType"
                    class="mb-4 some-space"
                    v-model="selectedFileStatus"
                    :options="fileStatuses"
                    label="Status pliku"
                    noOptionsText="Brak statusów do wybrania"
                />
                <input @input="uploadFile($event)" type="file" ref="fileUpload" />
                <va-button type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';

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
            rawfileTypes: [],
            selectedFileType: "",
            rawfileStatuses: [],
            selectedFileStatus: "",
		}
	},
    computed: {
        isGraphicType() {
            if(this.selectedFileType == ""){
                return false;
            } else if(this.selectedFileType == "Graficzny") {
                return true;
            } else {
                return false;
            }
        },
        fileTypes() {
            let resultArr = this.rawfileTypes.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        fileStatuses() {
            let resultArr = this.rawfileStatuses.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
    },
	methods: {
		async submitForm() {
            if(this.validateForm()) {
                let data = {
                    selectedFile: this.selectedFile,
                    fileType: this.getIdByName("fileType", this.selectedFileType),
                    fileStatus: this.getIdByName("fileStatus", this.selectedFileStatus),
                };

                this.$emit('createFile', data);
                this.closeFileModal();
            }
		},
        uploadFile(e) {
            this.selectedFile = e.target.files[0]; 
        },
        getIdByName(what, selectedName) {
            switch(what) {
                case "fileType":
                    return this.rawfileTypes.find(element => element.name == selectedName).idFileType;
                case "fileStatus":
                    return this.rawfileStatuses.find(element => element.name == selectedName).idFileStatus;
            }
        },
        validateForm() {
            this.$refs.modalFileForm.validate();
            if(this.selectedFileType == ""){
                this.isFileFormValidate = false;
                this.$vaToast.init({ message: 'Wybierz typ pliku.', color: 'danger', duration: 2000 });
            }

            if(this.isGraphicType && this.selectedFileStatus == ""){
                this.isFileFormValidate = false;
                this.$vaToast.init({ message: 'Wybierz status pliku.', color: 'danger', duration: 2000 });
            }

            if(this.selectedFile == null){
                this.isFileFormValidate = false;
                this.$vaToast.init({ message: 'Wybierz plik.', color: 'danger', duration: 2000 });
            }

            return this.isFileFormValidate;
        },
        async getDictionaryData() {
            let callPath = "/FileType/getFileTypes";
            this.rawfileTypes = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            callPath = "/FileStatus/getFileStatuses";
            this.rawfileStatuses = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
        closeFileModal() {
            this.$emit('close');
        }
	},
    async mounted() {
        this.selectedFileType = "";
        this.selectedFileStatus = "";
        this.selectedFile = null;

        this.getDictionaryData();
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

