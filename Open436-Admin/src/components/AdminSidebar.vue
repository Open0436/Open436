<template>
  <div class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-icon">O</span>
      <span v-show="!collapsed" class="logo-text">Open436</span>
    </div>
    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      background-color="#001529"
      text-color="#ffffffa6"
      active-text-color="#fff"
      router
      :collapse-transition="false"
    >
      <el-menu-item index="/dashboard">
        <el-icon><Odometer /></el-icon>
        <template #title>仪表盘</template>
      </el-menu-item>
      <el-sub-menu index="content">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>内容管理</span>
        </template>
        <el-menu-item index="/forum">
          <el-icon><ChatDotRound /></el-icon>
          <template #title>论坛管理</template>
        </el-menu-item>
        <el-menu-item index="/quiz">
          <el-icon><EditPen /></el-icon>
          <template #title>习题管理</template>
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="system">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="/enrollment">
          <el-icon><UserFilled /></el-icon>
          <template #title>纳新管理</template>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const appStore = useAppStore()

const activeMenu = computed(() => route.path)
const collapsed = computed(() => appStore.sidebarCollapsed)
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid #ffffff1a;
}
.logo-icon {
  width: 36px;
  height: 36px;
  background: #1976D2;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}
.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}
.el-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}
</style>
