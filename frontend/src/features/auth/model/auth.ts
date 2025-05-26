import { z } from 'zod'
import { TFunction } from 'i18next'
import crypto from 'crypto'

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  name: string
  password: string
  confirmPassword: string
}

export const createLoginSchema = (t: TFunction) => z.object({
  email: z.string()
    .min(1, t('validation.required', { field: t('auth.email') }))
    .email(t('validation.email')),
  password: z.string()
    .min(1, t('validation.required', { field: t('auth.password') }))
    .min(6, t('validation.minLength', { field: t('auth.password'), length: 6 }))
})

export const createRegisterSchema = (t: TFunction) => {
  return z.object({
    email: z.string()
      .min(1, t('validation.required', { field: t('auth.email') }))
      .email(t('validation.email')),
    name: z.string()
      .min(1, t('validation.required', { field: t('auth.name') }))
      .min(2, t('validation.minLength', { field: t('auth.name'), length: 2 })),
    password: z.string()
      .min(1, t('validation.required', { field: t('auth.password') }))
      .min(6, t('validation.minLength', { field: t('auth.password'), length: 6 })),
    confirmPassword: z.string()
      .min(1, t('validation.required', { field: t('auth.confirmPassword') }))
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwordMatch'),
    path: ['confirmPassword']
  })
}

export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex')
}
