import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCurrentSession, isAuthenticated } from '@/composables/authComposable'

export interface CartItem {
  id: number
  nombreProducto: string
  precioUnitario: number
  cantidad: number
}

export interface PurchaseRecord {
  fechaCompra: string
  id: number
  nombreProducto: string
  precioUnitario: number
  cantidad: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  function getStorageKey(): string {
    const session = getCurrentSession()
    if (session && isAuthenticated()) {
      return `${session.correoElectronico}CartStore`
    }
    return 'GuestCartStore'
  }

  function getHistoryStorageKey(): string {
    const session = getCurrentSession()
    return session ? `${session.correoElectronico}HistoryPurchased` : ''
  }

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

  function saveCart(): void {
    const key = getStorageKey()
    if (isAuthenticated()) {
      localStorage.setItem(key, JSON.stringify(items.value))
    } else {
      sessionStorage.setItem(key, JSON.stringify(items.value))
    }
  }

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

  function removeFromCart(productId: number): void {
    loadCart()
    items.value = items.value.filter(item => item.id !== productId)
    saveCart()
  }

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

  function clearCart(): void {
    items.value = []

    if (isAuthenticated()) {
      const key = getStorageKey()
      localStorage.removeItem(key)
    } else {
      sessionStorage.removeItem('GuestCartStore')
    }
  }

  const subtotal = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0)
  })

  const igic = computed(() => {
    return subtotal.value * 0.07
  })

  const total = computed(() => {
    return subtotal.value + igic.value
  })

  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.cantidad, 0)
  })

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

  function getHistory(): PurchaseRecord[] {
    const historyKey = getHistoryStorageKey()
    if (!historyKey) return []

    const data = localStorage.getItem(historyKey)
    return data ? JSON.parse(data) : []
  }

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

