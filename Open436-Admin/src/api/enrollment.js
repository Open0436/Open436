import { isMockEnabled } from '@/mock'
import * as mockEnrollment from '@/mock/enrollment'

export function getApplicationList(params) {
  if (isMockEnabled('enrollment')) return mockEnrollment.getApplicationList(params)
  return request.get('/api/enrollment/', { params })
}

export function reviewApplication(id, data) {
  if (isMockEnabled('enrollment')) return mockEnrollment.reviewApplication(id, data)
  return request.put(`/api/enrollment/${id}/review`, data)
}

export function batchReview(data) {
  if (isMockEnabled('enrollment')) return mockEnrollment.batchReview(data)
  return request.post('/api/enrollment/batch-review', data)
}

export function getEnrollmentStatistics() {
  if (isMockEnabled('enrollment')) return mockEnrollment.getEnrollmentStatistics()
  return request.get('/api/enrollment/statistics')
}
