import request from './request'

export function loginApi(data) {
  return request.post('/api/auth/admin/login', data)
}

export function logoutApi() {
  return request.post('/api/auth/logout')
}

export function getCurrentUser() {
  return request.get('/api/auth/current')
}
