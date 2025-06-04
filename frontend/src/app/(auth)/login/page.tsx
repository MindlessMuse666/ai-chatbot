"use client"


import { LoginForm } from '@/features/auth/ui/login-form'
import { useAuthStore } from '@/features/auth/model/auth-store'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

/**
 * LoginPage — страница входа пользователя.
 * Проверяет статус авторизации при монтировании, показывает форму логина или лоадер.
 */
export default function LoginPage() {
  const { checkAuth, isLoading } = useAuthStore()
  const searchParams = useSearchParams()
  const [toastShown, setToastShown] = useState(false)

  // Проверка авторизации при монтировании
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Показывает тост с ошибкой при переходе на страницу логина с query-параметром 'reason=auth'
  useEffect(() => {
    if (searchParams.get('reason') === 'auth') {
      toast.error('Для доступа к чату необходимо войти в аккаунт', { id: 'login-required' })
    }
  }, [searchParams])

  if (isLoading) {
    // Лоадер при проверке статуса
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}