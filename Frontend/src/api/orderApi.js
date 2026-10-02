import api from './axiosInstance'

export const getOrders = () => api.get('/orders')
export const getOrder = (id) => api.get(`/orders/${id}`)
export const createOrder = (payload) => api.post('/orders', payload)
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status })
export const scheduleDelivery = (id, deliveryAt) => api.patch(`/orders/${id}/delivery-schedule`, { deliveryAt })
