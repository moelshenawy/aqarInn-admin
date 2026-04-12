import { z } from 'zod'

function getAuthValidationMessages(t) {
  return {
    emailRequired: t('emailRequired'),
    emailInvalid: t('emailInvalid'),
    emailTooLong: t('emailTooLong'),
    passwordRequired: t('passwordRequired'),
    confirmPasswordRequired: t('confirmPasswordRequired'),
    passwordTooLong: t('passwordTooLong'),
    passwordMismatch: t('passwordMismatch'),
    passwordMinLength: t('passwordMinLength'),
    passwordUppercase: t('passwordUppercase'),
    passwordNumber: t('passwordNumber'),
    passwordSymbol: t('passwordSymbol'),
  }
}

function createEmailSchema(messages) {
  return z
    .string()
    .min(1, messages.emailRequired)
    .max(100, messages.emailTooLong)
    .email(messages.emailInvalid)
}

function createPasswordSchema(requiredMessage, messages) {
  return z
    .string()
    .min(1, requiredMessage)
    .max(50, messages.passwordTooLong)
    .refine((value) => value.length >= 8, {
      message: messages.passwordMinLength,
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: messages.passwordUppercase,
    })
    .refine((value) => /\d/.test(value), {
      message: messages.passwordNumber,
    })
    .refine((value) => /[^A-Za-z0-9]/.test(value), {
      message: messages.passwordSymbol,
    })
}

export function createLoginFormSchema(t) {
  const messages = getAuthValidationMessages(t)

  return z.object({
    email: createEmailSchema(messages),
    password: z
      .string()
      .min(1, messages.passwordRequired)
      .max(50, messages.passwordTooLong),
    remember: z.boolean().default(false),
  })
}

export function createForgotPasswordSchema(t) {
  return z.object({
    email: createEmailSchema(getAuthValidationMessages(t)),
  })
}

export function createResetPasswordSchema(t) {
  const messages = getAuthValidationMessages(t)

  return z
    .object({
      password: createPasswordSchema(messages.passwordRequired, messages),
      confirmPassword: createPasswordSchema(
        messages.confirmPasswordRequired,
        messages,
      ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordMismatch,
      path: ['confirmPassword'],
    })
}
