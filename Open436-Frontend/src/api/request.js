/**
 * Axios 请求封装
 * 统一配置请求拦截器和响应拦截器
 */
import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('open436_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 统一处理响应数据
    const res = response.data
    return res
  },
  (error) => {
    // 统一处理错误响应
    if (error.response?.status === 401) {
      // Token 过期或无效，清除登录态
      localStorage.removeItem('open436_token')
      localStorage.removeItem('open436_user')
    }
    return Promise.reject(error)
  }
)

export default request

