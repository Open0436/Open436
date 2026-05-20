<template>
  <div class="tabbar">
    <div class="tabbar-track">
      <div class="tabbar-pill" :style="pillStyle"></div>
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="tabbar-item"
        :class="{ active: isActive(tab) }"
        :ref="el => { if (el) tabRefs[tab.key] = el }"
      >
        <span class="tabbar-icon-wrap">
          <svg class="tabbar-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="tab.key === 'forum'">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </template>
            <template v-else-if="tab.key === 'quiz'">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 12l2 2 4-4"/>
            </template>
            <template v-else-if="tab.key === 'enroll'">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
            </template>
            <template v-else-if="tab.key === 'mine'">
              <circle cx="12" cy="8" r="4"/>
              <path d="M5 21a7 7 0 0 1 14 0"/>
            </template>
          </svg>
        </span>
        <span class="tabbar-label">{{ tab.label }}</span>
      </router-link>
    </div>
    <div class="tabbar-glow"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tabRefs = ref({})

const tabs = [
  { key: 'forum', label: '论坛', path: '/' },
  { key: 'quiz', label: '答题', path: '/quiz' },
  { key: 'enroll', label: '报名', path: '/enroll' },
  { key: 'mine', label: '我的', path: '/mine' }
]

function isActive(tab) {
  if (tab.path === '/') {
    return route.path === '/' || route.path.startsWith('/post') || route.path.startsWith('/search') || route.path.startsWith('/favorites')
  }
  return route.path.startsWith(tab.path)
}

const activeKey = computed(() => {
  const active = tabs.find(t => isActive(t))
  return active ? active.key : 'forum'
})

const pillStyle = computed(() => {
  const el = tabRefs.value[activeKey.value]
  if (!el) return { opacity: 0 }
  const rect = el.$el ? el.$el.getBoundingClientRect() : el.getBoundingClientRect()
  const parent = el.$el ? el.$el.parentElement.getBoundingClientRect() : el.parentElement.getBoundingClientRect()
  return {
    opacity: 1,
    width: `${rect.width + 8}px`,
    transform: `translateX(${rect.left - parent.left - 4}px)`
  }
})

onMounted(() => nextTick(() => { /* trigger initial pill position */ }))
watch(() => route.path, () => nextTick(() => { /* update pill on route change */ }))
</script>

<style scoped>
.tabbar {
  position: fixed;
  top: var(--navbar-h);
  left: 0;
  right: 0;
  height: var(--tabbar-h);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  z-index: 99;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.tabbar-glow {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary-light), var(--primary), var(--primary-light), transparent);
  opacity: 0.4;
}
.tabbar-track {
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 var(--s-lg);
  position: relative;
  gap: 4px;
}
.tabbar-pill {
  position: absolute;
  height: 34px;
  background: var(--primary-bg);
  border-radius: 17px;
  transition: all 380ms cubic-bezier(0.4, 0, 0.1, 1);
  z-index: 0;
  pointer-events: none;
  top: 50%;
  transform-origin: center center;
  margin-top: -17px;
}
.tabbar-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 18px;
  height: 34px;
  color: var(--text-secondary);
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: 0.2px;
  text-decoration: none;
  position: relative;
  z-index: 1;
  border-radius: 17px;
  transition: color 250ms ease;
  white-space: nowrap;
  user-select: none;
}
.tabbar-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}
.tabbar-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  transition: transform 250ms ease, stroke 250ms ease;
}
.tabbar-item:hover {
  color: var(--primary-dark);
}
.tabbar-item:hover .tabbar-icon {
  transform: scale(1.12);
}
.tabbar-item.active {
  color: var(--primary);
  font-weight: 600;
}
.tabbar-item.active .tabbar-icon {
  stroke: var(--primary);
}
.tabbar-label {
  line-height: 1;
}

@media (max-width: 599px) {
  .tabbar-track {
    max-width: 100%;
    padding: 0;
    justify-content: space-around;
    gap: 0;
  }
  .tabbar-item {
    flex-direction: column;
    gap: 3px;
    padding: 4px 0;
    border-radius: 0;
    flex: 1;
    height: auto;
  }
  .tabbar-pill {
    display: none;
  }
  .tabbar-item.active {
    position: relative;
  }
  .tabbar-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 3px;
    background: var(--primary);
    border-radius: 2px;
  }
  .tabbar-label {
    font-size: 11px;
  }
  .tabbar-icon-wrap {
    width: 24px;
    height: 24px;
  }
  .tabbar-icon {
    width: 22px;
    height: 22px;
  }
}
</style>
