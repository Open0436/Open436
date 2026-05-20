<template>
  <AppNavbar />
  <AdminSidebar :page="'posts'" />
  <div class="admin-layout">
    <div class="admin-content">
      <div class="admin-header"><h2>帖子管理</h2></div>
      <div class="toolbar">
        <input v-model="search" class="form-input" placeholder="搜索帖子..." style="max-width:300px" />
      </div>
      <div class="card">
        <table class="data-table">
          <thead><tr><th>ID</th><th>标题</th><th>作者</th><th>时间</th><th>浏览</th><th>回复</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="p in filteredPosts" :key="p.id">
              <td>{{ p.id }}</td>
              <td><a href="#" class="text-bold" @click.prevent="viewPost(p.id)">{{ p.title }}</a></td>
              <td>{{ p.author }}</td>
              <td class="text-muted text-small">{{ p.createdAt }}</td>
              <td>{{ p.views }}</td>
              <td>{{ p.replies }}</td>
              <td><span v-if="p.pinned" class="badge badge-warning">置顶</span><span v-else class="badge badge-success">正常</span></td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-text btn-sm" @click="viewPost(p.id)">查看</button>
                  <button class="btn btn-text btn-sm" @click="togglePin(p)">{{ p.pinned ? '取消置顶' : '置顶' }}</button>
                  <button class="btn btn-danger btn-sm" @click="showToast('已删除帖子', 'success')">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination v-model="page" :totalPages="5" />
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
const search = ref('')
const page = ref(1)

const posts = ref([
  { id: 1, title: 'Vue 3 Composition API 最佳实践总结', author: '前端小王', createdAt: '2026-05-19', views: 1280, replies: 32, pinned: true },
  { id: 2, title: '2026年前端开发趋势预测', author: '技术观察者', createdAt: '2026-05-18', views: 960, replies: 48, pinned: true },
  { id: 3, title: '分享一组深色模式UI设计稿', author: '设计师小李', createdAt: '2026-05-18', views: 670, replies: 19, pinned: false },
  { id: 4, title: 'Vite 构建速度突然变慢怎么排查？', author: '困惑的开发者', createdAt: '2026-05-17', views: 340, replies: 21, pinned: false },
  { id: 5, title: 'Rust + WebAssembly 在前端的实际应用案例', author: '性能狂魔', createdAt: '2026-05-15', views: 1120, replies: 38, pinned: false }
])

const filteredPosts = computed(() => posts.value.filter(p => !search.value || p.title.includes(search.value)))

function viewPost(id) { router.push(`/post/${id}`) }
function togglePin(p) { p.pinned = !p.pinned; showToast(p.pinned ? '已置顶' : '已取消置顶', 'success') }
</script>

<style scoped>
.toolbar { margin-bottom: var(--s-lg); }
.action-btns { display: flex; gap: 4px; }
</style>
