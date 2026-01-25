export interface User {
  nombreUsuario: string
  correoElectronico: string
  passwordHash: string
}

export interface ValidationResult {
  valid: boolean
  message: string
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function validateNombreUsuario(nombreUsuario: string): boolean {
  const regex = /^[a-zA-Z0-9\s]{3,20}$/
  return regex.test(nombreUsuario)
}

export function validateCorreoElectronico(correo: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  const maxLength = 100
  return regex.test(correo) && correo.length <= maxLength
}

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

export function getUsers(): User[] {
  const data = localStorage.getItem('DataUsers')
  return data ? JSON.parse(data) : []
}

export async function saveUser(user: Omit<User, 'passwordHash'> & { password: string }): Promise<boolean> {
  const users = getUsers()

  if (users.some(u => u.correoElectronico === user.correoElectronico)) {
    return false
  }

  const passwordHash = await sha256(user.password)

  users.push({
    nombreUsuario: user.nombreUsuario,
    correoElectronico: user.correoElectronico,
    passwordHash: passwordHash
  })

  localStorage.setItem('DataUsers', JSON.stringify(users))
  return true
}

export async function validateCredentials(correoElectronico: string, password: string): Promise<boolean> {
  const users = getUsers()
  const passwordHash = await sha256(password)

  return users.some(
    user =>
      user.correoElectronico === correoElectronico &&
      user.passwordHash === passwordHash
  )
}

export function createSession(correoElectronico: string): void {
  sessionStorage.setItem('ShopSession', JSON.stringify({ correoElectronico }))
}

export function clearSession(): void {
  sessionStorage.removeItem('ShopSession')
}

export function getCurrentSession(): { correoElectronico: string } | null {
  const session = sessionStorage.getItem('ShopSession')
  return session ? JSON.parse(session) : null
}

export function isAuthenticated(): boolean {
  return getCurrentSession() !== null
}

export function getPasswordErrorMessage(password: string): string {
  if (password.length < 6) return 'Mínimo 6 caracteres'
  if (password.length > 12) return 'Máximo 12 caracteres'
  if (!/[A-Z]/.test(password)) return 'Debe tener 1 mayúscula'
  if (!/[! "#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password)) return 'Debe tener 1 carácter especial'
  return ''
}

