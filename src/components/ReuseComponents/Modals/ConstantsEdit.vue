<template>
    <va-modal
        v-model="showModal"
        :title="titleMessage"
        hide-default-actions
        @click-outside="closeModal()"
    >
        <div class="background-modal">
            <va-input
                class="mb-3"
                v-model="constantNewName"
                label="Nowa nazwa"
            />
            <va-input
                class="mb-3"
                v-if="priceListType"
                v-model="constantPrice"
                label="Nowa cena"
            />
            <va-input
                class="mb-3"
                v-if="serviceNameType"
                v-model="constantDefaultPrice"
                label="Nowa cena domyślna"
            />
            <va-input
                class="mb-3"
                v-if="serviceNameType"
                v-model="constantMinPrice"
                label="Nowa cena minimalna"
            />
            <va-input
                class="mb-3"
                v-if="serviceNameType"
                v-model="constantMinCirculation"
                label="Nowy nakład minimalny"
            />
        </div>

        <div class="buttonCo">
            <va-button @click="this.closeModal()" flat text-color="gray" color="gray" class="mr-4 mb-2"> Anuluj </va-button>
            <va-button @click="this.editConstant()" color="primary" class="mr-4 mb-2"> {{ buttonMessage }} </va-button>
        </div>
    </va-modal>
</template>

<script>
export default {
  name: 'ConstantsEdit',
  props: {
    constantValue: {
        type: Object,
        required: false,
        default: null
    },
    constantType: {
        type: String,
        required: true,
        default: ""
    },
  },
  emits: ["editConstant", "close", "addConstant"],
	data() {
		return {
            buttonMessage: "",
            titleMessage: "",
            constantNewName: "",
            constantPrice: "",
            constantDefaultPrice: "",
            constantMinPrice: "",
            constantMinCirculation: "",
            serviceNameType: false,
            priceListType: false,
            showModal: true,
		}
	},
	methods: {
        closeModal() {
            this.$emit('close');
        },
        editConstant() {
            if(this.constantValue !== null) {
                this.$emit('editConstant', { Constant: this.constantValue, NewValues: { Name: this.constantNewName, Price: this.constantPrice, DefaultPrice: this.constantDefaultPrice, MinPrice: this.constantMinPrice, MinCirculation: this.constantMinCirculation }});
            } else {
                this.$emit('addConstant', { Name: this.constantNewName, Price: this.constantPrice, DefaultPrice: this.constantDefaultPrice, MinPrice: this.constantMinPrice, MinCirculation: this.constantMinCirculation });
            }
        },
	},
    beforeUpdate() {
        this.serviceNameType = this.constantType === 'Usługa';
        this.priceListType = this.constantType === 'Cennik';

        if(this.constantValue !== null){
            this.titleMessage = "Edytuj stałą";
            this.buttonMessage = "Edytuj";
            this.constantNewName = this.constantValue.name;
            this.constantPrice = this.constantValue.price;
            this.constantDefaultPrice = this.constantValue.defaultPrice;
            this.constantMinPrice = this.constantValue.minimumPrice;
            this.constantMinCirculation = this.constantValue.minimumCirculation;
        }else{
            this.titleMessage = "Dodaj stałą";
            this.buttonMessage = "Dodaj";
            this.constantNewName = "";
            this.constantPrice = "";
            this.constantDefaultPrice = "";
            this.constantMinPrice = "";
            this.constantMinCirculation = "";
        }
    }
}
</script>

<style scoped>
.background-modal {
    margin-bottom: 20px;
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

