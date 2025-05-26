'use client'

import { LoginForm } from '@/features/auth/ui/login-form'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/features/auth/model/auth-store'
import { useEffect } from 'react'

export default function LoginPage() {
  const { checkAuth, isLoading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
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