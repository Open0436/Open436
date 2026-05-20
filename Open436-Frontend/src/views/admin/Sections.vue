<template>
  <AppNavbar />
  <AdminSidebar :page="'sections'" />
  <div class="admin-layout">
    <div class="admin-content">
      <div class="admin-header" style="display:flex;justify-content:space-between;align-items:center">
        <h2>板块管理</h2>
        <button class="btn btn-primary" @click="showToast('功能开发中', 'info')">添加板块</button>
      </div>
      <div class="sections-grid">
        <div v-for="s in sections" :key="s.id" class="card section-card">
          <div class="card-body">
            <div class="section-top">
              <span class="section-icon">{{ s.icon }}</span>
              <div class="section-meta">
                <div class="text-bold">{{ s.name }}</div>
                <div class="text-muted text-small">/{{ s.slug }}</div>
              </div>
            </div>
            <p class="section-desc text-muted">{{ s.description }}</p>
            <div class="section-stats">
              <span>帖子 <strong>{{ s.postCount }}</strong></span>
              <span>成员 <strong>{{ s.memberCount }}</strong></span>
              <span>排序 <strong>{{ s.sort }}</strong></span>
            </div>
            <div class="section-actions">
              <button class="btn btn-text btn-sm" @click="showToast('编辑板块 ' + s.name, 'info')">编辑</button>
              <button class="btn btn-danger btn-sm" @click="showToast('已删除板块', 'success')">删除</button>
            </div>
          </div>
        </div>
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

const sections = ref([
  { id: 1, name: '技术交流', slug: 'tech', icon: '💻', description: '编程技术、框架、工具等话题讨论', postCount: 856, memberCount: 423, sort: 1 },
  { id: 2, name: '设计分享', slug: 'design', icon: '🎨', description: 'UI/UX设计、配色、排版等设计相关内容', postCount: 342, memberCount: 218, sort: 2 },
  { id: 3, name: '开放讨论', slug: 'discuss', icon: '💬', description: '自由讨论区，畅所欲言', postCount: 1203, memberCount: 689, sort: 3 },
  { id: 4, name: '问答求助', slug: 'question', icon: '❓', description: '遇到问题？在这里寻求帮助', postCount: 567, memberCount: 312, sort: 4 },
  { id: 5, name: '资源分享', slug: 'share', icon: '🔗', description: '优质资源、工具、教程推荐', postCount: 289, memberCount: 156, sort: 5 },
  { id: 6, name: '公告通知', slug: 'announce', icon: '📢', description: '论坛公告和重要通知', postCount: 45, memberCount: 1248, sort: 0 }
])
</script>

<style scoped>
.sections-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--s-lg); }
.section-top { display: flex; align-items: center; gap: var(--s-base); margin-bottom: var(--s-base); }
.section-icon { font-size: 36px; line-height: 1; }
.section-desc { font-size: 13px; margin-bottom: var(--s-base); line-height: 1.5; }
.section-stats { display: flex; gap: var(--s-lg); font-size: 13px; color: var(--text-secondary); margin-bottom: var(--s-base); }
.section-stats strong { color: var(--text-primary); }
.section-actions { display: flex; gap: var(--s-sm); border-top: 1px solid var(--divider); padding-top: var(--s-base); }
</style>
