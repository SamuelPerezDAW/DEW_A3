<template>
  <div class="shop-view">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>
          <i class="pi pi-heart"></i>
          Bienvenidos a Dulce Tentación
        </h1>
        <p>Descubre nuestros dulces artesanales elaborados con los mejores ingredientes</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <label><i class="pi pi-filter"></i> Filtrar por:</label>
        <Dropdown 
          v-model="selectedCategory" 
          :options="categories" 
          placeholder="Todas las categorías" 
          showClear
          class="filter-dropdown"
        />
      </div>
      <div class="search-results" v-if="searchQuery">
        <Tag severity="info" :value="`Resultados para: ${searchQuery}`" />
        <Button 
          icon="pi pi-times" 
          text 
          @click="clearSearch"
          aria-label="Limpiar búsqueda"
        />
      </div>
    </div>

    <!-- Products Grid -->
    <div class="products-container">
      <DataView :value="filteredProducts" layout="grid" :loading="loading">
        <template #grid="slotProps">
          <div class="products-grid">
            <div v-for="product in slotProps.items" :key="product.id" class="product-grid-item">
              <ProductCardComponent 
                :product="product"
                @add-to-cart="handleAddToCart"
              />
            </div>
          </div>
        </template>
        <template #empty>
          <div class="no-products">
            <i class="pi pi-search"></i>
            <h3>No se encontraron productos</h3>
            <p>Intenta con otros filtros o términos de búsqueda</p>
          </div>
        </template>
      </DataView>
    </div>

    <!-- Toast para notificaciones -->
    <Toast position="bottom-right" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import DataView from 'primevue/dataview'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import ProductCardComponent from '@/components/ProductCardComponent.vue'
import { useCartStore } from '@/stores/cartStore'
import { getSearchQuery } from '@/composables/searchComposable'

// Importar productos
import productsData from '@/data/dataProductsShop.json'

/**
 * Interfaz de producto
 */
interface Product {
  id: number
  nombreProducto: string
  rutaRelativaImagen: string
  descripcionProducto: string
  stock: number
  precioUnitario: number
  categoria?: string
}

// Referencias reactivas
const products = ref<Product[]>(productsData as Product[])
const loading = ref(false)
const selectedCategory = ref<string | null>(null)

// Usar el composable para la búsqueda
const searchQuery = ref(getSearchQuery())

// Store del carrito
const cartStore = useCartStore()

// Watch para sincronizar con el composable de búsqueda
watch(() => getSearchQuery(), (newValue) => {
  searchQuery.value = newValue
})

// Categorías disponibles
const categories = [
  { label: 'Dulces Tradicionales', value: 'tradicional' },
  { label: 'Tartas', value: 'tarta' },
  { label: ' Magdalenas y Repostería', value: 'reposteria' }
]

// Productos filtrados
const filteredProducts = computed(() => {
  let result = products.value
  
  // Filtrar por categoría
  if (selectedCategory.value) {
    result = result.filter(p => 
      p.nombreProducto.toLowerCase().includes(selectedCategory.value!.toLowerCase())
    )
  }
  
  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.nombreProducto.toLowerCase().includes(query) ||
      p.descripcionProducto.toLowerCase().includes(query)
    )
  }
  
  return result
})

// Manejar añadir al carrito
function handleAddToCart(product: Product) {
  cartStore.addToCart(product)
}

// Limpiar búsqueda
function clearSearch() {
  searchQuery.value = ''
}

// Cargar productos al montar
onMounted(() => {
  cartStore.init()
})
</script>

<style scoped>
.shop-view {
  min-height: 100vh;
  background: #f8f9fa;
}

.hero-section {
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 50%, #ab47bc 100%);
  padding: 3rem 2rem;
  text-align: center;
  color: white;
}

.hero-content h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.hero-content h1 i {
  color: #ff69b4;
}

.hero-content p {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
}

.filters-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.filter-dropdown {
  min-width: 200px;
}

.search-results {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.products-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 2rem 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.product-grid-item {
  display: flex;
}

.no-products {
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
}

.no-products i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-products h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.no-products p {
  margin: 0;
}

:deep(.p-dataview) {
  background: transparent;
}

:deep(.p-dataview-content) {
  background: transparent;
}

:deep(.p-dataview-grid) {
  border: none;
  background: transparent;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 1.8rem;
    flex-direction: column;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>

