import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

import errorIcon from '@/assets/investment-opportunities/review-icon-close.svg'
import successCheckIcon from '@/assets/investment-opportunities/review-icon-success-check.svg'
import i18n from '@/lib/i18n'
import { cn } from '@/lib/utils'

function getToastDirection() {
  return i18n.resolvedLanguage === 'ar' ? 'rtl' : 'ltr'
}

function getToastActionLabel(actionLabel) {
  return actionLabel ?? i18n.t('close', { ns: 'common' })
}

export function DashboardToast({
  id,
  title,
  description,
  actionLabel,
  icon = successCheckIcon,
}) {
  const dir = getToastDirection()

  return (
    <div
      dir={dir}
      role="status"
      aria-live="polite"
      className={cn(
        'flex w-[min(485px,calc(100vw-40px))] flex-col overflow-hidden rounded-[14px] bg-[#eae5d7] p-5 text-[#402f28] shadow-[0_1px_2px_rgba(10,13,18,0.05)]',
        dir === 'rtl' ? 'items-end text-right' : 'items-start text-left',
      )}
    >
      <div
        className={cn(
          'flex w-full items-start gap-5',
          dir === 'rtl' ? 'justify-end' : 'justify-start',
        )}
      >
        <div className="relative flex size-[53px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#d6cbb2]">
          {typeof icon === 'string' ? (
            <img
              src={icon}
              alt=""
              aria-hidden="true"
              className="size-[16px] shrink-0"
            />
          ) : (
            <div className="flex size-[16px] shrink-0 items-center justify-center">
              {icon}
            </div>
          )}
        </div>

        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col gap-2.5',
            dir === 'rtl' ? 'items-end' : 'items-start',
          )}
        >
          <p
            className={cn(
              'w-full text-lg leading-7 font-semibold text-[#181927]',
              dir === 'rtl' ? 'text-right' : 'text-left',
            )}
          >
            {title}
          </p>

          <div
            className={cn(
              'flex w-full items-center gap-2.5',
              dir === 'rtl' ? 'justify-end' : 'justify-start',
            )}
          >
            {description ? (
              <p
                className={cn(
                  'w-[264px] text-sm leading-5 font-normal text-[#402f28]',
                  dir === 'rtl' ? 'text-right' : 'text-left',
                )}
              >
                {description}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => toast.dismiss(id)}
              className="flex h-[39px] w-20 min-w-[70px] items-center justify-center overflow-hidden rounded-lg border border-[#d6cbb2] bg-[#f8f3e8] px-3.5 py-2.5 text-sm leading-5 font-semibold whitespace-nowrap text-[#402f28] transition hover:bg-[#f3eedf] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
            >
              {getToastActionLabel(actionLabel)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function showDashboardSuccessToast({
  title,
  description,
  actionLabel,
  duration = Infinity,
}) {
  return toast.custom(
    (id) => (
      <DashboardToast
        id={id}
        title={title}
        description={description}
        actionLabel={actionLabel}
      />
    ),
    {
      position: 'bottom-left',
      closeButton: false,
      duration,
      unstyled: true,
      className: 'border-0 bg-transparent p-0 shadow-none',
    },
  )
}

export function showDashboardErrorToast({
  title,
  description,
  actionLabel,
  duration = 6000,
}) {
  return toast.custom(
    (id) => (
      <DashboardToast
        id={id}
        title={title}
        description={description}
        actionLabel={actionLabel}
        icon={errorIcon}
      />
    ),
    {
      position: 'bottom-left',
      closeButton: false,
      duration,
      unstyled: true,
      className: 'border-0 bg-transparent p-0 shadow-none',
    },
  )
}

export function showDashboardLoadingToast({
  title,
  description,
  actionLabel,
  duration = Infinity,
}) {
  const loadingIcon = <Loader2Icon className="size-[20px] animate-spin" />

  return toast.custom(
    (id) => (
      <DashboardToast
        id={id}
        title={title}
        description={description}
        actionLabel={actionLabel}
        icon={loadingIcon}
      />
    ),
    {
      position: 'bottom-left',
      closeButton: false,
      duration,
      unstyled: true,
      className: 'border-0 bg-transparent p-0 shadow-none',
    },
  )
}
