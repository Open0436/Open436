<template>
  <div class="post-card" :class="{ pinned: post.pinned }" @click="$emit('click', post)">
    <div class="post-header">
      <img v-if="sectionData" :src="`https://api.iconify.design/${sectionData.icon}.svg?color=%23${sectionData.color.slice(1)}&width=20`" class="section-icon" />
      <span class="section-name" v-if="sectionData">r/{{ sectionData.name }}</span>
      <span class="dot">·</span>
      <span class="post-author">u/{{ post.author }}</span>
      <span class="dot">·</span>
      <span class="post-time">{{ formatDate(post.createdAt) }}</span>
      <span v-if="post.pinned" class="badge badge-warning" style="margin-left: auto">置顶</span>
    </div>
    <h3 class="post-title">{{ post.title }}</h3>
    <p class="post-preview">{{ post.content }}</p>
    <div class="post-footer">
      <span class="stat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        {{ post.votes || 0 }}
      </span>
      <span class="stat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        {{ post.replyCount || 0 }}
      </span>
      <span class="stat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        {{ post.shareCount || 0 }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { useSectionStore } from '@/stores/section'
import { formatDate } from '@/utils/format'

const props = defineProps({ post: { type: Object, required: true } })
defineEmits(['click'])
const sectionStore = useSectionStore()
const sectionData = sectionStore.getSection(props.post.section)
</script>

<style scoped>
.post-card {
  padding: var(--s-lg); border-bottom: 1px solid var(--divider);
  cursor: pointer; transition: background var(--t-fast);
}
.post-card:first-child { border-top: 1px solid var(--divider); }
.post-card:hover { background: #f8f9fa; }
.post-card.pinned { border-left: 4px solid var(--warning); padding-left: calc(var(--s-lg) - 4px); }
.post-header {
  display: flex; align-items: center; gap: var(--s-xs);
  font-size: 12px; color: var(--text-secondary); margin-bottom: var(--s-sm);
}
.section-icon { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; }
.section-name { font-weight: 500; }
.dot { color: var(--text-disabled); }
.post-title { font-size: 18px; font-weight: 500; color: var(--text-primary); margin-bottom: var(--s-xs); line-height: 1.4; }
.post-preview {
  font-size: 14px; color: var(--text-secondary); line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
  margin-bottom: var(--s-sm);
}
.post-footer { display: flex; gap: var(--s-lg); }
.stat {
  display: flex; align-items: center; gap: 4px; font-size: 12px;
  color: var(--text-secondary); font-weight: 500;
}
</style>
