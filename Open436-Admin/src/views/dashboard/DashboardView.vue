<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <StatCard label="用户总数" :value="1248" icon="User" icon-bg="#e3f2fd" icon-color="#1976D2" :change="12" />
      </el-col>
      <el-col :span="6">
        <StatCard label="帖子总数" :value="3456" icon="Document" icon-bg="#e8f5e9" icon-color="#4caf50" :change="8" />
      </el-col>
      <el-col :span="6">
        <StatCard label="今日活跃" :value="342" icon="TrendCharts" icon-bg="#fff3e0" icon-color="#ff9800" :change="5" />
      </el-col>
      <el-col :span="6">
        <StatCard label="今日新增" :value="28" icon="Plus" icon-bg="#f3e5f5" icon-color="#9c27b0" :change="15" />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header><span class="card-title">最近帖子</span></template>
          <el-table :data="recentPosts" stripe size="small">
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column prop="time" label="时间" width="140" />
            <el-table-column label="操作" width="80">
              <template #default>
                <el-button type="primary" link size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span class="card-title">快捷操作</span></template>
          <div class="quick-actions">
            <el-button @click="$router.push('/users')" class="action-btn">
              <el-icon><User /></el-icon>用户管理
            </el-button>
            <el-button @click="$router.push('/quiz')" class="action-btn">
              <el-icon><EditPen /></el-icon>习题管理
            </el-button>
            <el-button @click="$router.push('/forum')" class="action-btn">
              <el-icon><ChatDotRound /></el-icon>论坛管理
            </el-button>
            <el-button @click="$router.push('/enrollment')" class="action-btn">
              <el-icon><UserFilled /></el-icon>纳新管理
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '@/components/StatCard.vue'

const recentPosts = ref([
  { title: 'Vue 3 Composition API 最佳实践', author: '张三', time: '5 分钟前' },
  { title: 'Spring Boot 微服务架构分享', author: '李四', time: '12 分钟前' },
  { title: 'Docker 容器化部署指南', author: '王五', time: '30 分钟前' },
  { title: 'Rust 所有权系统详解', author: '赵六', time: '1 小时前' },
  { title: 'PostgreSQL 性能优化技巧', author: '孙七', time: '2 小时前' }
])
</script>

<style lang="scss" scoped>
.stat-row { margin-bottom: 20px; }
.card-title { font-weight: 600; font-size: 16px; }
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.action-btn {
  width: 100%;
  justify-content: flex-start;
  height: 44px;
}
</style>
