<template>
    <va-modal
        v-model="showServiceModal"
        :title="buttonMessage"
        hide-default-actions
        @click-outside="closeServiceModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalServiceForm" tag="form" ref="modalServiceForm" @validation="isServiceFormValidate = $event">
                <va-select
                    class="mb-4 some-space"
                    v-model="selectedService"
                    :options="services"
                    label="Nazwa usługi"
                    noOptionsText="Brak usług do wybrania"
                 />
                <va-input
                    class="some-space mb-4"
                    v-model="servicePrice"
                    label="Cena"
                    placeholder="Cena usługi"
                />
                <va-button type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
export default {
  name: 'ServiceModal',
  props: {
    service: {
        type: Object,
        required: false,
        default: null
    }
  },
  emits: ["createService", "editService", "close"],
	data() {
		return {
            buttonMessage: "",
            isServiceFormValidate: false,
            showServiceModal: true,
            servicePrice: 0.0,
            services: [],
            selectedService: null,
            IdForServiceTable: null,
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    newService: {
                        idServiceName: this.selectedService,
                        price: this.servicePrice,
                    }
                };

                if(this.IdForServiceTable !== null) {
                    data.newService.IdForServiceTable = this.IdForServiceTable;
                    this.$emit('editService', data);
                } else {
                    this.$emit('createService', data);
                }
                this.closeServiceModal();
            }
		},
        validateForm() {
            this.$refs.modalServiceForm.validate();

            return this.isServiceFormValidate;
        },
        closeServiceModal() {
            this.$emit('close');
        }
	},
    mounted() {
        if(this.service === null) {
            this.buttonMessage = "Dodaj usługę";
            this.selectedService = null;
            this.services = [];
            this.servicePrice = 0.0;
            this.IdForFileTable = null;
        }else {
            this.buttonMessage = "Edytuj usługę";
            this.servicePrice = this.newService.price;
            this.selectedService = this.newService.selectedService;
            this.IdForServiceTable = this.newService.IdForServiceTable;
        }
    }
}
</script>

<style scoped>
#modalServiceForm {
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

