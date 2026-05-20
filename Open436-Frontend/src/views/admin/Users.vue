<template>
  <AppNavbar />
  <AdminSidebar :page="'users'" />
  <div class="admin-layout">
    <div class="admin-content">
      <div class="admin-header"><h2>用户管理</h2></div>
      <div class="toolbar">
        <input v-model="search" class="form-input" placeholder="搜索用户..." style="max-width:300px" />
        <button class="btn btn-primary" @click="showToast('功能开发中', 'info')">创建用户</button>
      </div>
      <div class="card">
        <table class="data-table">
          <thead><tr><th>ID</th><th>用户</th><th>角色</th><th>状态</th><th>注册时间</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="u in filteredUsers" :key="u.id">
              <td>{{ u.id }}</td>
              <td>
                <div class="user-cell">
                  <img :src="u.avatar" class="avatar avatar-sm" />
                  <div><div class="text-bold">{{ u.name }}</div><div class="text-muted text-small">@{{ u.username }}</div></div>
                </div>
              </td>
              <td><span class="badge" :class="u.role === 'admin' ? 'badge-primary' : 'badge-success'">{{ u.role === 'admin' ? '管理员' : '用户' }}</span></td>
              <td><span class="badge" :class="u.active ? 'badge-success' : 'badge-error'">{{ u.active ? '正常' : '禁用' }}</span></td>
              <td class="text-muted">{{ u.createdAt }}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-text btn-sm" @click="showToast('编辑用户 ' + u.name, 'info')">编辑</button>
                  <button class="btn btn-text btn-sm" @click="showToast('已重置密码', 'success')">重置</button>
                  <button class="btn btn-danger btn-sm" @click="toggleUser(u)">{{ u.active ? '禁用' : '启用' }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination v-model="page" :totalPages="3" />
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

const users = ref([
  { id: 1, name: '管理员', username: 'admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=1976D2&color=fff', role: 'admin', active: true, createdAt: '2025-01-15' },
  { id: 2, name: '前端小王', username: 'wangfe', avatar: 'https://ui-avatars.com/api/?name=WF&background=4CAF50&color=fff', role: 'user', active: true, createdAt: '2025-03-22' },
  { id: 3, name: '设计师小李', username: 'lidesign', avatar: 'https://ui-avatars.com/api/?name=DL&background=FF9800&color=fff', role: 'user', active: true, createdAt: '2025-05-10' },
  { id: 4, name: '技术观察者', username: 'techwatch', avatar: 'https://ui-avatars.com/api/?name=TW&background=9C27B0&color=fff', role: 'user', active: false, createdAt: '2025-06-18' },
  { id: 5, name: '性能狂魔', username: 'perfreak', avatar: 'https://ui-avatars.com/api/?name=PR&background=F44336&color=fff', role: 'user', active: true, createdAt: '2026-01-08' }
])

const filteredUsers = computed(() => users.value.filter(u => !search.value || u.name.includes(search.value) || u.username.includes(search.value)))

function toggleUser(u) { u.active = !u.active; showToast(u.active ? `已启用 ${u.name}` : `已禁用 ${u.name}`, 'success') }
</script>

<style scoped>
.toolbar { display: flex; gap: var(--s-base); margin-bottom: var(--s-lg); flex-wrap: wrap; }
.user-cell { display: flex; align-items: center; gap: var(--s-sm); }
.action-btns { display: flex; gap: 4px; }
</style>
