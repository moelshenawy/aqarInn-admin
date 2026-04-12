import { z } from 'zod'

import { AUTH_VALIDATION_MESSAGES } from '@/features/auth/constants/auth-ui'

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, AUTH_VALIDATION_MESSAGES.emailRequired)
    .max(100, AUTH_VALIDATION_MESSAGES.emailTooLong)
    .email(AUTH_VALIDATION_MESSAGES.emailInvalid),
  password: z
    .string()
    .min(1, AUTH_VALIDATION_MESSAGES.passwordRequired)
    .max(50, AUTH_VALIDATION_MESSAGES.passwordTooLong),
  remember: z.boolean().default(false),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, AUTH_VALIDATION_MESSAGES.emailRequired)
    .max(100, AUTH_VALIDATION_MESSAGES.emailTooLong)
    .email(AUTH_VALIDATION_MESSAGES.emailInvalid),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, AUTH_VALIDATION_MESSAGES.passwordRequired)
      .max(50, AUTH_VALIDATION_MESSAGES.passwordTooLong),
    confirmPassword: z.string().min(
      1,
      AUTH_VALIDATION_MESSAGES.confirmPasswordRequired,
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_VALIDATION_MESSAGES.passwordMismatch,
    path: ['confirmPassword'],
  })
