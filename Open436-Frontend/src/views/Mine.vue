<template>
  <AppNavbar />
  <div class="page-mount">
    <div class="scene">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>

      <!-- Not logged in -->
      <div v-if="!auth.isLoggedIn" class="hero" key="guest">
        <div class="illustration">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="85" fill="rgba(25,118,210,0.04)"/>
            <circle cx="100" cy="78" r="28" fill="rgba(25,118,210,0.08)" stroke="var(--primary)" stroke-width="1.5" stroke-dasharray="4 3"/>
            <circle cx="100" cy="78" r="14" fill="var(--primary-bg)"/>
            <path d="M100 86v-6" stroke="var(--primary)" stroke-width="2" stroke-linecap="round"/>
            <rect x="100" y="72" width="0.5" height="0.5" fill="var(--primary)"/>
            <path d="M60 156a40 40 0 0 1 80 0" fill="rgba(25,118,210,0.06)" stroke="var(--primary)" stroke-width="1.5" stroke-dasharray="4 3"/>
            <circle class="pulse-ring" cx="100" cy="78" r="28" fill="none" stroke="var(--primary-light)" stroke-width="1" opacity="0.4"/>
          </svg>
        </div>

        <h2 class="title">个人中心</h2>
        <p class="subtitle">登录后查看个人信息、学习记录与更多内容</p>

        <router-link to="/login" class="login-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
          立即登录
        </router-link>

        <router-link to="/" class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          返回论坛
        </router-link>
      </div>

      <!-- Logged in -->
      <div v-else class="hero" key="user">
        <div class="illustration">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="85" fill="rgba(25,118,210,0.04)"/>
            <circle class="avatar-ring" cx="100" cy="76" r="32" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.5"/>
            <circle cx="100" cy="76" r="26" fill="var(--primary-bg)" stroke="var(--primary-light)" stroke-width="1"/>
            <circle cx="100" cy="70" r="8" fill="var(--primary)" opacity="0.5"/>
            <path d="M88 82c0-6.6 5.4-12 12-12s12 5.4 12 12" fill="none"/>
            <path d="M62 156a38 38 0 0 1 76 0" fill="rgba(25,118,210,0.06)" stroke="var(--primary)" stroke-width="1" opacity="0.4"/>
            <circle class="spark s1" cx="48" cy="60" r="3" fill="var(--primary-light)" opacity="0.35"/>
            <circle class="spark s2" cx="156" cy="52" r="2.5" fill="var(--primary)" opacity="0.25"/>
            <circle class="spark s3" cx="42" cy="138" r="2" fill="var(--primary-light)" opacity="0.3"/>
            <circle class="spark s4" cx="160" cy="144" r="2.5" fill="var(--primary)" opacity="0.2"/>
          </svg>
        </div>

        <h2 class="title">个人中心</h2>
        <p class="subtitle">
          <span class="badge-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            开发中
          </span>
          个人中心正在建设中，敬请期待
        </p>

        <div class="preview-cards">
          <div class="preview-card">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>个人资料</span>
          </div>
          <div class="preview-card">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            <span>学习数据</span>
          </div>
          <div class="preview-card">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>我的消息</span>
          </div>
        </div>

        <router-link to="/" class="back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          返回论坛
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<style scoped>
.page-mount {
  padding-top: var(--navbar-h);
  min-height: 100vh;
  background: var(--bg-secondary);
}
.scene {
  min-height: calc(100vh - var(--navbar-h));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.25;
  pointer-events: none;
}
.orb-1 {
  width: 360px; height: 360px;
  background: radial-gradient(circle, rgba(25,118,210,0.2), transparent 70%);
  top: -6%; right: -3%;
  animation: drift 15s ease-in-out infinite alternate;
}
.orb-2 {
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(66,165,245,0.15), transparent 70%);
  bottom: -5%; left: -4%;
  animation: drift 18s ease-in-out infinite alternate-reverse;
}
@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(25px, -15px) scale(1.06); }
}

.hero {
  text-align: center;
  padding: var(--s-3xl);
  position: relative;
  z-index: 1;
  animation: fadeUp 600ms cubic-bezier(0.4, 0, 0.2, 1) both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.illustration {
  width: 180px;
  height: 180px;
  margin: 0 auto var(--s-xl);
}
.illustration svg { width: 100%; height: 100%; }

.avatar-ring {
  animation: spin 20s linear infinite;
  transform-origin: 100px 76px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.pulse-ring {
  animation: pulse 2.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { r: 28; opacity: 0.3; }
  50% { r: 34; opacity: 0.08; }
}
.spark { animation: twinkle 3s ease-in-out infinite; }
.s2 { animation-delay: 0.6s; }
.s3 { animation-delay: 1.2s; }
.s4 { animation-delay: 1.8s; }
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.3); }
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--s-md);
  letter-spacing: -0.3px;
}
.subtitle {
  color: var(--text-secondary);
  font-size: 15px;
  max-width: 340px;
  margin: 0 auto var(--s-xl);
  line-height: 1.7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
.badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--primary-bg);
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

/* Guest state */
.login-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  border-radius: 24px;
  background: var(--primary);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(25,118,210,0.3);
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}
.login-btn:hover {
  background: var(--primary-dark);
  box-shadow: 0 6px 20px rgba(25,118,210,0.35);
  transform: translateY(-2px);
  color: #fff;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: var(--s-lg);
  color: var(--text-secondary);
  font-size: 13px;
  text-decoration: none;
  transition: color var(--t-fast);
}
.back-link:hover { color: var(--primary); }

/* Logged in state */
.preview-cards {
  display: flex;
  gap: var(--s-base);
  justify-content: center;
  margin-bottom: var(--s-2xl);
}
.preview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-radius: var(--r-md);
  background: var(--bg);
  border: 1px solid var(--divider);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  min-width: 80px;
  transition: all 250ms ease;
}
.preview-card svg { color: var(--primary); opacity: 0.6; }
.preview-card:hover {
  border-color: rgba(25,118,210,0.2);
  box-shadow: var(--sh-sm);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border-radius: 24px;
  background: var(--bg);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  box-shadow: var(--sh-sm);
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}
.back-btn:hover {
  box-shadow: var(--sh-md);
  transform: translateY(-1px);
  color: var(--primary);
}

@media (max-width: 599px) {
  .hero { padding: var(--s-xl) var(--s-base); }
  .title { font-size: 22px; }
  .preview-cards { gap: var(--s-sm); }
  .preview-card { padding: 12px 14px; min-width: 68px; font-size: 12px; }
  .illustration { width: 140px; height: 140px; }
}
</style>
