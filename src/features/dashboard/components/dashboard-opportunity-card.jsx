import { Link } from 'react-router-dom'

import { RiyalIcon } from '@/components/ui/riyal-icon'
import { cn } from '@/lib/utils'

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
  const card = (
    <article
      dir="rtl"
      className={cn(
        'h-full overflow-hidden rounded-xl border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] shadow-[var(--dashboard-shadow)]',
        className,
      )}
    >
      <div className="relative aspect-[358/131] overflow-hidden">
        <img
          src={image || 'https://placehold.co/358x131'}
          alt={title}
          className="size-full object-cover"
        />
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
        <p className="line-clamp-2 text-start text-lg leading-7 font-semibold text-[#181927]">
          {title}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src={sharesDot} alt="" className="size-4 shrink-0" />
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
