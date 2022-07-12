<template>
    <div id="background">
        <div id="headerCo">
            <h1>Stałe programowe</h1>
            <va-divider />
        </div>
        <va-sidebar id="menuCo" color="primary" text-color="background" gradient minimizedWidth="64px" width="18rem">
            <va-sidebar-item/>
            <va-sidebar-item 
                class="clicableItem"
                v-for="item in dictionaryData"
                @click="activeSwitch($event)"
                :key="item.title"
                active-color="#217cde"
                text-color="#ffffff"
                :active="item.active"
            >
                <va-sidebar-item-content>
                    <va-icon name="fiber_manual_record" />
                    <va-sidebar-item-title>
                        {{ item.title }}
                    </va-sidebar-item-title>
                </va-sidebar-item-content>
            </va-sidebar-item>
            <va-sidebar-item/>
        </va-sidebar>
        <div id="mainCo">
            <ConstantsList :listLabel="constantTitle" :constants="constantData"/>
        </div>
    </div>
</template>

<script>
import ConstantsList from './ReuseComponents/ConstantsList.vue';

export default {
  name: 'ProgramConstants',
	data() {
		return {
			dictionaryData: [
                { title: 'Status pliku' },
                { title: 'Typ pliku', active: true },
                { title: 'Typ wiązania' },
                { title: 'Rodzaj dostawy' },
                { title: 'Status zamówienia' },
                { title: 'Stanowisko pracy' },
                { title: 'Typ przedmiotu dostawy' },
                { title: 'Typ przedmiotu zamówienia' },
                { title: 'Usługa' },
                { title: 'Cennik' },
            ],
            constantTitle: "",
            constantData: [],
		}
	},
    components: {ConstantsList},
    mounted() {
        //api calls for an arrays
        this.constantData = [{Id: 1, Name: 'Graficzny'}, {Id: 2, Name: 'Pocztowy'}, {Id: 3, Name: 'Wymagania'}, {Id: 4, Name: 'Wzory'}, {Id: 5, Name: 'Wyniki'}, {Id: 6, Name: 'Umowa'},{Id: 11, Name: 'Graficzny2'}];
        this.constantTitle = "Typy plików";
    },
	methods: {
        activeSwitch(e) {
            let clickedItem = e.path.find(element => element.className.includes("clicableItem"));

            if(!clickedItem.className.includes("active")) {
                let title = clickedItem.textContent.replace("fiber_manual_record","");
                this.changeActiveData(title);
                this.showSelectedTable(title);
            }
        },
        changeActiveData(selectedTitle) {
            for(var i = 0; i < this.dictionaryData.length; i++) {
                delete this.dictionaryData[i].active;
            }

            let selectedItemIndex = this.dictionaryData.findIndex(element => element.title == selectedTitle);
            this.dictionaryData[selectedItemIndex].active = true;
        },
        showSelectedTable(selectedTitle) {   
            this.switchShowOff();

            switch(selectedTitle) {
            case 'Status pliku':
                //api call
                break;
            case 'Typ pliku':
                //api call
                break;
            case 'Typ wiązania':
                //api call
                break;
            case 'Rodzaj dostawy':
                //api call
                break;
            case 'Status zamówienia':
                //api call
                break;
            case 'Stanowisko pracy':
                //api call
                break;
            case 'Typ przedmiotu dostawy':
                //api call
                break;
            case 'Typ przedmiotu zamówienia':
                //api call
                break;
            case 'Usługa':
                //api call
                break;
            case 'Cennik':
                //api call
                break;
            default:
                // do nothing
            }
        }
	},
}
</script>

<style scoped>
#background {
    display: grid;
    grid-template-columns: 100px 1fr 1fr 1fr 1fr 100px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". header header header header ."
    ". sidebar main main main ."
    ". . main main main .";
    grid-gap: 30px;
}

#mainCo {
    grid-area: main;
	padding: 0px;
    padding-left: 20px;
    padding-right: 20px;
	background: white;
	border-radius: 25px;
}

#menuCo {
    grid-area: sidebar;
    padding-top: 5px;
    background: white;
	border-radius: 25px;
    height: 605px;
}

#headerCo {
    padding: 20px;
    grid-area: header;
    background: white;
	border-radius: 25px;
}

</style>