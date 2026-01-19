import CartView from '@/views/CartView.vue'
import LoginView from '@/views/LoginView.vue'
import PurchasedView from '@/views/PurchasedView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ShopView from '@/views/ShopView.vue'
import { createMemoryHistory, createRouter } from 'vue-router'



const routes = [
  { path: '/', component: ShopView },
  { path: '/Purchases', component: PurchasedView },
  { path: '/Cart', component: CartView },
  { path: '/Register', component: RegisterView },
  { path: '/Login', component: LoginView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
