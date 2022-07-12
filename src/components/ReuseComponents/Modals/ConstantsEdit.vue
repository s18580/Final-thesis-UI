<template>
    <va-modal
        v-model="showModal"
        :title="titleMessage"
        hide-default-actions
        @click-outside="closeModal()"
    >
        <div class="background-modal">
            <va-input
                v-model="constantName"
                label="Nowa nazwa"
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
  },
  emits: ["editConstant", "close", "addConstant"],
	data() {
		return {
            buttonMessage: "",
            titleMessage: "",
            constantId: "",
            constantName: "",
            showModal: true,
		}
	},
	methods: {
        closeModal() {
            this.$emit('close');
        },
        editConstant() {
            this.$emit('editConstant', { Id: this.constantId, Name: this.constantName });
        },
        addConstant(){
            this.$emit('addConstant', { Name: this.constantName });
        }
	},
    beforeUpdate() {
        if(this.constantValue !== null){
            this.titleMessage = "Edytuj stałą";
            this.buttonMessage = "Edytuj";
            this.constantName = this.constantValue.Name;
            this.constantId = this.constantValue.Id;
        }else{
            this.titleMessage = "Dodaj stałą";
            this.buttonMessage = "Dodaj";
            this.constantName = "";
            this.constantId = "";
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

