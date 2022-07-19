<template>
    <div id="background">
        <div id="headerCo">
            <h1>Stałe programowe</h1>
            <va-divider />
        </div>
        <va-sidebar id="menuCo" color="primary" text-color="background" gradient minimizedWidth="64px" width="18rem">
            <va-sidebar-item/>
            <va-sidebar-item 
                class="clicableItem"
                v-for="item in dictionaryData"
                @click="activeSwitch($event)"
                :key="item.title"
                active-color="#217cde"
                text-color="#ffffff"
                :active="item.active"
            >
                <va-sidebar-item-content>
                    <va-icon name="fiber_manual_record" />
                    <va-sidebar-item-title>
                        {{ item.title }}
                    </va-sidebar-item-title>
                </va-sidebar-item-content>
            </va-sidebar-item>
            <va-sidebar-item/>
        </va-sidebar>
        <div id="mainCo">
            <ConstantsList
                :listLabel="constantTitle"
                :constants="constantData"
                :constantType="activeConstant"
                @deleteConstant="deleteElement($event)"
                @editConstant="editElement($event)"
                @addConstant="addElement($event)"
            />
        </div>
    </div>
</template>

<script>
import CallAPI from '../axios/axios-connection.js';
import CallSeq from '../logging/seq-logger.js';
import ConstantsList from './ReuseComponents/ConstantsList.vue';

