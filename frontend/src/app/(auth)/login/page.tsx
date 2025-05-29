'use client'

import { LoginForm } from '@/features/auth/ui/login-form'
import { useAuthStore } from '@/features/auth/model/auth-store'
import { useEffect } from 'react'

/**
 * LoginPage — страница входа пользователя.
 * Проверяет статус авторизации при монтировании, показывает форму логина или лоадер.
 */
export default function LoginPage() {
  const { checkAuth, isLoading } = useAuthStore()

  // Проверка авторизации при монтировании
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

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