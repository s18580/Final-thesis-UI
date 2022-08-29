<template>
    <div>
		<div>
			<div>
				<!-- Panel z statystyk systemowych pokazujący ilości dodanych elementów lub panel rozmiarów rozmiar danych, agregowanych w API podczas zapisu pliku ? -->
			</div>
			<div id="toolsCo">
				<va-card stripe stripe-color="success">
					<img src="@/assets/seq-nuget.png" alt="Seq logo"/>
					<va-card-title>Seq</va-card-title>
					<va-card-content>Kolekcjonuje logi systemowe zarówno z UI jak i API.</va-card-content>
					<va-card-content><a href="http://localhost:8081/#/login" target="_blank">Logowanie do platformy</a></va-card-content>
				</va-card>
				<va-card stripe stripe-color="warning">
					<img id="s3Image" src="@/assets/aws-s3-logo-svgrepo-com.svg" alt="S3 logo"/>
					<va-card-title>Amazon S3</va-card-title>
					<va-card-content>Serwer przechowujący wszystkie pliki w tym systemie.</va-card-content>
					<va-card-content><a href="https://vuestic.dev/en/ui-elements/icon" target="_blank">Logowanie do platformy</a></va-card-content>
				</va-card>
			</div>
		</div>
	</div>
</template>

<script>
export default {
    name: 'AdminHome',
    data() {
		return {
            
		}
	},
}
</script>

<style scoped>
#toolsCo {
	display: flex;
	justify-content: space-evenly;
}

#s3Image{
	margin-top: 40px;
	margin-bottom: 40px;
}
</style>