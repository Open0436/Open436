<template>
  <AppNavbar />
  <AppSidebar @select="() => {}" />
  <div class="forum-layout with-sidebar">
    <div class="forum-main">
      <div class="card">
        <div class="card-header">编辑个人资料</div>
        <div class="card-body">
          <div class="avatar-upload">
            <img :src="form.avatar" class="avatar avatar-xl" />
            <label class="upload-btn btn btn-sm btn-text">
              更换头像
              <input type="file" accept="image/*" hidden @change="onAvatarChange" />
            </label>
          </div>
          <div class="form-group">
            <label class="form-label">昵称</label>
            <input v-model="form.nickname" class="form-input" placeholder="输入昵称" maxlength="20" />
            <div class="form-helper" :class="{ error: form.nickname.length > 20 }">{{ form.nickname.length }}/20</div>
          </div>
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input :value="form.username" class="form-input" disabled />
            <div class="form-helper">用户名不可修改</div>
          </div>
          <div class="form-group">
            <label class="form-label">邮箱</label>
            <input v-model="form.email" class="form-input" type="email" placeholder="输入邮箱地址" />
          </div>
          <div class="form-group">
            <label class="form-label">个人简介</label>
            <textarea v-model="form.bio" class="form-textarea" placeholder="介绍一下你自己..." maxlength="200" rows="4"></textarea>
            <div class="form-helper" :class="{ error: form.bio.length > 200 }">{{ form.bio.length }}/200</div>
          </div>
          <div class="form-actions">
            <button class="btn btn-text" @click="router.back()">取消</button>
            <button class="btn btn-primary" @click="save">保存修改</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

const router = useRouter()
const auth = useAuthStore()
const ui = useUIStore()

const form = reactive({
  avatar: auth.avatar || 'https://ui-avatars.com/api/?name=User&background=1976D2&color=fff&size=120',
  nickname: auth.nickname || '前端小王',
  username: auth.user?.username || 'frontend_wang',
  email: 'frontend@example.com',
  bio: '热爱前端技术，专注于 Vue.js 和性能优化。开源贡献者，技术博客写手。'
})

function onAvatarChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { ui.showToast('图片不能超过 2MB', 'warning'); return }
  const reader = new FileReader()
  reader.onload = (ev) => { form.avatar = ev.target.result }
  reader.readAsDataURL(file)
}

function save() {
  if (!form.nickname.trim()) { ui.showToast('昵称不能为空', 'warning'); return }
  if (form.nickname.length > 20) { ui.showToast('昵称不能超过20个字符', 'warning'); return }
  if (form.bio.length > 200) { ui.showToast('简介不能超过200个字符', 'warning'); return }
  ui.showToast('资料已更新', 'success')
  router.push('/profile')
}
</script>

<style scoped>
.avatar-upload {
  display: flex; align-items: center; gap: var(--s-lg); margin-bottom: var(--s-xl);
}
.upload-btn { cursor: pointer; position: relative; }
.form-actions { display: flex; justify-content: flex-end; gap: var(--s-sm); margin-top: var(--s-xl); }
.form-helper.error { color: var(--error); }
</style>
