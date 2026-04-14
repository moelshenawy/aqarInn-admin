import { Globe } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AUTH_BRAND_CONTENT,
  AUTH_LOGO_SRC,
} from '@/features/auth/constants/auth-ui'
import { cn } from '@/lib/utils'

// Helper to get locale from path
function getLocaleFromPath(pathname) {
  if (pathname.startsWith('/en')) return 'en'
  return 'ar'
}

export function AuthBrandPanel({ className }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { i18n } = useTranslation()
  const currentLocale = getLocaleFromPath(location.pathname)

  // Switch locale and update URL
  const handleLocaleSwitch = () => {
    const newLocale = currentLocale === 'ar' ? 'en' : 'ar'
    // Change i18n language
    i18n.changeLanguage(newLocale)
    // Update URL prefix
    let newPath = location.pathname
    if (newLocale === 'en') {
      if (!newPath.startsWith('/en')) {
        newPath = '/en' + (newPath === '/' ? '' : newPath)
      }
    } else {
      if (newPath.startsWith('/en')) {
        newPath = newPath.replace(/^\/en/, '') || '/'
      }
    }
    navigate(newPath + location.search, { replace: true })
  }

  return (
    <section className={cn('auth-brand-panel', className)}>
      <div className="flex justify-start">
        <img src={AUTH_LOGO_SRC} alt="Aqar Inn" className="auth-brand-logo" />
      </div>

      <div className="auth-brand-copy space-y-[25px]">
        <h1 className="text-[30px] leading-[38px] font-semibold text-[#252b37] md:text-[36px] md:leading-[44px]">
          {AUTH_BRAND_CONTENT.title[0]}
          <br />
          {AUTH_BRAND_CONTENT.title[1]}
        </h1>
        <p className="auth-brand-description text-[18px] leading-[28px] font-normal text-[#414651] md:text-[20px] md:leading-[30px]">
          {AUTH_BRAND_CONTENT.description}
        </p>
      </div>

      <div className="flex items-center justify-start gap-1.5 text-[#5c4437]">
        <button
          type="button"
          className="text-sm leading-5 font-semibold hover:underline focus:outline-none"
          aria-label={
            currentLocale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'
          }
          onClick={handleLocaleSwitch}
        >
          {currentLocale === 'ar' ? 'EN' : 'العربية'}
        </button>
        <Globe className="size-4 stroke-[1.6]" />
      </div>
    </section>
  )
}
