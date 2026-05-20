<template>
  <AppNavbar />
  <AppSidebar @select="() => {}" />
  <div class="forum-layout with-sidebar">
    <div class="forum-main">
      <div class="card">
        <div class="post-detail">
          <div class="post-meta">
            <img :src="`https://ui-avatars.com/api/?name=${post.author}&background=1976D2&color=fff&size=40`" class="avatar" />
            <div>
              <div class="author-name">u/{{ post.author }}</div>
              <div class="post-time">{{ formatDate(post.createdAt) }} · {{ sectionName }}</div>
            </div>
          </div>
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-content" v-html="postHtml"></div>
          <div class="post-actions">
            <button class="action-btn" :class="{ active: liked }" @click="liked = !liked">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
              {{ liked ? post.votes + 1 : post.votes }}
            </button>
            <button class="action-btn" :class="{ active: favorited }" @click="favorited = !favorited">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              {{ favorited ? '已收藏' : '收藏' }}
            </button>
            <button class="action-btn" @click="shareRef.open()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              分享
            </button>
            <router-link to="/post/new" class="action-btn">编辑</router-link>
            <button class="action-btn danger" @click="confirmRef.show('确定删除此帖子？', () => {})">删除</button>
          </div>
        </div>
      </div>
      <div class="card" style="margin-top: var(--s-base)">
        <div class="card-header">评论 ({{ totalComments }})</div>
        <div class="comment-form">
          <textarea v-model="newComment" class="form-textarea" placeholder="写下你的评论..." rows="3"></textarea>
          <button class="btn btn-primary btn-sm" style="margin-top: var(--s-sm)" @click="submitComment">发表评论</button>
        </div>
        <div class="comments-list">
          <template v-for="c in comments" :key="c.id">
            <CommentNode :comment="c" :depth="0" />
          </template>
        </div>
      </div>
    </div>
  </div>
  <ShareModal ref="shareRef" />
  <ConfirmDialog ref="confirmRef" />
</template>

