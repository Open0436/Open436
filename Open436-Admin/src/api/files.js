import request from './request'

export function uploadFile(formData) {
  return request.post('/api/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function getFileInfo(id) {
  return request.get(`/api/files/${id}`)
}

export function deleteFile(id) {
  return request.delete(`/api/files/${id}`)
}
