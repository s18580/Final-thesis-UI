<template>
  <div id="mainCo">
      <h4>Wyszukaj zamówienie</h4>
      <div id="search-params">
        <va-input
            class="search-box"
            v-model="orderName"
            label="Nazwa zamówienia:"
            placeholder="Nazwa zamówienia"
        />
        <va-input
            class="search-box"
            v-model="identifier"
            label="Identyfikator:"
            placeholder="Nazwa zamówienia"
        />
        <va-date-input
            class="search-box"
            v-model="deliveryDate"
            label="Przewidywana data dostawy:"
            placeholder="Przewidywana data dostawy"
        />
        <va-select
            class="search-box"
            v-model="selectedStatus"
            :options="statuses"
            label="Status zamówienia:"
            noOptionsText="Brak statusów do wybrania"
        />
        <va-select
            class="search-box"
            v-if="largeMode"
            v-model="selectedCustomerRep"
            :options="customerRep"
            label="Reprezentant klienta:"
            noOptionsText="Brak osób do wybrania"
        />
        <va-select
            class="search-box"
            v-if="largeMode"
            v-model="selectedSupplierRep"
            :options="supplierRep"
            label="Reprezentant dostawcy:"
            noOptionsText="Brak osób do wybrania"
        />
        <div class="search-box">
            <div class="search-input-box">
                <label>Przetarg:</label>
                <div>
                    <input v-model="isAuction" type="checkbox"> 
                </div> 
            </div>
        </div>
        <va-select
            class="search-box"
            v-if="largeMode"
            v-model="selectedWorker"
            :options="workers"
            label="Przydzielony pracownik:"
            noOptionsText="Brak osób do wybrania"
        />
        <va-select
            class="search-box"
            v-if="largeMode"
            v-model="selectedOrderItemType"
            :options="orderItemTypes"
            label="Typ przedmiotu zamówienia:"
            noOptionsText="Brak typów do wybrania"
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
            <template #cell(isAuction)="{ is }">
                <div id="isAuctionCo">
                    <va-icon v-if="is" color="success" class="material-icons">done</va-icon>
                    <va-icon v-if="!is" color="danger" class="material-icons">close</va-icon>
                </div> 
            </template>
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
  name: 'OrderSearch',
	data() {
		return {
            orderName: "",
            identifier: "",
            deliveryDate: "",
            isAuction: false,
            selectedStatus: "",
            rawStatuses: [],
            selectedOrderItemType: "",
            rawOrderItemTypes: [],
            selectedCustomerRep: "",
            rawCustomerRep: [],
            selectedSupplierRep: "",
            rawSupplierRep: [],
            selectedWorker: "",
            rawWorkers: [],
            largeMode: false,
            showResults: false,
            results: [],
            resultMessage: "Brak wyników do wyświetlenia",
            columns: [
                { key: 'name', label:"Nazwa", sortable: true },
                { key: 'identifier', label:"identyfikator", sortable: true },
                { key: 'deliveryDate', label:"Przewidywana data dostawy", sortable: true },
                { key: 'orderStatus', label:"Status zamówienia", sortable: true },
                { key: 'representativeName', label:"Reprezentant klienta" },
                { key: 'workers', label:"Przydzieleni pracownicy" },
                { key: 'orderItemTypes', label:"Typ przedmiotu zamówienia" },
                { key: 'isAuction', label:"Przetarg" },
                { key: 'actions', label:"Akcje", width: 80 },
            ],
            perPage: 10,
            currentPage: 1,
		}
	},
    async mounted() {
        let callPath = "/OrderItemType/getOrderItemsTypes";
        this.rawOrderItemTypes = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull supply items types: { err.message }", "Properties": { error: err }}]})
        });

        callPath = "/Worker/getWorkers";
        this.rawWorkers = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull supply items types: { err.message }", "Properties": { error: err }}]})
        });

        callPath = "/OrderStatus/getOrderStatuses";
        this.rawStatuses = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull supply items types: { err.message }", "Properties": { error: err }}]})
        });

        callPath = "/Representative/getCustomerRepresentatives";
        this.rawSupplierRep = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull supply items types: { err.message }", "Properties": { error: err }}]})
        });

        callPath = "/Representative/getSupplierRepresentatives";
        this.rawCustomerRep = await CallAPI.get(callPath)
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
        statuses() {
            let resultArr = this.rawStatuses.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        customerRep() {
            let resultArr = this.rawCustomerRep.map(function(item) {
                return item["name"] + " " + item["lastName"];
            });

            return resultArr;
        },
        supplierRep() {
            let resultArr = this.rawSupplierRep.map(function(item) {
                return item["name"] + " " + item["lastName"];
            });

            return resultArr;
        },
        workers() {
            let resultArr = this.rawWorkers.map(function(item) {
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

            let orderName = null;
            let identifier = null;
            let deliveryDate = null;
			let selectedStatus = null;
            let selectedOrderItemType = null;
            let selectedCustomerRep = null;
            let selectedSupplierRep = null;
            let selectedWorker = null;

            if(this.orderName !== "") {
                orderName = this.orderName;
            }
            if(this.identifier !== "") {
                identifier = this.identifier;
            }
            if(this.deliveryDate !== "") {
                deliveryDate = this.deliveryDate;
            }
            if(this.selectedStatus !== "") {
                selectedStatus = this.selectedStatus;
            }
            if(this.selectedOrderItemType !== "") {
                selectedOrderItemType = this.selectedOrderItemType;
            }
            if(this.selectedCustomerRep !== "") {
                selectedCustomerRep = this.selectedCustomerRep;
            }
            if(this.selectedSupplierRep !== "") {
                selectedSupplierRep = this.selectedSupplierRep;
            }
            if(this.selectedWorker !== "") {
                selectedWorker = this.selectedWorker;
            }

            let callPath = "/Order/getSearchOrders?isAuction=" + this.isAuction + "&name=" + orderName + "&identifier=" + identifier + "&expectedDeliveryDate=" + deliveryDate + "&status=" + selectedStatus + "&customerRepresentativeName=" + selectedCustomerRep + "&supplierRepresentativeName=" + selectedSupplierRep + "&workerName=" + selectedWorker + "&orderItemType=" + selectedOrderItemType;
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
        }
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

#createDatePicker,
#deliveryDatePicker {
    cursor: pointer;
}

.table-pagination {
    padding-top: 40px;
    text-align: center;
    text-align: -webkit-center;
}
</style>
