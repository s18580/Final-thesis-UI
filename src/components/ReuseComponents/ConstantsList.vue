<template>
    <div id="mainCo">
        <div id="buttonCo">
            <va-button color="primary">Dodaj stałą</va-button>
        </div>
        <div>
            <p v-if="myArray.length==0"> {{ resultMessage }} </p>
            <div v-else id="listCo">
                <p> {{ listLabel }} </p>
                <va-data-table :items="myArray" :columns="columns" striped :hoverable="true" :per-page="perPage" :current-page="currentPage" :no-data-filtered-html="resultMessage">
                    <template #cell(actions)="{ rowIndex }">
                        <va-button flat icon="edit" @click="openModalToEditItemById(rowIndex)" />
                        <va-button flat icon="delete" @click="deleteItemById(rowIndex)" />
                    </template>
                    <template #bodyAppend>
                    <tr><td colspan="3" class="table-pagination">
                        <va-pagination
                        v-model="currentPage"
                        input
                        :pages="pages"
                        />
                    </td></tr>
                </template>
                </va-data-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstantsList',
    props: {
        label: {
            type: String,
            required: true,
            default: "",
        },
        constants: {
            type: Array,
            required: true,
            default: null,
        }
    },
    data() {
        return {
            listLabel: "Typy plików",
            resultMessage: "Brak stałych",
            columns: [
                { key: 'Name', label:"Nazwa", sortable: true },
                { key: 'actions', label:"Akcje", width: 80 },
            ],
            myArray: [{Id: 1, Name: 'Graficzny'}, {Id: 2, Name: 'Pocztowy'}, {Id: 3, Name: 'Wymagania'}, {Id: 4, Name: 'Wzory'}, {Id: 5, Name: 'Wyniki'}, {Id: 6, Name: 'Umowa'},{Id: 1, Name: 'Graficzny'}],
            perPage: 6,
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
    // dodać modala z dodawaniem oraz obsługę danych z propsów
}
</script>

<style scoped>
#mainCo {
    padding: 0;
    margin-top: 20px;
    height: 300px;
}

#buttonCo {
    text-align: right;
}

#listCo {
    padding: 20px;
}

#listCo p {
    color: #217cde;
    font-style: oblique;
    font-weight: bold;
}

.table-pagination {
    padding-top: 40px;
    text-align: center;
    text-align: -webkit-center;
}
</style>