import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import 'vuestic-ui/dist/vuestic-ui.css'
import { createApp } from 'vue'
import { VuesticPlugin } from 'vuestic-ui'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).use(VuesticPlugin).mount('#app')