import api from './axios'

export const dtmAPI = {
  getCategories: () => api.get('/dtm/categories/'),
  getDirections: (params) => api.get('/dtm/directions/', { params }),
  getDirection: (id) => api.get(`/dtm/directions/${id}/`),
  getDirectionSubjects: (id) => api.get(`/dtm/directions/${id}/subjects/`),
}
