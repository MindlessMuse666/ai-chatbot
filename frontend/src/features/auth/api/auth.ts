import { api } from "@/shared/api/api";
import { LoginFormData, RegisterFormData } from "../model/auth";

const authApi = {
  login: async (data: LoginFormData) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },
  register: async (data: Omit<RegisterFormData, 'confirmPassword'>) => {
    const response = await api.post('/auth/signup', data)
    return response.data
  },
  refresh: async () => {
    const response = await api.post('/auth/refresh', {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
      }
    })
    return response.data
  }
}

export default authApi;