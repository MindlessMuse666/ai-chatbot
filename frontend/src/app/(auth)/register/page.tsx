'use client'

import { RegisterForm } from '@/features/auth/ui/register-form'

/**
 * RegisterPage — страница регистрации пользователя.
 * Показывает форму регистрации.
 */
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  )
}