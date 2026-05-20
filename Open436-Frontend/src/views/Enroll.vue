<template>
  <AppNavbar />
  <div class="page-mount">
    <div class="scene">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>

      <div class="hero">
        <div class="illustration">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="110" r="82" fill="rgba(76,175,80,0.05)" />
            <rect x="50" y="42" width="100" height="130" rx="10" fill="#fff" stroke="var(--success)" stroke-width="1.5"/>
            <rect x="64" y="36" width="72" height="16" rx="4" fill="var(--success)" opacity="0.15" stroke="var(--success)" stroke-width="1.2"/>
            <circle cx="100" cy="44" r="3" fill="var(--success)" opacity="0.6"/>
            <rect x="66" y="68" width="68" height="6" rx="3" fill="#E8F5E9"/>
            <rect x="66" y="82" width="52" height="6" rx="3" fill="#E8F5E9"/>
            <rect x="66" y="96" width="60" height="6" rx="3" fill="#E8F5E9"/>
            <rect x="66" y="110" width="44" height="6" rx="3" fill="#E8F5E9"/>
            <circle class="stamp" cx="130" cy="148" r="18" fill="var(--success)" opacity="0.12"/>
            <path class="stamp-check" d="M121 148l6 6 12-12" stroke="var(--success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path class="sprout" d="M100 158v-16" stroke="var(--success)" stroke-width="2" stroke-linecap="round"/>
            <path class="sprout-leaf-l" d="M100 148c-8-4-12-12-8-18 6 2 8 10 8 18z" fill="var(--success)" opacity="0.25"/>
            <path class="sprout-leaf-r" d="M100 142c8-4 12-12 8-18-6 2-8 10-8 18z" fill="var(--success)" opacity="0.2"/>
            <circle class="sparkle sparkle-1" cx="44" cy="72" r="2.5" fill="var(--success)" opacity="0.4"/>
            <circle class="sparkle sparkle-2" cx="160" cy="58" r="2" fill="var(--success)" opacity="0.35"/>
            <circle class="sparkle sparkle-3" cx="38" cy="140" r="1.5" fill="var(--success)" opacity="0.3"/>
          </svg>
        </div>

        <h2 class="title">纳新系统</h2>
        <p class="subtitle">
          <span class="badge-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            开发中
          </span>
          纳新通道即将开启，敬请期待
        </p>

        <div class="steps">
          <div class="step">
            <div class="step-dot">1</div>
            <span>浏览活动</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <div class="step-dot">2</div>
            <span>在线申请</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <div class="step-dot">3</div>
            <span>参与活动</span>
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
  opacity: 0.3;
  pointer-events: none;
}
.orb-1 {
  width: 380px; height: 380px;
  background: radial-gradient(circle, rgba(76,175,80,0.25), transparent 70%);
  top: -8%; left: -4%;
  animation: drift 16s ease-in-out infinite alternate;
}
.orb-2 {
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(129,199,132,0.2), transparent 70%);
  bottom: -6%; right: -2%;
  animation: drift 13s ease-in-out infinite alternate-reverse;
}
@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(-20px, 15px) scale(1.08); }
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

.stamp { animation: pop 2.5s ease-in-out infinite; }
.stamp-check { animation: pop 2.5s ease-in-out infinite 0.05s; }
@keyframes pop {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
.sprout { animation: grow 3s ease-in-out infinite; }
@keyframes grow {
  0%, 100% { transform: scaleY(1); transform-origin: bottom; }
  50% { transform: scaleY(1.05); transform-origin: bottom; }
}
.sprout-leaf-l { animation: sway 4s ease-in-out infinite; transform-origin: bottom right; }
.sprout-leaf-r { animation: sway 4s ease-in-out infinite 0.5s; transform-origin: bottom left; }
@keyframes sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(3deg); }
}
.sparkle-1 { animation: twinkle 2.5s ease-in-out infinite; }
.sparkle-2 { animation: twinkle 3s ease-in-out infinite 0.8s; }
.sparkle-3 { animation: twinkle 2s ease-in-out infinite 1.4s; }
@keyframes twinkle {
  0%, 100% { opacity: 0.3; r: 1.5; }
  50% { opacity: 0.7; r: 2.5; }
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
  margin: 0 auto var(--s-2xl);
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
  background: rgba(76,175,80,0.1);
  color: var(--success);
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: var(--s-3xl);
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
}
.step-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(76,175,80,0.1);
  color: var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}
.step-line {
  width: 48px;
  height: 2px;
  background: linear-gradient(90deg, rgba(76,175,80,0.2), rgba(76,175,80,0.08));
  border-radius: 1px;
  margin: 0 8px;
  margin-bottom: 24px;
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
  .step-line { width: 28px; }
  .illustration { width: 140px; height: 140px; }
}
</style>
