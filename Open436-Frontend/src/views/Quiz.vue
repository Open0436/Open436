<template>
  <AppNavbar />
  <div class="page-mount">
    <div class="scene">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>

      <div class="hero">
        <div class="illustration">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="88" fill="rgba(255,152,0,0.06)" />
            <circle cx="100" cy="100" r="68" fill="rgba(255,152,0,0.08)" />
            <rect x="52" y="40" width="96" height="120" rx="12" fill="#fff" stroke="var(--warning)" stroke-width="2"/>
            <path d="M72 72h56M72 88h40M72 104h48" stroke="#E0E0E0" stroke-width="3" stroke-linecap="round"/>
            <circle class="check-ring" cx="136" cy="134" r="22" fill="var(--success)" opacity="0.9"/>
            <path class="check-mark" d="M126 134l6 6 14-14" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <circle class="float-a" cx="36" cy="56" r="6" fill="var(--warning)" opacity="0.5"/>
            <circle class="float-b" cx="168" cy="64" r="4" fill="var(--secondary)" opacity="0.4"/>
            <rect class="float-c" x="30" y="140" width="8" height="8" rx="2" fill="var(--secondary-light)" opacity="0.5" transform="rotate(15 34 144)"/>
          </svg>
        </div>

        <h2 class="title">算法系统</h2>
        <p class="subtitle">
          <span class="badge-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            开发中
          </span>
          正在精心打造算法练习平台，敬请期待
        </p>

        <div class="features">
          <div class="feat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <span>题库练习</span>
          </div>
          <div class="feat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span>实时竞技</span>
          </div>
          <div class="feat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            <span>进度追踪</span>
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
  opacity: 0.35;
  pointer-events: none;
}
.orb-1 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(255,152,0,0.3), transparent 70%);
  top: -10%; right: -5%;
  animation: drift 14s ease-in-out infinite alternate;
}
.orb-2 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(255,111,0,0.2), transparent 70%);
  bottom: -8%; left: -3%;
  animation: drift 18s ease-in-out infinite alternate-reverse;
}
.orb-3 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(255,167,38,0.25), transparent 70%);
  top: 40%; left: 50%;
  animation: drift 12s ease-in-out infinite alternate;
}
@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(30px, -20px) scale(1.1); }
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
.illustration svg {
  width: 100%;
  height: 100%;
}
.check-ring {
  animation: pop 2s ease-in-out infinite;
}
@keyframes pop {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}
.check-mark {
  animation: pop 2s ease-in-out infinite 0.1s;
}
.float-a { animation: bobble 3s ease-in-out infinite; }
.float-b { animation: bobble 4s ease-in-out infinite 0.5s; }
.float-c { animation: bobble 3.5s ease-in-out infinite 1s; }
@keyframes bobble {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
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
  background: rgba(255,152,0,0.1);
  color: var(--warning);
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.features {
  display: flex;
  gap: var(--s-xl);
  justify-content: center;
  margin-bottom: var(--s-3xl);
}
.feat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
}
.feat svg {
  color: var(--warning);
  opacity: 0.7;
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
  .features { gap: var(--s-lg); }
  .illustration { width: 140px; height: 140px; }
}
</style>
