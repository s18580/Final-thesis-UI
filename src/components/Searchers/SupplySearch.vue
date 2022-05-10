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
                    <label>Typ przedmiotu dostawy - selectL:</label>
                    <input v-model="supplyDate" class="form-control" type="text">
                </div>
        </div>
        <div class="search-box">
                <div class="search-input-box">
                    <label>Dostawca - selectL:</label>
                    <input v-model="supplyDate" class="form-control" type="text">
                </div>
        </div>
        <div v-if="largeMode" class="search-box">
                <div class="search-input-box">
                    <label>Reprezentant - selectL:</label>
                    <input v-model="supplyDate" class="form-control" type="text">
                </div>
        </div>
        <div v-if="largeMode" class="search-box">
                <div class="search-input-box">
                    <label>Odebrana - checkBox:</label>
                    <input v-model="supplyDate" class="form-control" type="text">
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
      <button @click="searchForResults()" class="btn btn-primary my-3 search">Szukaj</button>
	</div>
    <div v-if="showResults" id="resultCo">
      <div class="result-table">
          <p v-if="results"> {{ resultMessage }} </p>
      </div>
	</div>
</template>

<script>
export default {
  name: 'AddSupplier',
	data() {
		return {
			supplyDate: "",
            largeMode: false,
            showResults: false,
            results: [],
            resultMessage: "Brak wyników do wyświetlenia",
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
}

#show-more {
    cursor: pointer;
    position: relative;
    text-align: right;
}

</style>
