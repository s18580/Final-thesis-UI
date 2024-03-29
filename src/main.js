import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import 'vuestic-ui/dist/vuestic-ui.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VuesticPlugin } from 'vuestic-ui'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

createApp(App).use(createPinia().use(piniaPluginPersistedstate)).use(router).use(VuesticPlugin).mount('#app')