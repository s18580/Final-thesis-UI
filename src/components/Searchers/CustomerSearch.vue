<template>
  <div id="mainCo">
      <h4>Wyszukaj klienta</h4>
      <div id="search-params">
        <div class="search-box">
            <div class="search-input-box">
                <label>Nazwa firmy:</label>
                <input v-model="companyName" class="form-control" type="text">
            </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Telefon firmy:</label>
                <input v-model="companyPhone" class="form-control" type="text">
            </div>
        </div>
        <div class="search-box">
            <div class="search-input-box">
                <label>Email firmy:</label>
                <input v-model="companyEmail" class="form-control" type="text">
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>NIP:</label>
                <input v-model="nip" class="form-control" type="text">
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>REGON:</label>
                <input v-model="regon" class="form-control" type="text">
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Imie klienta prywatnego lub reprezentanta:</label>
                <input v-model="repName" class="form-control" type="text">
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Nazwisko klienta prywatnego lub reprezentanta:</label>
                <input v-model="repLastName" class="form-control" type="text">
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Telefon klienta prywatnego lub reprezentanta:</label>
                <input v-model="repPhone" class="form-control" type="text">
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Email klienta prywatnego lub reprezentanta:</label>
                <input v-model="repEmail" class="form-control" type="text">
            </div>
        </div>
        <div v-if="largeMode" class="search-box">
            <div class="search-input-box">
                <label>Pracownik prowadzący:</label>
                <select v-model="selectedWorker" class="form-control">
                    <option v-for="worker in workers" :key="worker.Id">
                        {{ worker.name }}
                    </option>
                </select>
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
          <p v-if="results"> {{ resultMessage }} </p>
      </div>
	</div>
</template>

<script>
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
            workers: [],
            selectedWorker: null,
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
