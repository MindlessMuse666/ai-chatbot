'use client'

import { useTranslation } from 'react-i18next'
import { useLogin } from '../model/use-auth'
import { DynamicFormFields, type FormField } from '@/shared/ui/dynamic-form'
import Link from 'next/link'
import { createLoginSchema, type LoginFormData } from '../model/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../model/auth-store'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const Toaster = dynamic(() => import('sonner').then(mod => mod.Toaster), { ssr: false })

/**
 * LoginForm — форма входа пользователя.
 * Использует react-hook-form, Zod для валидации, интеграцию с Zustand store.
 * Показывает ошибки через toast, редиректит после успешного входа.
 */
export function LoginForm() {
  const { t } = useTranslation()
  const { mutate: login, isPending } = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(t)),
  })
  const { login: authStoreLogin, isLoading } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const fallback = '/chat'
  const [loginSuccess, setLoginSuccess] = useState(false)

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
      name: 'password',
      type: 'password',
      label: t('auth.password'),
      placeholder: t('auth.placeholder.password'),
      required: true,
      autoComplete: 'current-password',
      endContent: true,
    }
  ]

  // Обработка отправки формы
  const onSubmit = async (data: LoginFormData) => {
    try {
      await authStoreLogin(data.email, data.password)
      setLoginSuccess(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to login')
    }
  }

  // Редирект после успешного входа
  useEffect(() => {
    if (loginSuccess) {
      toast.success('Successfully logged in!')
      setTimeout(() => {
        console.log('Redirecting to /chat')
        router.replace('/chat')
      }, 300)
    }
  }, [loginSuccess, router])

  return (
    <div className="w-full min-w-[400px] p-8 bg-background rounded-xl shadow-lg border border-primary">
      <div className="flex justify-center mb-6">
        <img src="/logo-dark.svg" alt="Logo" className="h-11 w-auto" />
      </div>
      <DynamicFormFields
        fields={fields}
        schema={createLoginSchema(t)}
        onSubmit={onSubmit}
        className="flex flex-col gap-6"
        submitButton={{
          text: t('auth.submit.login'),
          isLoading: isLoading
        }}
      >
        <div className="text-center">
          <h1 className="text-xl text-foreground">
            {t('auth.login')}
          </h1>
        </div>
      </DynamicFormFields>

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

      {/* Ссылка на сброс пароля */}
      <div className="text-center text-sm text-foreground-secondary mt-6">
        <Link 
          href="/forgot-password"
          className="text-primary-foreground hover:underline font-medium"
        >
          {t('auth.forgotPassword')}
        </Link>
      </div>
    </div>
  )
}