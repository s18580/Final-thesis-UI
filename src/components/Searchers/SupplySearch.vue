<template>
  <div id="mainCo">
      <h4>Wyszukaj dostawę</h4>
      <div id="search-params">
        <va-date-input
            class="search-box"
            v-model="supplyDate"
            label="Data dostawy:"
            placeholder="Data dostawy"
        />
        <va-select
            class="search-box"
            v-model="selectedSupplyItemType"
            :options="supplyItemTypes"
            label="Typ przedmiotu dostawy:"
            noOptionsText="Brak typów do wybrania"
        />
        <va-select
            class="search-box"
            v-model="seledtedSupplier"
            :options="suppliers"
            label="Dostawca:"
            noOptionsText="Brak dostawców do wybrania"
        />
        <va-select
            class="search-box"
            v-model="selectedRepresentative"
            :options="representatives"
            label="Reprezentant:"
            noOptionsText="Brak osób do wybrania"
        />
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Dostawa odebrana:</label>
                <div>
                   <input v-model="supplyReceived" type="checkbox"> 
                </div>
            </div>
        </div>
      </div>
      <div id="show-more">
            <div @click="changeMode()" id="inner-show-more">
                Pokaż więcej filtrów
                <svg v-if="!largeMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
                <svg v-if="largeMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
                </svg>
            </div>
      </div>
      <va-button @click="searchForResults()" color="info" gradient>Szukaj</va-button>
	</div>
    <div v-if="showResults" id="resultCo">
      <div class="result-table">
          <p v-if="results.length==0"> {{ resultMessage }} </p>
          <va-data-table v-else :items="results" :columns="columns" striped hoverable :per-page="perPage" :current-page="currentPage" :no-data-filtered-html="resultMessage">
            <template #cell(actions)="{ rowIndex }">
                <va-button flat icon="visibility" @click="viewItemById(rowIndex)" />
                <va-button flat icon="edit" @click="editItemById(rowIndex)" />
                <va-button flat icon="delete" @click="deleteItemById(rowIndex)" />
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
	</div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';

export default {
  name: 'SupplySearch',
	data() {
		return {
			supplyDate: "",
            largeMode: false,
            showResults: false,
            selectedSupplyItemType: "",
            rawSupplyItemTypes: [],
            seledtedSupplier: "",
            rawSuppliers: [],
            selectedRepresentative: "",
            rawRepresentatives: [],
            supplyReceived: false,
            results: [],
            resultMessage: "Brak wyników do wyświetlenia",
            columns: [
                { key: 'supplyDate', label:"Data dostawy", sortable: true },
                { key: 'orderName', label:"Nazwa zamówienia", sortable: true },
                { key: 'supplyType', label:"Typ", sortable: true },
                { key: 'isReceived', label:"Odebrana" },
                { key: 'supplierName', label:"Dostawca" },
                { key: 'representativeName', label:"Reprezentant" },
                { key: 'actions', label:"Akcje", width: 80 },
            ],
            perPage: 10,
            currentPage: 1,
		}
	},
    computed: {
        pages() {
            let c = parseInt(this.results.length/10, 10);
            if(this.results.length%10 > 0) c+=1;
            return c;
        },
        supplyItemTypes() {
            let resultArr = this.rawSupplyItemTypes.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        suppliers() {
            let resultArr = this.rawSuppliers.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        representatives() {
            let resultArr = this.rawRepresentatives.map(function(item) {
                return item["name"] + " " + item["lastName"];
            });

            return resultArr;
        },
    },
	methods: {
        changeMode() {
            this.largeMode = !this.largeMode;
        },
        async searchForResults() {
            this.largeMode = false;

            let supplyDate = null;
            let selectedSupplyItemType = null;
            let seledtedSupplier = null;
            let selectedRepresentative = null;
            if(this.selectedRepresentative !== "") {
                selectedRepresentative = this.selectedRepresentative;
            }
            if(this.selectedSupplyItemType !== "") {
                selectedSupplyItemType = this.selectedSupplyItemType;
            }
            if(this.seledtedSupplier !== "") {
                seledtedSupplier = this.seledtedSupplier;
            }
            if(this.supplyDate !== "") {
                supplyDate = this.supplyDate;
            }

            let callPath = "/Supply/getSearchSupplies?supplyItemTypeName=" + selectedSupplyItemType + "&representativeName=" + selectedRepresentative + "&supplierName=" + seledtedSupplier + "&isReceived=" + this.supplyReceived + "&supplyDate=" + supplyDate;
            this.results = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull supply items types: { err.message }", "Properties": { error: err }}]})
            });

            if(this.results == []) {
                this.resultMessage = "Brak wyników do wyświetlenia";
            }

            this.showResults = true;
        },
        showThatPicker(id) {
            const dateInput = document.getElementById(id);
            try {
                dateInput.showPicker();
            } catch (error) {
                //do nothing
            }
        },
        viewItemById(row) {
            this.$router.push({ name: "SupplyDetails", params: { id: this.results[row].idSupply, mode: 'read' } });
        },
        editItemById(row) {
            this.$router.push({ name: "SupplyDetails", params: { id: this.results[row].idSupply, mode: 'edit' } });
        },
        async deleteItemById(row) {
            let callPath = "/Supply/deleteSupply";
            let body = { data: { IdSupply: this.results[row].idSupply } };

            await CallAPI.delete(callPath, body)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.searchForResults();
        },
	},
    async mounted() {
        let dictionaryData = [
            CallAPI.get(`SupplyItemType/getSupplyItemsTypes`)
            .then(res => {
                this.rawSupplyItemTypes = res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull supply items types: { err.message }", "Properties": { error: err }}]})
            }),
            
            CallAPI.get(`Supplier/getSuppliers`)
            .then(res => {
                this.rawSuppliers = res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull suppliers: { err.message }", "Properties": { error: err }}]})
            }),
            
            CallAPI.get(`Representative/getRepresentatives`)
            .then(res => {
                this.rawRepresentatives = res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull representatives: { err.message }", "Properties": { error: err }}]})
            })
        ]
        
        Promise.all(dictionaryData);
    }
}
</script>

<style scoped>
#mainCo,
#resultCo {
	margin-right: 100px;
	margin-left: 100px;
	padding: 40px;
	background: white;
	border-radius: 25px;
}

#mainCo {
    margin-bottom: 100px;
    padding-bottom: 10px;
}

#search-params {
    display: flex;
    flex-wrap: wrap;
    align-content: stretch;
}

.search-box {
    flex-grow: 4;
	padding: 20px;
}

.search-input-box input,
.search-input-box select {
	text-align: center;
    margin-top: 10px;
	margin-bottom: 10px;
    border-radius: 100vw;
    min-width: 250px;
    background: #f4f8fa;
}

.search-input-box select {
    -webkit-appearance: none;
    -moz-appearance: none;
    background-position-x: 100%;
    background-position-y: 5px;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
}

select option {
  background: #f4f8fa;
  color: #2C82E0;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
}

.search-input-box label {
	color: #2C82E0;
}

#show-more {
    color: #2C82E0;
    position: relative;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

#inner-show-more {
    cursor: pointer;
    max-width: 170px;
}

#deliveryDatePicker {
    cursor: pointer;
}

.table-pagination {
    padding-top: 40px;
    text-align: center;
    text-align: -webkit-center;
}

</style>
