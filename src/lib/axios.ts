import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://web-production-e3006.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
