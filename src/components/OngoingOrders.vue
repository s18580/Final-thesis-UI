<template>
    <div id="background">
        <div id="headerCo">
            <h1>Zamówienia w trakcie realizacji</h1>
            <va-divider />
        </div>
        <div id="mainCo">
            <OrdersTable :columns="onGoingColumns" dataType="onGoing"/>
        </div>
    </div>
</template>

<script>
import OrdersTable from '@/components/ReuseComponents/OrdersTable.vue';

export default {
    name: 'OngoingOrders',
	data() {
		return {
			onGoingColumns: [
                { key: 'identifier', label: "Identyfikator", sortable: true },
                { key: 'name', label: "Nazwa", sortable: true },
                { key: 'expectedDeliveryDate', label: "Przewidywany termin", sortable: true },
                { key: 'orderItemsNames', label: "Przedmioty zamówienia" },
                { key: 'statusName', label: "Status" },
                { key: 'isAuction', label: "Przetarg" },
                { key: 'actions', label: "Akcje", width: 80 },
            ]
		}
	},
    components: { OrdersTable },
}
</script>

<style scoped>
#background {
    display: grid;
    grid-template-columns: 100px 1fr 100px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". header ."
    ". main .";
    grid-gap: 30px;
}

#mainCo {
    grid-area: main;
    margin-top: 20px;
	padding: 0px;
    padding-left: 20px;
    padding-right: 20px;
	background: white;
	border-radius: 25px;
}

#headerCo {
    grid-area: header;
    padding: 20px;
    background: white;
	border-radius: 25px;
}
</style>