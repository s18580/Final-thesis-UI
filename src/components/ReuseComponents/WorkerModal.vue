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
                    label="Przepracowane godziny przy zamówieniu"
                    placeholder="Przepracowane godziny przy zamówieniu"
                />
                <va-checkbox
                    class="mb-4 some-top-space"
                    label="Prowadzący zamówienie"
                    v-model="idLeader"
                />
                <va-button type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
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
            idLeader: false,
            workers: [],
            selectedWorker: null,
            IdForWorkerTable: null,
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    newWorker: {
                        worker: this.selectedWorker,
                        hoursWorker: this.hoursWorked,
                        isLeader: this.idLeader,
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

            return this.isWorkerFormValidate;
        },
        closeWorkerModal() {
            this.$emit('close');
        }
	},
    mounted() {
        if(this.worker === null) {
            this.buttonMessage = "Przydziel pracownika";
            this.idLeader = false;
            this.hoursWorked = 0;
            this.selectedWorker = null;
        }else {
            this.buttonMessage = "Edytuj przydział";
            this.selectedWorker = this.worker.worker;
            this.hoursWorker = this.worker.hoursWorker;
            this.isLeader = this.worker.isLeader;
            this.IdForWorkerTable = this.worker.IdForWorkerTable;
        }
    }
}
</script>

<style scoped>
#modalWorkerForm {
    min-width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

