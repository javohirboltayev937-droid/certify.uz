import api from './axios'

export const examsAPI = {
  getExamTypes: () => api.get('/exams/types/'),
  getExamType: (slug) => api.get(`/exams/types/${slug}/`),
  getMockExams: (params) => api.get('/exams/mocks/', { params }),
  getIELTSTips: (section) => api.get('/exams/ielts/tips/', { params: { section } }),
  getNationalCerts: (params) => api.get('/exams/national/', { params }),
}

export const progressAPI = {
  startTest: (data) => api.post('/progress/start-test/', data),
  submitTest: (data) => api.post('/progress/submit-test/', data),
  getHistory: () => api.get('/progress/history/'),
  getResult: (id) => api.get(`/progress/results/${id}/`),
  getMyProgress: () => api.get('/progress/my-progress/'),
  updateLessonProgress: (data) => api.post('/progress/lesson-progress/', data),
  generateTest: (data) => api.post('/questions/generate/', data),
  aiGenerateTest: (data) => api.post('/questions/ai-generate/', data),
}
