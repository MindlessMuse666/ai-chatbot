import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import authApi from '../api/auth'
import { useUserStore } from '@/entities/user/model/store'
import { LoginFormData, RegisterFormData, hashPassword } from './auth'
import { useTranslation } from 'react-i18next'

export const useLogin = () => {
  const router = useRouter()
  const { fetchUser } = useUserStore()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (data: LoginFormData) => {
      const hashedPassword = hashPassword(data.password)
      return authApi.login({
        email: data.email,
        password: hashedPassword
      })
    },
    onSuccess: async (data: { accessToken: string; refreshToken: string }) => {
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      document.cookie = `token=${data.accessToken}; path=/;`
      await fetchUser()
      router.push('/')
      toast.success(t('auth.login'))
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error.response.data.message)
    }
  })
}

export const useRegister = () => {
  const router = useRouter()
  const { fetchUser } = useUserStore()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (data: Omit<RegisterFormData, 'confirmPassword'>) => {
      const hashedPassword = hashPassword(data.password)
      return authApi.register({
        email: data.email,
        name: data.name,
        password: hashedPassword
      })
    },
    onSuccess: async (data: { accessToken: string; refreshToken: string }) => {
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      document.cookie = `token=${data.accessToken}; path=/;`
      await fetchUser()
      router.push('/')
      toast.success(t('auth.register'))
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error.response.data.message)
    }
  })
}