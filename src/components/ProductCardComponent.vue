<template>
  <div class="product-card">
    <!-- Imagen del producto -->
    <div class="product-image">
      <img :src="product.rutaRelativaImagen" :alt="product.nombreProducto" @error="onImageError" />
      <div class="stock-badge" :class="{ 'low-stock': product.stock < 10 }">
        <i class="pi pi-box"></i>
        {{ product.stock }} uds
      </div>
    </div>
    
    <!-- Información del producto -->
    <div class="product-info">
      <h3 class="product-name">{{ product.nombreProducto }}</h3>
      <p class="product-description">{{ product.descripcionProducto }}</p>
      
      <!-- Precio y stock -->
      <div class="product-meta">
        <span class="product-price">
          <i class="pi pi-euro"></i>
          {{ product.precioUnitario.toFixed(2) }}
        </span>
      </div>
      
      <!-- Botón añadir al carrito -->
      <div class="product-actions">
        <Button 
          :label="buttonLabel" 
          icon="pi pi-cart-plus" 
          class="add-button"
          @click="addToCart"
          :disabled="product.stock === 0"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'

/**
 * Interfaz de producto
 */
export interface Product {
  id: number
  nombreProducto: string
  rutaRelativaImagen: string
  descripcionProducto: string
  stock: number
  precioUnitario: number
}

// Props del componente
const props = defineProps<{
  product: Product
}>()

// Events emitidos
const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>()

// Contador de clics en el botón
const clickCount = ref(0)

// Label del botón con el contador
const buttonLabel = computed(() => {
  if (clickCount.value === 0) return 'Añadir'
  return `Añadir ${clickCount.value}`
})

// Evento cuando la imagen no carga
function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = '/assets/images/placeholder.jpg'
}

// Añadir al carrito
function addToCart() {
  if (props.product.stock > 0) {
    clickCount.value++
    emit('add-to-cart', props.product)
  }
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(46, 204, 113, 0.9);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.stock-badge.low-stock {
  background: rgba(231, 76, 60, 0.9);
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
}

.product-description {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #7f8c8d;
  line-height: 1.4;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  margin-bottom: 1rem;
}

.product-price {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 1.3rem;
  font-weight: 700;
}

.product-price i {
  font-size: 0.9rem;
}

.product-actions {
  margin-top: auto;
}

.add-button {
  width: 100%;
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.add-button:hover {
  background: linear-gradient(135deg, #7d3c98 0%, #8e44ad 100%);
  transform: scale(1.02);
}

.add-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}
</style>

