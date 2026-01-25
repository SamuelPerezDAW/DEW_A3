<template>
  <div class="register-view">
    <div class="register-container">
      <Card class="register-card">
        <template #title>
          <div class="register-title">
            <i class="pi pi-user-plus"></i>
            <h2>Crear Cuenta</h2>
          </div>
        </template>

        <template #subtitle>
          <p>Únete a Dulce Tentación y descubre ofertas exclusivas</p>
        </template>

        <template #content>
          <form @submit.prevent="handleRegister" class="register-form">
            <div class="form-field">
              <label for="nombreUsuario">Nombre de Usuario</label>
              <InputText
                id="nombreUsuario"
                v-model="form.nombreUsuario"
                :class="{ 'p-invalid': errors.nombreUsuario }"
                placeholder="Ej: Juan Pérez"
                @blur="validateNombreUsuario"
              />
              <small v-if="errors.nombreUsuario" class="p-error">{{ errors.nombreUsuario }}</small>
            </div>

            <div class="form-field">
              <label for="correoElectronico">Correo Electrónico</label>
              <InputText
                id="correoElectronico"
                v-model="form.correoElectronico"
                :class="{ 'p-invalid': errors.correoElectronico }"
                placeholder="tu@email.com"
                @blur="validateCorreoElectronico"
              />
              <small v-if="errors.correoElectronico" class="p-error">{{ errors.correoElectronico }}</small>
            </div>

            <div class="form-field">
              <label for="password">Contraseña</label>
              <Password
                id="password"
                v-model="form.password"
                :class="{ 'p-invalid': errors.password }"
                placeholder="Mínimo 6 caracteres, 1 mayúscula y 1 especial"
                :feedback="false"
                toggleMask
                @blur="validatePassword"
              />
              <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
              <small v-else class="form-hint">
                Mínimo 6 caracteres, 1 mayúscula y 1 carácter especial (! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~)
              </small>
            </div>

            <div class="form-field">
              <label for="confirmPassword">Confirmar Contraseña</label>
              <Password
                id="confirmPassword"
                v-model="form.confirmPassword"
                :class="{ 'p-invalid': errors.confirmPassword }"
                placeholder="Repite tu contraseña"
                :feedback="false"
                toggleMask
                @blur="validateConfirmPassword"
              />
              <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
            </div>

            <Message v-if="errorMessage" severity="error" :closable="false">
              {{ errorMessage }}
            </Message>

            <Button
              type="submit"
              label="Crear Cuenta"
              icon="pi pi-check"
              class="register-button"
              :loading="loading"
            />
          </form>
        </template>

        <template #footer>
          <div class="register-footer">
            <p>¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink></p>
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
import { saveUser } from '@/composables/authComposable'
import { validateNombreUsuario as validateNombreUsuarioFn, validateCorreoElectronico as validateCorreoElectronicoFn, validatePassword as validatePasswordFn, createSession } from '@/composables/authComposable'

const form = reactive({
  nombreUsuario: '',
  correoElectronico: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  nombreUsuario: '',
  correoElectronico: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const errorMessage = ref('')

function validateNombreUsuario() {
  if (!form.nombreUsuario.trim()) {
    errors.nombreUsuario = 'El nombre de usuario es obligatorio'
  } else if (!validateNombreUsuarioFn(form.nombreUsuario)) {
    errors.nombreUsuario = '3-20 caracteres, solo letras, números y espacios'
  } else {
    errors.nombreUsuario = ''
  }
}

function validateCorreoElectronico() {
  if (!form.correoElectronico.trim()) {
    errors.correoElectronico = 'El correo electrónico es obligatorio'
  } else if (!validateCorreoElectronicoFn(form.correoElectronico)) {
    errors.correoElectronico = 'Correo electrónico no válido o muy largo'
  } else {
    errors.correoElectronico = ''
  }
}

function validatePassword() {
  if (!form.password) {
    errors.password = 'La contraseña es obligatoria'
  } else if (!validatePasswordFn(form.password)) {
    errors.password = 'No cumple los requisitos mínimos'
  } else {
    errors.password = ''
  }
}

function validateConfirmPassword() {
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  } else {
    errors.confirmPassword = ''
  }
}

function validateForm(): boolean {
  validateNombreUsuario()
  validateCorreoElectronico()
  validatePassword()
  validateConfirmPassword()

  return !errors.nombreUsuario &&
         !errors.correoElectronico &&
         !errors.password &&
         !errors.confirmPassword
}

async function handleRegister() {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''

  try {
    const success = await saveUser({
      nombreUsuario: form.nombreUsuario,
      correoElectronico: form.correoElectronico,
      password: form.password
    })

    if (success) {
      createSession(form.correoElectronico)
      window.location.href = '/';
    } else {
      errorMessage.value = 'Ya existe una cuenta con este correo electrónico'
    }
  } catch (error) {
    errorMessage.value = 'Error al registrar. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-container {
  width: 100%;
  max-width: 480px;
}

.register-card {
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.register-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #8e44ad;
}

.register-title i {
  font-size: 1.8rem;
}

.register-title h2 {
  margin: 0;
  font-size: 1.5rem;
}

:deep(.p-card-subtitle) {
  color: #7f8c8d;
  margin-top: 0.5rem;
}

.register-form {
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

.form-hint {
  color: #95a5a6;
  font-size: 0.8rem;
  line-height: 1.4;
}

.register-button {
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

.register-button:hover {
  background: linear-gradient(135deg, #7d3c98 0%, #8e44ad 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(142, 68, 173, 0.3);
}

.register-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.register-footer p {
  margin: 0;
  color: #7f8c8d;
}

.register-footer a {
  color: #8e44ad;
  font-weight: 600;
  text-decoration: none;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>

