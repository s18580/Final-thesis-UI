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
                    :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                    label="Nazwa"
                    placeholder="Nazwa przedmiotu zamówienia"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="insideFormat"
                    :rules="[(v) => v.length > 0 || `Pole format nie może być puste.`, (v) => v.length < 101 || `Pole format przekroczyło limit znaków.`]"
                    label="Format"
                    placeholder="Format przedmiotu zamówienia"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="coverFormat"
                    :rules="[(v) => v.length < 101 || `Pole format okładki przekroczyło limit znaków.`]"
                    label="Format okładki"
                    placeholder="Format okładki przedmiotu zamówienia"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="circulation"
                    :rules="[(v) => v >= 0 || `Nakład nie może być ujmeny.`]"
                    label="Nakład"
                />
                <va-input
                    class="some-space mb-4"
                    v-model="capacity"
                    :rules="[(v) => v >= 0 || `Objętość nie może być ujemna.`]"
                    label="Objętość"
                />
                <va-date-input
                    class="some-space mb-4"
                    v-model="expectedCompletionDate"
                    label="Pożądana data ukończenia"
                    placeholder="Pożądana data ukończenia"
                    clearable
                />
                <va-date-input
                    class="some-space mb-4"
                    v-model="completionDate"
                    label="Data ukończenia"
                    placeholder="Data ukończenia"
                    clearable
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
                    :rules="[(v) => v.length < 256 || `Pole notatka przekroczyło limit znaków.`]"
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
                        <va-list id="insideColorList">
                            <va-list-item
                                v-for="color in orderItemColors"
                                :key="color.IdForColorTable"
                            >

                                <va-list-item-section avatar>
                                    <va-avatar color="#6B5B95" icon="palette" />
                                </va-list-item-section>

                                <va-list-item-section>
                                    <va-list-item-label>
                                        {{ color.name }}
                                    </va-list-item-label>
                                </va-list-item-section>

                                <va-list-item-section icon>
                                    <va-popover message="Usuń kolor">
                                        <va-button flat icon="delete" @click="removeColor(color.IdForColorTable)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                        <va-button @click="showColorModal=true" type="button" color="success" gradient>Dodaj kolor</va-button>
                        <ColorModal v-if="showColorModal" :color="editedColor" @close="closeColorModal()" @createColor="addColor($event)"/>
                    </div>
                </div>
            </div>
            <div id="paperCo">
                <h3>Papiery</h3>
                <va-divider />
                <div>
                    <div class="objects-card-wrapper">
                        <h6>Lista papierów:</h6>
                        <va-list id="papersList">
                            <va-list-item
                                v-for="paper in orderItemPapers"
                                :key="paper.IdForPaperTable"
                            >
                                <va-list-item-section avatar>
                                    <va-avatar color="#6B5B95" icon="newspaper" />
                                </va-list-item-section>

                                <va-list-item-section>
                                    <va-list-item-label>
                                        {{ paper.name }}
                                    </va-list-item-label>
                                </va-list-item-section>

                                <va-list-item-section icon>
                                    <va-popover message="Edytuj papier">
                                        <va-button flat icon="edit" @click="editPaperInModal(paper)" />
                                    </va-popover>
                                    <va-popover message="Usuń papier">
                                        <va-button flat icon="delete" @click="removePaper(paper.IdForPaperTable)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                        <va-button @click="showPaperModal=true" type="button" color="success" gradient>Dodaj papier</va-button>
                        <PaperModal v-if="showPaperModal" :paper="editedPaper" @close="closePaperModal()" @createPaper="addPaper($event)" @editPaper="editPaper($event)"/>
                    </div>
                </div>
            </div>
            <div id="serviceCo">
                <h3>Usługi</h3>
                <va-divider />
                <div>
                    <div class="objects-card-wrapper">
                        <h6>Lista usług:</h6>
                        <va-list id="servicesList">
                            <va-list-item
                                v-for="service in orderItemService"
                                :key="service.IdForServiceTable"
                            >
                                <va-list-item-section avatar>
                                    <va-avatar color="#6B5B95" icon="receipt_long" />
                                </va-list-item-section>

                                <va-list-item-section>
                                    <va-list-item-label>
                                        {{ service.serviceName.name }}
                                    </va-list-item-label>
                                </va-list-item-section>

                                <va-list-item-section icon>
                                    <va-popover message="Edytuj pozycję">
                                        <va-button flat icon="edit" @click="editServiceInModal(service)" />
                                    </va-popover>
                                    <va-popover message="Usuń pozycję">
                                        <va-button flat icon="delete" @click="removeService(service.IdForServiceTable)" />
                                    </va-popover>
                                </va-list-item-section>
                            </va-list-item>
                        </va-list>
                        <va-button @click="showServiceModal=true" type="button" color="success" gradient>Dodaj usługę</va-button>
                        <ServiceModal v-if="showServiceModal" :service="editedService" @close="closeServiceModal()" @createService="addService($event)" @editService="editService($event)"/>
                    </div>
                </div>
            </div>
        </div>
    </va-modal>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
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
            orderItemId: null,
            orderItemColors: [],
            showColorModal: false,
            colorCounter: 0,
            editedColor: null,
            orderItemPapers: [],
            showPaperModal: false,
            paperCounter: 0,
            editedPaper: null,
            orderItemService: [],
            showServiceModal: false,
            serviceCounter: 0,
            editedService: null,
            buttonMessage: "",
            isOrderItemFormValidate: false,
            showOrderItemModal: true,
            IdForOrderItemTable: null,
            orderItemName: "",
            comments: "",
            insideFormat: "",
            coverFormat: "",
            completionDate: null,
            expectedCompletionDate: null,
            capacity: 0,
            circulation: 1,
            rawOrderItemTypes: [],
            selectedOrderItemType: "",
            rawDeliveryTypes: [],
            selectedDeliveryType: "",
            rawBindingTypes: [],
            selectedBindingTypes: "Bez szycia",
		}
	},
    computed: {
        orderItemTypes(){
            let resultArr = this.rawOrderItemTypes.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        deliveryTypes(){
            let resultArr = this.rawDeliveryTypes.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        bindingTypes(){
            let resultArr = this.rawBindingTypes.map(function(item) {
                return item["name"];
            });

            return ["Bez szycia"].concat(resultArr);
        },
    },
	methods: {
		submitForm() {
            if(this.validateForm()) {
                if(this.capacity == 0 || this.capacity == 1) this.capacity == null;

                let data = {
                    newOrderItem: {
                        idOrderItem: this.idOrderItem,
                        name: this.orderItemName,
                        comments: this.comments,
                        insideFormat: this.insideFormat,
                        coverFormat: this.coverFormat,
                        capacity: this.capacity,
                        circulation: this.circulation,
                        completionDate: this.completionDate,
                        expectedCompletionDate: this.expectedCompletionDate,
                        selectedOrderItemType: this.getIdByName("orderItemType", this.selectedOrderItemType),
                        selectedDeliveryType: this.getIdByName("deliveryType", this.selectedDeliveryType),
                        selectedBindingTypes: this.getIdByName("bindingType", this.selectedBindingTypes),
                        colors: this.orderItemColors,
                        papers: this.orderItemPapers,
                        services: this.orderItemService,
                    }
                };

                if(this.IdForOrderItemTable !== null) {
                    data.newOrderItem.IdForOrderItemTable = this.IdForOrderItemTable;
                    this.$emit('editOrderItem', data);
                } else {
                    this.$emit('createOrderItem', data);
                }
                this.closeOrderItemModal();
            }
		},
        getNameById(what, id){
            switch(what) {
                case "orderItemType":
                    return this.rawOrderItemTypes.find(element => element.idOrderItemType == id).name;
                case "deliveryType":
                    return this.rawDeliveryTypes.find(element => element.idDeliveryType == id).name;
                case "bindingType":
                    if(id  === null) {
                        return "Bez szycia";
                    } else {
                        return this.rawBindingTypes.find(element => element.idBindingType == id).name;
                    }
            }
        },
        getIdByName(what, objName){
            switch(what) {
                case "orderItemType":
                    return this.rawOrderItemTypes.find(element => element.name == objName).idOrderItemType;
                case "deliveryType":
                    return this.rawDeliveryTypes.find(element => element.name == objName).idDeliveryType;
                case "bindingType":
                    if(objName  === "Bez szycia") {
                        return null;
                    } else {
                        return this.rawBindingTypes.find(element => element.name == objName).idBindingType;
                    }
            }
        },
        validateForm() {
            this.$refs.modalOrderItemForm.validate();

            if(this.selectedOrderItemType === "") {
                this.isOrderItemFormValidate = false;
                this.$vaToast.init({ message: 'Wybierz typ przedmiotu zamówienia', color: 'danger', duration: 2000 })
            }

            if(this.selectedDeliveryType === "") {
                this.isOrderItemFormValidate = false;
                this.$vaToast.init({ message: 'Wybierz typ dostawy.', color: 'danger', duration: 2000 })
            }

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
        removeColor(id) {
            this.orderItemColors = this.orderItemColors.filter(item => item.IdForColorTable !== id);
        },
        closeColorModal() {
            this.showColorModal = false;
            this.editedColor = null;
        },
        addPaper(e) {
            let newPaper = {
                IdForPaperTable: this.paperCounter,
                idPaper: e.newPaper.IdPaper,
                name: e.newPaper.name,
                kind: e.newPaper.kind,
                sheetFormat: e.newPaper.sheetFormat,
                fiberDirection: e.newPaper.fiberDirection,
                opacity: e.newPaper.opacity,
                pricePerKilogram: e.newPaper.pricePerKilogram,
                quantity: e.newPaper.quantity
            };
            this.orderItemPapers.push(newPaper);
            this.paperCounter++;
        },
        editPaper(e) {
            for(const obj of this.orderItemPapers){
                if (obj.IdForPaperTable === e.newPaper.IdForPaperTable) {
                    obj.name = e.newPaper.name;
                    obj.kind = e.newPaper.kind;
                    obj.sheetFormat = e.newPaper.sheetFormat;
                    obj.fiberDirection = e.newPaper.fiberDirection;
                    obj.opacity = e.newPaper.opacity;
                    obj.pricePerKilogram = e.newPaper.pricePerKilogram;
                    obj.quantity = e.newPaper.quantity;
                    break;
                }
            }

            this.showPaperModal = false;
        },
        editPaperInModal(paper) {
            this.editedPaper = paper;
            this.showPaperModal = true;
        },
        removePaper(id) {
            this.orderItemPapers = this.orderItemPapers.filter(item => item.IdForPaperTable !== id);
        },
        closePaperModal() {
            this.showPaperModal = false;
            this.editedPaper = null;
        },
        addService(e) {
            let newService = {
                IdForServiceTable: this.serviceCounter,
                idServiceName: e.newService.idServiceName,
                serviceName: e.newService.serviceName,
                name: e.newService.name,
                price: e.newService.price,
            };
            this.orderItemService.push(newService);
            this.serviceCounter++;
        },
        editService(e) {
            for(const obj of this.orderItemService){
                if (obj.IdForServiceTable === e.newService.IdForServiceTable) {
                    obj.serviceName = e.newService.serviceName;
                    obj.price = e.newService.price;
                    obj.name = e.newService.name;
                    break;
                }
            }

            this.showServiceModal = false;
        },
        editServiceInModal(service) {
            this.editedService = service;
            this.showServiceModal = true;
        },
        removeService(id) {
            this.orderItemService = this.orderItemService.filter(item => item.IdForServiceTable !== id);
        },
        closeServiceModal() {
            this.showServiceModal=false;
            this.editedService = null;
        },
	},
    async mounted() {
        console.log(this.orderItem); 
        let callPath = "/BindingType/getBindingTypes";
        this.rawBindingTypes = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        callPath = "/DeliveryType/getDeliveryTypes";
        this.rawDeliveryTypes = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        callPath = "/OrderItemType/getOrderItemsTypes";
        this.rawOrderItemTypes = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        if(this.orderItem === null) {
            this.buttonMessage = "Dodaj przedmiot zamówienia";
            this.orderItemName = "";
            this.comments = "";
            this.insideFormat = "";
            this.coverFormat = "";
            this.capacity = 0;
            this.circulation = 1;
            this.completionDate = null;
            this.expectedCompletionDate = null;
            this.selectedOrderItemType = "";
            this.selectedDeliveryType = "";
            this.selectedBindingTypes = "Bez szycia";
            this.IdForOrderItemTable = null;
            this.orderItemColors = [];
            this.orderItemPapers = [];
            this.orderItemService = [];
            this.editedService = null;
            this.editedPaper = null;
            this.editedColor = null;
            this.orderItemId = null;
        }else {
            this.buttonMessage = "Edytuj przedmiot zamówienia";
            if(this.orderItem.idOrderItem != undefined && this.orderItem.idOrderItem != null) {
                this.orderItemId = this.orderItem.idOrderItem;
            }
            this.orderItemName = this.orderItem.name;
            this.comments = this.orderItem.comments;
            this.insideFormat = this.orderItem.insideFormat;
            this.coverFormat = this.orderItem.coverFormat;
            this.capacity = this.orderItem.capacity;
            this.circulation = this.orderItem.circulation;    
            this.selectedOrderItemType = this.getNameById("orderItemType", this.orderItem.idOrderItemType);
            this.selectedDeliveryType = this.getNameById("deliveryType", this.orderItem.idDeliveryType);
            this.selectedBindingTypes = this.getNameById("bindingType", this.orderItem.idBindingType);
            this.IdForOrderItemTable = this.orderItem.IdForOrderItemTable;
            this.orderItemColors = this.orderItem.colors;
            this.orderItemPapers = this.orderItem.papers;
            this.orderItemService = this.orderItem.services;
            this.editedService = null;
            this.editedPaper = null;
            this.editedColor = null;

            if(this.orderItem.completionDate != null) {
                this.completionDate = new Date(Date.parse(this.orderItem.completionDate));
            } else{
                this.completionDate = null;
            }
            if(this.orderItem.expectedCompletionDate != null) {
                this.expectedCompletionDate = new Date(Date.parse(this.orderItem.expectedCompletionDate));
            } else{
                this.expectedCompletionDate = null;
            }
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

