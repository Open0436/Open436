import request from './request'

export function getSections(params) {
  return request.get('/api/sections/', { params })
}

export function createSection(data) {
  return request.post('/api/sections/', data)
}

export function updateSection(id, data) {
  return request.put(`/api/sections/${id}/`, data)
}

export function deleteSection(id) {
  return request.delete(`/api/sections/${id}/`)
}

export function toggleSectionStatus(id, data) {
  return request.put(`/api/sections/${id}/status/`, data)
}

export function getSectionStatistics() {
  return request.get('/api/sections/statistics/')
}
