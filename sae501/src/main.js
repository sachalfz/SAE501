import './assets/css/reset.css'
import './assets/css/imports.css'
import './assets/css/variables.css'
import './assets/css/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './connection/store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'
import 'popper.js'
import 'jquery'

export const apiShop = 'https://shop.mmi-limoges.fr'
export const apiShopLocal = 'http://localhost:3000'

export const apiMusic = 'https://music.mmi-limoges.fr'
export const apiMusicLocal = 'http://localhost:3001'

export const apiUserInventory = 'https://user-inventory.mmi-limoges.fr'
export const apiUserInventoryLocal = 'http://localhost:3002'

const app = createApp(App)

app.use(router)
store.dispatch('initializeApp')
app.use(store)

app.mount('#app')
