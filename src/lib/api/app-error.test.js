import { describe, expect, it } from 'vitest'

import { normalizeApiError } from '@/lib/api/app-error'

describe('normalizeApiError', () => {
  it('normalizes unauthorized responses', () => {
    const normalized = normalizeApiError({
      response: { status: 401, data: {} },
    })
    expect(normalized.status).toBe(401)
    expect(normalized.isAuthError).toBe(true)
    expect(normalized.message).toBe('validation.sessionExpired')
  })

  it('normalizes validation payloads', () => {
    const normalized = normalizeApiError({
      response: {
        status: 422,
        data: {
          message: 'validation.invalidSubmission',
          errors: { email: ['Already taken'] },
        },
      },
    })
    expect(normalized.status).toBe(422)
    expect(normalized.fields.email).toEqual(['Already taken'])
  })

  it('normalizes network failures', () => {
    const normalized = normalizeApiError({ request: {} })
    expect(normalized.isNetworkError).toBe(true)
    expect(normalized.code).toBe('NETWORK_ERROR')
  })
})
