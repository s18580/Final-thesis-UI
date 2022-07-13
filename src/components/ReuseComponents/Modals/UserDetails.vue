<template>
    <va-modal
        v-model="showModal"
        title="Edytuj pracownika"
        hide-default-actions
        @click-outside="closeModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalForm" tag="form" ref="modalForm" @validation="isFormValidate = $event">
                <va-input
                    class="some-space mb-4"
                    v-model="workerName"
                    :rules="[(v) => v.length > 0 || `Pole imię nie może być puste.`, (v) => v.length < 33 || `Pole imię przekroczyło limit znaków.`]"
                    label="Imię"
                    placeholder="Imię pracownika"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="workerLastName"
                    :rules="[(v) => v.length > 0 || `Pole nazwisko nie może być puste.`, (v) => v.length < 65 || `Pole nazwisko przekroczyło limit znaków.`]"
                    label="Nazwisko"
                    placeholder="Nazwisko pracownika"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="workerEmail"
                    :rules="[(v) => v.length > 0 || `Pole email nie może być puste`, (v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                    label="Email"
                    placeholder="Email pracownika"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="workerPhone"
                    :rules="[(v) => v.length > 8 || `Pole telefon jest nieprawidłowe.`, (v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                    label="Telefon"
                    placeholder="Telefon pracownika"
                />
                <va-select
                    class="some-space mb-4"
                    v-model="selectedWorksite"
                    :options="worksites"
                    label="Stanowisko"
                    placeholder="Bez stanowiska"
                />
                <div class="buttonCo">
                    <va-button @click="closeModal()" flat text-color="gray" color="gray" class="mr-4 mb-2"> Anuluj </va-button>
                    <va-button type="submit" color="primary" class="mr-4 mb-2"> Edytuj </va-button>
                </div>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
export default {
  name: 'UserDetails',
  props: {
    worker: {
        type: Object,
        required: true,
        default: null
    }
  },
  emits: ["editWorker", "close"],
	data() {
		return {
            isFormValidate: false,
            showModal: true,
            workerName: "",
            workerLastName: "",
            workerEmail: "",
            workerPhone: "",
            selectedWorksite: null,
            worksites: [],
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                this.$emit('editWorker', { Id: this.worker.Id, Name: this.workerName, LastName: this.workerLastName, Email: this.workerEmail, Phone: this.workerPhone, Worksite: this.selectedWorksite });
                this.closeModal();
            }
		},
        validateForm() {
            this.$refs.modalForm.validate();

            return this.isFormValidate;
        },
        closeModal() {
            this.$emit('close');
        }
	},
    mounted() {
        if(this.worker !== null) {
            this.workerName = "";
            this.workerLastName = "";
            this.workerEmail = "";
            this.workerPhone = "";
            this.worksites = [];
        }
    }
}
</script>

<style scoped>
#modalForm {
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.buttonCo {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
}
</style>

