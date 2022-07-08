<template>
  <div id="mainCo">
        <h1>Dodaj nowego pracownika</h1>
		<va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
            <va-input
                class="some-space mb-4"
                v-model="workerName"
                :rules="[(v) => v.length > 0 || `Pole imię nie może być puste.`, (v) => v.length < 33 || `Pole imię przekroczyło limit znaków.`]"
                label="Imię"
                placeholder="Imię pracownika"
            />
            <va-input
                class="some-space mb-4"
                v-model="workerLastName"
                :rules="[(v) => v.length > 0 || `Pole nazwisko nie może być puste.`, (v) => v.length < 65 || `Pole nazwisko przekroczyło limit znaków.`]"
                label="Nazwisko"
                placeholder="Nazwisko pracownika"
            />
            <va-input
                class="some-space mb-4"
                v-model="workerEmail"
                :rules="[(v) => v.length > 0 || `Pole email nie może być puste`, (v) => v.length < 256 || `Pole email przekroczyło limit znaków.`]"
                label="Email"
                placeholder="Email pracownika"
            />
            <va-input
                class="some-space mb-4"
                v-model="workerPhone"
                :rules="[(v) => v.length > 8 || `Pole telefon jest nieprawidłowe.`, (v) => v.length < 33 || `Pole telefon przekroczyło limit znaków.`]"
                label="Telefon"
                placeholder="Telefon pracownika"
            />
            <va-select
                class="some-space mb-4"
                v-model="selectedWorksite"
                :options="worksites"
                label="Stanowisko"
                placeholder="Bez stanowiska"
            />
            <va-button type="submit" color="info" gradient class="my-3">Dodaj</va-button>
		</va-form>
	</div>
</template>

<script>
export default {
  name: 'AddWorker',
	data() {
		return {
			workerName: "",
            workerLastName: "",
            workerEmail: "",
			workerPhone: "",
            isFormValidate: false,
            selectedWorksite: "Bez stanowiska",
            rawWorksites: [{IdWorksite: 1, Name: "Administrator"}, {IdWorksite: 2, Name: "Pracownik biurowy"}, {IdWorksite: 3, Name: "Pracownik produkcyjny"}],
		}
	},
    computed: {
        worksites(){
            let resultArr = this.rawWorksites.map(function(item) {
                return item["Name"];
            });

            return ["Bez stanowiska"].concat(resultArr);
        }
    },
    components: {},
	methods: {
		async submitForm() {
            
		},
        validateForm() {
            this.$refs.form.validate();

            return this.isFormValidate;
        },
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
}

h1 {
    margin-bottom: 50px;
}

.some-space {
    padding-bottom: 20px;
}

#form {
	padding-right: 150px;
	padding-left: 150px;
}

</style>
