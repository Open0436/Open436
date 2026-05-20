<template>
  <aside class="admin-sidebar" :class="{ active: mobileOpen }">
    <div class="admin-sidebar-header">
      <div class="admin-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z"/>
        </svg>
        管理后台
      </div>
    </div>
    <nav class="admin-nav">
      <div class="nav-section">
        <div class="nav-section-title">概览</div>
        <router-link to="/admin" class="nav-item" :class="{ active: page === 'dashboard' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          仪表盘
        </router-link>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">内容管理</div>
        <router-link to="/admin/sections" class="nav-item" :class="{ active: page === 'sections' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/></svg>
          板块管理
        </router-link>
        <router-link to="/admin/posts" class="nav-item" :class="{ active: page === 'posts' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          帖子管理
        </router-link>
        <router-link to="/admin/comments" class="nav-item" :class="{ active: page === 'comments' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          评论管理
        </router-link>
        <router-link to="/admin/reports" class="nav-item" :class="{ active: page === 'reports' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          举报管理
        </router-link>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">用户管理</div>
        <router-link to="/admin/users" class="nav-item" :class="{ active: page === 'users' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          用户管理
        </router-link>
        <router-link to="/admin/roles" class="nav-item" :class="{ active: page === 'roles' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          角色权限
        </router-link>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">系统</div>
        <router-link to="/admin/settings" class="nav-item" :class="{ active: page === 'settings' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          系统设置
        </router-link>
      </div>
    </nav>
    <div class="admin-sidebar-footer">
      <router-link to="/" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
        返回前台
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ page: String })
const mobileOpen = ref(false)
</script>

<style scoped>
.admin-sidebar {
  position: fixed; left: 0; top: var(--navbar-h); bottom: 0;
  width: var(--admin-sidebar-w); background: var(--bg);
  border-right: 1px solid var(--divider); display: flex; flex-direction: column;
  z-index: 50; overflow-y: auto;
}
.admin-sidebar-header { padding: var(--s-lg); border-bottom: 1px solid var(--divider); }
.admin-badge {
  display: flex; align-items: center; gap: var(--s-sm);
  font-size: 15px; font-weight: 600; color: var(--primary);
}
.nav-section { margin-bottom: var(--s-base); }
.nav-section-title {
  padding: var(--s-sm) var(--s-lg); font-size: 12px; font-weight: 600;
  color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;
}
.nav-item {
  display: flex; align-items: center; gap: var(--s-sm);
  padding: 10px var(--s-lg); color: var(--text-primary); font-size: 14px;
  transition: all var(--t-fast);
}
.nav-item:hover { background: var(--bg-dark); color: var(--primary); }
.nav-item.active { background: var(--primary-bg); color: var(--primary); font-weight: 500; }
.admin-sidebar-footer {
  margin-top: auto; padding: var(--s-base); border-top: 1px solid var(--divider);
}
@media (max-width: 959px) {
  .admin-sidebar {
    transform: translateX(-100%); transition: transform var(--t-base);
    box-shadow: var(--sh-lg);
  }
  .admin-sidebar.active { transform: translateX(0); }
}
</style>
