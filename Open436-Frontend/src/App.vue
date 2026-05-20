<template>
  <router-view />
  <ToastNotification />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ToastNotification from '@/components/ToastNotification.vue'

const auth = useAuthStore()

onMounted(() => {
  // 页面刷新时尝试恢复登录态
  if (auth.token && !auth.user) {
    auth.fetchUser()
  }
})
</script>
