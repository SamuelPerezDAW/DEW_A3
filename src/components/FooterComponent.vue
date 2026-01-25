<template>
  <footer class="footer-container">
    <div class="footer-content">
      <!-- Mapa del sitio -->
      <div class="footer-section">
        <h3 class="footer-title">
          <i class="pi pi-sitemap"></i>
          Mapa del Sitio
        </h3>
        <ul class="footer-links">
          <li><RouterLink to="/"><i class="pi pi-home"></i> Inicio</RouterLink></li>
          <li><RouterLink to="/"><i class="pi pi-shopping-bag"></i> Tienda</RouterLink></li>
          <li><RouterLink to="/cart"><i class="pi pi-shopping-cart"></i> Carrito</RouterLink></li>
          <li><RouterLink to="/login"><i class="pi pi-user"></i> Login</RouterLink></li>
          <li><RouterLink to="/register"><i class="pi pi-user-plus"></i> Registro</RouterLink></li>
          <li v-if="isAuthenticated"><RouterLink to="/purchased"><i class="pi pi-history"></i> Mis Compras</RouterLink></li>
        </ul>
      </div>
      
      <!-- Información de contacto -->
      <div class="footer-section">
        <h3 class="footer-title">
          <i class="pi pi-phone"></i>
          Contacto
        </h3>
        <div class="contact-info">
          <div class="contact-item">
            <i class="pi pi-map-marker"></i>
            <div>
              <strong>Dirección:</strong>
              <p>Calle Dulce, 123<br>35001 Las Palmas de Gran Canaria<br>España</p>
            </div>
          </div>
          <div class="contact-item">
            <i class="pi pi-phone"></i>
            <div>
              <strong>Teléfono:</strong>
              <p>+34 928 123 456</p>
            </div>
          </div>
          <div class="contact-item">
            <i class="pi pi-envelope"></i>
            <div>
              <strong>Email:</strong>
              <p>info@dulcetentacion.com</p>
            </div>
          </div>
          <div class="contact-item">
            <i class="pi pi-clock"></i>
            <div>
              <strong>Horario:</strong>
              <p>Lunes a Sábado: 8:00 - 20:00<br>Domingo: 9:00 - 14:00</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mapa de ubicación -->
      <div class="footer-section">
        <h3 class="footer-title">
          <i class="pi pi-map"></i>
          Nuestra Ubicación
        </h3>
        <div class="map-container">
          <iframe 
            src="https://www.openstreetmap.org/export/embed.html?bbox=-15.43%2C28.09%2C-15.40%2C28.12&amp;layer=mapnik&amp;marker=28.10%2C-15.42"
            width="100%" 
            height="200" 
            style="border: 0; border-radius: 8px;"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
          <a href="https://www.openstreetmap.org/#map=14/28.10/-15.42" target="_blank" class="map-link">
            <i class="pi pi-external-link"></i>
            Ver en mapa completo
          </a>
        </div>
      </div>
    </div>
    
    <!-- Copyright -->
    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} Dulce Tentación. Todos los derechos reservados.</p>
      <p class="footer-made">Hecho con <i class="pi pi-heart"></i> y Vue.js</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { isAuthenticated } from '@/composables/authComposable'

// Año actual para el copyright
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer-container {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.footer-section {
  padding: 1rem;
}

.footer-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  color: #ff69b4;
  border-bottom: 2px solid rgba(255, 105, 180, 0.3);
  padding-bottom: 0.5rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.8rem;
}

.footer-links a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-links a:hover {
  color: #ff69b4;
  transform: translateX(5px);
}

.footer-links i {
  font-size: 0.9rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.contact-item i {
  color: #ff69b4;
  font-size: 1.2rem;
  margin-top: 0.2rem;
}

.contact-item strong {
  display: block;
  color: #ff69b4;
  margin-bottom: 0.2rem;
}

.contact-item p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.4;
}

.map-container {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
}

.map-container iframe {
  display: block;
}

.map-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  color: #ff69b4;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.map-link:hover {
  color: #ff8dc7;
}

.footer-bottom {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem 2rem;
  text-align: center;
}

.footer-bottom p {
  margin: 0.3rem 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.footer-made {
  color: rgba(255, 255, 255, 0.5) !important;
}

.footer-made i {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
  }
}
</style>

