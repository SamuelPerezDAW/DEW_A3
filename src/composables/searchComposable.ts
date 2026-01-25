import { ref } from 'vue'

const searchQuery = ref('')

export function getSearchQuery(): string {
  return searchQuery.value
}

export function setSearchQuery(query: string): void {
  searchQuery.value = query
}

export function clearSearch(): void {
  searchQuery.value = ''
}

