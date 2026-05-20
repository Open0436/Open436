<template>
  <div class="enrollment-view">
    <div class="page-header"><h2>纳新管理</h2></div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" style="margin-bottom:20px">
      <el-col :span="6">
        <StatCard label="总申请数" :value="stats.total" icon="Document" icon-bg="#e3f2fd" icon-color="#1976D2" />
      </el-col>
      <el-col :span="6">
        <StatCard label="待审核" :value="stats.pending" icon="Clock" icon-bg="#fff3e0" icon-color="#ff9800" />
      </el-col>
      <el-col :span="6">
        <StatCard label="已通过" :value="stats.approved" icon="CircleCheck" icon-bg="#e8f5e9" icon-color="#4caf50" />
      </el-col>
      <el-col :span="6">
        <StatCard label="通过率" :value="stats.approvalRate + '%'" icon="TrendCharts" icon-bg="#f3e5f5" icon-color="#9c27b0" />
      </el-col>
    </el-row>

    <!-- 筛选与操作 -->
    <div class="toolbar">
      <el-input v-model="keyword" placeholder="搜索姓名/学号/专业" clearable style="width:240px" prefix-icon="Search" @input="loadList" />
      <el-radio-group v-model="statusFilter" @change="loadList">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="pending">待审核</el-radio-button>
        <el-radio-button value="approved">已通过</el-radio-button>
        <el-radio-button value="rejected">已拒绝</el-radio-button>
      </el-radio-group>
      <el-button type="success" :disabled="!selectedIds.length" @click="handleBatchReview('approved')">
        <el-icon><CircleCheck /></el-icon>批量通过 ({{ selectedIds.length }})
      </el-button>
      <el-button type="danger" :disabled="!selectedIds.length" @click="handleBatchReview('rejected')">
        <el-icon><CircleClose /></el-icon>批量拒绝 ({{ selectedIds.length }})
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="applications" stripe v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="姓名" width="90" />
      <el-table-column prop="studentId" label="学号" width="130" />
      <el-table-column prop="major" label="专业" width="150" />
      <el-table-column prop="phone" label="联系方式" width="130" />
      <el-table-column prop="submittedAt" label="提交时间" width="160" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="statusTagType[row.status]" size="small">{{ statusLabels[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openDetail(row)">查看</el-button>
          <template v-if="row.status === 'pending'">
            <el-button type="success" link size="small" @click="handleReview(row, 'approved')">通过</el-button>
            <el-button type="danger" link size="small" @click="handleReview(row, 'rejected')">拒绝</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <div style="display:flex;justify-content:flex-end;margin-top:16px">
      <el-pagination v-model:current-page="page" :page-size="10" :total="total" layout="total, prev, pager, next" @current-change="loadList" />
    </div>

    <!-- 详情抽屉 -->
    <el-drawer v-model="drawerVisible" :title="`申请详情 - ${currentItem?.name || ''}`" size="480px">
      <template v-if="currentItem">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="姓名">{{ currentItem.name }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ currentItem.studentId }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{ currentItem.major }}</el-descriptions-item>
          <el-descriptions-item label="手机">{{ currentItem.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentItem.email }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ currentItem.submittedAt }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusTagType[currentItem.status]" size="small">{{ statusLabels[currentItem.status] }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <div style="margin-top:20px">
          <h4 style="margin-bottom:8px">自我介绍</h4>
          <p style="color:#666;line-height:1.6">{{ currentItem.selfIntro }}</p>
        </div>
        <div style="margin-top:16px">
          <h4 style="margin-bottom:8px">技能标签</h4>
          <div>
            <el-tag v-for="skill in currentItem.skills?.split(',')" :key="skill" style="margin:2px 4px">{{ skill.trim() }}</el-tag>
          </div>
        </div>
        <div v-if="currentItem.reviewReason" style="margin-top:16px">
          <h4 style="margin-bottom:8px">审核意见</h4>
          <p style="color:#f56c6c">{{ currentItem.reviewReason }}</p>
        </div>
        <div v-if="currentItem.status === 'pending'" style="margin-top:24px;display:flex;gap:12px">
          <el-button type="success" @click="handleReview(currentItem, 'approved'); drawerVisible = false">通过</el-button>
          <el-button type="danger" @click="showRejectReason = true">拒绝</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 拒绝原因对话框 -->
    <el-dialog v-model="showRejectReason" title="拒绝原因" width="400px">
      <el-input v-model="rejectReason" type="textarea" :rows="3" placeholder="请输入拒绝原因（可选）" />
      <template #footer>
        <el-button @click="showRejectReason = false">取消</el-button>
        <el-button type="danger" @click="confirmReject">确定拒绝</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatCard from '@/components/StatCard.vue'
import { getApplicationList, reviewApplication, batchReview, getEnrollmentStatistics } from '@/api/enrollment'

const loading = ref(false)
const applications = ref([])
const total = ref(0)
const page = ref(1)
const keyword = ref('')
const statusFilter = ref('')
const selectedIds = ref([])
const stats = ref({ total: 0, pending: 0, approved: 0, rejected: 0, approvalRate: 0 })
const drawerVisible = ref(false)
const currentItem = ref(null)
const showRejectReason = ref(false)
const rejectReason = ref('')

const statusLabels = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
const statusTagType = { pending: 'warning', approved: 'success', rejected: 'danger' }

async function loadStats() {
  try {
    const res = await getEnrollmentStatistics()
    stats.value = res.data
  } catch {}
}

async function loadList() {
  loading.value = true
  try {
    const res = await getApplicationList({ page: page.value, size: 10, status: statusFilter.value, keyword: keyword.value })
    applications.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function handleSelectionChange(rows) {
  selectedIds.value = rows.filter(r => r.status === 'pending').map(r => r.id)
}

function openDetail(row) {
  currentItem.value = row
  drawerVisible.value = true
}

async function handleReview(row, status) {
  if (status === 'rejected') {
    currentItem.value = row
    showRejectReason.value = true
    return
  }
  try {
    await ElMessageBox.confirm(`确定通过「${row.name}」的申请？`, '确认', { type: 'success' })
    await reviewApplication(row.id, { status: 'approved' })
    ElMessage.success('已通过')
    loadList()
    loadStats()
  } catch {}
}

async function confirmReject() {
  if (!currentItem.value) return
  await reviewApplication(currentItem.value.id, { status: 'rejected', reason: rejectReason.value })
  ElMessage.success('已拒绝')
  showRejectReason.value = false
  rejectReason.value = ''
  drawerVisible.value = false
  loadList()
  loadStats()
}

async function handleBatchReview(status) {
  const label = status === 'approved' ? '通过' : '拒绝'
  try {
    await ElMessageBox.confirm(`确定批量${label} ${selectedIds.value.length} 条申请？`, '确认', { type: status === 'approved' ? 'success' : 'warning' })
    await batchReview({ ids: selectedIds.value, status })
    ElMessage.success(`批量${label}成功`)
    selectedIds.value = []
    loadList()
    loadStats()
  } catch {}
}

onMounted(() => {
  loadStats()
  loadList()
})
</script>
