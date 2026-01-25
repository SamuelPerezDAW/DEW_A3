<template>
  <div class="cart-view">
    <div class="cart-header">
      <h1>
        <i class="pi pi-shopping-cart"></i>
        Tu Carrito de Compras
      </h1>
    </div>

    <div class="cart-content">
      <!-- Carrito vacío -->
      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <i class="pi pi-shopping-cart"></i>
        <h2>Tu carrito está vacío</h2>
        <p>¡Añade algunos productos deliciosos!</p>
        <RouterLink to="/" class="continue-shopping">
          <Button label="Volver a la Tienda" icon="pi pi-arrow-left" />
        </RouterLink>
      </div>

      <!-- Carrito con productos -->
      <div v-else class="cart-with-items">
        <!-- Lista de productos -->
        <div class="cart-items">
          <DataTable :value="cartStore.items" responsiveLayout="scroll">
            <Column field="nombreProducto" header="Producto">
              <template #body="slotProps">
                <div class="product-info">
                  <span class="product-name">{{ slotProps.data.nombreProducto }}</span>
                </div>
              </template>
            </Column>
            
            <Column field="precioUnitario" header="Precio">
              <template #body="slotProps">
                <span class="price">{{ slotProps.data.precioUnitario.toFixed(2) }} €</span>
              </template>
            </Column>
            
            <Column field="cantidad" header="Cantidad">
              <template #body="slotProps">
                <div class="quantity-controls">
                  <Button 
                    icon="pi pi-minus" 
                    text 
                    rounded 
                    size="small"
                    @click="decreaseQuantity(slotProps.data.id)"
                    :disabled="slotProps.data.cantidad <= 1"
                  />
                  <span class="quantity">{{ slotProps.data.cantidad }}</span>
                  <Button 
                    icon="pi pi-plus" 
                    text 
                    rounded 
                    size="small"
                    @click="increaseQuantity(slotProps.data.id)"
                  />
                </div>
              </template>
            </Column>
            
            <Column field="precioUnitario" header="Subtotal">
              <template #body="slotProps">
                <span class="subtotal">{{ (slotProps.data.precioUnitario * slotProps.data.cantidad).toFixed(2) }} €</span>
              </template>
            </Column>
            
            <Column header="Acciones">
              <template #body="slotProps">
                <Button 
                  icon="pi pi-trash" 
                  text 
                  rounded 
                  severity="danger"
                  @click="removeItem(slotProps.data.id)"
                  v-tooltip.top="'Eliminar'"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Resumen del pedido -->
        <div class="cart-summary">
          <Card>
            <template #title>
              <i class="pi pi-receipt"></i>
              Resumen del Pedido
            </template>
            <template #content>
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>{{ cartStore.subtotal.toFixed(2) }} €</span>
              </div>
              <div class="summary-row">
                <span>IGIC (7%):</span>
                <span>{{ cartStore.igic.toFixed(2) }} €</span>
              </div>
              <Divider />
              <div class="summary-row total">
                <span>Total:</span>
                <span>{{ cartStore.total.toFixed(2) }} €</span>
              </div>
            </template>
            <template #footer>
              <div class="summary-actions">
                <Button 
                  label="Cancelar" 
                  icon="pi pi-times" 
                  severity="secondary"
                  outlined
                  @click="cancelOrder"
                />
                <Button 
                  label="Pagar" 
                  icon="pi pi-check" 
                  severity="success"
                  @click="processPayment"
                  :loading="processing"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- Toast para notificaciones -->
    <Toast position="bottom-right" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Toast from 'primevue/toast'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()
const processing = ref(false)

// Inicializar store
cartStore.init()

// Aumentar cantidad
function increaseQuantity(productId: number) {
  const item = cartStore.items.find(i => i.id === productId)
  if (item) {
    cartStore.updateQuantity(productId, item.cantidad + 1)
  }
}

// Disminuir cantidad
function decreaseQuantity(productId: number) {
  const item = cartStore.items.find(i => i.id === productId)
  if (item && item.cantidad > 1) {
    cartStore.updateQuantity(productId, item.cantidad - 1)
  }
}

// Eliminar producto
function removeItem(productId: number) {
  cartStore.removeFromCart(productId)
}

// Cancelar pedido
function cancelOrder() {
  cartStore.clearCart()
  router.push('/')
}

// Procesar pago
async function processPayment() {
  processing.value = true
  
  // Simular procesamiento
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Guardar en historial si está logueado
  if (localStorage.getItem('ShopSession')) {
    cartStore.saveToHistory()
  }
  
  // Limpiar carrito
  cartStore.clearCart()
  processing.value = false
  
  // Mostrar toast de éxito
  // El toast se muestra automáticamente por el componente Toast
  
  router.push('/')
}
</script>

<style scoped>
.cart-view {
  min-height: 100vh;
  background: #f8f9fa;
}

.cart-header {
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  padding: 2rem;
  text-align: center;
  color: white;
}

.cart-header h1 {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
}

.cart-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.empty-cart i {
  font-size: 5rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
}

.empty-cart h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.empty-cart p {
  margin: 0 0 1.5rem 0;
  color: #7f8c8d;
}

.continue-shopping {
  text-decoration: none;
}

.cart-with-items {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}

.cart-items {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 600;
  color: #2c3e50;
}

.price,
.subtotal {
  font-weight: 600;
  color: #8e44ad;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
}

.cart-summary {
  position: sticky;
  top: 2rem;
}

:deep(.p-card) {
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

:deep(.p-card-title) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #8e44ad;
  font-size: 1.25rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #7f8c8d;
}

.summary-row.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
}

.summary-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.summary-actions :deep(.p-button) {
  flex: 1;
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

@media (max-width: 992px) {
  .cart-with-items {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}

@media (max-width: 576px) {
  .cart-header h1 {
    font-size: 1.5rem;
  }
  
  .cart-content {
    padding: 1rem;
  }
  
  .summary-actions {
    flex-direction: column;
  }
}
</style>

