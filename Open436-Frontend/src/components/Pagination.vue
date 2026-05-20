<template>
  <div class="pagination" v-if="totalPages > 1">
    <button class="page-btn" :disabled="modelValue <= 1" @click="$emit('update:modelValue', modelValue - 1)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <button
      v-for="p in visiblePages" :key="p"
      class="page-btn" :class="{ active: p === modelValue }"
      @click="$emit('update:modelValue', p)"
    >{{ p }}</button>
    <button class="page-btn" :disabled="modelValue >= totalPages" @click="$emit('update:modelValue', modelValue + 1)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ modelValue: Number, totalPages: Number })
defineEmits(['update:modelValue'])
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, props.modelValue - 2)
  const end = Math.min(props.totalPages, props.modelValue + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
</script>

<style scoped>
.pagination { display: flex; gap: 4px; justify-content: center; padding: var(--s-lg) 0; }
.page-btn {
  width: 36px; height: 36px; border-radius: var(--r-sm); border: 1px solid var(--divider);
  background: var(--bg); display: flex; align-items: center; justify-content: center;
  font-size: 14px; transition: all var(--t-fast);
}
.page-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
.page-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
