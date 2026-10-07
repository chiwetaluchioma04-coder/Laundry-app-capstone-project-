import axios from 'axios'

const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
const apiBaseURL = configuredApiUrl
  ? (/\/api$/i.test(configuredApiUrl) ? configuredApiUrl : `${configuredApiUrl}/api`)
  : '/api'

const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('folded_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default axiosInstance
