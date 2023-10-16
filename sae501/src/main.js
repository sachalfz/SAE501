import './assets/css/reset.css'
import './assets/css/main.css'
import './assets/css/base.css'
import './assets/css/imports.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'
import 'popper.js'
import 'jquery'


const app = createApp(App)

app.use(router)

app.mount('#app')
