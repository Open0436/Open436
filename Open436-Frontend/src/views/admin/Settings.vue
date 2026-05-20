<template>
  <AppNavbar />
  <AdminSidebar :page="'settings'" />
  <div class="admin-layout">
    <div class="admin-content">
      <div class="admin-header"><h2>系统设置</h2></div>
      <div class="settings-grid">
        <div class="card">
          <div class="card-header">基本设置</div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">站点名称</label>
              <input v-model="form.siteName" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">站点描述</label>
              <input v-model="form.siteDesc" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">关键词</label>
              <input v-model="form.keywords" class="form-input" placeholder="用逗号分隔" />
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">功能设置</div>
          <div class="card-body">
            <div class="toggle-row" v-for="t in featureToggles" :key="t.key">
              <span>{{ t.label }}</span>
              <label class="toggle"><input type="checkbox" v-model="form[t.key]" /><span class="toggle-slider"></span></label>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">内容设置</div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">每页帖子数</label>
              <input v-model.number="form.perPage" type="number" class="form-input" min="5" max="50" />
            </div>
            <div class="form-group">
              <label class="form-label">标题最大长度</label>
              <input v-model.number="form.titleMaxLength" type="number" class="form-input" min="10" max="200" />
            </div>
            <div class="form-group">
              <label class="form-label">内容最大长度</label>
              <input v-model.number="form.contentMaxLength" type="number" class="form-input" min="100" max="50000" />
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">安全设置</div>
          <div class="card-body">
            <div class="toggle-row">
              <span>暴力破解保护</span>
              <label class="toggle"><input type="checkbox" v-model="form.bruteForceProtection" /><span class="toggle-slider"></span></label>
            </div>
            <div class="toggle-row">
              <span>验证码</span>
              <label class="toggle"><input type="checkbox" v-model="form.captcha" /><span class="toggle-slider"></span></label>
            </div>
            <div class="form-group">
              <label class="form-label">会话超时（分钟）</label>
              <input v-model.number="form.sessionTimeout" type="number" class="form-input" min="5" max="1440" />
            </div>
          </div>
        </div>
      </div>
      <div class="save-bar">
        <button class="btn btn-primary btn-lg" @click="showToast('设置已保存', 'success')">保存设置</button>
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
import { useUIStore } from '@/stores/ui'

const router = useRouter()
const auth = useAuthStore()
const ui = useUIStore()
if (!auth.isAdmin) router.replace('/')

const { showToast } = ui

const featureToggles = [
  { key: 'openRegister', label: '开放注册' },
  { key: 'emailVerify', label: '邮箱验证' },
  { key: 'commentReview', label: '评论审核' },
  { key: 'anonymousAccess', label: '匿名访问' }
]

const form = ref({
  siteName: 'Open436 论坛',
  siteDesc: '一个开放的技术交流社区',
  keywords: '技术,编程,前端,后端,设计',
  openRegister: true,
  emailVerify: false,
  commentReview: true,
  anonymousAccess: false,
  perPage: 20,
  titleMaxLength: 100,
  contentMaxLength: 10000,
  bruteForceProtection: true,
  captcha: false,
  sessionTimeout: 30
})
</script>

<style scoped>
.settings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: var(--s-lg); }
.toggle-row { display: flex; justify-content: space-between; align-items: center; padding: var(--s-base) 0; border-bottom: 1px solid var(--divider); }
.toggle-row:last-child { border-bottom: none; }
.save-bar { margin-top: var(--s-xl); display: flex; justify-content: flex-end; }
@media (max-width: 959px) { .settings-grid { grid-template-columns: 1fr; } }
</style>
