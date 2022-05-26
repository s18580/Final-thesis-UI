<template>
    <va-modal
        v-model="showOrderItemModal"
        :title="buttonMessage"
        hide-default-actions
        @click-outside="closeOrderItemModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalOrderItemForm" tag="form" ref="modalOrderItemForm" @validation="isOrderItemFormValidate = $event">
                <va-input
                    class="some-space mb-4"
                    v-model="orderItemName"
                    label="Nazwa"
                    placeholder="Nazwa przedmiotu zamówienia"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="insideFormat"
                    label="Format"
                    placeholder="Format przedmiotu zamówienia"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="coverFormat"
                    label="Format okładki"
                    placeholder="Format okładki przedmiotu zamówienia"
                />
                <va-date-input
                    class="some-space mb-4"
                    v-model="expectedCompletionDate"
                    label="Pożądana data ukończenia"
                    placeholder="Pożądana data ukończenia"
                />
                <va-date-input
                    class="some-space mb-4"
                    v-model="completionDate"
                    label="Data ukończenia"
                    placeholder="Data ukończenia"
                />
                <va-select
                    class="mb-4 some-space"
                    v-model="selectedOrderItemType"
                    :options="orderItemTypes"
                    label="Typ przedmiotu zamówienia"
                    noOptionsText="Brak typów przedmiotu zamówienia do wybrania"
                 />
                 <va-select
                    class="mb-4 some-space"
                    v-model="selectedDeliveryType"
                    :options="deliveryTypes"
                    label="Typ dostawy"
                    noOptionsText="Brak typów dostawy do wybrania"
                 />
                 <va-select
                    class="mb-4 some-space"
                    v-model="selectedBindingTypes"
                    :options="bindingTypes"
                    label="Typ szycia"
                    noOptionsText="Brak typów szycia do wybrania"
                 />
                <va-input
                    class="mb-4 some-space"
                    v-model="comments"
                    type="textarea"
                    :rules="[ (v) => v.length < 255 || `Pole notatka przekroczyło limit znaków.`]"
                    label="Notatka (opcjonalnie)"
                />
                <va-button type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
export default {
  name: 'OrderItemModal',
  props: {
    orderItem: {
        type: Object,
        required: false,
        default: null
    }
  },
  emits: ["createOrderItem", "editOrderItem", "close"],
	data() {
		return {
            buttonMessage: "",
            isOrderItemFormValidate: false,
            showOrderItemModal: true,
            IdForOrderItemTable: null,
            orderItemName: "",
            comments: "",
            insideFormat: "",
            coverFormat: "",
            completionDate: new Date(),
            expectedCompletionDate: new Date(),
            capacity: null,
            circulation: 0,
            orderItemTypes: [],
            selectedOrderItemType: null,
            deliveryTypes: [],
            selectedDeliveryType: null,
            bindingTypes: [],
            selectedBindingTypes: null,
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    newOrderItem: {
                        name: this.orderItemName,
                        comments: this.comments,
                        insideFormat: this.insideFormat,
                        coverFormat: this.coverFormat,
                        capacity: this.capacity,
                        circulation: this.circulation,
                        selectedOrderItemType: this.selectedOrderItemType,
                        selectedDeliveryType: this.selectedDeliveryType,
                        selectedBindingTypes: this.selectedBindingTypes,
                    }
                };

                if(this.IdForOrderItemTable !== null) {
                    data.newFile.IdForOrderItemTable = this.IdForOrderItemTable;
                    this.$emit('editOrderItem', data);
                } else {
                    this.$emit('createOrderItem', data);
                }
                this.closeFileModal();
            }
		},
        validateForm() {
            this.$refs.modalOrderItemForm.validate();

            return this.isOrderItemFormValidate;
        },
        closeOrderItemModal() {
            this.$emit('close');
        }
	},
    mounted() {
        if(this.orderItem === null) {
            this.buttonMessage = "Dodaj przedmiot zamówienia";
            this.orderItemName = "",
            this.comments = "",
            this.insideFormat = "",
            this.coverFormat = "",
            this.capacity = null,
            this.circulation = 0,
            this.orderItemTypes = [],
            this.selectedOrderItemType = null,
            this.deliveryTypes = [],
            this.selectedDeliveryType = null,
            this.bindingTypes = [],
            this.selectedBindingTypes = null,
            this.IdForOrderItemTable = null;
        }else {
            this.buttonMessage = "Edytuj przedmiot zamówienia";
            this.orderItemName = this.newOrderItem.name,
            this.comments = this.newOrderItem.comments,
            this.insideFormat = this.newOrderItem.insideFormat,
            this.coverFormat = this.newOrderItem.coverFormat,
            this.capacity = this.newOrderItem.capacity,
            this.circulation = this.newOrderItem.circulation,
            this.selectedOrderItemType = this.newOrderItem.selectedOrderItemType,
            this.selectedDeliveryType = this.newOrderItem.selectedDeliveryType,
            this.selectedBindingTypes = this.newOrderItem.selectedBindingTypes,
            this.IdForOrderItemTable = this.newOrderItem.IdForOrderItemTable;
        }
    }
}
</script>

<style scoped>
#modalOrderItemForm {
    min-width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

