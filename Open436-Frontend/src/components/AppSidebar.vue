<template>
  <aside class="sidebar" :class="{ active: ui.sidebarOpen }">
    <div class="sidebar-header">板块分类</div>
    <nav class="sidebar-menu">
      <a
        v-for="s in sectionStore.sections"
        :key="s.key"
        class="sidebar-link"
        :class="{ active: sectionStore.activeSection === s.key }"
        @click="selectSection(s.key)"
      >
        <div class="sidebar-icon" :style="{ background: s.color + '15' }">
          <img
            :src="`https://api.iconify.design/${s.icon}.svg?color=%23${s.color.slice(1)}&width=20`"
            :alt="s.name"
            width="20" height="20"
          />
        </div>
        <span class="sidebar-name">{{ s.name }}</span>
        <span v-if="s.count && s.key !== 'all'" class="sidebar-count">{{ s.count }}</span>
      </a>
    </nav>
  </aside>
  <div v-if="ui.sidebarOpen" class="sidebar-overlay" @click="ui.toggleSidebar()"></div>
</template>

<script setup>
import { useSectionStore } from '@/stores/section'
import { useUIStore } from '@/stores/ui'

const sectionStore = useSectionStore()
const ui = useUIStore()
const emit = defineEmits(['select'])

function selectSection(key) {
  sectionStore.setActive(key)
  emit('select', key)
  if (window.innerWidth < 960) ui.sidebarOpen = false
}
</script>

<style scoped>
.sidebar {
  position: fixed; left: 0; top: var(--navbar-h); bottom: 0;
  width: var(--sidebar-w); background: var(--bg); border-right: 1px solid var(--divider);
  padding: var(--s-lg) 0; overflow-y: auto; z-index: 50;
}
.sidebar-header {
  padding: 0 var(--s-lg) var(--s-base); font-size: 13px; font-weight: 600;
  color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;
}
.sidebar-menu { display: flex; flex-direction: column; gap: 2px; padding: 0 var(--s-sm); }
.sidebar-link {
  display: flex; align-items: center; gap: var(--s-sm);
  padding: var(--s-sm) var(--s-base); border-radius: var(--r-md);
  color: var(--text-primary); font-size: 14px; cursor: pointer;
  transition: all var(--t-fast);
}
.sidebar-link:hover { background: var(--bg-dark); }
.sidebar-link.active {
  background: var(--primary-bg); border-left: 3px solid var(--primary);
  padding-left: calc(var(--s-base) - 3px); color: var(--primary); font-weight: 500;
}
.sidebar-icon {
  width: 32px; height: 32px; border-radius: var(--r-sm);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.sidebar-name { flex: 1; }
.sidebar-count {
  font-size: 12px; color: var(--text-secondary); background: var(--bg-dark);
  padding: 1px 8px; border-radius: 999px;
}
.sidebar-link.active .sidebar-count { background: var(--primary); color: #fff; }
.sidebar-overlay { display: none; }

@media (max-width: 959px) {
  .sidebar {
    transform: translateX(-100%); transition: transform var(--t-base);
    box-shadow: var(--sh-lg);
  }
  .sidebar.active { transform: translateX(0); }
  .sidebar-overlay {
    display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.3);
    z-index: 49;
  }
}
</style>
