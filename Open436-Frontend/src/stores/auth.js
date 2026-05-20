import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '@/api/request'
import { storage } from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(storage.get('user', null))
  const token = ref(storage.get('token', ''))

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const avatar = computed(() => user.value?.avatar || '')
  const nickname = computed(() => user.value?.nickname || '')

  function setUser(u) {
    user.value = u
    storage.set('user', u)
  }

  function setToken(t) {
    token.value = t
    storage.set('token', t)
  }

  async function register(username, password, nicknameVal = '') {
    try {
      const res = await request.post('/api/auth/register', {
        username,
        password,
        nickname: nicknameVal || username
      })
      if (res.code !== 200) {
        return { success: false, message: res.message || '注册失败' }
      }
      // 注册成功后自动登录
      return await login(username, password)
    } catch (e) {
      const msg = e?.response?.data?.message
      return { success: false, message: msg || e?.message || '注册失败' }
    }
  }

  async function login(username, password) {
    try {
      const res = await request.post('/api/auth/login', { username, password })
      if (res.code !== 200 || !res.data?.token) {
        return { success: false, message: res.message || '登录失败' }
      }
      setToken(res.data.token)
      setUser(res.data.user)
      return { success: true }
    } catch (e) {
      const msg = e?.response?.data?.message
      return { success: false, message: msg || e?.message || '登录失败' }
    }
  }

  async function fetchUser() {
    if (!token.value) return false
    try {
      const res = await request.get('/api/auth/current')
      if (res.code === 200 && res.data?.user) {
        setUser(res.data.user)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = ''
    storage.remove('user')
    storage.remove('token')
  }

  return { user, token, isLoggedIn, isAdmin, avatar, nickname, login, register, fetchUser, logout, setUser, setToken }
})
