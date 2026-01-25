<template>
  <div class="purchased-view">
    <div class="purchased-header">
      <h1>
        <i class="pi pi-history"></i>
        Mis Compras
      </h1>
    </div>

    <div class="purchased-content">
      <!-- Sin historial -->
      <div v-if="purchasedHistory.length === 0" class="empty-history">
        <i class="pi pi-shopping-bag"></i>
        <h2>No tienes compras aún</h2>
        <p>¡Haz tu primera compra en nuestra tienda!</p>
        <RouterLink to="/" class="go-shopping">
          <Button label="Ir a la Tienda" icon="pi pi-arrow-right" />
        </RouterLink>
      </div>

      <!-- Historial de compras -->
      <div v-else class="history-container">
        <!-- Resumen -->
        <div class="history-summary">
          <Card>
            <template #content>
              <div class="summary-stats">
                <div class="stat">
                  <i class="pi pi-shopping-cart"></i>
                  <div>
                    <span class="stat-value">{{ totalOrders }}</span>
                    <span class="stat-label">Pedidos</span>
                  </div>
                </div>
                <div class="stat">
                  <i class="pi pi-box"></i>
                  <div>
                    <span class="stat-value">{{ totalItems }}</span>
                    <span class="stat-label">Productos</span>
                  </div>
                </div>
                <div class="stat">
                  <i class="pi pi-euro"></i>
                  <div>
                    <span class="stat-value">{{ totalSpent.toFixed(2) }} €</span>
                    <span class="stat-label">Total gastado</span>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Lista de compras -->
        <div class="history-list">
          <DataTable :value="groupedHistory" responsiveLayout="scroll" sortField="fecha" :sortOrder="-1">
            <Column field="fecha" header="Fecha" sortable>
              <template #body="slotProps">
                {{ formatDate(slotProps.data.fecha) }}
              </template>
            </Column>
            
            <Column field="items" header="Productos">
              <template #body="slotProps">
                <div class="products-list">
                  <div v-for="item in slotProps.data.items" :key="item.id" class="product-item">
                    <span class="product-name">{{ item.nombreProducto }}</span>
                    <span class="product-qty">x{{ item.cantidad }}</span>
                  </div>
                </div>
              </template>
            </Column>
            
            <Column field="total" header="Total">
              <template #body="slotProps">
                <span class="order-total">{{ slotProps.data.total.toFixed(2) }} €</span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Toast position="bottom-right" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useCartStore, type PurchaseRecord } from '@/stores/cartStore'
import { isAuthenticated } from '@/composables/authComposable'

const router = useRouter()
const cartStore = useCartStore()

// Obtener historial de compras como propiedad reactiva
const purchasedHistory = computed(() => cartStore.getHistory())

// Inicializar store y verificar autenticación
onMounted(() => {
  cartStore.init()
  
  // Verificar si está logueado, si no redirigir al login
  if (!isAuthenticated()) {
    router.push('/login')
    return
  }
})


// Interfaz para grupo de historial
interface HistoryGroup {
  fecha: string
  items: PurchaseRecord[]
  total: number
}

// Historial agrupado por fecha de compra
const groupedHistory = computed(() => {
  const history = cartStore.getHistory()
  const groups = new Map<string, HistoryGroup>()
  
  history.forEach(item => {
    const dateKey = item.fechaCompra.split('T')[0]
    
    let group = groups.get(dateKey)
    if (!group) {
      group = {
        fecha: dateKey,
        items: [],
        total: 0
      }
      groups.set(dateKey, group)
    }
    
    group.items.push(item)
    group.total += item.precioUnitario * item.cantidad
  })
  
  return Array.from(groups.values()).sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )
})

// Total de pedidos únicos
const totalOrders = computed(() => groupedHistory.value.length)

// Total de productos comprados
const totalItems = computed(() => {
  const history = cartStore.getHistory()
  return history.reduce((sum, item) => sum + item.cantidad, 0)
})

// Total gastado
const totalSpent = computed(() => {
  return groupedHistory.value.reduce((sum, group) => sum + group.total, 0)
})

// Formatear fecha
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.purchased-view {
  min-height: 100vh;
  background: #f8f9fa;
}

.purchased-header {
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  padding: 2rem;
  text-align: center;
  color: white;
}

.purchased-header h1 {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
}

.purchased-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.empty-history {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.empty-history i {
  font-size: 5rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
}

.empty-history h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.empty-history p {
  margin: 0 0 1.5rem 0;
  color: #7f8c8d;
}

.go-shopping {
  text-decoration: none;
}

.history-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.history-summary {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  border-radius: 12px;
  color: white;
}

.stat i {
  font-size: 2rem;
  opacity: 0.9;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  opacity: 0.9;
}

.history-list {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.product-item {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
}

.product-name {
  color: #2c3e50;
}

.product-qty {
  color: #8e44ad;
  font-weight: 600;
}

.order-total {
  font-weight: 700;
  color: #27ae60;
  font-size: 1.1rem;
}

:deep(.p-datatable) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.p-datatable-thead > tr > th) {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
}

:deep(.p-card) {
  border-radius: 16px;
  box-shadow: none;
}

@media (max-width: 768px) {
  .purchased-header h1 {
    font-size: 1.5rem;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
}
</style>

