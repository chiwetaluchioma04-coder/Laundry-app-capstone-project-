import api from './axiosInstance'

export const getWallet = () => api.get('/wallet')
export const getWithdrawals = () => api.get('/wallet/withdrawals')
export const requestWithdrawal = (amount) => api.post('/wallet/withdraw', { amount })