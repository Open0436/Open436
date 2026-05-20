<template>
  <div class="toast-container">
    <div v-for="t in ui.toasts" :key="t.id" class="toast" :class="'toast-' + t.type">
      {{ t.message }}
    </div>
  </div>
</template>

<script setup>
import { useUIStore } from '@/stores/ui'
const ui = useUIStore()
</script>
