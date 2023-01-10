<template>
    <va-modal
        v-model="showAddressModal"
        :title="buttonMessage"
        hide-default-actions
        @click-outside="closeAddressModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalAddressForm" tag="form" ref="modalAddressForm" @validation="isAddressFormValidate = $event">
                <va-input
                    id="addressName"
                    class="some-space mb-4"
                    v-model="addressName"
                    :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                    label="Nazwa"
                    placeholder="Nazwa adresu"
                />
                <va-input
                    id="addressCountry"
                    class="some-space mb-4"
                    v-model="addressCountry"
                    :rules="[(v) => v.length > 0 || `Pole kraj nie może być puste.`, (v) => v.length < 31 || `Pole kraj przekroczyło limit znaków.`]"
                    label="Kraj"
                    placeholder="Kraj"
                />
                <va-input
                    id="addressCity"
                    class="some-space mb-4"
                    v-model="addressCity"
                    :rules="[(v) => v.length > 0 || `Pole miasto nie może być puste.`, (v) => v.length < 51 || `Pole miasto przekroczyło limit znaków.`]"
                    label="Miasto"
                    placeholder="Miasto"
                />
                <va-input
                    id="addressPostCode"
                    class="some-space mb-4"
                    v-model="addressPostCode"
                    :rules="[(v) => v.length < 12 || `Pole kod pocztowy przekroczyło limit znaków.`]"
                    label="Kod pocztowy (opcjonalne)"
                    placeholder="Kod pocztowy np. 00-000"
                />
                <va-input
                    id="addressStreet"
                    class="some-space mb-4"
                    v-model="addressStreet"
                    :rules="[(v) => v.length > 0 || `Pole ulica nie może być puste.`, (v) => v.length < 101 || `Pole ulica przekroczyło limit znaków.`]"
                    label="Ulica"
                    placeholder="Nazwa ulicy"
                />
                <va-input
                    id="addressStreetNumber"
                    class="some-space mb-4"
                    v-model="addressStreetNumber"
                    :rules="[(v) => v.length > 0 || `Pole numer budynku nie może być puste.`, (v) => v.length < 11 || `Pole numer budynku  przekroczyło limit znaków.`]"
                    label="Numer budynku"
                    placeholder="Numer budynku"
                />
                <va-input
                    id="addressApartment"
                    class="some-space mb-4"
                    v-model="addressApartmentNumber"
                    :rules="[(v) => v.length < 11 || `Pole numer mieszkania przekroczyło limit znaków.`]"
                    label="Numer mieszkania (opcjonalne)"
                    placeholder="Numer mieszkania"
                />
                <va-button id="addAddress" type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
export default {
  name: 'AddressModal',
  props: {
    addr: {
        type: Object,
        required: false,
        default: null
    }
  },
  emits: ["createAddress", "editAddress", "close"],
	data() {
		return {
            buttonMessage: "",
            isAddressFormValidate: false,
            showAddressModal: true,
            addressName: "",
            addressCountry: "",
            addressCity: "",
            addressPostCode: "",
            addressStreet: "",
            addressStreetNumber: "",
            addressApartmentNumber: "",
            IdAddress: null,
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    idAddress: this.IdAddress,
                    name: this.addressName,
                    country: this.addressCountry,
                    city: this.addressCity,
                    postCode: this.addressPostCode,
                    streetName: this.addressStreet,
                    streetNumber: this.addressStreetNumber,
                    apartmentNumber: this.addressApartmentNumber
                };

                if(this.addr !== null) {
                    this.$emit('editAddress', data);
                } else {
                    this.$emit('createAddress', data);
                }
                this.closeAddressModal();
            }
		},
        validateForm() {
            this.$refs.modalAddressForm.validate();

            return this.isAddressFormValidate;
        },
        closeAddressModal() {
            this.$emit('close');
        }
	},
    mounted() {
        if(this.addr === null) {
            this.buttonMessage = "Dodaj adres";
            this.addressName = "";
            this.addressCountry = "";
            this.addressCity = "";
            this.addressPostCode = "";
            this.addressStreet = "";
            this.addressStreetNumber = "";
            this.addressApartmentNumber = "";
            this.IdAddress = null;
        }else {
            this.buttonMessage = "Edytuj adres";
            this.addressName = this.addr.name;
            this.addressCountry = this.addr.country;
            this.addressCity = this.addr.city;
            this.addressPostCode = this.addr.postCode;
            this.addressStreet = this.addr.streetName;
            this.addressStreetNumber = this.addr.streetNumber;
            this.addressApartmentNumber = this.addr.apartmentNumber;
            this.IdAddress = this.addr.idAddress;
        }
    }
}
</script>

<style scoped>
#modalAddressForm {
    min-width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

