import request from './request'
import { isMockEnabled } from '@/mock'
import * as mockQuiz from '@/mock/quiz'

export function getQuizList(params) {
  if (isMockEnabled('quiz')) return mockQuiz.getQuizList(params)
  return request.get('/api/quiz/', { params })
}

export function getQuizDetail(id) {
  if (isMockEnabled('quiz')) return mockQuiz.getQuizDetail(id)
  return request.get(`/api/quiz/${id}`)
}

export function createQuiz(data) {
  if (isMockEnabled('quiz')) return mockQuiz.createQuiz(data)
  return request.post('/api/quiz/', data)
}

export function updateQuiz(id, data) {
  if (isMockEnabled('quiz')) return mockQuiz.updateQuiz(id, data)
  return request.put(`/api/quiz/${id}`, data)
}

export function deleteQuiz(id) {
  if (isMockEnabled('quiz')) return mockQuiz.deleteQuiz(id)
  return request.delete(`/api/quiz/${id}`)
}

export function getQuizStatistics() {
  if (isMockEnabled('quiz')) return mockQuiz.getQuizStatistics()
  return request.get('/api/quiz/statistics')
}
