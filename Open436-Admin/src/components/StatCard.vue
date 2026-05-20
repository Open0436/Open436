<template>
  <el-card shadow="hover" class="stat-card">
    <div class="stat-card-body">
      <div class="stat-info">
        <div class="stat-label">{{ label }}</div>
        <div class="stat-value">{{ value }}</div>
        <div class="stat-change" :class="changeClass" v-if="change !== undefined">
          <el-icon :size="12"><ArrowUp v-if="change > 0" /><ArrowDown v-else /></el-icon>
          {{ Math.abs(change) }}%
        </div>
      </div>
      <div class="stat-icon" :style="{ background: iconBg }">
        <el-icon :size="28" :color="iconColor"><component :is="icon" /></el-icon>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: [String, Number],
  icon: [String, Object],
  iconBg: { type: String, default: '#e3f2fd' },
  iconColor: { type: String, default: '#1976D2' },
  change: Number
})

const changeClass = computed(() => props.change > 0 ? 'up' : 'down')
</script>

<style lang="scss" scoped>
.stat-card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}
.stat-change {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 2px;
  &.up { color: #67c23a; }
  &.down { color: #f56c6c; }
}
.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
