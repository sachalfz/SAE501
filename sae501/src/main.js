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


const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
