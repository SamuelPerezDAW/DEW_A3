<template>
  <header class="header-container">
    <!-- Banner con búsqueda -->
    <div class="header-banner">
      <div class="header-content">
        <!-- Logo y Título -->
        <div class="header-title">
          <i class="pi pi-heart header-icon"></i>
          <div class="title-text">
            <h1>Dulce Tentación</h1>
            <p class="subtitle">Pasteles y Dulces Artesanales</p>
          </div>
        </div>
        
        <!-- Buscador de productos -->
        <div class="search-container">
          <span class="p-input-icon-left search-input-wrapper">
            <i class="pi pi-search search-icon"></i>
            <InputText 
              v-model="searchQuery" 
              placeholder="Buscar productos..." 
              class="search-input"
              @input="onSearch"
            />
          </span>
        </div>
        
        <!-- Redes sociales -->
        <div class="social-links">
          <a href="https://facebook.com" target="_blank" class="social-link" title="Facebook">
            <i class="pi pi-facebook"></i>
          </a>
          <a href="https://instagram.com" target="_blank" class="social-link" title="Instagram">
            <i class="pi pi-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" class="social-link" title="Twitter">
            <i class="pi pi-twitter"></i>
          </a>
          <a href="https://whatsapp.com" target="_blank" class="social-link" title="WhatsApp">
            <i class="pi pi-whatsapp"></i>
          </a>
        </div>
      </div>
    </div>
    
    <!-- Barra de navegación -->
    <NavbarComponent />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import NavbarComponent from './NavbarComponent.vue'

// Variable reactiva para el búsqueda
const searchQuery = ref('')

// Evento de búsqueda (emitir al padre para filtrar)
function onSearch() {
  // El componente padre puede escuchar este evento o usar watch
}
</script>

<style scoped>
.header-container {
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header-banner {
  background: linear-gradient(135deg, #6c3483 0%, #8e44ad 50%, #9b59b6 100%);
  padding: 1.5rem 2rem;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 3rem;
  color: #ff69b4;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.title-text h1 {
  margin: 0;
  color: white;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  margin: 0.2rem 0 0 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  font-style: italic;
}

.search-container {
  flex: 1;
  max-width: 400px;
  min-width: 250px;
}

.search-input-wrapper {
  width: 100%;
}

.search-input {
  width: 100%;
  border-radius: 25px;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #ff69b4;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
}

.search-icon {
  color: #8e44ad;
  left: 1rem;
}

.social-links {
  display: flex;
  gap: 0.8rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.social-link:hover {
  background: #ff69b4;
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.4);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .header-title {
    flex-direction: column;
  }
  
  .search-container {
    width: 100%;
    max-width: none;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>

