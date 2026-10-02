import api from './axiosInstance'

export const getPayments = (status = 'all') => api.get('/admin/payments', { params: { status } })
export const verifyPayment = (id) => api.post(`/admin/payments/${id}/verify`)
export const getPendingWithdrawals = () => api.get('/admin/withdrawals')
export const updateWithdrawal = (id, status) => api.patch(`/admin/withdrawals/${id}`, { status })