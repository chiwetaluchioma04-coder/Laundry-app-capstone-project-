import api from './axiosInstance'

export const getOrders = () => api.get('/orders')
export const getOrder = (id) => api.get(`/orders/${id}`)
export const createOrder = (payload) => api.post('/orders', payload)
export const updatePickupSchedule = (id, pickupDate) => api.patch(`/orders/${id}/pickup-schedule`, { pickupDate })
export const scheduleDelivery = (id, deliveryAt) => api.patch(`/orders/${id}/delivery-schedule`, { deliveryAt })
