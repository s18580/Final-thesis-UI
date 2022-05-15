<template>
  <div id="mainCo">
      <h4>Wyszukaj dostawę</h4>
      <div id="search-params">
        <div class="search-box">
                <div class="search-input-box">
                    <label>Data dostawy:</label>
                    <input v-model="supplyDate" class="form-control" type="text">
                </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Typ przedmiotu dostawy:</label>
                <select v-model="selectedSupplyItemType" class="form-control">
                    <option v-for="itemType in supplyItemTypes" :key="itemType.Id">
                        {{ itemType.name }}
                    </option>
                </select>
            </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Dostawca:</label>
                <select v-model="seledtedSupplier" class="form-control">
                    <option v-for="supplier in suppliers" :key="supplier.Id">
                        {{ supplier.name }}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Reprezentant:</label>
                <select v-model="selectedRepresentative" class="form-control">
                    <option v-for="representative in representatives" :key="representative.Id">
                        {{ representative.name }}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Dostawa odebrana:</label>
                <div>
                   <input type="checkbox"> 
                </div>
            </div>
        </div>
      </div>
      <div @click="changeMode()" id="show-more">
            Pokaż więcej filtrów
            <svg v-if="!largeMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
            </svg>
            <svg v-if="largeMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
            </svg>
      </div>
      <va-button @click="searchForResults()" color="info" gradient>Szukaj</va-button>
	</div>
    <div v-if="showResults" id="resultCo">
      <div class="result-table">
            <va-data-table
                v-if="areResultsLoaded()"
                :items="results"
                :columns="tableResultColumns"
            />
          <p v-if="!areResultsLoaded()"> {{ resultMessage }} </p>
      </div>
	</div>
</template>

<script>
import CallAPI from '../../axios/axios-connection.js';
import CallSeq from '../../logging/seq-logger.js';

export default {
  name: 'SupplySearch',
	data() {
		return {
			supplyDate: "",
            largeMode: false,
            showResults: false,
            selectedSupplyItemType: null,
            supplyItemTypes: [],
            seledtedSupplier: null,
            suppliers: [],
            selectedRepresentative: null,
            representatives: [],
            supplyReceived: false,
            results: [],
            resultsColumns: [
                {key: 'SupplyDate', label: 'Data dostawy', sortable: true},
                {key: 'OrderItem.Name', label: 'Nazwa zamówienia', sortable: true},
                {key: 'ItemDescription', label: 'Opis', sortable: true},
                {key: 'IsReceived', label: 'Odebrana', sortable: true},
                {key: 'SupplyItemType.Name', label: 'Typ', sortable: true},
            ],
            resultMessage: "Brak wyników do wyświetlenia"
		}
	},
	methods: {
        changeMode() {
            this.largeMode = !this.largeMode;
        },
        areResultsLoaded() {
            return this.results.length > 0;
        },
        async searchForResults() {
            this.largeMode = false;

            //API call
            //set result message or show table
            this.showResults = true;
            this.resultMessage = "Brak wyników do wyświetlenia";
        }
	},
    async created() {
        let dictionaryData = [
            CallAPI.get(`SupplyItemType/getSupplyItemsTypes`)
            .then(res => {
                this.supplyItemTypes = res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull supply items types: { err.message }", "Properties": { error: err }}]})
            }),
            
            CallAPI.get(`Supplier/getSuppliers`)
            .then(res => {
                this.suppliers = res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": "Failed to pull suppliers: { err.message }", "Properties": { error: err }}]})
            }),
            
            CallAPI.get(`Representative/getRepresentatives`)
            .then(res => {
                this.representatives = res.data;
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
    cursor: pointer;
    position: relative;
    text-align: right;
}

</style>
