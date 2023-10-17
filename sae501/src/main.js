import './assets/css/reset.css'
<<<<<<< HEAD
import './assets/css/imports.css'
import './assets/css/variables.css'
import './assets/css/style.css'
=======
import './assets/css/main.css'
import './assets/css/base.css'
import './assets/css/imports.css'
>>>>>>> 0e56db26e0632d8af0392f68df42c317a9e43c62

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
