<template>
  <div class="user-view">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>
    <div class="toolbar">
      <el-input v-model="keyword" placeholder="搜索用户名/昵称" clearable style="width:240px" prefix-icon="Search" @input="handleSearch" />
      <el-select v-model="roleFilter" placeholder="角色筛选" clearable style="width:140px" @change="handleSearch">
        <el-option label="管理员" value="admin" />
        <el-option label="普通用户" value="user" />
      </el-select>
      <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width:140px" @change="handleSearch">
        <el-option label="启用" value="active" />
        <el-option label="禁用" value="disabled" />
      </el-select>
      <el-button type="primary" @click="showCreateDialog = true"><el-icon><Plus /></el-icon>创建用户</el-button>
    </div>

    <el-table :data="filteredUsers" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column label="用户" min-width="200">
        <template #default="{ row }">
          <div style="display:flex;align-items:center;gap:10px">
            <el-avatar :size="32" :src="row.avatar">{{ row.username[0] }}</el-avatar>
            <div>
              <div style="font-weight:500">{{ row.nickname || row.username }}</div>
              <div style="font-size:12px;color:#909399">@{{ row.username }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : ''" size="small">
            {{ row.role === 'admin' ? '管理员' : '用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            :model-value="row.status === 'active'"
            @change="(val) => handleToggleStatus(row, val)"
            active-text="启用"
            inactive-text="禁用"
            inline-prompt
          />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="注册时间" width="180" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleResetPwd(row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="display:flex;justify-content:flex-end;margin-top:16px">
      <el-pagination
        v-model:current-page="page"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="loadUsers"
      />
    </div>

    <!-- 创建用户对话框 -->
    <el-dialog v-model="showCreateDialog" title="创建用户" width="460px" destroy-on-close>
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="createForm.username" placeholder="3-20个字符" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="createForm.password" type="password" placeholder="6-32个字符" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="createForm.role" style="width:100%">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleCreate">确定</el-button>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog v-model="showResetDialog" title="重置密码" width="460px" destroy-on-close>
      <el-form ref="resetFormRef" :model="resetForm" :rules="resetRules" label-width="80px">
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="resetForm.newPassword" type="password" placeholder="6-32个字符" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showResetDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleResetSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, createUser, updateUserStatus, resetPassword } from '@/api/users'

const loading = ref(false)
const submitting = ref(false)
const users = ref([])
const keyword = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const page = ref(1)
const pageSize = 10
const total = ref(0)

const showCreateDialog = ref(false)
const showResetDialog = ref(false)
const createFormRef = ref(null)
const resetFormRef = ref(null)
const resetTarget = ref(null)

const createForm = reactive({ username: '', password: '', role: 'user' })
const createRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 20, message: '3-20个字符', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 32, message: '6-32个字符', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const resetForm = reactive({ newPassword: '' })
const resetRules = {
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, max: 32, message: '6-32个字符', trigger: 'blur' }]
}

const filteredUsers = computed(() => {
  let list = users.value
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter(u => u.username.toLowerCase().includes(kw) || (u.nickname || '').toLowerCase().includes(kw))
  }
  if (roleFilter.value) list = list.filter(u => u.role === roleFilter.value)
  if (statusFilter.value) list = list.filter(u => u.status === statusFilter.value)
  return list
})

function handleSearch() {
  page.value = 1
}

async function loadUsers() {
  loading.value = true
  try {
    const res = await getUserList({ page: page.value, size: pageSize })
    const data = res.data || res
    users.value = data.list || data.records || data || []
    total.value = data.total || users.value.length
  } catch {
    // Mock fallback
    users.value = [
      { id: 1, username: 'admin', nickname: '管理员', role: 'admin', status: 'active', avatar: '', createdAt: '2025-01-01' },
      { id: 2, username: 'zhangsan', nickname: '张三', role: 'user', status: 'active', avatar: '', createdAt: '2025-02-15' },
      { id: 3, username: 'lisi', nickname: '李四', role: 'user', status: 'disabled', avatar: '', createdAt: '2025-03-10' },
      { id: 4, username: 'wangwu', nickname: '王五', role: 'user', status: 'active', avatar: '', createdAt: '2025-04-01' },
      { id: 5, username: 'zhaoliu', nickname: '赵六', role: 'user', status: 'active', avatar: '', createdAt: '2025-04-20' }
    ]
    total.value = users.value.length
  } finally {
    loading.value = false
  }
}

async function handleToggleStatus(row, val) {
  const status = val ? 'active' : 'disabled'
  try {
    await ElMessageBox.confirm(`确定${val ? '启用' : '禁用'}用户 ${row.username}？`, '提示', { type: 'warning' })
    await updateUserStatus(row.id, { status })
    row.status = status
    ElMessage.success('操作成功')
  } catch {}
}

async function handleCreate() {
  const valid = await createFormRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await createUser(createForm)
    ElMessage.success('创建成功')
    showCreateDialog.value = false
    Object.assign(createForm, { username: '', password: '', role: 'user' })
    loadUsers()
  } catch (e) {
    ElMessage.error(e?.message || '创建失败')
  } finally {
    submitting.value = false
  }
}

function handleResetPwd(row) {
  resetTarget.value = row
  resetForm.newPassword = ''
  showResetDialog.value = true
}

async function handleResetSubmit() {
  const valid = await resetFormRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await resetPassword(resetTarget.value.id, { newPassword: resetForm.newPassword })
    ElMessage.success('密码已重置')
    showResetDialog.value = false
  } catch (e) {
    ElMessage.error(e?.message || '重置失败')
  } finally {
    submitting.value = false
  }
}

onMounted(loadUsers)
</script>
