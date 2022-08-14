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
                    class="mb-4 some-space"
                    v-model="selectedWorker"
                    :options="workers"
                    label="Pracownik"
                    noOptionsText="Brak pracowniów do wybrania"
                 />
                <va-input
                    class="some-space mb-4"
                    v-model="hoursWorked"
                    :rules="[ (v) => v >= 0 || `Godziny nie mogą być ujemne.`]"
                    label="Przepracowane godziny przy zamówieniu"
                    placeholder="Przepracowane godziny przy zamówieniu"
                />
                <va-button type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
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
            hoursWorked: 0,
            rawWorkers: [],
            selectedWorker: "",
            IdForWorkerTable: null,
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
                    newWorker: {
                        name: this.selectedWorker,
                        hoursWorker: this.hoursWorked,
                    }
                };

                if(this.IdForWorkerTable !== null) {
                    data.newWorker.IdForWorkerTable = this.IdForWorkerTable;
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
        closeWorkerModal() {
            this.$emit('close');
        }
	},
    async mounted() {
        if(this.worker === null) {
            this.buttonMessage = "Przydziel pracownika";
            this.hoursWorked = 0;
            this.selectedWorker = "";
        }else {
            this.buttonMessage = "Edytuj przydział";
            this.selectedWorker = this.worker.name;
            this.hoursWorker = this.worker.hoursWorker;
            this.IdForWorkerTable = this.worker.IdForWorkerTable;
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
