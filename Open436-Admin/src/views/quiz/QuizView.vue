<template>
  <div class="quiz-view">
    <div class="page-header">
      <h2>习题管理</h2>
    </div>
    <div class="toolbar">
      <el-input v-model="keyword" placeholder="搜索习题标题/内容" clearable style="width:240px" prefix-icon="Search" @input="loadQuizzes" />
      <el-select v-model="typeFilter" placeholder="题型" clearable style="width:120px" @change="loadQuizzes">
        <el-option label="选择题" value="choice" />
        <el-option label="判断题" value="truefalse" />
        <el-option label="填空题" value="fill" />
      </el-select>
      <el-select v-model="statusFilter" placeholder="状态" clearable style="width:120px" @change="loadQuizzes">
        <el-option label="已发布" value="published" />
        <el-option label="草稿" value="draft" />
      </el-select>
      <el-button type="primary" @click="openDialog()"><el-icon><Plus /></el-icon>新增习题</el-button>
    </div>

    <el-table :data="quizList" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" width="90">
        <template #default="{ row }">
          <el-tag :type="typeTagMap[row.type]" size="small">{{ typeLabels[row.type] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="difficulty" label="难度" width="100">
        <template #default="{ row }">
          <el-rate :model-value="row.difficulty" disabled :max="5" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
            {{ row.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="170" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openDialog(row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="display:flex;justify-content:flex-end;margin-top:16px">
      <el-pagination v-model:current-page="page" :page-size="10" :total="total" layout="total, prev, pager, next" @current-change="loadQuizzes" />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑习题' : '新增习题'" width="640px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="输入习题标题" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="题型" prop="type">
              <el-select v-model="form.type" style="width:100%">
                <el-option label="选择题" value="choice" />
                <el-option label="判断题" value="truefalse" />
                <el-option label="填空题" value="fill" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="难度" prop="difficulty">
              <el-rate v-model="form.difficulty" :max="5" show-score />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="题目" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="3" placeholder="输入题目内容" />
        </el-form-item>
        <el-form-item v-if="form.type === 'choice'" label="选项">
          <div v-for="(_, idx) in form.options" :key="idx" style="display:flex;gap:8px;margin-bottom:8px;width:100%">
            <el-tag>{{ String.fromCharCode(65 + idx) }}</el-tag>
            <el-input v-model="form.options[idx]" :placeholder="`选项${String.fromCharCode(65 + idx)}`" style="flex:1" />
            <el-button type="danger" :icon="Delete" circle size="small" @click="form.options.splice(idx, 1)" v-if="form.options.length > 2" />
          </div>
          <el-button type="primary" link @click="form.options.push('')" v-if="form.options.length < 6"><el-icon><Plus /></el-icon>添加选项</el-button>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model="form.answer" placeholder="输入正确答案" />
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="form.tags" multiple filterable allow-create default-first-option style="width:100%" placeholder="输入标签回车添加" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="draft">草稿</el-radio>
            <el-radio value="published">发布</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { getQuizList, createQuiz, updateQuiz, deleteQuiz } from '@/api/quiz'

const loading = ref(false)
const submitting = ref(false)
const quizList = ref([])
const total = ref(0)
const page = ref(1)
const keyword = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const dialogVisible = ref(false)
const editingId = ref(null)
const formRef = ref(null)

const typeLabels = { choice: '选择题', truefalse: '判断题', fill: '填空题' }
const typeTagMap = { choice: '', truefalse: 'success', fill: 'warning' }

const form = reactive({
  title: '', type: 'choice', difficulty: 3, content: '', options: ['', '', '', ''], answer: '', tags: [], status: 'draft'
})

const formRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择题型', trigger: 'change' }],
  content: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
  answer: [{ required: true, message: '请输入答案', trigger: 'blur' }]
}

async function loadQuizzes() {
  loading.value = true
  try {
    const res = await getQuizList({ page: page.value, size: 10, keyword: keyword.value, type: typeFilter.value, status: statusFilter.value })
    quizList.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function openDialog(row) {
  if (row) {
    editingId.value = row.id
    Object.assign(form, { title: row.title, type: row.type, difficulty: row.difficulty, content: row.content, options: row.options ? [...row.options] : ['', '', '', ''], answer: row.answer, tags: row.tags ? [...row.tags] : [], status: row.status })
  } else {
    editingId.value = null
    Object.assign(form, { title: '', type: 'choice', difficulty: 3, content: '', options: ['', '', '', ''], answer: '', tags: [], status: 'draft' })
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    const data = { ...form }
    if (data.type !== 'choice') delete data.options
    if (editingId.value) {
      await updateQuiz(editingId.value, data)
      ElMessage.success('更新成功')
    } else {
      await createQuiz(data)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadQuizzes()
  } catch (e) {
    ElMessage.error(e?.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确定删除习题「${row.title}」？`, '提示', { type: 'warning' })
    await deleteQuiz(row.id)
    ElMessage.success('删除成功')
    loadQuizzes()
  } catch {}
}

onMounted(loadQuizzes)
</script>
