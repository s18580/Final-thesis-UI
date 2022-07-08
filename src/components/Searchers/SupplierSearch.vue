<template>
  <div id="mainCo">
      <h4>Wyszukaj dostawcę</h4>
      <div id="search-params">
        <div class="search-box">
                <div class="search-input-box">
                    <label>Nazwa:</label>
                    <input v-model="supplierName" class="form-control" type="text">
                </div>
        </div>
        <div class="search-box">
                <div class="search-input-box">
                    <label>Email:</label>
                    <input v-model="supplierEmail" class="form-control" type="text">
                </div>
        </div>
        <div class="search-box">
                <div class="search-input-box">
                    <label>Telefon:</label>
                    <input v-model="supplierPhone" class="form-control" type="text">
                </div>
        </div>
        <div v-if="largeMode" class="search-box">
                <div class="search-input-box">
                    <label>Imię:</label>
                    <input v-model="concactName" class="form-control" type="text">
                </div>
        </div>
        <div v-if="largeMode" class="search-box">
                <div class="search-input-box">
                    <label>Nazwisko:</label>
                    <input v-model="concactSurrname" class="form-control" type="text">
                </div>
        </div>
        <div v-if="largeMode" class="search-box">
                <div class="search-input-box">
                    <label>Nazwa adresu:</label>
                    <input v-model="addressName" class="form-control" type="text">
                </div>
        </div>
        <div v-if="largeMode" class="search-box">
                <div class="search-input-box">
                    <label>Ulica:</label>
                    <input v-model="addressStreet" class="form-control" type="text">
                </div>
        </div>
        <div v-if="largeMode" class="search-box">
                <div class="search-input-box">
                    <label>Miasto:</label>
                    <input v-model="addressCity" class="form-control" type="text">
                </div>
        </div>
        <div v-if="largeMode" class="search-box">
                <div class="search-input-box">
                    <label>Fragment z opisu:</label>
                    <textarea v-model="supplierDescription" class="form-control"></textarea>
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
export default {
  name: 'SupplierSearch',
	data() {
		return {
			supplierName: "",
            supplierEmail: "",
            supplierPhone: "",
			supplierDescription: "",
            concactName: "",
            concactSurrname: "",
            addressName: "",
            addressStreet: "",
            addressCity: "",
            largeMode: false,
            showResults: false,
            results: [],
            resultMessage: "Brak wyników do wyświetlenia",
            columns: [
                { key: 'Name', label:"Nazwa", sortable: true },
                { key: 'PhoneNumber', label:"Telefon", sortable: true },
                { key: 'EmailAddress', label:"Email", sortable: true },
                { key: 'RepresentativeName', label:"Reprezentant dostawcy", sortable: true },
                { key: 'AddressName', label:"Nazwa adresu", sortable: true },
                { key: 'Street', label:"Ulica", sortable: true },
                { key: 'City', label:"Miasto", sortable: true },
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
        }
    },
	methods: {
        changeMode() {
            this.largeMode = !this.largeMode;
        },
        searchForResults() {
            this.largeMode = false;
            this.showResults = true;
            //API call
            //set result message or show table
            this.resultMessage = "Brak wyników do wyświetlenia";
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
.search-box textarea {
	text-align: center;
	margin-top: 10px;
	margin-bottom: 10px;
    border-radius: 100vw;
    min-width: 250px;
    background: #f4f8fa;
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
