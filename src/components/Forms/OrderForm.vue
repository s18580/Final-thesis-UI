<template>
  <div id="mainCo">
        <h1>Dodaj nowe zamówienie</h1>
		<va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
            <va-checkbox
                class="mb-4 some-top-space"
                label="Zamówienie jest przetargiem"
                v-model="isAuction"
            />
            <va-input
                class="some-space mb-4"
                v-model="orderName"
                :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                label="Nazwa"
                placeholder="Nazwa zamówienia"
            />
            <va-date-input
                class="some-space mb-4"
                v-model="orderSubmissionDate"
                label="Data złożenia"
                placeholder="Data złożenia zamówienia"
            />
            <va-date-input
                class="some-space mb-4"
                v-model="expectedDeliveryDate"
                label="Data dostawy"
                placeholder="Pożądana data dostawy"
            />
            <va-date-input
                class="some-space mb-4"
                v-model="deliveryDate"
                label="Data dostawy"
                placeholder="Data dostawy"
            />
            <va-date-input
                class="some-space mb-4"
                v-model="offerValidityDate"
                label="Termin oferty"
                placeholder="Termin ważności oferty"
            />
            <va-select
                class="mb-4 some-space"
                v-model="selectedClient"
                :options="clients"
                label="Klient"
                noOptionsText="Brak klientów do wybrania"
            />
            <va-select
                class="mb-4 some-space"
                v-model="selectedRepresentative"
                :options="representatives"
                label="Osoba kontaktowa"
                noOptionsText="Brak osób do wybrania"
            />
            <va-select
                class="mb-4 some-space"
                v-model="selectedOrderStatus"
                :options="orderStatuses"
                label="Status zamówienia"
                noOptionsText="Brak statusów do wybrania"
            />
            <va-input
                class="mb-4 some-space"
                v-model="orderNote"
                type="textarea"
                :rules="[ (v) => v.length < 255 || `Pole notatka przekroczyło limit znaków.`]"
                label="Notatka (opcjonalnie)"
            />
            <va-divider inset />



<!-- adjust -->
			<div id="card-container">
				<div class="objects-card-wrapper">
					<h6>Przydzieleni pracownicy:</h6>
					<div class="objects-card">
						<div v-for="worker in assignmentWorkers" :key="worker.IdForWorkerTable" class="card-items">
                            <div>
                                {{ worker.name + ' ' + worker.lastName }}
                            </div>
                            <div class="card-icons">
                                <svg @click="editWorkerInModal(worker)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>

                                <svg @click="removeWorker(worker.IdForWorkerTable)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                            </div>
						</div>
					</div>
                    <va-button @click="showWorkerModal=true" type="button" color="success" gradient>Przydziel pracownika</va-button>
                    <RepresentativeModal :person="editedWorker" v-if="showWorkerModal" @close="closeContactModal()" @createRepresentative="addContact($event)" @editRepresentative="editContact($event)"/>
				</div>



<!-- adjust -->
                <va-divider vertical />
				<div class="objects-card-wrapper">
					<h6>Adresy dostawy zamówienia:</h6>
					<div class="objects-card">
						<div v-for="address in deliveryAddresses" :key="address.IdForAddressTable" class="card-items">
                            <div>
                                {{ address.name }}
                            </div>
                            <div class="card-icons">
                                <svg @click="editAddressInModal(address)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>

                                <svg @click="removeAddress(address.IdForAddressTable)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                            </div>
						</div>
					</div>
                    <va-button @click="showAddressModal=true" type="button" color="success" gradient>Przydziel adres klienta</va-button>
                    <AddressModal :addr="editedDeliveryAddress" v-if="showAddressModal" @close="closeAddressModal()" @createAddress="addAddress($event)" @editAddress="editAddress($event)"/>
				</div>
			</div>
            <va-divider inset />




<!-- adjust -->
                <div class="objects-card-wrapper">
					<h6>Przedmioty zamówienia:</h6>
					<div class="objects-card">
						<div v-for="orderItem in orderItems" :key="orderItem.IdForOrderItemTable" class="card-items">
                            <div>
                                {{ orderItem.name }}
                            </div>
                            <div class="card-icons">
                                <svg @click="editOrderItemInModal(orderItem)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>

                                <svg @click="removeOrderItem(orderItem.IdForOrderItemTable)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                            </div>
						</div>
					</div>
                    <va-button @click="showOrderItemModal=true" type="button" color="success" gradient>Dodaj przedmiot zamówienia</va-button>
                    <AddressModal :addr="editedOrderItem" v-if="showOrderItemModal" @close="closeAddressModal()" @createAddress="addAddress($event)" @editAddress="editAddress($event)"/>
				</div>





            <va-button type="submit" color="info" gradient class="my-3">Dodaj</va-button>
		</va-form>
	</div>
</template>

<script>
export default {
  name: 'OrderForm',
  data() {
		return {
            isAuction: false,
            orderName: "",
            orderSubmissionDate: new Date(),
            expectedDeliveryDate: new Date(),
            deliveryDate: new Date(),
            offerValidityDate: new Date(),
            showWorkerModal: false,
            showAddressModal: false,
            showOrderItemModal: false,
            editedWorker: null,
            assignmentWorkers: [],
            workerCounter: 0,
            editedDeliveryAddress: null,
            deliveryAddresses: [],
            addressCounter: 0,
            editedOrderItem: null,
            orderItems: [],
            orderItemsCounter: 0,
            orderNote: "",

            offerValidityDays: 7, // get it from API consts
		}
	},
}
</script>

<style scoped>
#mainCo {
	margin-right: 100px;
	margin-left: 100px;
	padding: 40px;
	background: white;
	border-radius: 25px;
    padding-right: 190px;
	padding-left: 190px;
}

h1 {
    margin-bottom: 50px;
}

.some-space {
    padding-bottom: 20px;
}

.some-top-space {
    padding-top: 20px;
}

.radio-box {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 50px;
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
	max-height: 300px;
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
