<template>
  <div id="mainCo">
      <h4>Wyszukaj pracownika</h4>
      <div id="search-params">
        <va-input
            id="workerName"
            class="search-box"
            v-model="workerName"
            label="Imie:"
            placeholder="Imie"
        />
        <va-input
            id="workerLastName"
            class="search-box"
            v-model="workerLastName"
            label="Nazwisko:"
            placeholder="Nazwisko"
        />
        <va-select
            id="worksite"
            class="search-box"
            v-model="selectedWorksite"
            :options="worksites"
            label="Stanowisko:"
            noOptionsText="Brak stanowisk do wybrania"
        />
      </div>
      <va-button id="search" @click="searchForResults()" color="info" gradient>Szukaj</va-button>
	</div>
    <div v-if="showResults" id="resultCo">
      <div class="result-table">
          <p v-if="results.length==0"> {{ resultMessage }} </p>
          <va-data-table v-else :items="results" :columns="columns" striped hoverable :per-page="perPage" :current-page="currentPage" :no-data-filtered-html="resultMessage">
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
  name: 'WorkerSearch',
	data() {
		return {
			workerName: "",
            workerLastName: "",
            selectedWorksite: "",
            rawWorksites: [],
            showResults: false,
            results: [],
            resultMessage: "Brak wyników do wyświetlenia",
            columns: [
                { key: 'name', label:"Imię", sortable: true },
                { key: 'lastName', label:"Nazwisko", sortable: true },
                { key: 'phoneNumber', label:"Telefon", sortable: true },
                { key: 'emailAddres', label:"Email", sortable: true },
                { key: 'worksiteName', label:"Stanowisko", sortable: true },
            ],
            perPage: 10,
            currentPage: 1,
		}
	},
    async mounted() {
        let callPath = "/Worksite/getWorksites";
        this.rawWorksites = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            this.resultMessage = "Brak wyników do wyświetlenia";
        });
    },
    computed: {
        pages() {
            let c = parseInt(this.results.length/10, 10);
            if(this.results.length%10 > 0) c+=1;
            return c;
        },
        worksites() {
            let resultArr = this.rawWorksites.map(function(item) {
                return item["name"];
            });

            return resultArr;
        }
    },
	methods: {
        async searchForResults() {
            let workerName = null;
            let workerLastName = null;
            let selectedWorksite = null;
            if(this.workerName !== "") {
                workerName = this.workerName;
            }
            if(this.workerLastName !== "") {
                workerLastName = this.workerLastName;
            }
            if(this.selectedWorksite !== "") {
                selectedWorksite = this.selectedWorksite;
            }

            let callPath = "/Worker/getSearchWorkers?name=" + workerName + "&lastName=" + workerLastName + "&worksite=" + selectedWorksite;
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

select option {
  background: #f4f8fa;
  color: #2C82E0;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
}

.table-pagination {
    padding-top: 40px;
    text-align: center;
    text-align: -webkit-center;
}

</style>
