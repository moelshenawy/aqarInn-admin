import { toast } from 'sonner'

import successCheckIcon from '@/assets/investment-opportunities/review-icon-success-check.svg'

export function DashboardToast({
  id,
  title,
  description,
  actionLabel = 'إغلاق',
  icon = successCheckIcon,
}) {
  return (
    <div
      dir="rtl"
      role="status"
      aria-live="polite"
      className="flex w-[min(485px,calc(100vw-40px))] flex-col items-end overflow-hidden rounded-[14px] bg-[#eae5d7] p-5 text-right text-[#402f28] shadow-[0_1px_2px_rgba(10,13,18,0.05)]"
    >
      <div className="flex w-full items-start justify-end gap-5">
        <div className="relative flex size-[53px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#d6cbb2]">
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className="size-[35px] shrink-0"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start gap-2.5">
          <p className="w-full text-right text-lg leading-7 font-semibold text-[#181927]">
            {title}
          </p>

          <div className="flex w-full items-center justify-end gap-2.5">
            <p className="w-[264px] text-right text-sm leading-5 font-normal text-[#402f28]">
              {description}
            </p>

            <button
              type="button"
              onClick={() => toast.dismiss(id)}
              className="flex h-[39px] min-w-[70px] w-20 items-center justify-center overflow-hidden rounded-lg border border-[#d6cbb2] bg-[#f8f3e8] px-3.5 py-2.5 text-sm leading-5 font-semibold whitespace-nowrap text-[#402f28] transition hover:bg-[#f3eedf] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
            >
              {actionLabel}
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
