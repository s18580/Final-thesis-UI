<template>
    <div id="background">
        <div id="yoursOrderHeader" class="sectionHeader">
            <h1>Twoje zamówienia</h1>
            <va-divider />
        </div>
        <div id="yoursOrderTable" class="mainCo">
            <OrdersTable :columns="yourColumns" dataType="workers"/>
        </div>
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
    name: 'BasicHome',
    data() {
		return {
            yourColumns: [
                { key: 'identifier', label: "Identyfikator", sortable: true },
                { key: 'name', label: "Nazwa", sortable: true },
                { key: 'creationDate', label: "Data stworzenia", sortable: true },
                { key: 'orderItemsNames', label: "Przedmioty zamówienia" },
                { key: 'statusName', label: "Status" },
                { key: 'isAuction', label: "Przetarg" },
                { key: 'actions', label: "Akcje", width: 80 },
            ],
            closeColumns: [
                { key: 'expectedDeliveryDate', label: "Przewidywany termin", sortable: true },
                { key: 'identifier', label: "Identyfikator" },
                { key: 'name', label: "Nazwa" },
                { key: 'creationDate', label: "Data stworzenia" },
                { key: 'orderItemsNames', label: "Przedmioty zamówienia" },
                { key: 'statusName', label: "Status" },
                { key: 'isAuction', label: "Przetarg" },
                { key: 'actions', label: "Akcje", width: 80 },
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