export default {
    name: 'ProgramConstants',
	data() {
		return {
			dictionaryData: [
                { title: 'Status pliku' },
                { title: 'Typ pliku', active: true },
                { title: 'Typ wiązania' },
                { title: 'Sposób dostawy' },
                { title: 'Status zamówienia' },
                { title: 'Stanowisko pracy' },
                { title: 'Typ przedmiotu dostawy' },
                { title: 'Typ przedmiotu zamówienia' },
                { title: 'Usługa' },
                { title: 'Cennik' },
            ],
            constantTitle: "",
            constantData: [],
            activeConstant: "",
		}
	},
    components: { ConstantsList },
    async mounted() {
        this.constantData = await this.callApiForData('/FileType/getFileTypes');
        this.constantTitle = "Typy plików";
        this.activeConstant = "Typ pliku";
    },
	methods: {
        async activeSwitch(e) {
            let clickedItem = e.path.find(element => element.className.includes("clicableItem"));

            if(!clickedItem.className.includes("active")) {
                let title = clickedItem.textContent.replace("fiber_manual_record","");
                this.changeActiveData(title);
                await this.showSelectedTable(title);
            }
        },
        changeActiveData(selectedTitle) {
            for(var i = 0; i < this.dictionaryData.length; i++) {
                delete this.dictionaryData[i].active;
            }

            let selectedItemIndex = this.dictionaryData.findIndex(element => element.title == selectedTitle);
            this.dictionaryData[selectedItemIndex].active = true;
        },
        async callApiForData(callPath) {
            return await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
        async callApiForAction(callPath, action, body) {
            switch(action) {
                case 'add':
                    return await CallAPI.post(callPath, body)
                    .then(res => {
                        return res.data;
                    })
                    .catch(err => {
                        CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                    });
                case 'edit':
                    return await CallAPI.post(callPath, body)
                    .then(res => {
                        return res.data;
                    })
                    .catch(err => {
                        CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                    });
                case 'delete':
                    return await CallAPI.delete(callPath, { data: body })
                    .then(res => {
                        return res.data;
                    })
                    .catch(err => {
                        CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                    });
            }
        },
        async updateList() {
            await this.showSelectedTable(this.activeConstant);
        },
        async showSelectedTable(selectedTitle) {
            switch(selectedTitle) {
                case 'Status pliku':
                    this.constantData = await this.callApiForData('/FileStatus/getFileStatuses');
                    this.constantTitle = "Statusy plików";
                    this.activeConstant = "Status pliku";
                    break;
                case 'Typ pliku':
                    this.constantData = await this.callApiForData('/FileType/getFileTypes');
                    this.constantTitle = "Typy plików";
                    this.activeConstant = "Typ pliku";
                    break;
                case 'Typ wiązania':
                    this.constantData = await this.callApiForData('/BindingType/getBindingTypes');
                    this.constantTitle = "Typy wiązań";
                    this.activeConstant = "Typ wiązania";
                    break;
                case 'Sposób dostawy':
                    this.constantData = await this.callApiForData('/DeliveryType/getDeliveryTypes');
                    this.constantTitle = "Sposoby dostawy";
                    this.activeConstant = "Sposób dostawy";
                    break;
                case 'Status zamówienia':
                    this.constantData = await this.callApiForData('/OrderStatus/getOrderStatuses');
                    this.constantTitle = "Statusy zamówienia";
                    this.activeConstant = "Status zamówienia";
                    break;
                case 'Stanowisko pracy':
                    this.constantData = await this.callApiForData('/Worksite/getWorksites');
                    this.constantTitle = "Stanowiska pracy";
                    this.activeConstant = "Stanowisko pracy";
                    break;
                case 'Typ przedmiotu dostawy':
                    this.constantData = await this.callApiForData('/SupplyItemType/getSupplyItemsTypes');
                    this.constantTitle = "Typy przedmiotów dostawy";
                    this.activeConstant = "Typ przedmiotu dostawy";
                    break;
                case 'Typ przedmiotu zamówienia':
                    this.constantData = await this.callApiForData('/OrderItemType/getOrderItemsTypes');
                    this.constantTitle = "Typy przedmiotów zamówienia";
                    this.activeConstant = "Typ przedmiotu zamówienia";
                    break;
                case 'Usługa':
                    this.constantData = await this.callApiForData('/ServiceName/getServiceNames');
                    this.constantTitle = "Usługi";
                    this.activeConstant = "Usługa";
                    break;
                case 'Cennik':
                    this.constantData = await this.callApiForData('/PriceList/getPriceLists');
                    this.constantTitle = "Pozycje w cenniku";
                    this.activeConstant = "Cennik";
                    break;
                default:
                    // do nothing
                break;
            }
        },
        async deleteElement(e) {
            switch(this.activeConstant) {
                case 'Status pliku':
                    await this.callApiForAction('/FileStatus/deleteFileStatus', 'delete', { idFileStatus: e.Constant.idFileStatus });
                    break;
                case 'Typ pliku':
                    await this.callApiForAction('/FileType/deleteFileType', 'delete', { idFileType: e.Constant.idFileType });
                    break;
                case 'Typ wiązania':
                    await this.callApiForAction('/BindingType/deleteBindingType', 'delete', { idBindingType: e.Constant.idBindingType });
                    break;
                case 'Sposób dostawy':
                    await this.callApiForAction('/DeliveryType/deleteDeliveryType', 'delete', { idDeliveryType: e.Constant.idDeliveryType });
                    break;
                case 'Status zamówienia':
                    await this.callApiForAction('/OrderStatus/deleteOrderStatus', 'delete', { idOrderStatus: e.Constant.idStatus });
                    break;
                case 'Stanowisko pracy':
                    await this.callApiForAction('/Worksite/deleteWorksite', 'delete', { idWorksite: e.Constant.idWorksite });
                    break;
                case 'Typ przedmiotu dostawy':
                    await this.callApiForAction('/SupplyItemType/deleteSupplyItemsType', 'delete', { idSupplyItemType: e.Constant.idSupplyItemType });
                    break;
                case 'Typ przedmiotu zamówienia':
                    await this.callApiForAction('/OrderItemType/deleteOrderItemsType', 'delete', { idOrderItemType: e.Constant.idOrderItemType });
                    break;
                case 'Usługa':
                    await this.callApiForAction('/ServiceName/deleteServiceName', 'delete', { idServiceName: e.Constant.idServiceName });
                    break;
                case 'Cennik':
                    await this.callApiForAction('/PriceList/deletePriceList', 'delete', { idPriceList: e.Constant.idPriceList });
                    break;
                default:
                    // do nothing
                break;
            }

            this.updateList();
        },
        async editElement(e) {
            switch(this.activeConstant) {
                case 'Status pliku':
                    await this.callApiForAction('/FileStatus/updateFileStatus', 'edit', { idFileStatus: e.Constant.idFileStatus, name: e.NewValues.Name });
                    break;
                case 'Typ pliku':
                    await this.callApiForAction('/FileType/updateFileType', 'edit', { idFileType: e.Constant.idFileType, name: e.NewValues.Name });
                    break;
                case 'Typ wiązania':
                    await this.callApiForAction('/BindingType/updateBindingType', 'edit', { idBindingType: e.Constant.idBindingType, name: e.NewValues.Name });
                    break;
                case 'Sposób dostawy':
                    await this.callApiForAction('/DeliveryType/updateDeliveryType', 'edit', { idDeliveryType: e.Constant.idDeliveryType, name: e.NewValues.Name });
                    break;
                case 'Status zamówienia':
                    await this.callApiForAction('/OrderStatus/updateOrderStatus', 'edit', { idOrderStatus: e.Constant.idStatus, name: e.NewValues.Name });
                    break;
                case 'Stanowisko pracy':
                    await this.callApiForAction('/Worksite/updateWorksite', 'edit', { idWorksite: e.Constant.idWorksite, name: e.NewValues.NewValues.Name });
                    break;
                case 'Typ przedmiotu dostawy':
                    await this.callApiForAction('/SupplyItemType/updateSupplyItemsType', 'edit', { idSupplyItemType: e.Constant.idSupplyItemType, name: e.NewValues.Name });
                    break;
                case 'Typ przedmiotu zamówienia':
                    await this.callApiForAction('/OrderItemType/updateOrderItemsType', 'edit', { idOrderItemType: e.Constant.idOrderItemType, name: e.NewValues.Name });
                    break;
                case 'Usługa':
                    await this.callApiForAction('/ServiceName/updateServiceName', 'edit', { idServiceName: e.Constant.idServiceName, name: e.NewValues.Name, defaultPrice: e.NewValues.DefaultPrice, minimumPrice: e.NewValues.MinPrice, minimumCirculation: e.NewValues.MinCirculation });
                    break;
                case 'Cennik':
                    await this.callApiForAction('/PriceList/updatePriceList', 'edit', { idPriceList: e.Constant.idPriceList, name: e.NewValues.Name, price: e.NewValues.Price });
                    break;
                default:
                    // do nothing
                break;
            }

            this.updateList();
        },
        async addElement(e) {
            switch(this.activeConstant) {
                case 'Status pliku':
                    await this.callApiForAction('/FileStatus/createFileStatus', 'add', { name: e.Name });
                    break;
                case 'Typ pliku':
                    await this.callApiForAction('/FileType/createFileType', 'add', { name: e.Name });
                    break;
                case 'Typ wiązania':
                    await this.callApiForAction('/BindingType/createBindingType', 'add', { name: e.Name });
                    break;
                case 'Sposób dostawy':
                    await this.callApiForAction('/DeliveryType/createDeliveryType', 'add', { name: e.Name });
                    break;
                case 'Status zamówienia':
                    await this.callApiForAction('/OrderStatus/createOrderStatus', 'add', { name: e.Name });
                    break;
                case 'Stanowisko pracy':
                    await this.callApiForAction('/Worksite/createWorksite', 'add', { name: e.Name });
                    break;
                case 'Typ przedmiotu dostawy':
                    await this.callApiForAction('/SupplyItemType/createSupplyItemsType', 'add', { name: e.Name });
                    break;
                case 'Typ przedmiotu zamówienia':
                    await this.callApiForAction('/OrderItemType/createOrderItemsType', 'add', { name: e.Name });
                    break;
                case 'Usługa':
                    await this.callApiForAction('/ServiceName/createServiceName', 'add', { name: e.Name, defaultPrice: e.DefaultPrice, minimumPrice: e.MinPrice, minimumCirculation: e.MinCirculation });
                    break;
                case 'Cennik':
                    await this.callApiForAction('/PriceList/createPriceList', 'add', { name: e.Name, price: e.Price });
                    break;
                default:
                    // do nothing
                break;
            }

            this.updateList();
        },
	},
}
</script>

<style scoped>
#background {
    display: grid;
    grid-template-columns: 100px 1fr 1fr 1fr 1fr 100px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". header header header header ."
    ". sidebar main main main ."
    ". . main main main .";
    grid-gap: 30px;
}

#mainCo {
    grid-area: main;
	padding: 0px;
    padding-left: 20px;
    padding-right: 20px;
	background: white;
	border-radius: 25px;
}

#menuCo {
    grid-area: sidebar;
    padding-top: 5px;
    background: white;
	border-radius: 25px;
    height: 605px;
}

#headerCo {
    padding: 20px;
    grid-area: header;
    background: white;
	border-radius: 25px;
}

</style>