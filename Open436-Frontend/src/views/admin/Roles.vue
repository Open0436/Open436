<template>
  <AppNavbar />
  <AdminSidebar :page="'roles'" />
  <div class="admin-layout">
    <div class="admin-content">
      <div class="admin-header"><h2>角色权限</h2></div>
      <div class="roles-grid">
        <div v-for="r in roles" :key="r.name" class="card">
          <div class="card-body">
            <div class="role-icon">{{ r.icon }}</div>
            <h4>{{ r.name }}</h4>
            <p class="text-muted text-small">{{ r.description }}</p>
            <div class="role-count">{{ r.count }} 位用户</div>
            <div class="role-tags">
              <span v-for="t in r.tags" :key="t" class="badge badge-primary">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card" style="margin-top:var(--s-xl)">
        <div class="card-header">权限矩阵</div>
        <table class="data-table">
          <thead><tr><th>权限项</th><th>管理员</th><th>版主</th><th>用户</th></tr></thead>
          <tbody>
            <template v-for="g in permissions" :key="g.group">
              <tr class="group-row"><td colspan="4" class="text-bold">{{ g.group }}</td></tr>
              <tr v-for="p in g.items" :key="p.name">
                <td>{{ p.name }}</td>
                <td v-for="role in ['admin','moderator','user']" :key="role" class="text-center">
                  <span v-if="p[role]" class="check-yes">&#10003;</span>
                  <span v-else class="check-no">&#10007;</span>
                </td>
              </tr>
            </template>
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

const roles = ref([
  { name: '管理员', icon: '👑', description: '拥有系统所有权限，可管理全部内容和用户', count: 3, tags: ['全部权限', '系统设置', '用户管理', '内容管理'] },
  { name: '版主', icon: '🛡️', description: '负责内容审核和板块管理，可处理举报', count: 12, tags: ['内容审核', '帖子管理', '评论管理', '举报处理'] },
  { name: '用户', icon: '👤', description: '普通注册用户，可发帖、评论和参与社区互动', count: 1233, tags: ['发帖', '评论', '收藏', '举报'] }
])

const permissions = ref([
  { group: '内容管理', items: [
    { name: '查看帖子', admin: true, moderator: true, user: true },
    { name: '发布帖子', admin: true, moderator: true, user: true },
    { name: '编辑帖子', admin: true, moderator: true, user: false },
    { name: '删除帖子', admin: true, moderator: true, user: false },
    { name: '置顶帖子', admin: true, moderator: true, user: false },
    { name: '管理评论', admin: true, moderator: true, user: false }
  ]},
  { group: '用户管理', items: [
    { name: '查看用户列表', admin: true, moderator: true, user: false },
    { name: '编辑用户信息', admin: true, moderator: false, user: false },
    { name: '禁用/启用用户', admin: true, moderator: false, user: false },
    { name: '分配角色', admin: true, moderator: false, user: false }
  ]},
  { group: '系统管理', items: [
    { name: '板块管理', admin: true, moderator: false, user: false },
    { name: '系统设置', admin: true, moderator: false, user: false },
    { name: '查看日志', admin: true, moderator: false, user: false },
    { name: '数据备份', admin: true, moderator: false, user: false }
  ]}
])
</script>

<style scoped>
.roles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--s-lg); }
.role-icon { font-size: 40px; margin-bottom: var(--s-sm); }
.role-count { font-size: 13px; color: var(--text-secondary); margin: var(--s-sm) 0; }
.role-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.group-row td { background: var(--bg-secondary) !important; color: var(--text-secondary); font-size: 13px; }
.check-yes { color: var(--success); font-weight: 700; font-size: 16px; }
.check-no { color: var(--text-disabled); font-size: 16px; }
</style>
