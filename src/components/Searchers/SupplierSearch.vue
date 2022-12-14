<template>
  <div id="mainCo">
      <h4>Wyszukaj dostawcę</h4>
      <div id="search-params">
        <va-input
            class="search-box"
            v-model="supplierName"
            label="Nazwa:"
            placeholder="Nazwa"
        />
        <va-input
            class="search-box"
            v-model="supplierEmail"
            label="Email:"
            placeholder="Email"
        />
        <va-input
            class="search-box"
            v-model="supplierPhone"
            label="Telefon:"
            placeholder="Telefon"
        />
        <va-input
            v-if="largeMode"
            class="search-box"
            v-model="concactName"
            label="Imię osoby kontaktowej:"
            placeholder="Imię"
        />
        <va-input
            v-if="largeMode"
            class="search-box"
            v-model="concactSurrname"
            label="Nazwisko osoby kontaktowej:"
            placeholder="Nazwisko"
        />
        <va-input
            v-if="largeMode"
            class="search-box"
            v-model="addressName"
            label="Nazwa adresu:"
            placeholder="Nazwa adresu"
        />
        <va-input
            v-if="largeMode"
            class="search-box"
            v-model="addressStreet"
            label="Ulica:"
            placeholder="Ulica"
        />
        <va-input
            v-if="largeMode"
            class="search-box"
            v-model="addressCity"
            label="Miasto:"
            placeholder="Miasto"
        />
        <va-input
            v-if="largeMode"
            type="textarea"
            class="search-box"
            v-model="supplierDescription"
            label="Fragment z opisu:"
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
                { key: 'name', label:"Nazwa", sortable: true },
                { key: 'phoneNumber', label:"Telefon", sortable: true },
                { key: 'emailAddress', label:"Email", sortable: true },
                { key: 'representativeName', label:"Reprezentanci dostawcy", sortable: true },
                { key: 'addressName', label:"Nazwy adresów", sortable: true },
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
        async searchForResults() {
            this.largeMode = false;
            
            let supplierName = null;
            let supplierEmail = null;
            let supplierPhone = null;
			let supplierDescription = null;
            let concactName = null;
            let concactSurrname = null;
            let addressName = null;
            let addressStreet = null;
            let addressCity = null;

            if(this.supplierName !== "") {
                supplierName = this.supplierName;
            }
            if(this.supplierEmail !== "") {
                supplierEmail = this.supplierEmail;
            }
            if(this.supplierPhone !== "") {
                supplierPhone = this.supplierPhone;
            }
            if(this.supplierDescription !== "") {
                supplierDescription = this.supplierDescription;
            }
            if(this.concactName !== "") {
                concactName = this.concactName;
            }
            if(this.concactSurrname !== "") {
                concactSurrname = this.concactSurrname;
            }
            if(this.addressName !== "") {
                addressName = this.addressName;
            }
            if(this.addressStreet !== "") {
                addressStreet = this.addressStreet;
            }
            if(this.addressCity !== "") {
                addressCity = this.addressCity;
            }

            let callPath = "/Supplier/getSearchSuppliers?supplierName="+ supplierName + "&phoneNumber=" + supplierPhone + "&emailAddress=" + supplierEmail + "&addressName=" + addressName + "&street=" + addressStreet + "&city=" + addressCity + "&description=" + supplierDescription + "&representativeName=" + concactName + "&representativeLastName=" + concactSurrname;
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
        viewItemById(row) {
            this.$router.push({ name: "SupplierDetails", params: { id: this.results[row].idSupplier, mode: 'read' } });
        },
        editItemById(row) {
            this.$router.push({ name: "SupplierDetails", params: { id: this.results[row].idSupplier, mode: 'edit' } });
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
