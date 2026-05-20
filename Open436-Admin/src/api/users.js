import request from './request'

export function getUserList(params) {
  return request.get('/api/auth/users', { params })
}

export function createUser(data) {
  return request.post('/api/auth/users', data)
}

export function updateUserStatus(id, data) {
  return request.put(`/api/auth/users/${id}/status`, data)
}

export function resetPassword(id, data) {
  return request.put(`/api/auth/users/${id}/password`, data)
}
