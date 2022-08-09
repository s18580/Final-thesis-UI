<template>
    <va-modal
        v-model="showModal"
        title="Dodaj rolę"
        hide-default-actions
        @click-outside="closeModal()"
    >
        <div class="background-modal">
            <va-form @submit.prevent="submitForm()" id="modalForm" tag="form" ref="modalForm">
                <va-select
                    class="some-space mb-4"
                    v-model="selectedRole"
                    :options="roles"
                    label="Rola"
                    placeholder="Wybierz rolę"
                />
                <div class="buttonCo">
                    <va-button @click="closeModal()" flat text-color="gray" color="gray" class="mr-4 mb-2"> Anuluj </va-button>
                    <va-button type="submit" color="primary" class="mr-4 mb-2"> Dodaj </va-button>
                </div>
            </va-form>
        </div>
    </va-modal>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';

export default {
  name: 'RoleModal',
  emits: ["addRole", "close"],
	data() {
		return {
            showModal: true,
            selectedRole: "",
            rawRoles: [],
		}
	},
    computed: {
        roles(){
            let resultArr = this.rawRoles.map(function(item) {
                return item["name"];
            });

            return resultArr;
        }
    },
	methods: {
		submitForm() {
            if(this.validateForm()) {
                let roleId = this.rawRoles.find(element => element.name == this.selectedRole).idRole
                this.$emit('addRole', {idRole: roleId, name: this.selectedRole});
                this.closeModal();
            }
		},
        validateForm() {
            if(this.selectedRole === "" || this.selectedRole === "Wybierz rolę") {
                this.$vaToast.init({ message: 'Wybierz konkretną rolę.', color: 'danger', duration: 2000 })
                return false;
            }

            return true;
        },
        closeModal() {
            this.$emit('close');
        }
	},
    async mounted() {
        this.selectedRole = "";

        let callPath = "/Role/getRoles";
        this.rawRoles = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        console.log(this.rawRoles);
    }
}
</script>

<style scoped>
#modalForm {
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.buttonCo {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
}
</style>

