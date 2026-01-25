<template>
  <div class="login-view">
    <div class="login-container">
      <Card class="login-card">
        <template #title>
          <div class="login-title">
            <i class="pi pi-user"></i>
            <h2>Iniciar Sesión</h2>
          </div>
        </template>

        <template #subtitle>
          <p>Accede a tu cuenta y descubre ofertas exclusivas</p>
        </template>

        <template #content>
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-field">
              <label for="correoElectronico">Correo Electrónico</label>
              <InputText
                id="correoElectronico"
                v-model="form.correoElectronico"
                :class="{ 'p-invalid': errors.correoElectronico }"
                placeholder="tu@email.com"
                @blur="clearError('correoElectronico')"
              />
              <small v-if="errors.correoElectronico" class="p-error">{{ errors.correoElectronico }}</small>
            </div>

            <div class="form-field">
              <label for="password">Contraseña</label>
              <Password
                id="password"
                v-model="form.password"
                :class="{ 'p-invalid': errors.password }"
                placeholder="Tu contraseña"
                :feedback="false"
                toggleMask
                @blur="clearError('password')"
              />
              <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
            </div>

            <Message v-if="errorMessage" severity="error" :closable="false">
              {{ errorMessage }}
            </Message>

            <Button
              type="submit"
              label="Iniciar Sesión"
              icon="pi pi-sign-in"
              class="login-button"
              :loading="loading"
            />
          </form>
        </template>

        <template #footer>
          <div class="login-footer">
            <p>¿No tienes cuenta? <RouterLink to="/register">Regístrate</RouterLink></p>
          </div>
        </template>
      </Card>
    </div>

    <Toast position="bottom-right" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import { validateCredentials, createSession, getCurrentSession } from '@/composables/authComposable'

const form = reactive({
  correoElectronico: '',
  password: ''
})

const errors = reactive({
  correoElectronico: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

function clearError(field: 'correoElectronico' | 'password') {
  errors[field] = ''
}

function validateForm(): boolean {
  let valid = true

  if (!form.correoElectronico.trim()) {
    errors.correoElectronico = 'El correo electrónico es obligatorio'
    valid = false
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(form.correoElectronico)) {
      errors.correoElectronico = 'Correo electrónico no válido'
      valid = false
    }
  }

  if (!form.password) {
    errors.password = 'La contraseña es obligatoria'
    valid = false
  }

  return valid
}

async function handleLogin() {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''

  try {
    const isValid = await validateCredentials(form.correoElectronico, form.password)

    if (isValid) {
      createSession(form.correoElectronico)

      window.location.href = '/';
    } else {
      errorMessage.value = 'Correo electrónico o contraseña incorrectos'
    }
  } catch (error) {
    errorMessage.value = 'Error al iniciar sesión. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}

if (getCurrentSession()) {
  window.location.href = '/';
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.login-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #8e44ad;
}

.login-title i {
  font-size: 1.8rem;
}

.login-title h2 {
  margin: 0;
  font-size: 1.5rem;
}

:deep(.p-card-subtitle) {
  color: #7f8c8d;
  margin-top: 0.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem 0;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-weight: 600;
  color: #2c3e50;
}

.form-field :deep(.p-inputtext),
.form-field :deep(.p-password-input) {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-field :deep(.p-inputtext:focus),
.form-field :deep(.p-password-input:focus) {
  border-color: #8e44ad;
  box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.1);
}

.form-field :deep(.p-invalid) {
  border-color: #e74c3c;
}

.p-error {
  color: #e74c3c;
  font-size: 0.85rem;
}

.login-button {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
}

.login-button:hover {
  background: linear-gradient(135deg, #7d3c98 0%, #8e44ad 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(142, 68, 173, 0.3);
}

.login-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.login-footer p {
  margin: 0;
  color: #7f8c8d;
}

.login-footer a {
  color: #8e44ad;
  font-weight: 600;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>

