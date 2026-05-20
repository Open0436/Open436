<template>
  <el-container class="admin-layout">
    <el-aside :width="appStore.sidebarCollapsed ? '64px' : '220px'" class="admin-aside">
      <AdminSidebar />
    </el-aside>
    <el-container>
      <el-header class="admin-header" height="60px">
        <AdminHeader />
      </el-header>
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import AdminSidebar from '@/components/AdminSidebar.vue'
import AdminHeader from '@/components/AdminHeader.vue'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.admin-layout { height: 100vh; }
.admin-aside {
  background: #001529;
  transition: width 0.3s;
  overflow: hidden;
}
.admin-header {
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
  padding: 0 20px;
  display: flex;
  align-items: center;
}
.admin-main {
  background: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
