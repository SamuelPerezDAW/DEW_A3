import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import OtherView from '../views/OtherView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/other', component: OtherView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
