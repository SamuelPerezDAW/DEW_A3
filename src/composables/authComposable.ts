/**
 * authComposable.ts
 * Composables para gestión de autenticación de usuarios
 * Maneja registro, login y validación de credenciales
 */

/**
 * Interfaz de usuario para la BBDD simulada
 */
export interface User {
  nombreUsuario: string
  correoElectronico: string
  passwordHash: string
}

/**
 * Interfaz de resultado de validación
 */
export interface ValidationResult {
  valid: boolean
  message: string
}

/**
 * Genera un hash SHA-256 para una cadena de texto
 * @param message - Texto a hashear
 * @returns Hash en formato hexadecimal
 */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Valida el formato del nombre de usuario
 * @param nombreUsuario - Nombre a validar
 * @returns true si es válido
 */
export function validateNombreUsuario(nombreUsuario: string): boolean {
  // Mínimo 3 caracteres, máximo 20, solo letras, números y espacios
  const regex = /^[a-zA-Z0-9\s]{3,20}$/
  return regex.test(nombreUsuario)
}

/**
 * Valida el formato del correo electrónico
 * @param correo - Correo a validar
 * @returns true si es válido
 */
export function validateCorreoElectronico(correo: string): boolean {
  // Regex básico para correo electrónico
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  const maxLength = 100
  return regex.test(correo) && correo.length <= maxLength
}

/**
 * Valida el formato de la contraseña
 * Mínimo 6 caracteres, máximo 12, 1 mayúscula y 1 carácter especial
 * @param password - Contraseña a validar
 * @returns true si es válido
 */
export function validatePassword(password: string): boolean {
  const minLength = 6
  const maxLength = 12
  const hasUpperCase = /[A-Z]/.test(password)
  const hasSpecialChar = /[! "#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password)
  
  return (
    password.length >= minLength &&
    password.length <= maxLength &&
    hasUpperCase &&
    hasSpecialChar
  )
}

/**
 * Obtiene los usuarios almacenados en LocalStorage
 * @returns Array de usuarios o array vacío si no existen
 */
export function getUsers(): User[] {
  const data = localStorage.getItem('DataUsers')
  return data ? JSON.parse(data) : []
}

/**
 * Guarda un nuevo usuario en LocalStorage
 * @param user - Usuario a guardar
 */
export async function saveUser(user: Omit<User, 'passwordHash'> & { password: string }): Promise<boolean> {
  const users = getUsers()
  
  // Verificar si el correo ya existe
  if (users.some(u => u.correoElectronico === user.correoElectronico)) {
    return false
  }
  
  // Hashear la contraseña
  const passwordHash = await sha256(user.password)
  
  // Guardar usuario
  users.push({
    nombreUsuario: user.nombreUsuario,
    correoElectronico: user.correoElectronico,
    passwordHash: passwordHash
  })
  
  localStorage.setItem('DataUsers', JSON.stringify(users))
  return true
}

/**
 * Valida las credenciales de un usuario
 * @param correoElectronico - Correo del usuario
 * @param password - Contraseña en texto plano
 * @returns true si las credenciales son válidas
 */
export async function validateCredentials(correoElectronico: string, password: string): Promise<boolean> {
  const users = getUsers()
  const passwordHash = await sha256(password)
  
  return users.some(
    user => 
      user.correoElectronico === correoElectronico && 
      user.passwordHash === passwordHash
  )
}

/**
 * Inicia sesión creando la sesión en SessionStorage
 * @param correoElectronico - Correo del usuario autenticado
 */
export function createSession(correoElectronico: string): void {
  sessionStorage.setItem('ShopSession', JSON.stringify({ correoElectronico }))
}

/**
 * Cierra la sesión eliminando la sesión de SessionStorage
 */
export function clearSession(): void {
  sessionStorage.removeItem('ShopSession')
}

/**
 * Obtiene el usuario actualmente autenticado
 * @returns Objecto con correoElectronico o null si no hay sesión
 */
export function getCurrentSession(): { correoElectronico: string } | null {
  const session = sessionStorage.getItem('ShopSession')
  return session ? JSON.parse(session) : null
}

/**
 * Verifica si hay un usuario autenticado
 * @returns true si hay sesión activa
 */
export function isAuthenticated(): boolean {
  return getCurrentSession() !== null
}

/**
 * Genera un mensaje de error para validación de contraseña
 * @param password - Contraseña a evaluar
 * @returns Mensaje de error o string vacío si es válida
 */
export function getPasswordErrorMessage(password: string): string {
  if (password.length < 6) return 'Mínimo 6 caracteres'
  if (password.length > 12) return 'Máximo 12 caracteres'
  if (!/[A-Z]/.test(password)) return 'Debe tener 1 mayúscula'
  if (!/[! "#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password)) return 'Debe tener 1 carácter especial'
  return ''
}

