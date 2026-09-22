import api from './axiosInstance'

export const getOrders = () => api.get('/orders')
export const createOrder = (payload) => api.post('/orders', payload)
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status })
