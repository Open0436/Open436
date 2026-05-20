<template>
  <AppNavbar />
  <AdminSidebar :page="'comments'" />
  <div class="admin-layout">
    <div class="admin-content">
      <div class="admin-header"><h2>评论管理</h2></div>
      <div class="filter-bar">
        <button v-for="f in filters" :key="f.key" class="btn btn-sm" :class="activeFilter === f.key ? 'btn-primary' : 'btn-text'" @click="activeFilter = f.key">{{ f.label }}</button>
      </div>
      <div class="card">
        <table class="data-table">
          <thead><tr><th>ID</th><th>内容</th><th>所属帖子</th><th>用户</th><th>时间</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="c in filteredComments" :key="c.id">
              <td>{{ c.id }}</td>
              <td class="comment-content">{{ c.content }}</td>
              <td><a href="#" @click.prevent>{{ c.postTitle }}</a></td>
              <td>
                <div class="user-cell">
                  <img :src="c.avatar" class="avatar avatar-sm" />
                  <span>{{ c.user }}</span>
                </div>
              </td>
              <td class="text-muted text-small">{{ c.createdAt }}</td>
              <td><span class="badge" :class="statusBadge(c.status)">{{ statusLabel(c.status) }}</span></td>
              <td>
                <div class="action-btns">
                  <button v-if="c.status === 'reported'" class="btn btn-text btn-sm" @click="handleComment(c, 'normal')">通过</button>
                  <button class="btn btn-danger btn-sm" @click="handleComment(c, 'deleted')">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination v-model="page" :totalPages="4" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AdminSidebar from '@/components/AdminSidebar.vue'
import Pagination from '@/components/Pagination.vue'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

const router = useRouter()
const auth = useAuthStore()
const ui = useUIStore()
if (!auth.isAdmin) router.replace('/')

const { showToast } = ui
const activeFilter = ref('all')
const page = ref(1)

const filters = [
  { key: 'all', label: '全部' },
  { key: 'normal', label: '正常' },
  { key: 'reported', label: '已举报' },
  { key: 'deleted', label: '已删除' }
]

const comments = ref([
  { id: 1, content: '写得很详细，收藏了！特别是响应式数据管理那部分讲解非常清楚', postTitle: 'Vue 3 Composition API 最佳实践', user: '前端小王', avatar: 'https://ui-avatars.com/api/?name=WF&background=4CAF50&color=fff', createdAt: '2026-05-19 10:30', status: 'normal' },
  { id: 2, content: '关于AI辅助编程的部分说得很好，现在确实越来越依赖Copilot了', postTitle: '2026年前端开发趋势预测', user: '技术观察者', avatar: 'https://ui-avatars.com/api/?name=TW&background=9C27B0&color=fff', createdAt: '2026-05-18 14:20', status: 'normal' },
  { id: 3, content: '这个配色方案不错，能否分享一下Figma源文件？', postTitle: '深色模式UI设计稿', user: '设计师小李', avatar: 'https://ui-avatars.com/api/?name=DL&background=FF9800&color=fff', createdAt: '2026-05-18 09:45', status: 'normal' },
  { id: 4, content: '建议检查一下tsconfig里的paths配置，我有一次也是这个问题导致的', postTitle: 'Vite 构建速度排查', user: '困惑的开发者', avatar: 'https://ui-avatars.com/api/?name=CD&background=F44336&color=fff', createdAt: '2026-05-17 12:10', status: 'reported' },
  { id: 5, content: 'WASM的Benchmark数据能否提供测试环境信息？这样更有参考价值', postTitle: 'Rust + WASM 实际应用', user: '性能狂魔', avatar: 'https://ui-avatars.com/api/?name=PR&background=2196F3&color=fff', createdAt: '2026-05-16 16:30', status: 'normal' },
  { id: 6, content: '垃圾文章，完全是复制粘贴的内容，举报了', postTitle: '前端性能优化技巧', user: '暴躁老哥', avatar: 'https://ui-avatars.com/api/?name=BJ&background=E91E63&color=fff', createdAt: '2026-05-16 08:20', status: 'reported' },
  { id: 7, content: '已移除：违反社区规范', postTitle: 'TypeScript类型系统讨论', user: '潜水用户', avatar: 'https://ui-avatars.com/api/?name=QS&background=607D8B&color=fff', createdAt: '2026-05-15 20:50', status: 'deleted' },
  { id: 8, content: 'SVG动画那部分讲得很好，期待更多类似教程', postTitle: 'SVG 动画入门指南', user: '动画匠人', avatar: 'https://ui-avatars.com/api/?name=DH&background=009688&color=fff', createdAt: '2026-05-15 11:15', status: 'normal' }
])

const filteredComments = computed(() => comments.value.filter(c => activeFilter.value === 'all' || c.status === activeFilter.value))

function statusBadge(s) { return { normal: 'badge-success', reported: 'badge-warning', deleted: 'badge-error' }[s] }
function statusLabel(s) { return { normal: '正常', reported: '已举报', deleted: '已删除' }[s] }
function handleComment(c, status) { c.status = status; showToast('操作成功', 'success') }
</script>

<style scoped>
.filter-bar { display: flex; gap: var(--s-sm); margin-bottom: var(--s-lg); }
.comment-content { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-cell { display: flex; align-items: center; gap: var(--s-sm); }
.action-btns { display: flex; gap: 4px; }
</style>
