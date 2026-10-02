import api from './axiosInstance'

export const registerUser = (payload) => api.post('/auth/register', payload)
export const loginUser = (payload) => api.post('/auth/login', payload)
export const getProfile = () => api.get('/auth/me')
export const updateProfile = (payload) => api.patch('/users/me', payload)
