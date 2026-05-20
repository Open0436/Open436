<template>
  <AppNavbar />
  <AdminSidebar :page="'dashboard'" />
  <div class="admin-layout">
    <div class="admin-content">
      <div class="admin-header"><h2>仪表盘</h2></div>
      <div class="stats-grid">
        <div v-for="s in stats" :key="s.label" class="stat-card card">
          <div class="stat-icon" :style="{ background: s.bg, color: s.color }">
            <span v-html="s.icon"></span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ s.value.toLocaleString() }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
          <div class="stat-change" :class="s.change > 0 ? 'up' : 'down'">
            {{ s.change > 0 ? '+' : '' }}{{ s.change }}%
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">最近帖子</div>
        <table class="data-table">
          <thead><tr><th>标题</th><th>作者</th><th>时间</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="p in recentPosts" :key="p.id">
              <td class="text-bold">{{ p.title }}</td>
              <td>{{ p.author }}</td>
              <td class="text-muted">{{ p.time }}</td>
              <td><button class="btn btn-text btn-sm" @click="viewPost(p.id)">查看</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
if (!auth.isAdmin) router.replace('/')

const stats = ref([
  { label: '用户总数', value: 1248, change: 12, icon: '&#x1F465;', bg: 'rgba(25,118,210,0.1)', color: '#1976D2' },
  { label: '帖子总数', value: 3456, change: 8, icon: '&#x1F4C4;', bg: 'rgba(76,175,80,0.1)', color: '#4CAF50' },
  { label: '今日活跃', value: 342, change: 5, icon: '&#x1F525;', bg: 'rgba(255,152,0,0.1)', color: '#FF9800' },
  { label: '今日新增', value: 28, change: 15, icon: '&#x2728;', bg: 'rgba(156,39,176,0.1)', color: '#9C27B0' }
])

const recentPosts = ref([
  { id: 1, title: 'Vue 3 Composition API 最佳实践总结', author: '前端小王', time: '10分钟前' },
  { id: 2, title: '2026年前端开发趋势预测', author: '技术观察者', time: '2小时前' },
  { id: 3, title: '分享一组深色模式UI设计稿', author: '设计师小李', time: '5小时前' },
  { id: 4, title: 'Vite 构建速度突然变慢怎么排查？', author: '困惑的开发者', time: '8小时前' },
  { id: 5, title: 'Rust + WebAssembly 在前端的实际应用案例', author: '性能狂魔', time: '1天前' }
])

function viewPost(id) { router.push(`/post/${id}`) }
</script>

<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--s-lg); margin-bottom: var(--s-xl); }
.stat-card { display: flex; align-items: center; gap: var(--s-base); padding: var(--s-lg); }
.stat-icon { width: 48px; height: 48px; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.stat-info { flex: 1; }
.stat-value { font-size: 24px; font-weight: 700; line-height: 1.2; }
.stat-label { font-size: 13px; color: var(--text-secondary); }
.stat-change { font-size: 13px; font-weight: 600; }
.stat-change.up { color: var(--success); }
.stat-change.down { color: var(--error); }
</style>
