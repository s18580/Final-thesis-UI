<template>
    <va-modal
        v-model="showWorkerModal"
        :title="buttonMessage"
        hide-default-actions
        @click-outside="closeWorkerModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalWorkerForm" tag="form" ref="modalWorkerForm" @validation="isWorkerFormValidate = $event">
                <va-select
                    id="worker"
                    class="mb-4 some-space"
                    v-model="selectedWorker"
                    :options="workers"
                    label="Pracownik"
                    noOptionsText="Brak pracowniów do wybrania"
                 />
                <div class="search-input-box">
                    <label>Pracownik jest liderem zamówienia:</label>
                    <div id="isAuctionCo">
                        <input id="isLeader" v-model="isLeader" type="checkbox"/>
                    </div> 
                </div>
                <va-button id="addAssignment" type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';

export default {
  name: 'WorkerModal',
  props: {
    worker: {
        type: Object,
        required: false,
        default: null
    }
  },
  emits: ["createWorker", "editWorker", "close"],
	data() {
		return {
            buttonMessage: "",
            isWorkerFormValidate: false,
            showWorkerModal: true,
            isLeader: false,
            rawWorkers: [],
            selectedWorker: "",
		}
	},
    computed: {
        workers() {
            let resultArr = this.rawWorkers.map(function(item) {
                return item["name"] + " " + item["lastName"];
            });

            return resultArr;
        }
    },
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    idWorker: this.getIdByName(this.selectedWorker),
                    name: this.selectedWorker,
                    isLeader: this.isLeader
                };

                if(this.worker !== null) {
                    this.$emit('editWorker', data);
                } else {
                    this.$emit('createWorker', data);
                }
                this.closeWorkerModal();
            }
		},
        validateForm() {
            this.$refs.modalWorkerForm.validate();
            if(this.selectedWorker === "") {
                this.isWorkerFormValidate = false;
                this.$vaToast.init({ message: 'Wybierz pracownika.', color: 'danger', duration: 2000 })
            }

            return this.isWorkerFormValidate;
        },
        getIdByName(workerName) {
            return this.rawWorkers.find(element => (element.name + " " + element.lastName) == workerName).idWorker;
        },
        closeWorkerModal() {
            this.$emit('close');
        }
	},
    async mounted() {
        if(this.worker === null) {
            this.buttonMessage = "Przydziel pracownika";
            this.isLeader = false;
            this.selectedWorker = "";
        }else {
            this.buttonMessage = "Edytuj przydział";
            this.selectedWorker = this.worker.name;
            this.isLeader = this.worker.isLeader;
        }

        let callPath = "/Worker/getWorkers";
        this.rawWorkers = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });
    }
}
</script>

<style scoped>
#modalWorkerForm {
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

