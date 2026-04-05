import { describe, expect, it } from 'vitest'

import { getLanguageDirection } from '@/lib/i18n/language'

describe('language helpers', () => {
  it('maps Arabic to rtl', () => {
    expect(getLanguageDirection('ar')).toBe('rtl')
  })

  it('maps English to ltr', () => {
    expect(getLanguageDirection('en')).toBe('ltr')
  })
})
