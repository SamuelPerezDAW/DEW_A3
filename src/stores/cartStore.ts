/**
 * cartStore.ts
 * Store de Pinia para gestión del carrito de compras
 * Maneja tanto usuarios autenticados (LocalStorage) como invitados (SessionStorage)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCurrentSession, isAuthenticated } from '@/composables/authComposable'

/**
 * Interfaz de producto en el carrito
 */
export interface CartItem {
  id: number
  nombreProducto: string
  precioUnitario: number
  cantidad: number
}

/**
 * Interfaz de compra histórica
 */
export interface PurchaseRecord {
  fechaCompra: string
  id: number
  nombreProducto: string
  precioUnitario: number
  cantidad: number
}

export const useCartStore = defineStore('cart', () => {
  // Referencias reactivas
  const items = ref<CartItem[]>([])

  /**
   * Obtiene la clave de storage según el estado de autenticación
   */
  function getStorageKey(): string {
    const session = getCurrentSession()
    if (session && isAuthenticated()) {
      return `${session.correoElectronico}CartStore`
    }
    return 'GuestCartStore'
  }

  /**
   * Obtiene la clave de historial según el usuario autenticado
   */
  function getHistoryStorageKey(): string {
    const session = getCurrentSession()
    return session ? `${session.correoElectronico}HistoryPurchased` : ''
  }

  /**
   * Carga el carrito desde el storage correspondiente
   */
  function loadCart(): void {
    const key = getStorageKey()
    if (isAuthenticated()) {
      const data = localStorage.getItem(key)
      items.value = data ? JSON.parse(data) : []
    } else {
      const data = sessionStorage.getItem(key)
      items.value = data ? JSON.parse(data) : []
    }
  }

  /**
   * Guarda el carrito en el storage correspondiente
   */
  function saveCart(): void {
    const key = getStorageKey()
    if (isAuthenticated()) {
      localStorage.setItem(key, JSON.stringify(items.value))
    } else {
      sessionStorage.setItem(key, JSON.stringify(items.value))
    }
  }

  /**
   * Añade un producto al carrito
   * Si ya existe, incrementa la cantidad
   */
  function addToCart(product: { id: number; nombreProducto: string; precioUnitario: number }): void {
    loadCart()
    
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.cantidad++
    } else {
      items.value.push({
        id: product.id,
        nombreProducto: product.nombreProducto,
        precioUnitario: product.precioUnitario,
        cantidad: 1
      })
    }
    
    saveCart()
  }

  /**
   * Elimina un producto del carrito
   */
  function removeFromCart(productId: number): void {
    loadCart()
    items.value = items.value.filter(item => item.id !== productId)
    saveCart()
  }

  /**
   * Actualiza la cantidad de un producto
   */
  function updateQuantity(productId: number, quantity: number): void {
    loadCart()
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.cantidad = quantity
        saveCart()
      }
    }
  }

  /**
   * Limpia completamente el carrito
   */
  function clearCart(): void {
    items.value = []
    
    if (isAuthenticated()) {
      const key = getStorageKey()
      localStorage.removeItem(key)
    } else {
      sessionStorage.removeItem('GuestCartStore')
    }
  }

  /**
   * Calcula el subtotal (sin IGIC)
   */
  const subtotal = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0)
  })

  /**
   * Calcula el IGIC (7%)
   */
  const igic = computed(() => {
    return subtotal.value * 0.07
  })

  /**
   * Calcula el total (subtotal + IGIC)
   */
  const total = computed(() => {
    return subtotal.value + igic.value
  })

  /**
   * Obtiene el número total de items en el carrito
   */
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.cantidad, 0)
  })

  /**
   * Guarda una compra en el historial
   */
  function saveToHistory(): void {
    const historyKey = getHistoryStorageKey()
    if (!historyKey) return

    const history = getHistory()
    const now = new Date()
    const fechaCompra = now.toISOString()

    items.value.forEach(item => {
      history.push({
        fechaCompra,
        id: item.id,
        nombreProducto: item.nombreProducto,
        precioUnitario: item.precioUnitario,
        cantidad: item.cantidad
      })
    })

    localStorage.setItem(historyKey, JSON.stringify(history))
  }

  /**
   * Obtiene el historial de compras del usuario actual
   */
  function getHistory(): PurchaseRecord[] {
    const historyKey = getHistoryStorageKey()
    if (!historyKey) return []

    const data = localStorage.getItem(historyKey)
    return data ? JSON.parse(data) : []
  }

  /**
   * Inicializa el store cargando el carrito
   */
  function init(): void {
    loadCart()
  }

  return {
    items,
    subtotal,
    igic,
    total,
    totalItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    saveToHistory,
    getHistory,
    loadCart,
    init
  }
})

