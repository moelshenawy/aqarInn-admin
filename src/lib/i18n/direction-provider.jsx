import { createContext, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getLanguageDirection } from '@/lib/i18n/language'

const DirectionContext = createContext({ dir: 'ltr' })

export function AppDirectionProvider({ children }) {
  const { i18n } = useTranslation()
  const value = useMemo(
    () => ({ dir: getLanguageDirection(i18n.resolvedLanguage) }),
    [i18n.resolvedLanguage],
  )

  return (
    <DirectionContext.Provider value={value}>
      <div dir={'rtl'} className="min-h-screen">
        {children}
      </div>
    </DirectionContext.Provider>
  )
}

export function useDirection() {
  return useContext(DirectionContext)
}
