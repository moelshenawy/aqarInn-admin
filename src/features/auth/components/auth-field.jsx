import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

export const AuthField = forwardRef(function AuthField(
  {
    label,
    error,
    trailingIcon: TrailingIcon,
    leadingIcon: LeadingIcon,
    className,
    inputClassName,
    ...props
  },
  ref,
) {
  const hasError = Boolean(error)

  return (
    <label className={cn('flex w-full flex-col items-start gap-3', className)}>
      <span className="text-right text-sm leading-5 font-medium text-[#402f28]">
        {label}
      </span>
      <div className="w-full">
        <div className="relative">
          {TrailingIcon ? (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#876647]">
              <TrailingIcon className="size-[18px] stroke-[1.8]" />
            </span>
          ) : null}
          {LeadingIcon ? (
            <span
              className={cn(
                'pointer-events-none absolute inset-y-0 left-3 flex items-center',
                hasError ? 'text-[#ff5f49]' : 'text-[#402f28]',
              )}
            >
              <LeadingIcon className="size-[18px] stroke-[1.8]" />
            </span>
          ) : null}
          <input
            ref={ref}
            dir="rtl"
            className={cn(
              'h-12 w-full rounded-[8px] border bg-[#f8f3e8] px-3 text-right text-sm leading-5 font-medium text-[#402f28] shadow-[0_1px_2px_rgba(10,13,18,0.05)] transition-colors outline-none placeholder:text-[#bfab85] focus:border-[#9d7e55]',
              TrailingIcon && 'pr-11',
              LeadingIcon && 'pl-11',
              hasError
                ? 'border-[#ff9b8a] focus:border-[#ff9b8a]'
                : 'border-[#bfab85]',
              inputClassName,
            )}
            {...props}
          />
        </div>
        <div className="min-h-6 pt-2 text-right">
          {hasError ? (
            <p className="text-sm leading-5 font-medium text-[#ff5f49]">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </label>
  )
})
