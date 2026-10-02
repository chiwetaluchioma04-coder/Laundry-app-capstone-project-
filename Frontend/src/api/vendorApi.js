import api from './axiosInstance'

export const getVendorDirectory = () => api.get('/vendor/directory')
export const getVendorPricing = () => api.get('/vendor/pricing')
export const updateVendorPricing = (payload) => api.patch('/vendor/pricing', payload)
export const updateBankDetails = (payload) => api.patch('/vendor/bank-details', payload)
export const getAvailableVendorOrders = () => api.get('/vendor/orders/available')
export const getVendorOrders = () => api.get('/vendor/orders')
export const receiveVendorOrder = (id) => api.patch(`/vendor/orders/${id}/receive`)
export const updateVendorOrderStatus = (id, status) => api.patch(`/vendor/orders/${id}/status`, { status })