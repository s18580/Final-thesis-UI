<template>
  <div id="mainCo">
      <h4>Wyszukaj wycenę</h4>
      <div id="search-params">
        <div class="search-box">
            <div class="search-input-box">
                <label>Data stworzenia:</label>
                <input @click="showThatPicker('createDatePicker')" v-model="creationDate" class="form-control" type="date" id="createDatePicker">
            </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Nazwa wyceny:</label>
                <input v-model="valuationName" class="form-control" type="text">
            </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Autor:</label>
                <select v-model="selectedAuthor" class="form-control">
                    <option v-for="author in authors" :key="author.Id">
                        {{ author.name }}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Papier:</label>
                <input v-model="valuationPaper" class="form-control" type="text">
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Kolorystyka:</label>
                <input v-model="valuationColor" class="form-control" type="text">
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Usługa:</label>
                <select v-model="selectedService" class="form-control">
                    <option v-for="valService in valuationServices" :key="valService.Id">
                        {{ valService.name }}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Rodzaj szycia:</label>
                <select v-model="selectedBindingTypes" class="form-control">
                    <option v-for="bindingType in valuationBindingTypes" :key="bindingType.Id">
                        {{ bindingType.name }}
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
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Zamówienie:</label>
                <select v-model="selectedOrder" class="form-control">
                    <option v-for="order in orders" :key="order.Id">
                        {{ order.name }}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Przedmiot wybranego zamówienia:</label>
                <select v-model="selectedOrderItem" class="form-control">
                    <option v-for="orderItem in orderItems" :key="orderItem.Id">
                        {{ orderItem.name }}
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
export default {
  name: 'ValuationSearch',
	data() {
		return {
            valuationName: "",
            creationDate: "",
            valuationColor: "",
            valuationPaper: "",
            selectedService: null,
            valuationServices: [],
            selectedBindingTypes: null,
            valuationBindingTypes: [],
            selectedOrder: null,
            orders: [],
            selectedOrderItem: null,
            orderItems: [],
            selectedAuthor: null,
            authors: [],
            selectedOrderItemType: null,
            orderItemTypes: [],
            largeMode: false,
            showResults: false,
            results: [],
            resultMessage: "Brak wyników do wyświetlenia",
            columns: [
                { key: 'Name', label:"Nazwa", sortable: true },
                { key: 'Author', label:"Autor", sortable: true },
                { key: 'CreationDate', label:"Data stworzenia" },
                { key: 'Paper', label:"Papier", sortable: true },
                { key: 'Color', label:"Kolorystyka" },
                { key: 'Service', label:"Usługi" },
                { key: 'BindingType', label:"Rodzaj szycia" },
                { key: 'OrderItemType', label:"Typ przedmiotu zamówienia" },
                { key: 'Order', label:"Zamówienie" },
                { key: 'OrderItem', label:"Przedmioty zamówienia" },
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
        },
        showThatPicker(id) {
            const dateInput = document.getElementById(id);
            try {
                dateInput.showPicker();
            } catch (error) {
                //do nothing
            }
        }
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

#createDatePicker {
    cursor: pointer;
}

.table-pagination {
    padding-top: 40px;
    text-align: center;
    text-align: -webkit-center;
}

</style>
