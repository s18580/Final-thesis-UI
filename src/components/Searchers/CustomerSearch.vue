<template>
  <div id="mainCo">
      <h4>Wyszukaj klienta</h4>
      <div id="search-params">
        <va-input
            class="search-box"
            v-model="companyName"
            label="Nazwa firmy:"
            placeholder="Nazwa firmy"
        />
        <va-input
            class="search-box"
            v-model="companyPhone"
            label="Telefon firmy:"
            placeholder="Telefon firmy"
        />
        <va-input
            class="search-box"
            v-model="companyEmail"
            label="Email firmy:"
            placeholder="Email firmy"
        />
        <va-input
            class="search-box"
            v-model="nip"
            label="NIP:"
            placeholder="NIP"
        />
        <va-input
            class="search-box"
            v-model="regon"
            label="REGON:"
            placeholder="REGON"
        />
        <va-input
            v-if="largeMode"
            class="search-box"
            v-model="repName"
            label="Imie reprezentanta:"
            placeholder="Imię"
        />
        <va-input
            v-if="largeMode"
            class="search-box"
            v-model="repLastName"
            label="Nazwisko reprezentanta:"
            placeholder="Nazwisko"
        />
        <va-input
            v-if="largeMode"
            class="search-box"
            v-model="repPhone"
            label="Telefon reprezentanta:"
            placeholder="Telefon"
        />
        <va-input
            v-if="largeMode"
            class="search-box"
            v-model="repEmail"
            label="Email reprezentanta:"
            placeholder="Email"
        />
        <va-select
            v-if="largeMode"
            class="search-box"
            v-model="selectedWorker"
            :options="workers"
            label="Pracownik prowadzący:"
            noOptionsText="Brak pracowników"
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
      <va-button id="search" @click="searchForResults()" color="info" gradient>Szukaj</va-button>
	</div>
    <div v-if="showResults" id="resultCo">
      <div class="result-table">
          <p v-if="results.length==0"> {{ resultMessage }} </p>
          <va-data-table v-else :items="results" :columns="columns" striped hoverable :per-page="perPage" :current-page="currentPage" :no-data-filtered-html="resultMessage">
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
	</div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import { useUserStore } from '@/stores/UserStore';

export default {
  name: 'CustomerSearch',
	data() {
		return {
            companyName: "",
            companyPhone: "",
            companyEmail: "",
            nip: "",
            regon: "",
            repName: "",
            repLastName: "",
            repPhone: "",
            repEmail: "",
            rawWorkers: [],
            selectedWorker: "",
            largeMode: false,
            showResults: false,
            results: [],
            resultMessage: "Brak wyników do wyświetlenia",
            columns: [
                { key: 'customerName', label:"Nazwa", sortable: true },
                { key: 'customerPhone', label:"Telefon", sortable: true },
                { key: 'customerEmail', label:"Email", sortable: true },
                { key: 'nip', label:"NIP", sortable: true },
                { key: 'regon', label:"REGON", sortable: true },
                { key: 'workerLeader', label:"Pracownik prowadzący" },
                { key: 'actions', label:"Akcje", width: 80 },
            ],
            perPage: 10,
            currentPage: 1,
		}
	},
    async mounted(){
        let callPath = "/Worker/getWorkers";
        this.rawWorkers = await CallAPI.get(callPath)
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
        },
        workers() {
            let resultArr = this.rawWorkers.map(function(item) {
                return item["name"] + " " + item["lastName"];
            });

            return resultArr;
        },
    },
	methods: {
        changeMode() {
            this.largeMode = !this.largeMode;
        },
        checkIfAuthorized(role) {
            const userStore = useUserStore();
            return userStore.doesUserHasRole(role);
        },
        async searchForResults() {
            this.largeMode = false;
            
            let companyName = null;
            let companyPhone = null;
            let companyEmail = null;
            let nip = null;
            let regon = null;
            let repName = null;
            let repLastName = null;
            let repPhone = null;
            let repEmail = null;
            let selectedWorker = null;
            if(this.companyName !== "") {
                companyName = this.companyName;
            }
            if(this.companyPhone !== "") {
                companyPhone = this.companyPhone;
            }
            if(this.selectedWorker !== "") {
                selectedWorker = this.selectedWorker;
            }
            if(this.companyEmail !== "") {
                companyEmail = this.companyEmail;
            }
            if(this.nip !== "") {
                nip = this.nip;
            }
            if(this.regon !== "") {
                regon = this.regon;
            }
            if(this.repName !== "") {
                repName = this.repName;
            }
            if(this.repLastName !== "") {
                repLastName = this.repLastName;
            }
            if(this.repPhone !== "") {
                repPhone = this.repPhone;
            }
            if(this.repEmail !== "") {
                repEmail = this.repEmail;
            }

            let callPath = "/Customer/getSearchCustomers?customerName=" + companyName + "&customerPhone=" + companyPhone + "&customerEmail=" + companyEmail + "&nIP=" + nip + "&rEGON=" + regon + "&representativeName=" + repName + "&representativeLastName=" + repLastName + "&representativePhone=" + repPhone + "&representativeEmail=" + repEmail + "&workerLeader=" + selectedWorker;
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
        },
        viewItemById(row) {
            this.$router.push({ name: "CustomerDetails", params: { id: this.results[row].idCustomer, mode: 'read' } });
        },
        editItemById(row) {
            this.$router.push({ name: "CustomerDetails", params: { id: this.results[row].idCustomer, mode: 'edit' } });
        },
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

.table-pagination {
    padding-top: 40px;
    text-align: center;
    text-align: -webkit-center;
}

</style>
