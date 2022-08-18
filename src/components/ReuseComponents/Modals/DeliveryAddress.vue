<template>
    <va-modal
        v-model="showModal"
        title="Przydziel adres dostawy"
        hide-default-actions
        @click-outside="closeModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalForm" tag="form" ref="modalForm">
                <va-select
                    class="mb-4 some-space"
                    v-model="selectedAddress"
                    :options="addresses"
                    label="Adres"
                    noOptionsText="Brak adresów do wybrania"
                 />
                <va-button type="submit" color="info" gradient class="my-3 sub">Przydziel adres dostawy</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';

export default {
  name: 'DeliveryAddress',
  props: {
    idCustomer: {
        type: Number,
        required: true,
    },
  },
  emits: ["createDeliveryAddress", "close"],
	data() {
		return {
            showModal: true,
            rawAddresses: [],
            selectedAddress: "",
		}
	},
    computed: {
        addresses() {
            let resultArr = this.rawAddresses.map(function(item) {
                return item["name"];
            });

            return resultArr;
        }
    },
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    IdAddress: this.getIdByName(this.selectedAddress),
                    name: this.selectedAddress,
                };

                this.$emit('createDeliveryAddress', data);
                this.closeModal();
            }
		},
        validateForm() {
            if(this.selectedAddress === "") {
                this.$vaToast.init({ message: 'Wybierz adres dostawy.', color: 'danger', duration: 2000 });
                return false;
            }

            return true;
        },
        getIdByName(addressName) {
            return this.rawAddresses.find(element => element.name == addressName).idAddress;
        },
        closeModal() {
            this.$emit('close');
        }
	},
    async mounted() {
        this.selectedAddress = "";

        let callPath = "/Address/getAddressesByCustomer?id=" + this.idCustomer;
        this.rawAddresses = await CallAPI.get(callPath)
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
#modalForm {
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

