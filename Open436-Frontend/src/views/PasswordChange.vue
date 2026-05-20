<template>
  <AppNavbar />
  <AppSidebar @select="() => {}" />
  <div class="forum-layout with-sidebar">
    <div class="forum-main">
      <div class="card">
        <div class="card-header">修改密码</div>
        <div class="card-body" style="max-width: 480px;">
          <div class="alert alert-info">
            <strong>安全提示：</strong>请使用包含大小写字母、数字和特殊字符的强密码，并定期更换密码以保障账号安全。
          </div>
          <div class="form-group">
            <label class="form-label">当前密码</label>
            <div class="password-field">
              <input v-model="form.current" :type="show.current ? 'text' : 'password'" class="form-input" placeholder="输入当前密码" />
              <button class="toggle-vis" @click="show.current = !show.current">
                <svg v-if="show.current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">新密码</label>
            <div class="password-field">
              <input v-model="form.newPwd" :type="show.newPwd ? 'text' : 'password'" class="form-input" placeholder="输入新密码" />
              <button class="toggle-vis" @click="show.newPwd = !show.newPwd">
                <svg v-if="show.newPwd" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div v-if="form.newPwd" class="strength-bar">
              <div class="strength-track"><div class="strength-fill" :style="{ width: strength.pct + '%', background: strength.color }"></div></div>
              <span class="strength-label" :style="{ color: strength.color }">{{ strength.label }}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">确认新密码</label>
            <div class="password-field">
              <input v-model="form.confirm" :type="show.confirm ? 'text' : 'password'" class="form-input" placeholder="再次输入新密码" />
              <button class="toggle-vis" @click="show.confirm = !show.confirm">
                <svg v-if="show.confirm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div v-if="form.confirm && form.confirm !== form.newPwd" class="form-helper" style="color: var(--error)">两次输入的密码不一致</div>
          </div>
          <div class="form-actions">
            <button class="btn btn-text" @click="router.back()">取消</button>
            <button class="btn btn-primary" @click="submit" :disabled="!canSubmit">确认修改</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useUIStore } from '@/stores/ui'
import { getPasswordStrength } from '@/utils/format'

const router = useRouter()
const ui = useUIStore()

const form = reactive({ current: '', newPwd: '', confirm: '' })
const show = reactive({ current: false, newPwd: false, confirm: false })

const strength = computed(() => getPasswordStrength(form.newPwd))
const canSubmit = computed(() => form.current && form.newPwd.length >= 8 && form.newPwd === form.confirm)

function submit() {
  if (!canSubmit.value) { ui.showToast('请填写完整信息', 'warning'); return }
  if (form.newPwd === form.current) { ui.showToast('新密码不能与当前密码相同', 'warning'); return }
  ui.showToast('密码修改成功', 'success')
  router.push('/profile')
}
</script>

<style scoped>
.password-field { position: relative; }
.password-field .form-input { padding-right: 40px; }
.toggle-vis {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  color: var(--text-disabled); display: flex; align-items: center;
}
.toggle-vis:hover { color: var(--text-secondary); }
.strength-bar { display: flex; align-items: center; gap: var(--s-sm); margin-top: var(--s-xs); }
.strength-track { flex: 1; height: 4px; background: var(--divider); border-radius: 2px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 2px; transition: all var(--t-fast); }
.strength-label { font-size: 12px; font-weight: 500; }
.form-actions { display: flex; justify-content: flex-end; gap: var(--s-sm); margin-top: var(--s-xl); }
</style>
