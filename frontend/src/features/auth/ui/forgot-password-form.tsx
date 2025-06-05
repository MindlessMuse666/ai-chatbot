'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { DynamicFormFields, type FormField } from '@/shared/ui/dynamic-form'
import Link from 'next/link'
import { z } from 'zod'
import { useAuthStore } from '../model/auth-store'

// Создаем схему валидации
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Некорректный email' }),
})

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const fields: FormField[] = [
    {
      name: 'email',
      type: 'email',
      label: t('auth.email'),
      placeholder: t('auth.placeholder.email'),
      required: true,
      autoComplete: 'email',
    },
  ]
  const handleSubmit = async (data: { email: string }) => {
    alert(`Запрос на сброс пароля для email: ${data.email}`)
    // Тут вызов API
  }

  return (
    <div className="w-full min-w-[400px] p-8 bg-background rounded-xl shadow-lg border border-primary">
        <div className="flex justify-center mb-6">
            <img src="/logo-dark.svg" alt="Logo" className="h-11 w-auto" />  
        </div>

      <DynamicFormFields
        fields={fields}
        schema={forgotPasswordSchema}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        submitButton={{
          text: t('auth.submit.resetPassword'),
          isLoading: false,
        }}>

        <div className="text-center">
            <h1 className="text-xl text-foreground">
                {t('auth.forgotPassword')}
            </h1>
        </div>
        </DynamicFormFields>

        <div className="text-center text-sm text-foreground-secondary mt-6">
            <Link 
                href="/forgot-password"
                className="text-primary-foreground hover:underline font-medium">
                {t('auth.backToLogin')}
            </Link>
        </div>

        {/* Ссылка на регистрацию */}
      <p className="text-center text-sm text-foreground-secondary mt-6">
        {t('auth.noAccount')}{' '}
        <Link
          href="/register"
          className="text-primary-foreground hover:underline font-medium"
        >
          {t('auth.createAccount')}
        </Link>
      </p>
    </div>
  )
}