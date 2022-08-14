<template>
    <div id="mainCo">
        <va-data-table :items="myArray" :columns="columns" striped hoverable :per-page="perPage" :current-page="currentPage" :no-data-filtered-html="resultMessage">
            <template #cell(statusName)="{ rowIndex, value }"><va-chip size="small" :color="chipColor(rowIndex)">{{ value }}</va-chip></template>
            <template #cell(isAuction)="{ value }">
                <va-icon v-if="!value" color="success" class="material-icons">done</va-icon>
                <va-icon v-if="value" color="danger" class="material-icons">close</va-icon>
            </template>
            <template #cell(actions)="{ rowIndex }">
                <va-button flat icon="visibility" @click="viewItem(rowIndex, 'read')" />
                <va-button flat icon="edit" @click="viewItem(rowIndex, 'edit')" />
            </template>
            <template #bodyAppend>
                <tr><td colspan="8" class="table-pagination">
                    <va-pagination
                        v-model="currentPage"
                        input
                        :pages="pages"
                    />
                </td></tr>
            </template>
        </va-data-table>
    </div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import { useUserStore } from '@/stores/UserStore';

export default {
    name: 'OrdersTable',
    props: {
        columns: {
            type: Array,
            required: true,
            default: null,
        },
        dataType: {
            type: String,
            required: true,
            default: "workers",
        }
    },
	data() {
		return {
            resultMessage: "Brak zamówień",
            myArray: [],
			perPage: 20,
            currentPage: 1,
            editedItem: null,
            editedItemId: null,
		}
	},
    computed: {
        pages() {
            let c = parseInt(this.myArray.length/6, 10);
            if(this.myArray.length%6 > 0) c+=1;
            return c;
        },
    },
    async mounted() {
        switch(this.dataType) {
            case "workers":
                this.myArray = await this.getWorkersOrders();
            break;
            case "closest":
                this.myArray = await this.getClosestOrders(); 
            break;
            case "onGoing":
                this.myArray = await this.getOnGoingOrders(); 
            break;
        }
    },
    methods: {
        chipColor(row) {
            return this.myArray[row].statusColor;
        },
        viewItem(row, mode){
            let id = this.myArray[row].idOrder;
            switch(mode){
                case "read":
                    console.log(id);
                    // redirect to details page with read-only mode and properId
                break;
                case "edit":
                    // redirect to details page with edit mode and properId
                break;
            }
        },
        async getWorkersOrders() {
            const userStore = useUserStore();
            let callPath = `/Order/getOrdersByWorker?id=${userStore.userId}`;

            var orders = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            return orders;
        },
        async getClosestOrders() {
            let callPath = '/Order/getOrdersByDeliveryDate';

            var orders = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            return orders;
        },
        async getOnGoingOrders() {
            let callPath = '/Order/getOnGoingOrdersList';

            var orders = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            return orders;
        },
    },
}
</script>

<style scoped>
.table-pagination {
    padding-bottom: 20px;
    padding-top: 40px;
    text-align: center;
    text-align: -webkit-center;
}
</style>