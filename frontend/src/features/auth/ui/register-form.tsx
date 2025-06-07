"use client";

import { useTranslation } from 'react-i18next'
import { DynamicFormFields, type FormField } from '@/shared/ui/dynamic-form'
import Link from 'next/link'
import { z } from 'zod'
import { useAuthStore } from '../model/auth-store'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>

/**
 * RegisterForm — форма регистрации пользователя.
 * Использует react-hook-form, Zod для валидации, интеграцию с Zustand store.
 * Показывает ошибки через toast, уведомляет об успешной регистрации.
 */
export function RegisterForm() {
  const { t } = useTranslation()
  const { register: authStoreRegister, isLoading } = useAuthStore()
  const router = useRouter()

  // Описание полей формы
  const fields: FormField[] = [
    {
      name: 'email',
      type: 'email',
      label: t('auth.email'),
      placeholder: t('auth.placeholder.email'),
      required: true,
      autoComplete: 'email'
    },
    {
      name: 'username',
      type: 'text',
      label: t('auth.username'),
      placeholder: t('auth.placeholder.username'),
      required: true,
      autoComplete: 'username'
    },
    {
      name: 'password',
      type: 'password',
      label: t('auth.password'),
      placeholder: t('auth.placeholder.password'),
      required: true,
      autoComplete: 'new-password',
      endContent: true,
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: t('auth.confirmPassword'),
      placeholder: t('auth.placeholder.confirmPassword'),
      required: true,
      autoComplete: 'new-password',
      endContent: true,
    }
  ]

  // Обработка отправки формы
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authStoreRegister(data.email, data.password, data.username)
      toast.success('Successfully registered!')
      router.replace('/chat')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register')
    }
  }

  return (
    <div className="w-full min-w-[400px] p-8 bg-background rounded-xl shadow-lg border border-primary">
      <div className="flex justify-center mb-6">
        <img src="/logo-dark.svg" alt="Logo" className="h-11 w-auto" />
      </div>
      <DynamicFormFields
        fields={fields}
        schema={registerSchema}
        onSubmit={onSubmit}
        className="flex flex-col gap-6"
        submitButton={{
          text: t('auth.submit.register'),
          isLoading: isLoading
        }}
      >
        <div className="text-center">
          <h1 className="text-xl text-foreground">
            {t('auth.register')}
          </h1>
        </div>
      </DynamicFormFields>

      <p className="text-center text-sm text-foreground-secondary mt-6">
        {t('auth.haveAccount')}{' '}
        <Link
          href="/login"
          className="text-primary-foreground hover:underline font-medium"
        >
          {t('auth.login')}
        </Link>
      </p>
    </div>
  )
} 