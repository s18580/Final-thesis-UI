<template>
  <div id="mainCo">
      <h4>Wyszukaj osoby kontaktowej</h4>
      <div id="search-params">
        <div class="search-box">
            <div class="search-input-box">
                <label>Imie:</label>
                <input v-model="representativeName" class="form-control" type="text">
            </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Nazwisko:</label>
                <input v-model="representativeLastName" class="form-control" type="text">
            </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Telefon:</label>
                <input v-model="representativePhone" class="form-control" type="text">
            </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Email:</label>
                <input v-model="representativeEmail" class="form-control" type="text">
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Klient:</label>
                <select v-model="selectedCustomer" class="form-control">
                    <option v-for="customer in customers" :key="customer.Id">
                        {{ customer.name }}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Dostawca:</label>
                <select v-model="seledtedSupplier" class="form-control">
                    <option v-for="supplier in suppliers" :key="supplier.Id">
                        {{ supplier.name }}
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
  name: 'RepresentativeSearch',
	data() {
		return {
			representativeName: "",
            representativeLastName: "",
            representativePhone: "",
            representativeEmail: "",
            seledtedSupplier: "",
            rawSuppliers: [],
            selectedCustomer: "",
            rawCustomers: [],
            largeMode: false,
            showResults: false,
            results: [],
            resultMessage: "Brak wyników do wyświetlenia",
            columns: [
                { key: 'name', label:"Imię", sortable: true },
                { key: 'lastName', label:"Nazwisko", sortable: true },
                { key: 'phoneNumber', label:"Telefon", sortable: true },
                { key: 'emailAddress', label:"Email", sortable: true },
                { key: 'representativeName', label:"Klient/Dostawca" },
                { key: 'actions', label:"Akcje", width: 80 },
            ],
            perPage: 10,
            currentPage: 1,
		}
	},
    async mounted() {
        let callPath = "/Supplier/getSuppliers";
        this.rawSuppliers = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        callPath = "/Customer/getCustomers";
        this.rawCustomers = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
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
            
            let representativeName = null;
            let representativeLastName = null;
            let representativePhone = null;
            let representativeEmail = null;
            let seledtedSupplier = null;
            let selectedCustomer = null;
            if(this.representativeName !== "") {
                representativeName = this.representativeName;
            }
            if(this.representativeLastName !== "") {
                representativeLastName = this.representativeLastName;
            }
            if(this.representativePhone !== "") {
                representativePhone = this.representativePhone;
            }
            if(this.representativeEmail !== "") {
                representativeEmail = this.representativeEmail;
            }
            if(this.seledtedSupplier !== "") {
                seledtedSupplier = this.seledtedSupplier;
            }
            if(this.selectedCustomer !== "") {
                selectedCustomer = this.selectedCustomer;
            }

            let callPath = "/Representative/getSearchRepresentatives?name=" + representativeName + "&lastName=" + representativeLastName + "&email=" + representativeEmail + "&phone=" + representativePhone + "&customer=" + selectedCustomer + "&supplier=" + seledtedSupplier;
            this.results = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                this.resultMessage = "Brak wyników do wyświetlenia";
            });

            if(this.results == []) {
                this.resultMessage = "Brak wyników do wyświetlenia";
            }

            this.showResults = true;
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

.table-pagination {
    padding-top: 40px;
    text-align: center;
    text-align: -webkit-center;
}

</style>
