<template>
  <AppNavbar />
  <AppSidebar @select="() => {}" />
  <div class="forum-layout with-sidebar">
    <div class="forum-main">
      <div class="card">
        <div class="card-header">发布新帖</div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">标题</label>
            <input v-model="form.title" class="form-input" placeholder="请输入帖子标题" maxlength="100" />
          </div>
          <div class="form-group">
            <label class="form-label">板块</label>
            <select v-model="form.section" class="form-select">
              <option v-for="s in sectionStore.sections.filter(s => s.key !== 'all')" :key="s.key" :value="s.key">{{ s.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">内容</label>
            <div class="editor-toolbar">
              <button v-for="t in toolbar" :key="t.label" class="toolbar-btn" @click="insertMarkdown(t.syntax)" :title="t.label" v-html="t.icon"></button>
            </div>
            <div class="editor-split">
              <textarea v-model="form.content" class="form-textarea editor-pane" placeholder="支持 Markdown 语法..." rows="16"></textarea>
              <div class="preview-pane" v-html="previewHtml"></div>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-text" @click="router.back()">取消</button>
            <button class="btn btn-primary" @click="submitPost" :disabled="!canSubmit">发布帖子</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useSectionStore } from '@/stores/section'
import { useUIStore } from '@/stores/ui'
import { markdownToHtml } from '@/utils/format'

const router = useRouter()
const sectionStore = useSectionStore()
const ui = useUIStore()
const form = ref({ title: '', section: 'tech', content: '' })
const editorRef = ref(null)

const toolbar = [
  { label: '加粗', syntax: '**粗体文本**', icon: '<b>B</b>' },
  { label: '斜体', syntax: '*斜体文本*', icon: '<i>I</i>' },
  { label: '标题', syntax: '\n## 标题\n', icon: 'H' },
  { label: '代码', syntax: '`代码`', icon: '&lt;/&gt;' },
  { label: '链接', syntax: '[链接文本](https://)', icon: '🔗' },
  { label: '图片', syntax: '![图片描述](https://)', icon: '🖼' },
  { label: '列表', syntax: '\n- 列表项\n', icon: '&#8226;' },
  { label: '引用', syntax: '\n> 引用内容\n', icon: '❝' }
]

const previewHtml = computed(() => markdownToHtml(form.value.content))
const canSubmit = computed(() => form.value.title.trim() && form.value.content.trim() && form.value.section)

function insertMarkdown(syntax) {
  form.value.content += syntax
}

function submitPost() {
  if (!canSubmit.value) { ui.showToast('请填写完整内容', 'warning'); return }
  ui.showToast('发布成功！', 'success')
  router.push('/post/1')
}
</script>

<style scoped>
.editor-toolbar {
  display: flex; gap: 2px; padding: var(--s-sm); background: var(--bg-dark);
  border: 1px solid var(--divider); border-bottom: none; border-radius: var(--r-sm) var(--r-sm) 0 0;
}
.toolbar-btn {
  width: 32px; height: 32px; border-radius: var(--r-sm); font-size: 13px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary); transition: all var(--t-fast);
}
.toolbar-btn:hover { background: var(--bg); color: var(--text-primary); }
.editor-split { display: flex; gap: 0; border: 1px solid var(--divider); border-radius: 0 0 var(--r-sm) var(--r-sm); overflow: hidden; }
.editor-pane {
  flex: 1; border: none; border-radius: 0; resize: none; font-family: var(--mono);
  font-size: 14px; line-height: 1.6; padding: var(--s-base);
}
.editor-pane:focus { box-shadow: none; }
.preview-pane {
  flex: 1; padding: var(--s-base); background: var(--bg); font-size: 14px;
  line-height: 1.8; overflow-y: auto; border-left: 1px solid var(--divider);
  min-height: 300px;
}
.preview-pane:empty::before { content: '预览区域...'; color: var(--text-disabled); }
.form-actions { display: flex; justify-content: flex-end; gap: var(--s-sm); margin-top: var(--s-lg); }
@media (max-width: 959px) { .editor-split { flex-direction: column; } }
</style>
