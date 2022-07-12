<template>
    <div id="mainCo">
        <va-data-table :items="myArray" :columns="columns" striped hoverable :per-page="perPage" :current-page="currentPage" :no-data-filtered-html="resultMessage">
            <template #cell(actions)="{ rowIndex }">
                <va-button flat icon="visibility" @click="viewItemById(rowIndex)" />
                <va-button flat icon="edit" @click="editItemById(rowIndex)" />
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
export default {
    name: 'OrdersTable',
    props: {
        ordersOwner: {
            type: Object,
            required: false,
            default: null,
        },
    },
	data() {
		return {
            resultMessage: "Brak zamówień",
            columns: [
                { key: 'Identifier', label:"Identyfikator", sortable: true },
                { key: 'Name', label:"Nazwa", sortable: true },
                { key: 'CreationDate', label:"Data stworzenia", sortable: true },
                { key: 'OrderItemsNames', label:"Przedmioty zamówienia" },
                { key: 'StatusName', label:"Status" },
                { key: 'IsAuction', label:"Przetarg" },
                { key: 'actions', label:"Akcje", width: 80 },
            ],
            myArray: [],
			perPage: 20,
            currentPage: 1,
		}
	},
    computed: {
        pages() {
            let c = parseInt(this.myArray.length/6, 10);
            if(this.myArray.length%6 > 0) c+=1;
            return c;
        }
    },
    mounted() {
        //api call for data
        this.myArray = [];
    },
    methods: {
        viewItemById() {
            //open view
        },
        editItemById() {
            //open edit view
        }
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