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
import { S3Client, PutObjectCommand  } from "@aws-sdk/client-s3";
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';

export default {
  name: 'FileModal',
  emits: ["createFile", "close"],
	data() {
		return {
            buttonMessage: "",
            isFileFormValidate: false,
            showFileModal: true,
            fileUpload: [],
            fileName: "",
            selectedFile: null,
            rawfileTypes: [],
            selectedFileType: "",
            rawfileStatuses: [],
            selectedFileStatus: "",
            albumBucketName: "printingsystemfiles",
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
                // setup data
                const REGION = "eu-west-2";
                const secretAccessKey = "ESrtU64dJv7DWCFdvKZ0kSokRNfnV5LbdRDbVN/h"
                const accessKeyId = "AKIAQC42EGU5WCMUZBHR"

                // create s3 object
                const awsClient = new S3Client({
                    region: REGION,
                    credentials: {
                        accessKeyId: accessKeyId,
                        secretAccessKey: secretAccessKey
                    }
                });

                // create params and command
                this.fileName = this.selectedFile.name;
                const params = { Bucket: this.albumBucketName, Key: this.fileName, Body: this.selectedFile };
                const command = new PutObjectCommand(params);

                // send command and handle it correctly
                try{
                    var resultData = await awsClient.send(command);
                    console.log("Succesfully for now");
                    console.log(resultData);

                    let data = {
                        newFile: {
                            name: this.fileName,
                            fileType: this.getIdByName("fileType", this.selectedFileType),
                            fileStatus: this.getIdByName("fileStatus", this.selectedFileStatus),
                        }
                    };

                    this.$emit('createFile', data);
                    this.closeFileModal();

                }catch(err) {
                    console.log("Error appeared");
                    console.log(err);
                }
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
    mounted() {
        this.buttonMessage = "Dodaj plik";
        this.selectedFileType = "";
        this.selectedFileStatus = "";
        this.fileName = "";
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

