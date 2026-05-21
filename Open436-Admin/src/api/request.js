import axios from 'axios'
import { ElMessage } from 'element-plus'
import { storage } from '@/utils/storage'
import router from '@/router'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000
})

request.interceptors.request.use(config => {
  const token = storage.get('token')
  if (token) {
    config.headers['token'] = token
  }
  return config
})

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code && res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message))
    }
    return res
  },
  error => {
    if (error.response) {
      const { status, data } = error.response
      const msg = data?.message || '请求失败'
      if (status === 401) {
        storage.clear()
        router.push('/login')
      }
      return Promise.reject(new Error(msg))
    }
    return Promise.reject(new Error('网络连接失败'))
  }
)

export default request