<script setup>
import { ref, computed, h, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import ShareModal from '@/components/ShareModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useSectionStore } from '@/stores/section'
import { useUIStore } from '@/stores/ui'
import { formatDate, markdownToHtml } from '@/utils/format'

const route = useRoute()
const sectionStore = useSectionStore()
const ui = useUIStore()
const shareRef = ref(null)
const confirmRef = ref(null)
const liked = ref(false)
const favorited = ref(false)
const newComment = ref('')

const CommentNode = defineComponent({
  name: 'CommentNode',
  props: { comment: Object, depth: { type: Number, default: 0 } },
  setup(props) {
    return () => {
      const c = props.comment
      const indent = Math.min(props.depth, 4) * 24
      return h('div', { class: 'comment-item', style: { marginLeft: indent + 'px' } }, [
        h('div', { class: 'comment-header' }, [
          h('img', { src: `https://ui-avatars.com/api/?name=${c.author}&background=1976D2&color=fff&size=32`, class: 'avatar avatar-sm' }),
          h('span', { class: 'comment-author' }, 'u/' + c.author),
          h('span', { class: 'comment-time' }, formatDate(c.createdAt))
        ]),
        h('div', { class: 'comment-body' }, c.content),
        h('div', { class: 'comment-actions' }, [
          h('button', { class: 'action-btn btn-sm' }, '回复')
        ]),
        ...(c.children || []).map(child => h(CommentNode, { comment: child, depth: props.depth + 1, key: child.id }))
      ])
    }
  }
})

const post = ref({
  id: route.params.id, title: 'Vue 3 Composition API 最佳实践总结',
  author: '前端小王', section: 'tech', votes: 128, createdAt: '2026-05-19T10:30:00',
  content: `## 前言\n\n在 Vue 3 中，Composition API 带来了全新的代码组织方式。本文将分享在实际项目中总结的最佳实践。\n\n### 1. 逻辑复用优先使用 Composables\n\n将可复用逻辑封装为 \`useXXX\` 函数，比 Mixin 更清晰、更类型安全。\n\n\`\`\`js\nfunction useCounter(initial = 0) {\n  const count = ref(initial)\n  const increment = () => count.value++\n  return { count, increment }\n}\n\`\`\`\n\n### 2. 响应式数据选择\n\n- 基础类型用 \`ref()\`\n- 对象/数组用 \`reactive()\`\n- 从 \`reactive()\` 解构会丢失响应性，需用 \`toRefs()\`\n\n### 3. 组件通信模式\n\n> Props down, events up. 对于跨层级通信，优先使用 provide/inject。\n\n希望这些实践能帮助你写出更优雅的 Vue 3 代码！`
})

const sectionName = computed(() => sectionStore.getSection(post.value.section)?.name || '')
const postHtml = computed(() => markdownToHtml(post.value.content))

const comments = ref([
  { id: 1, author: '技术观察者', content: '写得非常好！关于 Composables 的封装原则，我觉得还可以补充一点：尽量保持每个 Composable 的职责单一。', createdAt: '2026-05-19T11:00:00', children: [
    { id: 2, author: '前端小王', content: '感谢补充！确实单一职责很重要，我在实际项目中也深有体会。', createdAt: '2026-05-19T11:15:00', children: [
      { id: 3, author: 'TS爱好者', content: '推荐结合 TypeScript 的泛型来约束 Composable 的输入输出类型，开发体验会好很多。', createdAt: '2026-05-19T12:00:00', children: [] }
    ] }
  ] },
  { id: 4, author: '性能狂魔', content: '建议再加一条关于性能的实践：computed 缓存和 watchEffect 的清理函数。这两点在大列表渲染场景下特别关键。', createdAt: '2026-05-19T13:00:00', children: [
    { id: 5, author: '前端小王', content: '好建议！我会在后续更新中补充性能优化相关的章节。', createdAt: '2026-05-19T13:30:00', children: [] }
  ] },
  { id: 6, author: '远程老司机', content: '感谢分享，已经收藏了。我之前一直在用 Options API，看完这篇文章准备在新项目中试试 Composition API。', createdAt: '2026-05-19T14:00:00', children: [] },
  { id: 7, author: 'CSS布道者', content: '关于 toRefs 那条，其实也可以用 computed 来代替解构，这样更灵活。', createdAt: '2026-05-19T15:00:00', children: [
    { id: 8, author: '架构思考者', content: 'computed 确实更灵活，但在简单场景下 toRefs 更直观。两种方式各有适用场景。', createdAt: '2026-05-19T15:30:00', children: [] }
  ] }
])

const totalComments = computed(() => {
  function count(arr) { return arr.reduce((n, c) => n + 1 + count(c.children || []), 0) }
  return count(comments.value)
})

function submitComment() {
  if (!newComment.value.trim()) { ui.showToast('请输入评论内容', 'warning'); return }
  comments.value.push({ id: Date.now(), author: '我', content: newComment.value, createdAt: new Date().toISOString(), children: [] })
  newComment.value = ''
  ui.showToast('评论成功', 'success')
}
</script>

<style scoped>
.post-detail { padding: var(--s-lg); }
.post-meta { display: flex; align-items: center; gap: var(--s-sm); margin-bottom: var(--s-base); }
.author-name { font-weight: 500; font-size: 14px; }
.post-time { font-size: 12px; color: var(--text-secondary); }
.post-title { font-size: 24px; font-weight: 600; margin-bottom: var(--s-base); line-height: 1.4; }
.post-content { line-height: 1.8; color: var(--text-primary); margin-bottom: var(--s-lg); }
.post-content :deep(h2) { font-size: 20px; margin: var(--s-base) 0 var(--s-sm); }
.post-content :deep(h3) { font-size: 16px; margin: var(--s-base) 0 var(--s-xs); }
.post-content :deep(code) { background: var(--bg-dark); padding: 2px 6px; border-radius: 3px; font-family: var(--mono); font-size: 13px; }
.post-content :deep(pre) { background: #1e1e1e; color: #d4d4d4; padding: var(--s-base); border-radius: var(--r-md); overflow-x: auto; margin: var(--s-base) 0; }
.post-content :deep(pre code) { background: none; padding: 0; color: inherit; }
.post-content :deep(blockquote) { border-left: 3px solid var(--primary); padding-left: var(--s-base); color: var(--text-secondary); margin: var(--s-base) 0; }
.post-actions { display: flex; gap: var(--s-sm); border-top: 1px solid var(--divider); padding-top: var(--s-base); }
.action-btn {
  display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px;
  border-radius: var(--r-sm); font-size: 13px; color: var(--text-secondary);
  transition: all var(--t-fast);
}
.action-btn:hover { background: var(--bg-dark); }
.action-btn.active { color: var(--primary); font-weight: 500; }
.action-btn.danger:hover { color: var(--error); }
.comment-form { padding: var(--s-lg); border-bottom: 1px solid var(--divider); }
.comments-list { padding: var(--s-base) var(--s-lg); }
.comment-item { padding: var(--s-base) 0; border-bottom: 1px solid var(--divider); }
.comment-header { display: flex; align-items: center; gap: var(--s-sm); margin-bottom: var(--s-xs); }
.comment-author { font-size: 13px; font-weight: 500; }
.comment-time { font-size: 12px; color: var(--text-secondary); }
.comment-body { font-size: 14px; line-height: 1.6; padding-left: 40px; }
.comment-actions { padding-left: 40px; margin-top: var(--s-xs); }
</style>
