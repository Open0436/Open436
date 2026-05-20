<template>
  <div class="auth-page">
    <div class="auth-left">
      <div class="brand"><div class="brand-icon">O</div><span>Open436</span></div>
      <div class="hero-title">
        <code class="code-line">
          <span class="token-class">System</span><span class="token-dot">.</span><span class="token-method">out</span><span class="token-dot">.</span><span class="token-method">print</span><span class="token-paren">(</span><span class="token-string">"Hello 36!"</span><span class="token-paren">)</span><span class="token-semicolon">;</span><span class="cursor">|</span>
        </code>
      </div>
      <div class="characters">
        <div class="char-group">
          <div ref="pR" class="char purple" :class="{ stretch: isStretch, shrink: isShrink }" :style="pBody">
            <div class="eyes" :class="{ closed: allEyesClosed }" :style="pEyes">
              <div class="eye" :class="{ blink: pb || allEyesClosed }"><div class="pupil" :style="pPupil"/></div>
              <div class="eye" :class="{ blink: pb || allEyesClosed }"><div class="pupil" :style="pPupil"/></div>
            </div>
          </div>
          <div ref="bR" class="char black" :class="{ stretch: isStretch, shrink: isShrink }" :style="bBody">
            <div class="eyes" :class="{ closed: allEyesClosed }" :style="bEyes">
              <div class="eye" :class="{ blink: bb || allEyesClosed }"><div class="pupil" :style="bPupil"/></div>
              <div class="eye" :class="{ blink: bb || allEyesClosed }"><div class="pupil" :style="bPupil"/></div>
            </div>
          </div>
          <div ref="oR" class="char orange" :class="{ stretch: isStretch, shrink: isShrink }" :style="oBody">
            <div class="eyes" :class="{ closed: allEyesClosed }" :style="oEyes">
              <div class="pupil-wrap"><div class="pupil-only" :style="oPupil"/></div>
              <div class="pupil-wrap"><div class="pupil-only" :style="oPupil"/></div>
            </div>
          </div>
          <div ref="yR" class="char yellow" :class="{ stretch: isStretch, shrink: isShrink }" :style="yBody">
            <div class="eyes" :class="{ closed: allEyesClosed }" :style="yEyes">
              <div class="pupil-wrap"><div class="pupil-only" :style="yPupil"/></div>
              <div class="pupil-wrap"><div class="pupil-only" :style="yPupil"/></div>
            </div>
            <div class="mouth" :style="mS"/>
          </div>
        </div>
      </div>
            <div class="bg-grid"/><div class="bg-orb o1"/><div class="bg-orb o2"/><div class="bg-orb o3"/>
    </div>
    <div class="auth-right">
      <div class="mobile-brand"><div class="brand-icon">O</div><span>Open436</span></div>
      <div class="form-box">
        <div class="form-header"><h1>{{ isR ? '创建账号' : '欢迎回来！' }}</h1><p>{{ isR ? '填写信息加入 Open436' : '请输入你的账号信息' }}</p></div>
        <form @submit.prevent="onSubmit" class="auth-form">
          <div class="form-group"><label>用户名</label><input ref="uRef" v-model="f.u" type="text" placeholder="3-20 位" required @focus="onTextFocus" @blur="onBlur"/></div>
          <div v-if="isR" class="form-group"><label>昵称</label><input ref="nRef" v-model="f.n" type="text" placeholder="显示名称（可选）" @focus="onTextFocus" @blur="onBlur"/></div>
          <div class="form-group"><label>密码</label><div class="password-wrap"><input ref="pRef" v-model="f.p" :type="showP ? 'text' : 'password'" placeholder="至少 6 位" required @focus="onPasswordFocus" @blur="onBlur"/><button type="button" class="eye-btn" @click="showP = !showP"><svg v-if="showP" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><line x1="1" y1="1" x2="23" y2="23"/></svg><svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></div></div>
          <div v-if="isR" class="form-group"><label>确认密码</label><div class="password-wrap"><input ref="cpRef" v-model="f.cp" :type="showP ? 'text' : 'password'" placeholder="再次输入密码" required @focus="onPasswordFocus" @blur="onBlur"/></div></div>
          <div v-if="!isR" class="form-options"><label class="remember"><input type="checkbox" v-model="f.r"/><span>记住我</span></label><a href="#" class="forgot">忘记密码？</a></div>
          <div v-if="err" class="error-msg">{{ err }}</div>
          <button type="submit" class="submit-btn" :disabled="ld"><span v-if="ld" class="spinner"/>{{ ld ? (isR ? '注册中...' : '登录中...') : (isR ? '注册' : '登录') }}</button>
        </form>
        <div class="toggle-mode">{{ isR ? '已有账号？' : '还没有账号？' }}<a @click.prevent="toggle" href="#">{{ isR ? '立即登录' : '立即注册' }}</a></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

const R = useRoute(), router = useRouter(), auth = useAuthStore(), ui = useUIStore()
const isR = ref(R.query.mode === 'register')
const ld = ref(false), err = ref(''), showP = ref(false)
const f = reactive({ u: '', n: '', p: '', cp: '', r: false })

const focusedType = ref(null)
const mx = ref(0), my = ref(0)
const uRef = ref(null), nRef = ref(null), pRef = ref(null), cpRef = ref(null)
const pR = ref(null), bR = ref(null), oR = ref(null), yR = ref(null)
const pb = ref(false), bb = ref(false)

function onMove(e) { mx.value = e.clientX; my.value = e.clientY }
onMounted(() => window.addEventListener('mousemove', onMove))
onUnmounted(() => window.removeEventListener('mousemove', onMove))

