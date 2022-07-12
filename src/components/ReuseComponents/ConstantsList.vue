<template>
    <div id="mainCo">
        <div id="buttonCo">
            <va-button color="primary">Dodaj stałą</va-button>
        </div>
        <div>
            <p v-if="myArray.length==0"> {{ resultMessage }} </p>
            <div v-else id="listCo">
                <p> {{ this.listLabel }} </p>
                <va-data-table :items="myArray" :columns="columns" striped :hoverable="true" :per-page="perPage" :current-page="currentPage" :no-data-filtered-html="resultMessage">
                    <template #cell(actions)="{ rowIndex }">
                        <va-button flat icon="edit" @click="openEditModal(rowIndex)" />
                        <va-button flat icon="delete" @click="openDeleteModal(rowIndex)" />
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
        <ConstantsEdit v-model="showEditModal" :constantValue="selectedConstant" @close="closeEditModal()" @editConstant="editConstant($event)" />
        <va-modal v-model="showDeleteModal"
            message="Czy napewno chcesz to usunąć ?"
            size="small"
            title="Usuń stałą"
            cancel-text="Anuluj"
            ok-text="Usuń"
            @cancel="closeDeleteModal()"
            @click-outside="closeDeleteModal()"
            @ok="deleteConstant()"
        />
    </div>
</template>

<script>
import ConstantsEdit from './Modals/ConstantsEdit.vue';

export default {
    name: 'ConstantsList',
    props: {
        listLabel: {
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
    components: { ConstantsEdit },
    data() {
        return {
            resultMessage: "Brak stałych",
            columns: [
                { key: 'Name', label:"Nazwa", sortable: true, tdAlign: 'center', thAlign: 'center' },
                { key: 'actions', label:"Akcje", width: 80 },
            ],
            myArray: [],
            perPage: 6,
            currentPage: 1,
            showDeleteModal: false,
            showEditModal: false,
            selectedConstant: {},
        }
    },
    computed: {
        pages() {
            let c = parseInt(this.myArray.length/6, 10);
            if(this.myArray.length%6 > 0) c+=1;
            return c;
        }
    },
    beforeUpdate() {
        this.myArray = this.constants;
    },
    methods: {
        openDeleteModal(s) {
            this.selectedConstant = this.myArray[s];
            this.showDeleteModal = true;
        },
        openEditModal(s) {
            this.selectedConstant = this.myArray[s];
            this.showEditModal = true;
        },
        closeDeleteModal() {
            this.showDeleteModal = false;
        },
        closeEditModal() {
            this.showEditModal = false;
        },
        deleteConstant() {
            this.closeDeleteModal();
            // call do API o usunięcie
            // update listy
        },
        editConstant(e) {
            this.closeEditModal();
            console.log(e);
            // call do API o edycję
            // update listy
        },
    }
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