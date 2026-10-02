import api from './axiosInstance'

export const initializePayment = (orderId) => api.post('/payments/initialize', { orderId })