const targetPt = computed(() => {
  const ae = document.activeElement
  let el = null
  if (ae === uRef.value) el = uRef.value
  else if (ae === nRef.value) el = nRef.value
  else if (isR.value && ae === cpRef.value) el = cpRef.value
  if (el) { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } }
  return null
})

function bodyOf(ref, maxSkew, sCfg, kCfg) {
  if (!ref.value) return {}
  const r = ref.value.getBoundingClientRect()
  const cx = r.left + r.width / 2
  if (focusedType.value === 'text' && sCfg) {
    return { transform: `skewX(${sCfg.skew}deg) translateX(${sCfg.x}px) translateY(${sCfg.y}px) scale(${sCfg.s}) !important` }
  }
  if (focusedType.value === 'password' && kCfg) {
    return { transform: `skewX(${kCfg.skew}deg) translateX(${kCfg.x}px) translateY(${kCfg.y}px) scale(${kCfg.s}) !important` }
  }
  const dx = mx.value - cx
  const baseSk = Math.max(-maxSkew, Math.min(maxSkew, -dx / 120))
  return { transform: `skewX(${baseSk}deg) !important` }
}

function eyesOf(ref, maxX, maxY) {
  if (!ref.value) return {}
  if (focusedType.value === 'password') {
    return { transform: `translate(-${maxX}px, 0px)` }
  }
  const r = ref.value.getBoundingClientRect()
  const cx = r.left + r.width / 2, cy = r.top + r.height / 3
  const t = targetPt.value || { x: mx.value, y: my.value }
  const dx = t.x - cx, dy = t.y - cy
  return { transform: `translate(${Math.max(-maxX, Math.min(maxX, dx / 20))}px, ${Math.max(-maxY, Math.min(maxY, dy / 30))}px)` }
}

function pupilOf(ref, maxD) {
  if (!ref.value) return {}
  if (focusedType.value === 'password') {
    return { transform: `translate(-${maxD}px, 0px)` }
  }
  const r = ref.value.getBoundingClientRect()
  const cx = r.left + r.width / 2, cy = r.top + r.height / 3
  const t = targetPt.value || { x: mx.value, y: my.value }
  const dx = t.x - cx, dy = t.y - cy
  const d = Math.min(Math.sqrt(dx * dx + dy * dy), maxD)
  const a = Math.atan2(dy, dx)
  return { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px)` }
}

const isStretch = computed(() => focusedType.value !== 'password')
const isShrink = computed(() => focusedType.value === 'password')
const allEyesClosed = computed(() => false)

const pBody = computed(() => bodyOf(pR, 8, { skew: -12, x: 40, y: -15, s: 1.03 }, { skew: 10, x: -12, y: 8, s: 0.97 }))
const bBody = computed(() => bodyOf(bR, 6, { skew: -10, x: 25, y: -8, s: 1.03 }, { skew: 8, x: -10, y: 6, s: 0.97 }))
const oBody = computed(() => bodyOf(oR, 5, { skew: -8, x: 30, y: -30, s: 1.08 }, { skew: 6, x: -12, y: 15, s: 0.92 }))
const yBody = computed(() => bodyOf(yR, 6, { skew: -8, x: 22, y: -25, s: 1.1 }, { skew: 6, x: -10, y: 12, s: 0.9 }))

const pEyes = computed(() => eyesOf(pR, 15, 10))
const bEyes = computed(() => eyesOf(bR, 12, 8))
const oEyes = computed(() => eyesOf(oR, 18, 12))
const yEyes = computed(() => eyesOf(yR, 14, 9))

const pPupil = computed(() => pupilOf(pR, 6))
const bPupil = computed(() => pupilOf(bR, 5))
const oPupil = computed(() => pupilOf(oR, 5))
const yPupil = computed(() => pupilOf(yR, 5))
const mS = computed(() => pupilOf(yR, 5))

function blink(tgt, dur = 150) {
  const dl = Math.random() * 4000 + 3000
  return setTimeout(() => { tgt.value = true; setTimeout(() => { tgt.value = false; blink(tgt, dur) }, dur) }, dl)
}
let pt, bt
onMounted(() => { pt = blink(pb); bt = blink(bb) })
onUnmounted(() => { clearTimeout(pt); clearTimeout(bt) })

function onTextFocus() { focusedType.value = 'text' }
function onPasswordFocus() { focusedType.value = 'password' }
function onBlur() {
  setTimeout(() => {
    const ae = document.activeElement
    if (ae === pRef.value || (isR.value && ae === cpRef.value)) focusedType.value = 'password'
    else if (ae === uRef.value || ae === nRef.value) focusedType.value = 'text'
    else focusedType.value = null
  }, 50)
}

function toggle() {
  isR.value = !isR.value; err.value = ''
  Object.assign(f, { u: '', n: '', p: '', cp: '', r: false })
  focusedType.value = null
}

async function onSubmit() {
  err.value = ''
  if (isR.value) {
    if (f.p !== f.cp) { err.value = '两次密码不一致'; return }
    if (f.u.length < 3 || f.u.length > 20) { err.value = '用户名 3-20 位'; return }
    if (f.p.length < 6) { err.value = '密码至少 6 位'; return }
  }
  ld.value = true
  try {
    const r = isR.value ? await auth.register(f.u, f.p, f.n) : await auth.login(f.u, f.p)
    if (r.success) { ui.showToast(isR.value ? '注册成功！' : '登录成功！', 'success'); router.push(R.query.redirect || '/') }
    else err.value = r.message || (isR.value ? '注册失败' : '登录失败')
  } catch (e) { err.value = e?.message || (isR.value ? '注册失败' : '登录失败') }
  finally { ld.value = false }
}
</script>

<style scoped>
@import url('@/styles/login-page.css');
</style>
