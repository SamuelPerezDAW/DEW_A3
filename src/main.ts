import { createApp } from 'vue'
import { router } from './router/mainRouter'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura  from '@primeuix/themes/aura'
import '../node_modules/primeflex/primeflex.css'
import '../node_modules/primeflex/themes/primeone-light.css'
import '../node_modules/primeicons/primeicons.css'

import App from './App.vue'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(createPinia())
app.use(router)

app.mount('#app')
