import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const sidebarOpen = ref(false)
  const toasts = ref([])
  let toastId = 0

  function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }

  function showToast(message, type = 'info', duration = 3000) {
    const id = ++toastId
    toasts.value.push({ id, message, type })
    setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, duration)
  }

  return { sidebarOpen, toasts, toggleSidebar, showToast }
})
