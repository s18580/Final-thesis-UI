<template>
    <va-modal
        v-model="showModal"
        title="Pomoc"
        hide-default-actions
        @click-outside="closeModal()"
    >
        <div class="background-modal">
            <p>W razie wszelkich problemów prosimy się zgłosić do swojego administratora.</p>
            <va-button id="okButton" @click="closeModal()" color="info" gradient class="my-3 sub">Ok</va-button>
        </div>
    </va-modal>
</template>

<script>
export default {
    name: 'HelpModal',
    emits: ["close"],
	data() {
		return {
            showModal: true,
		}
	},
	methods: {
        closeModal() {
            this.$emit('close');
        }
	},
}
</script>

<style scoped>
</style>

