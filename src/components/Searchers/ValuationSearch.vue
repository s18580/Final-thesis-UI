<template>
  <div id="mainCo">
      <h4>Wyszukaj wycenę</h4>
      <div id="search-params">
        <va-input
            class="search-box"
            v-model="valuationName"
            label="Nazwa wyceny:"
            placeholder="Nazwa wyceny"
        />
        <va-select
            class="search-box"
            v-model="selectedAuthor"
            :options="authors"
            label="Autor:"
            noOptionsText="Brak osób do wybrania"
        />
        <va-date-input
            class="search-box"
            v-model="creationDate"
            label="Data stworzenia:"
            placeholder="Data stworzenia"
        />
        <va-input
            v-if="largeMode"
            class="search-box"
            v-model="valuationPaper"
            label="Papier:"
            placeholder="Papier"
        />
        <va-input
            v-if="largeMode"
            class="search-box"
            v-model="valuationColor"
            label="Kolorystyka:"
            placeholder="Kolorystyka"
        />
        <va-select
            v-if="largeMode"
            class="search-box"
            v-model="selectedService"
            :options="valuationServices"
            label="Nazwa usługi:"
            noOptionsText="Brak usług do wybrania"
        />
        <va-select
            v-if="largeMode"
            class="search-box"
            v-model="selectedBindingTypes"
            :options="valuationBindingTypes"
            label="Rodzaj szycia:"
            noOptionsText="Brak rodzaji do wybrania"
        />
        <va-select
            v-if="largeMode"
            class="search-box"
            v-model="selectedOrderItemType"
            :options="orderItemTypes"
            label="Typ przedmiotu zamówienia:"
            noOptionsText="Brak typów do wybrania"
        />
        <va-select
            v-if="largeMode"
            class="search-box"
            v-model="selectedOrder"
            :options="orders"
            label="Zamówienie:"
            noOptionsText="Brak zamówień do wybrania"
        />
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
                <tr><td colspan="12" class="table-pagination">
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
  name: 'ValuationSearch',
	data() {
		return {
            valuationName: "",
            creationDate: "",
            valuationColor: "",
            valuationPaper: "",
            selectedService: "",
            rawValuationServices: [],
            selectedBindingTypes: "",
            rawValuationBindingTypes: [],
            selectedOrder: "",
            rawOrders: [],
            selectedOrderItem: "",
            rawOrderItems: [],
            selectedAuthor: "",
            rawAuthors: [],
            selectedOrderItemType: "",
            rawOrderItemTypes: [],
            largeMode: false,
            showResults: false,
            results: [],
            resultMessage: "Brak wyników do wyświetlenia",
            columns: [
                { key: 'name', label:"Nazwa", sortable: true },
                { key: 'author', label:"Autor", sortable: true },
                { key: 'printPrice', label:"Cena" },
                { key: 'order', label:"Zamówienie" },
                { key: 'orderItemType', label:"Typ przedmiotu zamówienia" },
                { key: 'actions', label:"Akcje", width: 80 },
            ],
            perPage: 10,
            currentPage: 1,
		}
	},
    async mounted() {
        this.rawOrderItemTypes = await CallAPI.get(`OrderItemType/getOrderItemsTypes`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull supply items types: { err.message }", "Properties": { error: err }}]})
        });

        this.rawAuthors = await CallAPI.get(`Worker/getWorkers`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull supply items types: { err.message }", "Properties": { error: err }}]})
        });

        this.rawOrders = await CallAPI.get(`Order/getOrders`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull supply items types: { err.message }", "Properties": { error: err }}]})
        });

        this.rawValuationBindingTypes = await CallAPI.get(`BindingType/getBindingTypes`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull supply items types: { err.message }", "Properties": { error: err }}]})
        });

        this.rawValuationServices = await CallAPI.get(`ServiceName/getServiceNames`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull supply items types: { err.message }", "Properties": { error: err }}]})
        });
    },
    computed: {
        pages() {
            let c = parseInt(this.results.length/10, 10);
            if(this.results.length%10 > 0) c+=1;
            return c;
        },
        valuationServices() {
            let resultArr = this.rawValuationServices.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        valuationBindingTypes() {
            let resultArr = this.rawValuationBindingTypes.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        orders() {
            let resultArr = this.rawOrders.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        authors() {
            let resultArr = this.rawAuthors.map(function(item) {
                return item["name"] + " " + item["lastName"];
            });

            return resultArr;
        },
        orderItemTypes() {
            let resultArr = this.rawOrderItemTypes.map(function(item) {
                return item["name"];
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
            
            let valuationName = null;
            let creationDate = null;
            let valuationColor = null;
			let valuationPaper = null;
            let selectedService = null;
            let selectedBindingTypes = null;
            let selectedOrder = null;
            let selectedOrderItem = null;
            let selectedAuthor = null;
            let selectedOrderItemType = null;

            if(this.valuationName !== "") {
                valuationName = this.valuationName;
            }
            if(this.creationDate !== "") {
                creationDate = this.creationDate;
            }
            if(this.valuationColor !== "") {
                valuationColor = this.valuationColor;
            }
            if(this.valuationPaper !== "") {
                valuationPaper = this.valuationPaper;
            }
            if(this.selectedService !== "") {
                selectedService = this.selectedService;
            }
            if(this.selectedBindingTypes !== "") {
                selectedBindingTypes = this.selectedBindingTypes;
            }
            if(this.selectedOrder !== "") {
                selectedOrder = this.selectedOrder;
            }
            if(this.selectedOrderItem !== "") {
                selectedOrderItem = this.selectedOrderItem;
            }
            if(this.selectedAuthor !== "") {
                selectedAuthor = this.selectedAuthor;
            }
            if(this.selectedOrderItemType !== "") {
                selectedOrderItemType = this.selectedOrderItemType;
            }

            let callPath = "/Valuation/getSearchValuations?valuationName=" + valuationName + "&author=" + selectedAuthor + "&paper=" + valuationPaper + "&color=" + valuationColor + "&serviceName=" + selectedService + "&bindingType=" + selectedBindingTypes + "&orderName=" + selectedOrder + "&orderItemType=" + selectedOrderItemType + "&orderItem=" + selectedOrderItem + "&creationDate=" + creationDate;
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
            this.$router.push({ name: "ValuationDetails", params: { id: this.results[row].idValuation, mode: 'read' } });
        },
        editItemById(row) {
            this.$router.push({ name: "ValuationDetails", params: { id: this.results[row].idValuation, mode: 'edit' } });
        },
        async deleteItemById(row) {
            let callPath = "/Valuation/deleteValuation";
            let body = { data: { IdValuation: this.results[row].idValuation } };

            await CallAPI.delete(callPath, body)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
	},
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

#createDatePicker {
    cursor: pointer;
}

.table-pagination {
    padding-top: 40px;
    text-align: center;
    text-align: -webkit-center;
}

</style>
