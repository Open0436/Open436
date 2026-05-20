<template>
  <div class="forum-view">
    <div class="page-header">
      <h2>论坛管理</h2>
    </div>
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 帖子管理 -->
      <el-tab-pane label="帖子管理" name="posts">
        <div class="toolbar">
          <el-input v-model="postKw" placeholder="搜索帖子标题" clearable style="width:240px" prefix-icon="Search" @input="filterPosts" />
          <el-select v-model="postStatusFilter" placeholder="状态" clearable style="width:120px" @change="filterPosts">
            <el-option label="正常" value="normal" />
            <el-option label="置顶" value="pinned" />
          </el-select>
        </div>
        <el-table :data="filteredPosts" stripe>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
          <el-table-column prop="author" label="作者" width="100" />
          <el-table-column prop="views" label="浏览" width="80" />
          <el-table-column prop="replies" label="回复" width="80" />
          <el-table-column label="状态" width="80">
            <template #default="{ row }">
              <el-tag v-if="row.pinned" type="warning" size="small">置顶</el-tag>
              <el-tag v-else size="small">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="发布时间" width="160" />
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="togglePin(row)">{{ row.pinned ? '取消置顶' : '置顶' }}</el-button>
              <el-button type="danger" link size="small" @click="deletePost(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 评论管理 -->
      <el-tab-pane label="评论管理" name="comments">
        <div class="toolbar">
          <el-input v-model="commentKw" placeholder="搜索评论内容" clearable style="width:240px" prefix-icon="Search" @input="filterComments" />
          <el-radio-group v-model="commentStatusFilter" @change="filterComments">
            <el-radio-button value="">全部</el-radio-button>
            <el-radio-button value="normal">正常</el-radio-button>
            <el-radio-button value="reported">已举报</el-radio-button>
            <el-radio-button value="deleted">已删除</el-radio-button>
          </el-radio-group>
        </div>
        <el-table :data="filteredComments" stripe>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="content" label="内容" min-width="240" show-overflow-tooltip />
          <el-table-column prop="postTitle" label="所属帖子" width="160" show-overflow-tooltip />
          <el-table-column prop="user" label="用户" width="100" />
          <el-table-column prop="createdAt" label="时间" width="160" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="commentTagType[row.status]" size="small">{{ commentStatusLabels[row.status] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button v-if="row.status !== 'deleted'" type="danger" link size="small" @click="deleteComment(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 板块管理 -->
      <el-tab-pane label="板块管理" name="sections">
        <div class="toolbar">
          <el-button type="primary" @click="openSectionDialog()"><el-icon><Plus /></el-icon>添加板块</el-button>
        </div>
        <el-row :gutter="20">
          <el-col :span="8" v-for="section in sections" :key="section.id" style="margin-bottom:20px">
            <el-card shadow="hover">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
                <div class="section-icon" :style="{ background: section.color + '22', color: section.color }">{{ section.icon }}</div>
                <div>
                  <div style="font-weight:600;font-size:16px">{{ section.name }}</div>
                  <div style="font-size:12px;color:#909399">/{{ section.slug }}</div>
                </div>
              </div>
              <div style="font-size:13px;color:#666;margin-bottom:12px;min-height:36px">{{ section.description || '暂无描述' }}</div>
              <div style="display:flex;gap:16px;font-size:13px;color:#909399;margin-bottom:12px">
                <span>帖子 {{ section.postsCount || 0 }}</span>
                <span>排序 {{ section.sortOrder }}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <el-switch :model-value="section.isEnabled" @change="(v) => handleToggleSection(section, v)" active-text="启用" inactive-text="禁用" inline-prompt />
                <div style="display:flex;gap:4px">
                  <el-button type="primary" link size="small" @click="openSectionDialog(section)">编辑</el-button>
                  <el-button type="danger" link size="small" @click="handleDeleteSection(section)">删除</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!-- 板块编辑对话框 -->
    <el-dialog v-model="sectionDialogVisible" :title="editingSection ? '编辑板块' : '添加板块'" width="500px" destroy-on-close>
      <el-form ref="sectionFormRef" :model="sectionForm" :rules="sectionRules" label-width="80px">
        <el-form-item label="标识" prop="slug">
          <el-input v-model="sectionForm.slug" placeholder="如: tech（3-20字符）" :disabled="!!editingSection" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="sectionForm.name" placeholder="板块名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="sectionForm.description" type="textarea" :rows="2" placeholder="板块描述" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="sectionForm.color" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="sectionForm.sortOrder" :min="1" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="sectionDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="sectionSubmitting" @click="handleSubmitSection">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSections, createSection, updateSection, deleteSection, toggleSectionStatus } from '@/api/sections'

const route = useRoute()
const activeTab = ref(route.query.tab || 'posts')

// === 帖子 Mock ===
const postKw = ref('')
const postStatusFilter = ref('')
const posts = ref([
  { id: 1, title: 'Vue 3 Composition API 最佳实践', author: '张三', views: 1234, replies: 23, pinned: true, createdAt: '2025-04-15 10:00' },
  { id: 2, title: 'Spring Boot 微服务架构分享', author: '李四', views: 856, replies: 15, pinned: false, createdAt: '2025-04-14 14:00' },
  { id: 3, title: 'Docker 容器化部署指南', author: '王五', views: 623, replies: 8, pinned: false, createdAt: '2025-04-13 09:00' },
  { id: 4, title: 'Rust 所有权系统详解', author: '赵六', views: 445, replies: 12, pinned: false, createdAt: '2025-04-12 16:00' },
  { id: 5, title: 'PostgreSQL 性能优化技巧', author: '孙七', views: 321, replies: 6, pinned: true, createdAt: '2025-04-11 11:00' },
  { id: 6, title: 'Go 并发编程模式', author: '周八', views: 278, replies: 10, pinned: false, createdAt: '2025-04-10 15:00' }
])

const filteredPosts = computed(() => {
  let list = posts.value
  if (postKw.value) {
    const kw = postKw.value.toLowerCase()
    list = list.filter(p => p.title.toLowerCase().includes(kw))
  }
  if (postStatusFilter.value === 'pinned') list = list.filter(p => p.pinned)
  else if (postStatusFilter.value === 'normal') list = list.filter(p => !p.pinned)
  return list
})
function filterPosts() {}

function togglePin(row) {
  row.pinned = !row.pinned
  ElMessage.success(row.pinned ? '已置顶' : '已取消置顶')
}

function deletePost(row) {
  ElMessageBox.confirm(`确定删除帖子「${row.title}」？`, '提示', { type: 'warning' }).then(() => {
    posts.value = posts.value.filter(p => p.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// === 评论 Mock ===
const commentKw = ref('')
const commentStatusFilter = ref('')
const commentStatusLabels = { normal: '正常', reported: '已举报', deleted: '已删除' }
const commentTagType = { normal: 'success', reported: 'warning', deleted: 'danger' }
const comments = ref([
  { id: 1, content: '写得非常好，受益匪浅！期待更多分享。', postTitle: 'Vue 3 Composition API 最佳实践', user: '张三', status: 'normal', createdAt: '2025-04-15 11:00' },
  { id: 2, content: '这个方案在生产环境中有什么潜在问题吗？', postTitle: 'Spring Boot 微服务架构分享', user: '李四', status: 'normal', createdAt: '2025-04-14 15:00' },
  { id: 3, content: '这篇内容涉嫌抄袭，建议核实。', postTitle: 'Docker 容器化部署指南', user: '王五', status: 'reported', createdAt: '2025-04-13 10:00' },
  { id: 4, content: '感谢分享，已经按照教程部署成功了。', postTitle: 'Rust 所有权系统详解', user: '赵六', status: 'normal', createdAt: '2025-04-12 17:00' },
  { id: 5, content: '内容包含不当言论', postTitle: 'PostgreSQL 性能优化技巧', user: '孙七', status: 'reported', createdAt: '2025-04-11 12:00' },
  { id: 6, content: '广告内容已删除', postTitle: 'Go 并发编程模式', user: '周八', status: 'deleted', createdAt: '2025-04-10 16:00' },
  { id: 7, content: '非常实用的优化建议，收藏了。', postTitle: 'PostgreSQL 性能优化技巧', user: '吴九', status: 'normal', createdAt: '2025-04-09 14:00' },
  { id: 8, content: '请问有相关的源码参考吗？', postTitle: 'Vue 3 Composition API 最佳实践', user: '郑十', status: 'normal', createdAt: '2025-04-08 09:00' }
])

const filteredComments = computed(() => {
  let list = comments.value
  if (commentKw.value) {
    const kw = commentKw.value.toLowerCase()
    list = list.filter(c => c.content.toLowerCase().includes(kw))
  }
  if (commentStatusFilter.value) list = list.filter(c => c.status === commentStatusFilter.value)
  return list
})
function filterComments() {}

function deleteComment(row) {
  ElMessageBox.confirm('确定删除该评论？', '提示', { type: 'warning' }).then(() => {
    row.status = 'deleted'
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// === 板块管理（对接真实 API）===
const sections = ref([])
const sectionDialogVisible = ref(false)
const sectionSubmitting = ref(false)
const editingSection = ref(null)
const sectionFormRef = ref(null)

const sectionForm = reactive({ slug: '', name: '', description: '', color: '#1976D2', sortOrder: 1, icon: '📚' })
const sectionRules = {
  slug: [{ required: true, message: '请输入标识', trigger: 'blur' }, { min: 3, max: 20, message: '3-20字符', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
}

async function loadSections() {
  try {
    const res = await getSections()
    sections.value = (res.data || res.results || res || []).map(s => ({ ...s, icon: s.icon_file_id ? '📁' : '📚', postsCount: s.posts_count || 0, sortOrder: s.sort_order || 1, isEnabled: s.is_enabled !== false }))
  } catch {
    // Mock fallback
    sections.value = [
      { id: 1, slug: 'tech', name: '技术交流', description: '技术话题讨论与经验分享', color: '#1976D2', icon: '💻', postsCount: 234, sortOrder: 1, isEnabled: true },
      { id: 2, slug: 'design', name: '设计分享', description: 'UI/UX 设计灵感与作品展示', color: '#e91e63', icon: '🎨', postsCount: 156, sortOrder: 2, isEnabled: true },
      { id: 3, slug: 'discuss', name: '综合讨论', description: '自由讨论各种话题', color: '#ff9800', icon: '💬', postsCount: 89, sortOrder: 3, isEnabled: true },
      { id: 4, slug: 'question', name: '问答求助', description: '遇到问题？在这里寻求帮助', color: '#4caf50', icon: '❓', postsCount: 312, sortOrder: 4, isEnabled: true },
      { id: 5, slug: 'share', name: '资源分享', description: '优质资源、工具、教程推荐', color: '#9c27b0', icon: '🔗', postsCount: 78, sortOrder: 5, isEnabled: false },
      { id: 6, slug: 'announce', name: '公告通知', description: '官方公告与活动通知', color: '#f44336', icon: '📢', postsCount: 23, sortOrder: 6, isEnabled: true }
    ]
  }
}

function openSectionDialog(row) {
  if (row) {
    editingSection.value = row
    Object.assign(sectionForm, { slug: row.slug, name: row.name, description: row.description || '', color: row.color || '#1976D2', sortOrder: row.sortOrder || 1, icon: row.icon || '📚' })
  } else {
    editingSection.value = null
    Object.assign(sectionForm, { slug: '', name: '', description: '', color: '#1976D2', sortOrder: 1, icon: '📚' })
  }
  sectionDialogVisible.value = true
}

async function handleSubmitSection() {
  const valid = await sectionFormRef.value.validate().catch(() => false)
  if (!valid) return
  sectionSubmitting.value = true
  try {
    const data = { slug: sectionForm.slug, name: sectionForm.name, description: sectionForm.description, color: sectionForm.color, sort_order: sectionForm.sortOrder }
    if (editingSection.value) {
      await updateSection(editingSection.value.id, data)
      ElMessage.success('更新成功')
    } else {
      await createSection(data)
      ElMessage.success('创建成功')
    }
    sectionDialogVisible.value = false
    loadSections()
  } catch (e) {
    ElMessage.error(e?.message || '操作失败')
  } finally {
    sectionSubmitting.value = false
  }
}

async function handleToggleSection(section, val) {
  try {
    await toggleSectionStatus(section.id, { is_enabled: val })
    section.isEnabled = val
    ElMessage.success(val ? '已启用' : '已禁用')
  } catch {
    section.isEnabled = !val
  }
}

function handleDeleteSection(section) {
  ElMessageBox.confirm(`确定删除板块「${section.name}」？`, '提示', { type: 'warning' }).then(async () => {
    try {
      await deleteSection(section.id)
      ElMessage.success('删除成功')
      loadSections()
    } catch (e) {
      ElMessage.error(e?.message || '删除失败')
    }
  }).catch(() => {})
}

onMounted(() => {
  loadSections()
})
</script>

<style lang="scss" scoped>
.section-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
</style>
