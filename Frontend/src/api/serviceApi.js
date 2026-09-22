import api from './axiosInstance'

export const getServices = () => api.get('/services')
export const createService = (payload) => api.post('/services', payload)
export const updateService = (id, payload) => api.patch(`/services/${id}`, payload)
