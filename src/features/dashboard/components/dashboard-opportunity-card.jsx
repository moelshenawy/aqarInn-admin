import opportunityOverlay from '@/assets/dashboard/opportunity-overlay.png'
import { cn } from '@/lib/utils'

export function DashboardOpportunityCard({
  code,
  title,
  soldShares,
  price,
  status,
  progress,
  image,
  sharesDot,
  accentIcon: AccentIcon,
  className,
}) {
  const AccentIconComponent = AccentIcon

  return (
    <article
      dir="rtl"
      className={cn(
        'overflow-hidden rounded-xl border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] shadow-[var(--dashboard-shadow)]',
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

      <div className="flex flex-col gap-3 px-4 pb-[14px] pt-3">
        <p className="text-right text-lg font-semibold leading-7 text-[#181927]">
          {title}
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] px-2 py-0.5 text-xs font-medium leading-[18px] text-[color:var(--dashboard-text)]">
            {code}
          </span>
          <div className="flex items-center gap-2">
            <img src={sharesDot} alt="" className="size-4 shrink-0" />
            <span className="text-sm font-medium leading-5 text-[#181927]">
              {soldShares}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-sm font-medium leading-5 text-[#181927]">
            <AccentIconComponent className="size-4 stroke-[1.8] text-[color:var(--dashboard-text-soft)]" />
            <span>{status}</span>
          </div>
          <div className="flex items-center gap-1 text-base font-semibold leading-6 text-black">
            <span>﷼</span>
            <span>{price}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-medium leading-[18px] text-[color:var(--dashboard-text)]">
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
}
