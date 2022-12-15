<template>
  <div id="mainCo">
      <h4>Wyszukaj osoby kontaktowej</h4>
      <div id="search-params">
        <va-input
            class="search-box"
            v-model="representativeName"
            label="Imie:"
            placeholder="Imie"
        />
        <va-input
            class="search-box"
            v-model="representativeLastName"
            label="Nazwisko:"
            placeholder="Nazwisko"
        />
        <va-input
            class="search-box"
            v-model="representativePhone"
            label="Telefon:"
            placeholder="Telefon"
        />
        <va-input
            class="search-box"
            v-model="representativeEmail"
            label="Email:"
            placeholder="Email"
        />
        <va-select
            v-if="largeMode"
            class="search-box"
            v-model="selectedCustomer"
            :options="customers"
            label="Klient:"
            noOptionsText="Brak klientów do wybrania"
        />
        <va-select
            v-if="largeMode"
            class="search-box"
            v-model="seledtedSupplier"
            :options="suppliers"
            label="Dostawca:"
            noOptionsText="Brak dostawców do wybrania"
        />
      </div>
      <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Szukaj wśród dezaktywowanych osób:</label>
                <div>
                    <input v-model="showDisabled" type="checkbox">
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
                <va-button v-if="!showDisabled" flat icon="delete" @click="disableRepresentative(rowIndex)" />
                <va-button v-if="showDisabled" flat icon="restore_from_trash" @click="activateRepresentative(rowIndex)" />
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
            showDisabled: false,
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
        },
        customers(){
            let resultArr = this.rawCustomers.map(function(item) {
                return item["companyName"];
            });

            return resultArr;
        },
        suppliers() {
            let resultArr = this.rawSuppliers.map(function(item) {
                return item["name"];
            });

            return resultArr;
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
            let showDisabled = this.showDisabled;
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

            let callPath = "/Representative/getSearchRepresentatives?name=" + representativeName + "&lastName=" + representativeLastName + "&email=" + representativeEmail + "&phone=" + representativePhone + "&customer=" + selectedCustomer + "&supplier=" + seledtedSupplier + "&isDisabled=" + showDisabled;
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
            this.$router.push({ name: "RepresentativeDetails", params: { id: this.results[row].idRepresentative, mode: 'read' } });
        },
        editItemById(row) {
            this.$router.push({ name: "RepresentativeDetails", params: { id: this.results[row].idRepresentative, mode: 'edit' } });
        },
        async activateRepresentative(row){
            let callPath = "/Representative/disableRepresentative";
            let body = { Id: this.results[row].idRepresentative, IsDisabled: false };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Aktywowano osobę.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                this.$vaToast.init({ message: 'Błąd aktywacji osoby kontaktowej.', color: 'danger', duration: 3000 })
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            await this.searchForResults();
        },
        async disableRepresentative(row){
            let callPath = "/Representative/disableRepresentative";
            let body = { Id: this.results[row].idRepresentative, IsDisabled: true };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Dezaktywowano osobę.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                this.$vaToast.init({ message: 'Błąd dezaktywacji osoby kontaktowej.', color: 'danger', duration: 3000 })
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            await this.searchForResults();
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
