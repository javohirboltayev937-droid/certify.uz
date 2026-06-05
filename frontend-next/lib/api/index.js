import api from './axios'

export const authAPI = {
  login:               (d) => api.post('/auth/login/', d),
  register:            (d) => api.post('/auth/register/', d),
  logout:              (refresh) => api.post('/auth/logout/', { refresh }),
  getProfile:          () => api.get('/auth/profile/'),
  updateProfile:       (d) => { const fd = new FormData(); Object.entries(d).forEach(([k,v]) => v != null && fd.append(k,v)); return api.patch('/auth/profile/', fd, { headers: { 'Content-Type': 'multipart/form-data' } }) },
  changePassword:      (d) => api.post('/auth/change-password/', d),
  getStats:            () => api.get('/auth/stats/'),
  forgotPassword:      (d) => api.post('/auth/forgot-password/', d),
  resetPassword:       (d) => api.post('/auth/reset-password/', d),
}

export const coursesAPI = {
  getSubjects:  () => api.get('/courses/subjects/'),
  getCourses:   (p) => api.get('/courses/', { params: p }),
  getCourse:    (slug) => api.get(`/courses/${slug}/`),
  getSubject:   (slug) => api.get(`/courses/subjects/${slug}/`),
  getLessons:   (slug) => api.get(`/courses/subjects/${slug}/lessons/`),
  enroll:       (id) => api.post(`/courses/${id}/enroll/`),
  getMyCourses: () => api.get('/courses/my/courses/'),
}

export const dtmAPI = {
  getCategories:       () => api.get('/dtm/categories/'),
  getDirections:       (p) => api.get('/dtm/directions/', { params: p }),
  getDirection:        (id) => api.get(`/dtm/directions/${id}/`),
  getDirectionSubjects:(id) => api.get(`/dtm/directions/${id}/subjects/`),
}

export const examsAPI = {
  getExamTypes:   () => api.get('/exams/types/'),
  getExamType:    (slug) => api.get(`/exams/types/${slug}/`),
  getMockExams:   (p) => api.get('/exams/mocks/', { params: p }),
  getExams:       (p) => api.get('/exams/mocks/', { params: p }),
  getIELTSTips:   (s) => api.get('/exams/ielts/tips/', { params: { section: s } }),
  getNationalCerts:(p) => api.get('/exams/national/', { params: p }),
}

export const progressAPI = {
  startTest:        (d) => api.post('/progress/start-test/', d),
  submitTest:       (d) => api.post('/progress/submit-test/', d),
  getHistory:       (p) => api.get('/progress/history/', { params: p }),
  getResult:        (id) => api.get(`/progress/results/${id}/`),
  getMyProgress:    () => api.get('/progress/my-progress/'),
  getStats:         () => api.get('/progress/stats/'),
  updateLesson:     (d) => api.post('/progress/lesson-progress/', d),
  aiGenerateTest:   (d) => api.post('/questions/ai-generate/', d),
}

export const paymentsAPI = {
  getPlans:           () => api.get('/payments/plans/'),
  subscribe:          (d) => api.post('/payments/subscribe/', d),
  getPaymentStatus:   (id) => api.get(`/payments/status/${id}/`),
  getMySubscription:  () => api.get('/payments/my-subscription/'),
  getSubscription:    () => api.get('/payments/my-subscription/'),
  getHistory:         () => api.get('/payments/history/'),
}
