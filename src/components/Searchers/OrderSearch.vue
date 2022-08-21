<template>
  <div id="mainCo">
      <h4>Wyszukaj zamówienie</h4>
      <div id="search-params">
        <div class="search-box">
            <div class="search-input-box">
                <label>Nazwa zamówienia:</label>
                <input v-model="orderName" class="form-control" type="text">
            </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Identyfikator:</label>
                <input v-model="identifier" class="form-control" type="text">
            </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Data dostawy:</label>
                <input @click="showThatPicker('deliveryDatePicker')" v-model="deliveryDate" class="form-control" type="date" id="deliveryDatePicker">
            </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Status zamówienia:</label>
                <select v-model="selectedStatus" class="form-control">
                    <option v-for="status in statuses" :key="status.Id">
                        {{ status.name }}
                    </option>
                </select>
            </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Przetarg:</label>
                <div>
                    <input v-model="isAuction" type="checkbox"> 
                </div> 
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Reprezentant klienta:</label>
                <select v-model="selectedCustomerRep" class="form-control">
                    <option v-for="repC in customerRep" :key="repC.Id">
                        {{ repC.name }}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Reprezentant dostawcy:</label>
                <select v-model="selectedSupplierRep" class="form-control">
                    <option v-for="repS in supplierRep" :key="repS.Id">
                        {{ repS.name }}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Przydzielony pracownik:</label>
                <select v-model="selectedWorker" class="form-control">
                    <option v-for="worker in workers" :key="worker.Id">
                        {{ worker.name }}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Typ przedmiotu zamówienia:</label>
                <select v-model="selectedOrderItemType" class="form-control">
                    <option v-for="type in orderItemTypes" :key="type.Id">
                        {{ type.name }}
                    </option>
                </select>
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
        }
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
