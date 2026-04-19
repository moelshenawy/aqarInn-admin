import { Link } from 'react-router-dom'

import { RiyalIcon } from '@/components/ui/riyal-icon'
import { cn } from '@/lib/utils'
import { useDirection } from '@/lib/i18n/direction-provider'

const opportunityOverlay = '/assets/dashboard/opportunity-overlay.png'

export function DashboardOpportunityCard({
  referenceCode,
  title,
  soldShares,
  price,
  status,
  progress,
  image,
  sharesDot,
  className,
  to,
}) {
  const { dir } = useDirection()

  const card = (
    <article
      dir={dir}
      className={cn(
        'h-full overflow-hidden rounded-xl border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] shadow-[var(--dashboard-shadow)]',
        className,
      )}
    >
      <div className="relative aspect-[358/131] overflow-hidden">
        <img src={image} alt={title} className="size-full object-cover" />
        <div
          className="absolute inset-0 opacity-10 mix-blend-soft-light"
          style={{
            backgroundImage: `url(${opportunityOverlay})`,
            backgroundSize: 'cover',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
      </div>

      <div className="flex flex-col gap-3 px-4 pt-3 pb-[14px]">
        <p className="line-clamp-1 text-start text-lg leading-7 font-semibold text-[#181927]">
          {title}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img
              src={sharesDot}
              alt=""
              className="size-4 shrink-0 rounded-full"
            />
            <span className="text-sm leading-5 font-medium text-[#181927]">
              {soldShares}
            </span>
          </div>
          <span className="rounded-full border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] px-2 py-0.5 text-xs leading-[18px] font-medium text-[color:var(--dashboard-text)]">
            {referenceCode}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-sm leading-5 font-medium text-[#181927]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="17"
              viewBox="0 0 19 17"
              fill="none"
            >
              <path
                d="M14.583 11.6668C16.1938 11.6668 17.4997 9.2417 17.4997 6.25016C17.4997 3.25862 16.1938 0.833496 14.583 0.833496M14.583 11.6668C12.9722 11.6668 11.6663 9.2417 11.6663 6.25016C11.6663 3.25862 12.9722 0.833496 14.583 0.833496M14.583 11.6668L3.70263 9.68858C2.92972 9.54805 2.54326 9.47778 2.23078 9.32429C1.59507 9.01202 1.12164 8.44476 0.928129 7.76344C0.833008 7.42854 0.833008 7.03575 0.833008 6.25016C0.833008 5.46458 0.833008 5.07179 0.928129 4.73689C1.12164 4.05557 1.59507 3.48831 2.23078 3.17604C2.54326 3.02254 2.92972 2.95228 3.70263 2.81175L14.583 0.833496M3.33301 10.0002L3.66122 14.5952C3.69239 15.0315 3.70798 15.2497 3.8029 15.4151C3.88648 15.5606 4.01208 15.6776 4.16325 15.7506C4.33494 15.8335 4.55369 15.8335 4.99117 15.8335H6.4765C6.97663 15.8335 7.22669 15.8335 7.41177 15.7338C7.5744 15.6461 7.70329 15.5069 7.7782 15.3381C7.86345 15.1459 7.84427 14.8965 7.80591 14.3979L7.49967 10.4168"
                stroke="#6D4F3B"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{status}</span>
          </div>
          <div className="flex items-center gap-1 text-base leading-6 font-semibold text-black">
            <span>{price}</span>
            <RiyalIcon className="" />
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs leading-[18px] font-medium text-[color:var(--dashboard-text)]">
          <span>{progress}%</span>
          <div className="h-0.5 flex-1 rounded-full bg-[#efe8d8]">
            <div
              className="h-0.5 rounded-full bg-[color:var(--dashboard-border-strong)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  )

  if (!to) {
    return card
  }

  return (
    <Link
      to={to}
      className="block h-full rounded-xl transition outline-none focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25"
    >
      {card}
    </Link>
  )
}
