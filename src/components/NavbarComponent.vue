<template>
  <div class="navbar-container">
    <Menubar class="navbar-custom">
      <template #start>
        <RouterLink to="/" class="navbar-logo">
          <i class="pi pi-heart"></i>
          <span>Dulce Tentación</span>
        </RouterLink>
      </template>
      <template #end>
        <div class="navbar-actions">

          <template v-if="!isLoggedIn">
            <RouterLink to="/cart" class="cart-link">
              <i class="pi pi-shopping-cart"></i>
              <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
            </RouterLink>
            <RouterLink to="/login" class="auth-link">
              <i class="pi pi-user"></i>
              <span>Login</span>
            </RouterLink>
            <RouterLink to="/register" class="auth-link">
              <i class="pi pi-user-plus"></i>
              <span>Registro</span>
            </RouterLink>
          </template>

          <template v-else>
            <span class="user-greeting">
              <i class="pi pi-user"></i>
              <span>{{ userEmail }}</span>
            </span>
            <RouterLink to="/cart" class="cart-link">
              <i class="pi pi-shopping-cart"></i>
              <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
            </RouterLink>
            <RouterLink to="/purchases" class="auth-link">
              <span>Mis compras</span>
            </RouterLink>
            <button @click="logout" class="logout-btn">
              <i class="pi pi-sign-out"></i>
              <span>Logout</span>
            </button>
          </template>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Menubar } from 'primevue'
import { useCartStore } from '@/stores/cartStore'
import { getCurrentSession, clearSession, isAuthenticated } from '@/composables/authComposable'

const router = useRouter()
const cartStore = useCartStore()

cartStore.init()

const isLoggedIn = computed(() => isAuthenticated())

const userEmail = computed(() => {
  const session = getCurrentSession()
  return session?.correoElectronico || ''
})

function logout() {
  clearSession()
  cartStore.clearCart()
  router.push('/login')
}
</script>

<style scoped>
.navbar-container {
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-custom {
  border: none;
  background: transparent;
  padding: 0.5rem 1rem;
}

:deep(.p-menubar) {
  border: none;
  background: transparent;
}

:deep(.p-menubar-content) {
  background: transparent;
  border: none;
}

:deep(.p-menuitem-link) {
  color: white !important;
}

:deep(.p-menuitem-icon) {
  color: white !important;
}

:deep(.p-menubar-item-label) {
  color: white !important;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.navbar-logo:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-logo i {
  color: #ff69b4;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-link,
.auth-link {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: white;
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  transition: background-color 0.3s;
  font-size: 0.95rem;
}

.cart-link:hover,
.auth-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #e74c3c;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-greeting {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  padding: 0.5rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
}
</style>

