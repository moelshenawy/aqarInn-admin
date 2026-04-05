import { z } from 'zod'

import { APP_ROLES } from '@/lib/permissions/constants'

export function createLoginSchema(t) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail')),
    password: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .min(8, t('validation.minCharacters', { count: 8 })),
    role: z.enum(Object.values(APP_ROLES), { error: t('validation.required') }),
  })
}
