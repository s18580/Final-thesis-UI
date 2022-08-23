<template>
    <div>
        <div id="background">
            <div id="headerCo">
                <h1>Szczegóły osoby kontaktowej</h1>
                <va-divider />
            </div>
            <div id="representativeDetailsCo">
                <h3>Dane osoby kontaktowej</h3>
                <va-divider />
                <div id="representativeDetailsCoInner">
                    <va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
                        <va-input
                            class="some-space mb-4"
                            v-model="repName"
                            :rules="[(v) => v.length > 0 || `Pole imię nie może być puste.`, (v) => v.length < 33 || `Pole imię przekroczyło limit znaków.`]"
                            label="Imię"
                            :readonly="readOnlyMode"
                        />
                        <va-input
                            class="some-space mb-4"
                            v-model="repLastName"
                            :rules="[(v) => v.length > 0 || `Pole nazwisko nie może być puste.`, (v) => v.length < 65 || `Pole nazwisko przekroczyło limit znaków.`]"
                            label="Nazwisko"
                            :readonly="readOnlyMode"
                        />
                        <va-input
                            class="mb-4 some-space"
                            v-model="repEmail"
                            :rules="[(v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                            label="Adres email"
                            placeholder="Adres email"
                            :readonly="readOnlyMode"
                        />
                        <va-input
                            class="mb-4 some-space"
                            v-model="repPhone"
                            :rules="[(v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                            label="Telefon"
                            placeholder="Telefon"
                            :readonly="readOnlyMode"
                        />
                        <va-button v-if="!readOnlyMode" @click="submitForm()" color="info" gradient class="my-3">Edytuj dane</va-button>
                    </va-form>
                </div>
            </div>
            <div id="ownerDetailsCo">
                <h3>{{ ownerSectionTitle }}</h3>
                <va-divider />
                <div id="ownerDetailsCoInner">
                    <va-input
                        class="some-space mb-4"
                        v-model="ownerName"
                        :label="ownerNameLabel"
                        readonly
                    />
                    <va-input
                        class="mb-4 some-space"
                        v-model="ownerEmail"
                        :label="ownerEmailLabel"
                        :placeholder="ownerEmailLabel"
                        readonly
                    />
                    <va-input
                        class="mb-4 some-space"
                        v-model="ownerPhone"
                        :label="ownerPhoneLabel"
                        :placeholder="ownerPhoneLabel"
                        readonly
                    />
                </div>
            </div>
            <div id="itemsCo">
                <h3>{{ itemsLabel }}</h3>
                <va-divider />
                <div id="itemsCoInner">
                    <va-list v-if="isCustomerRepresentative">
                        <va-list-label>
                            Zamówienia
                        </va-list-label>

                        <va-list-item
                            v-for="item in rawItems"
                            :key="item.idOrder"
                        >
                            <va-list-item-section avatar>
                                <va-avatar color="#6B5B95" icon="list_alt" />
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ item.name }}
                                </va-list-item-label>

                                <va-list-item-label caption>
                                    {{ item.identifier }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section icon v-if="!readOnlyMode">
                                <va-popover message="Zobacz dane zamówienia">
                                    <va-button flat icon="visibility" @click="openOrder(item.idOrder)" />
                                </va-popover>
                                <va-popover message="Edytuj dane zamówienia">
                                    <va-button flat icon="edit" @click="openEditOrder(item.idOrder)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-list v-if="!isCustomerRepresentative">
                        <va-list-label>
                            Dostawy
                        </va-list-label>

                        <va-list-item
                            v-for="item in rawItems"
                            :key="item.idSupply"
                        >
                            <va-list-item-section avatar>
                                <va-avatar color="#6B5B95" icon="list_alt" />
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ item.itemDescription }}
                                </va-list-item-label>

                                <va-list-item-label caption>
                                    {{ item.supplyDate }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section icon v-if="!readOnlyMode">
                                <va-popover message="Zobacz dane zamówienia">
                                    <va-button flat icon="visibility" @click="openOrder(item.idOrder)" />
                                </va-popover>
                                <va-popover message="Edytuj dane zamówienia">
                                    <va-button flat icon="edit" @click="openEditOrder(item.idOrder)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';

export default {
    name: "RepresentativeDetails",
    props: {
        id: {
            type: String,
            required: true,
        },
        mode: {
            type: String,
            required: false,
            default: "read"
        },
    },
    components: {  },
    data() {
        return {
            repName: "",
            repLastName: "",
            repEmail: "",
            repPhone: "",
            ownerSectionTitle: "",
            ownerName: "",
            ownerNameLabel: "",
            ownerEmail: "",
            ownerEmailLabel: "",
            ownerPhone: "",
            ownerPhoneLabel: "",
            itemsLabel: "",
            rawItems: [],

            readOnlyMode: false,
            isFormValidate: false,
            isCustomerRepresentative: false,
        }
    },
    async mounted() {
        let callPath = "/Representative/getRepresentative?id=" + this.id;
        let representativeData = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        this.repName = representativeData.name;
        this.repLastName = representativeData.lastName;
        this.repEmail = representativeData.emailAddress;
        this.repPhone = representativeData.phoneNumber;

        if(representativeData.idCustomer != null && representativeData.idSupplier == null) {
            this.isCustomerRepresentative = true;
        } else { 
            this.isCustomerRepresentative = false;
        }

        if(this.isCustomerRepresentative) {
            callPath = "/Customer/getCustomer?id=" + representativeData.idCustomer;
            let customerData = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            callPath = "/Order/getOrdersByRepresentative?id=" + this.id;
            this.rawItems = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.ownerSectionTitle = "Dane reprezentowanego klienta";
            this.itemsLabel = "Powiązane zamówienia";
            this.ownerNameLabel = "Imię klienta";
            this.ownerEmailLabel = "Email klienta";
            this.ownerPhoneLabel = "Telefon klienta";
            this.ownerName = customerData.companyName;
            this.ownerEmail = customerData.companyEmailAddress;
            this.ownerPhone = customerData.companyPhoneNumber;
        } else {
            callPath = "/Supplier/getSupplier?id=" + representativeData.idSupplier;
            let supplierData = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            callPath = "/Supply/getSuppliesByRepresetnative?id=" + this.id;
            this.rawItems = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.ownerSectionTitle = "Dane reprezentowanego dostawcy";
            this.itemsLabel = "Powiązane dostawy";
            this.ownerNameLabel = "Imię dostawcy";
            this.ownerEmailLabel = "Email dostawcy";
            this.ownerPhoneLabel = "Telefon dostawcy";
            this.ownerName = supplierData.name;
            this.ownerEmail = supplierData.phoneNumber;
            this.ownerPhone = supplierData.emailAddress;
        }
    },
    methods: {
        async submitForm() {
            if(this.validateForm) {
                let callPath = "/Order/updateOrder"
                let body = {
                    IdOrder: this.id,
                    Name: this.orderName,
                    OrderSubmissionDate: this.submissionDate,
                    Note: this.orderNote,
                    IsAuction: this.isAuction,
                    ExpectedDeliveryDate: this.expectedDeliveryDate,
                    DeliveryDate: this.deliveryDate,
                    OfferValidityDate: this.offerValidityDate,
                    IdRepresentative: this.getIdByName("representative", this.selectedRepresentative),
                    IdStatus: this.getIdByName("status", this.selectedStatus),
                };
                
                await CallAPI.post(callPath, body)
                .then(res => {
                    this.$vaToast.init({ message: 'Dane zostały edytowane.', color: 'success', duration: 3000 })
                    return res.data;
                })
                .catch(err => {
                    if(err.message.includes("422")) {
                        this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                    }else{
                        this.$vaToast.init({ message: 'Błąd edycji danych.', color: 'danger', duration: 3000 })
                    }
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
        },
        validateForm() {
            this.$refs.form.validate();

            return this.isFormValidate;
        },
        openOrder(givenId) {
            this.$router.push({ name: "OrderDetails", params: { id: givenId, mode: 'read' } });
        },
        openEditOrder(givenId) {
            this.$router.push({ name: "OrderDetails", params: { id: givenId, mode: 'edit' } });
        }
    }
}
</script>

<style scoped>
#background {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 1fr 50px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". header header header ."
    ". main main sidebarA ."
    ". mainT mainT sidebarA .";
    grid-gap: 30px;
}

#headerCo {
    grid-area: header;
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#representativeDetailsCo {
    grid-area: main;
}

#representativeDetailsCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#ownerDetailsCo {
    grid-area: mainT;
}

#ownerDetailsCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#itemsCo {
    grid-area: sidebarA;
}

#itemsCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

.inputWidth {
    width: 250px;
}
</style>