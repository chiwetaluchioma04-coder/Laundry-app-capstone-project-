import api from './axiosInstance'

export const getPickups = () => api.get('/pickups')
export const createPickup = (payload) => api.post('/pickups', payload)
export const updatePickupStatus = (id, status) => api.patch(`/pickups/${id}/status`, { status })
