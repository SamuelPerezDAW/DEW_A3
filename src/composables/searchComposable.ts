/**
 * searchComposable.ts
 * Composables compartido para la búsqueda de productos
 */

import { ref } from 'vue'

// Variable reactiva compartida para la búsqueda
const searchQuery = ref('')

/**
 * Obtiene la consulta de búsqueda actual
 */
export function getSearchQuery(): string {
  return searchQuery.value
}

/**
 * Establece la consulta de búsqueda
 */
export function setSearchQuery(query: string): void {
  searchQuery.value = query
}

/**
 * Limpia la búsqueda
 */
export function clearSearch(): void {
  searchQuery.value = ''
}

