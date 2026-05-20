<template>
  <AppNavbar />
  <AdminSidebar :page="'reports'" />
  <div class="admin-layout">
    <div class="admin-content">
      <div class="admin-header"><h2>举报管理</h2></div>
      <div class="filter-bar">
        <button v-for="f in filters" :key="f.key" class="btn btn-sm" :class="activeFilter === f.key ? 'btn-primary' : 'btn-text'" @click="activeFilter = f.key">{{ f.label }}</button>
      </div>
      <div class="card">
        <table class="data-table">
          <thead><tr><th>ID</th><th>类型</th><th>被举报内容</th><th>原因</th><th>举报人</th><th>时间</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="r in filteredReports" :key="r.id">
              <td>{{ r.id }}</td>
              <td><span class="badge" :class="typeBadge(r.type)">{{ typeLabel(r.type) }}</span></td>
              <td class="report-content">{{ r.content }}</td>
              <td class="text-small">{{ r.reason }}</td>
              <td>{{ r.reporter }}</td>
              <td class="text-muted text-small">{{ r.createdAt }}</td>
              <td><span class="badge" :class="statusBadge(r.status)">{{ statusLabel(r.status) }}</span></td>
              <td>
                <div class="action-btns" v-if="r.status === 'pending'">
                  <button class="btn btn-text btn-sm" @click="handleReport(r, 'resolved')">处理</button>
                  <button class="btn btn-danger btn-sm" @click="handleReport(r, 'rejected')">驳回</button>
                </div>
                <span v-else class="text-muted text-small">已处理</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

const router = useRouter()
const auth = useAuthStore()
const ui = useUIStore()
if (!auth.isAdmin) router.replace('/')

const { showToast } = ui
const activeFilter = ref('all')

const filters = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'resolved', label: '已处理' },
  { key: 'rejected', label: '已驳回' }
]

const reports = ref([
  { id: 1, type: 'post', content: 'Vue 3 性能优化终极指南', reason: '广告推广内容，与标题不符', reporter: '前端小王', createdAt: '2026-05-19 10:30', status: 'pending' },
  { id: 2, type: 'comment', content: '建议检查一下tsconfig里的paths配置', reason: '人身攻击和恶意言论', reporter: '困惑的开发者', createdAt: '2026-05-18 16:20', status: 'pending' },
  { id: 3, type: 'user', content: '用户 spam_bot_001', reason: '大量发布垃圾广告', reporter: '技术观察者', createdAt: '2026-05-18 09:15', status: 'resolved' },
  { id: 4, type: 'post', content: '免费领取编程课程资源', reason: '虚假信息和钓鱼链接', reporter: '设计师小李', createdAt: '2026-05-17 14:45', status: 'pending' },
  { id: 5, type: 'comment', content: '已移除：违反社区规范', reason: '恶意刷屏和灌水', reporter: '性能狂魔', createdAt: '2026-05-16 20:10', status: 'rejected' }
])

const filteredReports = computed(() => reports.value.filter(r => activeFilter.value === 'all' || r.status === activeFilter.value))

function typeBadge(t) { return { post: 'badge-primary', comment: 'badge-success', user: 'badge-warning' }[t] }
function typeLabel(t) { return { post: '帖子', comment: '评论', user: '用户' }[t] }
function statusBadge(s) { return { pending: 'badge-warning', resolved: 'badge-success', rejected: 'badge-error' }[s] }
function statusLabel(s) { return { pending: '待处理', resolved: '已处理', rejected: '已驳回' }[s] }
function handleReport(r, status) { r.status = status; showToast(status === 'resolved' ? '已处理' : '已驳回', 'success') }
</script>

<style scoped>
.filter-bar { display: flex; gap: var(--s-sm); margin-bottom: var(--s-lg); }
.report-content { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.action-btns { display: flex; gap: 4px; }
</style>
