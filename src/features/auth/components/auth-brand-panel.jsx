import { Globe } from 'lucide-react'

import {
  AUTH_BRAND_CONTENT,
  AUTH_LOGO_SRC,
} from '@/features/auth/constants/auth-ui'
import { cn } from '@/lib/utils'

export function AuthBrandPanel({ className }) {
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
        <span className="text-sm leading-5 font-semibold">
          {AUTH_BRAND_CONTENT.language}
        </span>
        <Globe className="size-4 stroke-[1.6]" />
      </div>
    </section>
  )
}
