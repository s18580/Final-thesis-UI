<template>
    <va-modal
        v-model="showRepresentativeModal"
        :title="buttonMessage"
        hide-default-actions
        @click-outside="closeRepresentativeModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalRepresentativeForm" tag="form" ref="modalRepresentativeForm" @validation="isRepresentativeFormValidate = $event">
                <va-input
                    id="repName"
                    class="some-space mb-4"
                    v-model="representativeName"
                    :rules="[(v) => v.length > 0 || `Pole imię nie może być puste.`, (v) => v.length < 33 || `Pole imię przekroczyło limit znaków.`]"
                    label="Imię"
                    placeholder="Imię"
                />
                <va-input
                    id="repLastName"
                    class="some-space mb-4"
                    v-model="representativeLastName"
                    :rules="[(v) => v.length > 0 || `Pole nazwisko nie może być puste.`, (v) => v.length < 65 || `Pole nazwisko przekroczyło limit znaków.`]"
                    label="Nazwisko"
                    placeholder="Nazwisko"
                />
                <va-input
                    id="repPhone"
                    class="some-space mb-4"
                    v-model="representativePhone"
                    :rules="[(v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                    label="Telefon (opcjonalne)"
                    placeholder="Telefon"
                />
                <va-input
                    id="repEmail"
                    class="some-space mb-4"
                    v-model="representativeEmail"
                    :rules="[(v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                    label="Email (opcjonalne)"
                    placeholder="Adres email"
                />
                <va-button id="addRep" type="submit" color="info" gradient class="my-3 sub">{{ buttonMessage }}</va-button>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
export default {
  name: 'RepresentativeModal',
  props: {
    person: {
        type: Object,
        required: false,
        default: null
    }
  },
  emits: ["createRepresentative", "editRepresentative", "close"],
	data() {
		return {
            buttonMessage: "",
            isRepresentativeFormValidate: false,
            showRepresentativeModal: true,
            representativeName: "",
            representativeLastName: "",
            representativePhone: "",
            representativeEmail: "",
            IdRepresentative: null,
		}
	},
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let data = {
                    idRepresentative: this.IdRepresentative,
                    name: this.representativeName,
                    lastName: this.representativeLastName,
                    phoneNumber: this.representativePhone,
                    emailAddress: this.representativeEmail,
                };

                if(this.person !== null) {
                    this.$emit('editRepresentative', data);
                } else {
                    this.$emit('createRepresentative', data);
                }
                this.closeRepresentativeModal();
            }
		},
        validateForm() {
            this.$refs.modalRepresentativeForm.validate();

            return this.isRepresentativeFormValidate;
        },
        closeRepresentativeModal() {
            this.$emit('close');
        }
	},
    mounted() {
        if(this.person === null) {
            this.buttonMessage = "Dodaj osobę kontaktową";
            this.representativeName = "";
            this.representativeLastName = "";
            this.representativePhone = "";
            this.representativeEmail = "";
            this.IdRepresentative = null;
        }else {
            this.buttonMessage = "Edytuj osobę kontaktową";
            this.representativeName = this.person.name;
            this.representativeLastName = this.person.lastName;
            this.representativePhone = this.person.phoneNumber;
            this.representativeEmail = this.person.emailAddress;
            this.IdRepresentative = this.person.idRepresentative;
        }
    }
}
</script>

<style scoped>
#modalRepresentativeForm {
    min-width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

