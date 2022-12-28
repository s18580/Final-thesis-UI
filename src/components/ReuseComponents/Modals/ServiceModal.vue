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
                    :rules="[ (v) => v >= 0 || `Cena nie może być ujemna.`]"
                    label="Cena"
                    placeholder="Cena usługi"
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
            rawServices: [],
            selectedService: "",
		}
	},
    watch: {
        selectedService(newValue, oldValue) {
            if(newValue !== '' || newValue !== null || newValue !== undefined || newValue !== oldValue){
                this.servicePrice = this.rawServices.find(element => element.name == newValue).defaultPrice
            }
        },
    },  
    computed: {
        services(){
            let resultArr = this.rawServices.map(function(item) {
                return item["name"];
            });

            return resultArr;
        }
    },
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    idServiceName: this.getServiceIdByName(this.selectedService),
                    serviceName : { name: this.selectedService },
                    name: this.selectedService,
                    price: this.servicePrice,
                };

                if(this.service !== null) {
                    this.$emit('editService', data);
                } else {
                    this.$emit('createService', data);
                }
                this.closeServiceModal();
            }
		},
        validateForm() {
            this.$refs.modalServiceForm.validate();
            if(this.selectedService === "") {
                this.isServiceFormValidate = false;
                this.$vaToast.init({ message: 'Wybierz nazwę usługi.', color: 'danger', duration: 2000 })
            }
            return this.isServiceFormValidate;
        },
        closeServiceModal() {
            this.$emit('close');
        },
        getServiceIdByName(serviceName) {
            return this.rawServices.find(element => element.name == serviceName).idServiceName;
        },
        getServiceNameById(idService) {
            return this.rawServices.find(element => element.idServiceName == idService).name;
        }
	},
    async mounted() {
        let callPath = "/ServiceName/getServiceNames";
        this.rawServices = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        if(this.service === null) {
            this.buttonMessage = "Dodaj usługę";
            this.selectedService = "";
            this.servicePrice = 0.0;
        }else {
            this.buttonMessage = "Edytuj usługę";
            this.servicePrice = this.service.price;
            this.selectedService = this.getServiceNameById(this.service.idServiceName);
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

