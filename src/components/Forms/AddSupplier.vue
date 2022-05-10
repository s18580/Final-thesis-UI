<template>
  <div id="mainCo">
		<form @submit.prevent="this.submitForm()">
			<h1>Dodaj nowego dostawcę</h1>
            <div class="input-box">
				<label>Nazwa:</label>
				<input v-model="supplierName" class="form-control" type="text">
				<div v-if="nameErrorMessage" class="error-box">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-triangle-fill error-icon" viewBox="0 0 16 16">
						<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
					</svg>
                    <label class="error-message"> {{ nameErrorMessage }}</label>
                </div>
            </div>
            <div class="input-box">
				<label>Email:</label>
				<input v-model="supplierEmail" class="form-control" type="text">
				<div v-if="emailErrorMessage" class="error-box">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-triangle-fill error-icon" viewBox="0 0 16 16">
						<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
					</svg>
                    <label class="error-message"> {{ emailErrorMessage }}</label>
                </div>
			</div>
            <div class="input-box">
				<label>Telefon:</label>
				<input v-model="supplierPhone" class="form-control" type="text">
				<div v-if="phoneErrorMessage" class="error-box">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-triangle-fill error-icon" viewBox="0 0 16 16">
						<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
					</svg>
                    <label class="error-message"> {{ phoneErrorMessage }}</label>
                </div>
			</div>
			<div id="card-container">
				<div class="objects-card-wrapper">
					<h6>Osoby kontaktowe dostawcy:</h6>
					<div class="objects-card">
						<div v-for="person in contactPepole" :key="person.IdRepresentative" class="card-items">
                            <div>
                                {{ person.Name }}
                            </div>
                            <div class="card-icons">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>

                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                            </div>
						</div>
					</div>
					<button type="button" class="btn btn-info btn-sm">Dodaj osobę</button>
				</div>
				<div class="objects-card-wrapper">
					<h6>Adresy dostawcy:</h6>
					<div class="objects-card">
						<div v-for="address in suplierAddresses" :key="address.IdAddress" class="card-items">
                            <div>
                                {{ address.Name }}
                            </div>
                            <div class="card-icons">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>

                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                            </div>
						</div>
					</div>
					<button type="button" class="btn btn-info btn-sm">Dodaj adres</button>
				</div>
			</div>
			<div class="input-box">
				<label>Opis (opcjonalnie):</label>
				<textarea v-model="supplierDescription" class="form-control"></textarea>
                <div v-if="descriptionErrorMessage" class="error-box">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-triangle-fill error-icon" viewBox="0 0 16 16">
						<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
					</svg>
                    <label class="error-message"> {{ descriptionErrorMessage }}</label>
                </div>
			</div>
			<button type="submit" class="btn btn-primary my-3">Dodaj</button>
		</form>
	</div>
</template>

<script>
export default {
  name: 'AddSupplier',
	data() {
		return {
			supplierName: "",
            supplierEmail: "",
            supplierPhone: "",
			supplierDescription: "",
			nameErrorMessage: "",
            emailErrorMessage: "",
            phoneErrorMessage: "",
            descriptionErrorMessage: "",
			contactPepole: [],
			suplierAddresses: [],
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                // API call
                // Added info  
            }
		},
        validateForm() {
            let formIsCorrect = true;
            this.nameErrorMessage = "";
            this.emailErrorMessage = "";
            this.phoneErrorMessage = "";
            this.descriptionErrorMessage = "";

            if(this.supplierName.trim().length == 0){
                this.nameErrorMessage = "Pole nazwa nie może być puste.";
                formIsCorrect = false;
            } else if(this.supplierName.trim().length > 255) {
                this.nameErrorMessage = "Pole nazwa przekroczyło limit znaków.";
                formIsCorrect = false;
            }

            if(this.supplierEmail.trim().length != 0){
                if(this.supplierEmail.trim().length > 255) {
                    this.emailErrorMessage = "Pole email przekroczyło limit znaków.";
                    formIsCorrect = false;
                }
            }

            if(this.supplierPhone.trim().length != 0){
                if(this.supplierPhone.trim().length < 9) {
                    this.phoneErrorMessage = "Pole telefon jest nieprawidłowe.";
                    formIsCorrect = false;
                } else if(this.supplierPhone.trim().length > 32) {
                    this.phoneErrorMessage = "Pole telefon przekroczyło limit znaków.";
                    formIsCorrect = false;
                }
            }

            if(this.supplierDescription.trim().length != 0){
                if(this.supplierDescription.trim().length > 255) {
                    this.descriptionErrorMessage = "Pole opis przekroczyło limit znaków.";
                    formIsCorrect = false;
                }
            }

            return formIsCorrect;
        }
	}
}
</script>

<style scoped>
#mainCo {
	margin-right: 100px;
	margin-left: 100px;
	padding: 40px;
	background: white;
	border-radius: 25px;
}

form {
	padding-right: 150px;
	padding-left: 150px;
}

.input-box {
	padding-top: 50px;
}

.input-box input,
.input-box textarea {
	text-align: center;
	margin-top: 10px;
	margin-bottom: 10px;
    border-radius: 25px;
}

.error-message {
	text-align: left;
	color: red;
}

.error-box {
	display: flex;
	justify-content: center;
}

.error-icon {
	margin-right: 5px;
	color: red;
}

#card-container {
	display: flex;
	justify-content: space-around;
}

.objects-card-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 60px;
	margin-bottom: 60px;
}

.objects-card {
	border-color: rgb(226, 226, 226);
	border-style: solid;
    border-radius: 10px;
	width: 250px;
	height: 300px;
	margin-bottom: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
    max-height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.card-items {
    background: #ffcc80;
    padding: 5px;
    margin: 5px;
    width: 100%;
    border-radius: 50px;
    border-color:burlywood;
    border-style: solid;
    border-width: 3px;
    display: flex;
    justify-content: space-between;
}

.card-icons svg{
    margin-left: 5px;
}

.objects-card::-webkit-scrollbar {
  width: 0.25rem;
}

.objects-card::-webkit-scrollbar-thumb {
  background: burlywood;
  border-radius: 100vw;
}

.objects-card::-webkit-scrollbar-thumb:hover {
  background: rgb(214, 145, 54);
}
</style>
