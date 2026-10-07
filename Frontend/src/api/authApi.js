import api from './axiosInstance'

export const registerUser = (payload) => api.post('/auth/register', payload)
export const loginUser = (payload) => api.post('/auth/login', payload)
export const getProfile = () => api.get('/auth/me')
export const requestPasswordReset = (email) => api.post('/auth/forgot-password', { email })
export const resetPassword = (resetToken, password) => api.post('/auth/reset-password', { resetToken, password })
