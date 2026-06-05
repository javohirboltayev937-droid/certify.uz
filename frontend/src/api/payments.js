import api from './axios'

export const paymentsAPI = {
  // Obuna rejalari
  getPlans: () => api.get('/payments/plans/'),

  // Obuna yaratish (checkout URL qaytaradi)
  subscribe: (data) => api.post('/payments/subscribe/', data),

  // To'lov holati
  getPaymentStatus: (paymentId) => api.get(`/payments/status/${paymentId}/`),

  // Mening obuna
  getMySubscription: () => api.get('/payments/my-subscription/'),

  // To'lov tarixi
  getHistory: () => api.get('/payments/history/'),

  // OTP
  sendOTP: (phone) => api.post('/payments/otp/send/', { phone }),
  verifyOTP: (phone, code) => api.post('/payments/otp/verify/', { phone, code }),
}

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: (refresh) => api.post('/auth/logout/', { refresh }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v) })
    return api.patch('/auth/profile/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  changePassword: (data) => api.post('/auth/change-password/', data),
  getStats: () => api.get('/auth/stats/'),

  // Email tasdiqlash
  verifyEmail: (token) => api.post('/auth/verify-email/', { token }),
  resendVerification: () => api.post('/auth/resend-verification/'),

  // Parol tiklash
  forgotPassword: (email) => api.post('/auth/forgot-password/', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password/', { token, password }),
}
