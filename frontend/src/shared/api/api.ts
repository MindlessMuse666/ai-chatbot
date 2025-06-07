import axios from 'axios'
import authApi from '@/features/auth/api/auth'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_MOCKING === 'enabled'
    ? '/api/v1.0'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1.0';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    const isAuthRequest = originalRequest.url?.includes('/auth/')
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { accessToken } = await authApi.refresh()
        localStorage.setItem('token', accessToken)
        
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        processQueue()
        
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        document.cookie = `token=; path=/;`
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)