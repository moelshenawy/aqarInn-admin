import { QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'

import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'
import { queryClient } from '@/lib/query/query-client'
import { router } from '@/app/router/router'

export function AppProviders() {
  useEffect(() => {
    const handleLanguageChanged = () => {
      void queryClient.invalidateQueries()
    }

    i18n.on('languageChanged', handleLanguageChanged)

    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppDirectionProvider>
            <TooltipProvider delayDuration={150}>
              <RouterProvider router={router} />
              <Toaster richColors closeButton />
            </TooltipProvider>
          </AppDirectionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nextProvider>
  )
}
