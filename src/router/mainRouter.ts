import CartView from '@/views/CartView.vue'
import LoginView from '@/views/LoginView.vue'
import PurchasedView from '@/views/PurchasedView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ShopView from '@/views/ShopView.vue'
import { createMemoryHistory, createRouter } from 'vue-router'



const routes = [
  { path: '/', component: ShopView },
  { path: '/purchased', component: PurchasedView },
  { path: '/cart', component: CartView },
  { path: '/register', component: RegisterView },
  { path: '/login', component: LoginView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
