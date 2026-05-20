<template>
  <AppNavbar />
  <AppSidebar @select="() => {}" />
  <div class="forum-layout with-sidebar">
    <div class="forum-main">
      <div class="search-header">
        <h2>搜索：{{ query }}</h2>
        <div class="section-tabs">
          <button class="filter-chip" :class="{ active: activeSection === 'all' }" @click="activeSection = 'all'">全部</button>
          <button v-for="s in sectionStore.sections.filter(s => s.key !== 'all')" :key="s.key" class="filter-chip" :class="{ active: activeSection === s.key }" @click="activeSection = s.key">{{ s.name }}</button>
        </div>
      </div>
      <div class="card">
        <div v-for="post in filteredResults" :key="post.id" class="search-item" @click="router.push(`/post/${post.id}`)">
          <div class="search-meta">
            <span class="section-tag" :style="{ background: getSectionColor(post.section) }">{{ getSectionName(post.section) }}</span>
            <span>u/{{ post.author }}</span>
            <span class="dot">·</span>
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
          <h3 class="search-title" v-html="highlight(post.title)"></h3>
          <p class="search-preview" v-html="highlight(post.content)"></p>
        </div>
        <div v-if="filteredResults.length === 0" class="empty-state">
          <p>未找到相关结果</p>
          <div class="suggestion-tags">
            <span class="suggest-label">试试搜索：</span>
            <button v-for="tag in suggestions" :key="tag" class="suggest-tag" @click="router.push({ query: { q: tag } })">{{ tag }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useSectionStore } from '@/stores/section'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const sectionStore = useSectionStore()
const query = computed(() => route.query.q || '')
const activeSection = ref('all')
const suggestions = ['Vue 3', 'TypeScript', '性能优化', 'Docker', 'CSS']

const results = ref([
  { id: 1, title: 'Vue 3 Composition API 最佳实践总结', content: '本文总结了在实际项目中使用 Vue 3 Composition API 的经验，包括响应式数据管理、自定义 Hooks 设计、性能优化技巧等核心内容', author: '前端小王', section: 'tech', createdAt: '2026-05-19T10:30:00' },
  { id: 2, title: 'Pinia 和 Vuex 5 该选哪个？', content: '新项目启动在即，状态管理库的选择让我纠结。Pinia 已经成为 Vue 官方推荐，但 Vuex 5 似乎也有不少改进', author: '选择困难症', section: 'question', createdAt: '2026-05-14T14:00:00' },
  { id: 8, title: 'Rust + WebAssembly 在前端的实际应用案例', content: '分享我们将图像处理核心逻辑用 Rust 重写并编译为 WASM 的完整过程，性能提升超过 10 倍', author: '性能狂魔', section: 'tech', createdAt: '2026-05-15T15:30:00' },
  { id: 17, title: 'CSS Container Queries 实战体验', content: '容器查询终于得到了所有主流浏览器的支持！本文通过实际项目案例展示如何用容器查询替代媒体查询', author: 'CSS布道者', section: 'tech', createdAt: '2026-05-11T09:30:00' },
  { id: 20, title: '如何优雅地处理前端错误边界？', content: '错误边界是提升用户体验的关键。本文对比 Vue 3 的 onErrorCaptured 与 React Error Boundary 的设计差异', author: '架构思考者', section: 'tech', createdAt: '2026-05-09T10:00:00' }
])

const filteredResults = computed(() => {
  if (activeSection.value === 'all') return results.value
  return results.value.filter(p => p.section === activeSection.value)
})

function getSectionName(key) { return sectionStore.getSection(key)?.name || '' }
function getSectionColor(key) { return sectionStore.getSection(key)?.color || '#757575' }

function highlight(text) {
  if (!query.value) return text
  const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(${escaped})`, 'gi')
  return text.replace(re, '<mark>$1</mark>')
}
</script>

<style scoped>
.search-header { margin-bottom: var(--s-base); }
.search-header h2 { font-size: 20px; font-weight: 600; margin-bottom: var(--s-sm); }
.section-tabs { display: flex; gap: var(--s-sm); flex-wrap: wrap; }
.filter-chip {
  padding: 4px 12px; border-radius: 999px; font-size: 13px;
  border: 1px solid var(--divider); color: var(--text-secondary); transition: all var(--t-fast);
}
.filter-chip:hover { border-color: var(--primary); color: var(--primary); }
.filter-chip.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.search-item { padding: var(--s-lg); border-bottom: 1px solid var(--divider); cursor: pointer; transition: background var(--t-fast); }
.search-item:hover { background: #f8f9fa; }
.search-meta { display: flex; align-items: center; gap: var(--s-xs); font-size: 12px; color: var(--text-secondary); margin-bottom: var(--s-xs); }
.section-tag { padding: 1px 8px; border-radius: 999px; color: #fff; font-size: 11px; }
.dot { color: var(--text-disabled); }
.search-title { font-size: 16px; font-weight: 500; margin-bottom: 4px; }
.search-preview { font-size: 13px; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
:deep(mark) { background: #FFF176; padding: 0 2px; border-radius: 2px; }
.empty-state { text-align: center; padding: var(--s-3xl); }
.suggestion-tags { margin-top: var(--s-base); }
.suggest-label { font-size: 13px; color: var(--text-secondary); }
.suggest-tag {
  display: inline-block; padding: 4px 12px; margin: var(--s-xs); border-radius: 999px;
  border: 1px solid var(--divider); font-size: 13px; color: var(--primary); transition: all var(--t-fast);
}
.suggest-tag:hover { background: var(--primary-bg); border-color: var(--primary); }
</style>
