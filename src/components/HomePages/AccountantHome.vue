<template>
    <div id="background">
        <div id="closestOrderHeader" class="sectionHeader">
            <h1>Zamówienia z najbliższym terminem wykonania</h1>
            <va-divider />
        </div>
        <div id="closestOrderTable" class="mainCo">
            <OrdersTable :columns="closeColumns" dataType="closest"/>
        </div>
    </div>
</template>

<script>
import OrdersTable from '@/components/ReuseComponents/OrdersTable.vue'

export default {
    name: 'AccountantHome',
    data() {
		return {
            closeColumns: [
                { key: 'Identifier', label:"Identyfikator", sortable: true },
                { key: 'Name', label:"Nazwa", sortable: true },
                { key: 'CreationDate', label:"Data stworzenia", sortable: true },
                { key: 'OrderItemsNames', label:"Przedmioty zamówienia" },
                { key: 'StatusName', label:"Status" },
                { key: 'IsAuction', label:"Przetarg" },
                { key: 'actions', label:"Akcje", width: 80 },
            ],
		}
	},
    components: { OrdersTable }
}
</script>

<style scoped>
.mainCo {
	padding: 0px;
    margin-right: 100px;
    margin-left: 100px;
    padding-left: 20px;
    padding-right: 20px;
	background: white;
	border-radius: 25px;
}

#yoursOrderHeader {
    margin-right: 100px;
    margin-left: 100px;
    margin-top: 20px;
}

#closestOrderHeader {
    margin-right: 100px;
    margin-left: 100px;
    margin-top: 120px;
}
</style>