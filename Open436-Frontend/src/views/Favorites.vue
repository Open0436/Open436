<template>
  <AppNavbar />
  <AppSidebar @select="() => {}" />
  <div class="forum-layout with-sidebar">
    <div class="forum-main">
      <div class="card">
        <div class="card-header">
          <div class="tabs">
            <button class="tab" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">全部收藏</button>
            <button class="tab" :class="{ active: activeTab === 'recent' }" @click="activeTab = 'recent'">最近收藏</button>
          </div>
        </div>
        <div v-for="post in filteredPosts" :key="post.id" class="fav-item">
          <div class="fav-content">
            <h3 class="fav-title">{{ post.title }}</h3>
            <p class="fav-preview">{{ post.content }}</p>
            <div class="fav-meta">
              <span>u/{{ post.author }}</span>
              <span class="dot">·</span>
              <span>{{ formatDate(post.createdAt) }}</span>
              <span class="dot">·</span>
              <span>{{ post.votes }} 赞</span>
            </div>
          </div>
          <button class="unfav-btn" @click="removeFav(post.id)" title="取消收藏">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
        <div v-if="filteredPosts.length === 0" class="empty-state">
          <p>暂无收藏帖子</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useUIStore } from '@/stores/ui'
import { formatDate } from '@/utils/format'

const ui = useUIStore()
const activeTab = ref('all')

const posts = ref([
  { id: 1, title: 'Vue 3 Composition API 最佳实践总结', content: '本文总结了在实际项目中使用 Vue 3 Composition API 的经验，包括响应式数据管理、自定义 Hooks 设计...', author: '前端小王', votes: 128, createdAt: '2026-05-19T10:30:00', favoritedAt: '2026-05-19T12:00:00' },
  { id: 2, title: '推荐10个高质量开发者播客频道', content: '整理了我过去一年持续收听的10个技术播客，涵盖前端、后端、架构设计等方向...', author: '播客达人', votes: 73, createdAt: '2026-05-16T20:00:00', favoritedAt: '2026-05-17T09:00:00' },
  { id: 3, title: '免费开源的设计系统资源合集', content: '整理了 20+ 个高质量开源设计系统，包含 Figma 组件库、Design Token 方案...', author: '资源收集者', votes: 89, createdAt: '2026-05-13T18:00:00', favoritedAt: '2026-05-14T10:00:00' },
  { id: 4, title: 'Git 高级技巧：交互式 Rebase 实战', content: '很多开发者只会基本的 git rebase -i，但它的强大远不止于此。本文演示如何用交互式 Rebase 美化提交历史...', author: 'Git大师', votes: 68, createdAt: '2026-05-09T15:00:00', favoritedAt: '2026-05-09T16:00:00' }
])

const filteredPosts = computed(() => {
  if (activeTab.value === 'recent') {
    const weekAgo = Date.now() - 7 * 86400000
    return posts.value.filter(p => new Date(p.favoritedAt).getTime() > weekAgo)
  }
  return posts.value
})

function removeFav(id) {
  posts.value = posts.value.filter(p => p.id !== id)
  ui.showToast('已取消收藏', 'info')
}
</script>

<style scoped>
.tabs { display: flex; gap: 0; }
.tab {
  padding: 4px 16px; font-size: 14px; font-weight: 500; color: var(--text-secondary);
  border-bottom: 2px solid transparent; transition: all var(--t-fast);
}
.tab:hover { color: var(--text-primary); }
.tab.active { color: var(--primary); border-bottom-color: var(--primary); }
.fav-item { display: flex; align-items: flex-start; padding: var(--s-lg); border-bottom: 1px solid var(--divider); gap: var(--s-base); }
.fav-content { flex: 1; cursor: pointer; }
.fav-title { font-size: 16px; font-weight: 500; margin-bottom: 4px; }
.fav-preview { font-size: 13px; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: var(--s-xs); }
.fav-meta { font-size: 12px; color: var(--text-disabled); display: flex; gap: var(--s-xs); }
.dot { color: var(--text-disabled); }
.unfav-btn {
  flex-shrink: 0; width: 36px; height: 36px; border-radius: var(--r-sm);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary); transition: all var(--t-fast);
}
.unfav-btn:hover { background: rgba(244,67,54,0.08); color: var(--error); }
.empty-state { text-align: center; padding: var(--s-3xl); color: var(--text-secondary); }
</style>
