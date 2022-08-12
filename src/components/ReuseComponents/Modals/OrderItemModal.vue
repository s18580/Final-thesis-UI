<template>
    <va-modal
        v-model="showOrderItemModal"
        :title="buttonMessage"
        hide-default-actions
        @click-outside="closeOrderItemModal()"
        max-width="1100px"
    >
        <div id="background-modal">
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
            <div id="colorCo">
                <h3>Kolorystyka</h3>
                <va-divider />
                <div>
                    <div class="objects-card-wrapper">
                        <h6>Lista kolorów:</h6>
                        <div class="objects-card">
                            <div v-for="color in orderItemColors" :key="color.IdForColorTable" class="card-items">
                                <div class="my-1">
                                    {{ color.name }}
                                </div>
                                <div class="card-icons">
                                    <va-icon @click="editColorInModal(color)" color="#1b63b1" class="material-icons">edit</va-icon>
                                    <va-icon @click="removeColor(color.IdForColorTable)" color="#1b63b1" class="material-icons">delete</va-icon>
                                </div>
                            </div>
                        </div>
                        <va-button @click="showColorModal=true" type="button" color="success" gradient>Dodaj kolor</va-button>
                        <ColorModal v-if="showColorModal" @close="showColorModal=false" @createColor="addColor($event)" @editColor="editColor($event)"/>
                    </div>
                </div>
            </div>
            <div id="paperCo">
                <h3>Papiery</h3>
                <va-divider />
                <div>
                    <div class="objects-card-wrapper">
                        <h6>Lista papierów:</h6>
                        <div class="objects-card">
                            <div v-for="paper in orderItemPapers" :key="paper.IdForPaperTable" class="card-items">
                                <div class="my-1">
                                    {{ paper.name }}
                                </div>
                                <div class="card-icons">
                                    <va-icon @click="editPaperInModal(paper)" color="#1b63b1" class="material-icons">edit</va-icon>
                                    <va-icon @click="removePaper(paper.IdForPaperTable)" color="#1b63b1" class="material-icons">delete</va-icon>
                                </div>
                            </div>
                        </div>
                        <va-button @click="showPaperModal=true" type="button" color="success" gradient>Dodaj papier</va-button>
                        <PaperModal v-if="showPaperModal" @close="showPaperModal=false" @createPaper="addPaper($event)" @editPaper="editPaper($event)"/>
                    </div>
                </div>
            </div>
            <div id="serviceCo">
                <h3>Usługi</h3>
                <va-divider />
                <div>
                    <div class="objects-card-wrapper">
                        <h6>Lista usług:</h6>
                        <div class="objects-card">
                            <div v-for="service in orderItemService" :key="service.IdForServiceTable" class="card-items">
                                <div class="my-1">
                                    {{ service.name }}
                                </div>
                                <div class="card-icons">
                                    <va-icon @click="editServiceInModal(service)" color="#1b63b1" class="material-icons">edit</va-icon>
                                    <va-icon @click="removeService(service.IdForServiceTable)" color="#1b63b1" class="material-icons">delete</va-icon>
                                </div>
                            </div>
                        </div>
                        <va-button @click="showServiceModal=true" type="button" color="success" gradient>Dodaj usługę</va-button>
                        <ServiceModal v-if="showServiceModal" @close="showServiceModal=false" @createService="addService($event)" @editService="editService($event)"/>
                    </div>
                </div>
            </div>
        </div>
    </va-modal>
</template>

<script>
import ColorModal from '@/components/ReuseComponents/Modals/ColorModal.vue';
import PaperModal from '@/components/ReuseComponents/Modals/PaperModal.vue';
import ServiceModal from '@/components/ReuseComponents/Modals/ServiceModal.vue';

export default {
  name: 'OrderItemModal',
  components: { ColorModal, PaperModal, ServiceModal },
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
            orderItemColors: [{name: "cos tam"}],
            showColorModal: false,
            colorCounter: 0,
            orderItemPapers: [],
            showPaperModal: false,
            paperCounter: 0,
            orderItemService: [],
            showServiceModal: false,
            serviceCounter: 0,

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
        },
        addColor(e) {
            e.newColor.IdForColorTable = this.colorCounter;
            this.orderItemColors.push(e.newColor);
            this.colorCounter++;
            this.showColorModal = false;
        },
        editColor(e) {
            for(const obj of this.orderItemColors){
                if (obj.IdForColorTable === e.newColor.IdForColorTable) {
                    obj.name = e.newColor.name;
                    break;
                }
            }

            this.showColorModal = false;
        },
        editColorInModal() {

        },
        removeColor() {

        },
        addPaper(e) {
            e.newPaper.IdForPaperTable = this.paperCounter;
            this.orderItemPapers.push(e.newPaper);
            this.paperCounter++;
            this.showPaperModal = false;
        },
        editPaper(e) {
            for(const obj of this.orderItemPapers){
                if (obj.IdForPaperTable === e.newPaper.IdForPaperTable) {
                    obj.name = e.newPaper.name;
                    break;
                }
            }

            this.showPaperModal = false;
        },
        editPaperInModal() {

        },
        removePaper() {

        },


        addService(e) {
            e.newService.IdForServiceTable = this.serviceCounter;
            this.orderItemService.push(e.newService);
            this.serviceCounter++;
            this.showServiceModal = false;
        },
        editService(e) {
            for(const obj of this.orderItemService){
                if (obj.IdForServiceTable === e.newService.IdForServiceTable) {
                    obj.name = e.newService.name;
                    break;
                }
            }

            this.showServiceModal = false;
        },
        editServiceInModal() {

        },
        removeService() {

        },
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
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    grid-area: main;
}

#background-modal {
    display: grid;
    grid-template-columns: 50px 2fr 1fr 1fr 50px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". main sidebarA sidebarC ."
    ". main sidebarB sidebarC ."
    ". . footer . .";
    grid-gap: 30px;
}

#colorCo{
    grid-area: sidebarA;
}

#paperCo{
    grid-area: sidebarB;
}

#serviceCo{
    grid-area: sidebarC;
}

.objects-card-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 20px;
	padding-bottom: 20px;
}

.objects-card {
	border-color: rgb(226, 226, 226);
	border-style: solid;
    border-radius: 10px;
	width: 250px;
	max-height: 300px;
	margin-bottom: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
    max-height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.card-items {
    background: #d3e5f8;
    padding-bottom: 10px;
    padding-top: 10px;
    margin: 5px;
    width: 240px;
    border-radius: 50px;
    border: solid 1px #1b63b1;
    display: grid;
    grid-template-columns: 1fr 80px;
    grid-template-rows: 1fr;
    justify-items: center;
}

.card-icons svg{
    margin-left: 5px;
    cursor: pointer;
}

.objects-card::-webkit-scrollbar {
    width: 0.25rem;
}

.objects-card::-webkit-scrollbar-thumb {
    background: #1b63b1;
    border-radius: 100vw;
}

.objects-card::-webkit-scrollbar-thumb:hover {
    background: #217cde;
}
</style>

