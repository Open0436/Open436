<template>
  <AppNavbar />
  <AppSidebar @select="() => {}" />
  <div class="forum-layout with-sidebar">
    <div class="forum-main">
      <div class="card profile-header">
        <img :src="user.avatar" class="avatar avatar-xl" />
        <div class="profile-info">
          <h1 class="profile-name">{{ user.nickname }}</h1>
          <div class="profile-username">@{{ user.username }}</div>
          <p class="profile-bio">{{ user.bio }}</p>
          <div class="profile-stats">
            <div class="stat-item"><span class="stat-value">{{ formatNumber(user.stats.posts) }}</span><span class="stat-label">帖子</span></div>
            <div class="stat-item"><span class="stat-value">{{ formatNumber(user.stats.replies) }}</span><span class="stat-label">回复</span></div>
            <div class="stat-item"><span class="stat-value">{{ formatNumber(user.stats.likes) }}</span><span class="stat-label">获赞</span></div>
            <div class="stat-item"><span class="stat-value">{{ formatNumber(user.stats.favorites) }}</span><span class="stat-label">收藏</span></div>
          </div>
          <div class="profile-joined">加入于 {{ user.joinDate }}</div>
        </div>
      </div>
      <div class="card" style="margin-top: var(--s-base)">
        <div class="tabs">
          <button class="tab" :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">发帖历史</button>
          <button class="tab" :class="{ active: activeTab === 'replies' }" @click="activeTab = 'replies'">回复历史</button>
        </div>
        <div v-if="activeTab === 'posts'">
          <div v-for="p in posts" :key="p.id" class="history-item">
            <h3 class="history-title">{{ p.title }}</h3>
            <div class="history-meta">{{ formatDate(p.createdAt) }} · {{ p.votes }} 赞 · {{ p.replyCount }} 回复</div>
          </div>
        </div>
        <div v-else>
          <div v-for="r in replies" :key="r.id" class="history-item">
            <div class="history-meta">回复了《{{ r.postTitle }}》</div>
            <p class="history-content">{{ r.content }}</p>
            <div class="history-meta">{{ formatDate(r.createdAt) }} · {{ r.votes }} 赞</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { formatDate, formatNumber } from '@/utils/format'

const route = useRoute()
const activeTab = ref('posts')

const user = ref({
  id: route.params.id || '1', nickname: '前端小王', username: 'frontend_wang',
  avatar: 'https://ui-avatars.com/api/?name=前端小王&background=1976D2&color=fff&size=120',
  bio: '热爱前端技术，专注于 Vue.js 和性能优化。开源贡献者，技术博客写手。',
  joinDate: '2025-03-15',
  stats: { posts: 42, replies: 186, likes: 2340, favorites: 89 }
})

const posts = ref([
  { id: 1, title: 'Vue 3 Composition API 最佳实践总结', createdAt: '2026-05-19T10:30:00', votes: 128, replyCount: 32 },
  { id: 2, title: '前端性能优化实战：从 8s 到 1s 的优化之路', createdAt: '2026-05-10T14:00:00', votes: 89, replyCount: 24 },
  { id: 3, title: 'Pinia 状态管理进阶：自定义插件开发指南', createdAt: '2026-04-28T09:00:00', votes: 56, replyCount: 15 }
])

const replies = ref([
  { id: 1, postTitle: '2026年前端开发趋势预测', content: '非常认同关于 AI 辅助编程的观点，我在实际工作中已经深刻感受到了效率提升，但也需要注意代码质量把控。', createdAt: '2026-05-18T16:00:00', votes: 18 },
  { id: 2, postTitle: 'Vite 构建速度突然变慢怎么排查？', content: '建议检查一下是否有循环依赖的问题，可以用 rollup-plugin-visualizer 来分析包的依赖关系。', createdAt: '2026-05-17T13:00:00', votes: 12 },
  { id: 3, postTitle: '如何优雅地处理前端错误边界？', content: '补充一点：在 Vue 3 中还可以配合 Suspense 组件来处理异步组件的错误状态，体验会更好。', createdAt: '2026-05-09T15:00:00', votes: 8 }
])
</script>

<style scoped>
.profile-header { display: flex; gap: var(--s-xl); padding: var(--s-xl); align-items: flex-start; }
.profile-info { flex: 1; }
.profile-name { font-size: 24px; font-weight: 600; margin-bottom: 2px; }
.profile-username { font-size: 14px; color: var(--text-secondary); margin-bottom: var(--s-sm); }
.profile-bio { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--s-base); }
.profile-stats { display: flex; gap: var(--s-xl); margin-bottom: var(--s-sm); }
.stat-item { display: flex; flex-direction: column; align-items: center; }
.stat-value { font-size: 20px; font-weight: 600; color: var(--text-primary); }
.stat-label { font-size: 12px; color: var(--text-secondary); }
.profile-joined { font-size: 12px; color: var(--text-disabled); }
.tabs { display: flex; border-bottom: 1px solid var(--divider); }
.tab {
  padding: var(--s-base) var(--s-lg); font-size: 14px; font-weight: 500;
  color: var(--text-secondary); border-bottom: 2px solid transparent; transition: all var(--t-fast);
}
.tab:hover { color: var(--text-primary); }
.tab.active { color: var(--primary); border-bottom-color: var(--primary); }
.history-item { padding: var(--s-base) var(--s-lg); border-bottom: 1px solid var(--divider); }
.history-title { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
.history-content { font-size: 14px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 4px; }
.history-meta { font-size: 12px; color: var(--text-disabled); }
@media (max-width: 599px) {
  .profile-header { flex-direction: column; align-items: center; text-align: center; }
  .profile-stats { justify-content: center; }
}
</style>
