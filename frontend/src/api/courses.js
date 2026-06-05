import api from './axios'

export const coursesAPI = {
  getSubjects: () => api.get('/courses/subjects/'),
  getCourses: (params) => api.get('/courses/', { params }),
  getCourse: (slug) => api.get(`/courses/${slug}/`),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll/`),
  getMyCourses: () => api.get('/courses/my/courses/'),
}
