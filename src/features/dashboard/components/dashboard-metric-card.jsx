import { RiyalIcon } from '@/components/ui/riyal-icon'

export function DashboardMetricCard({
  icon: Icon,
  label,
  value,
  isCurrency = false,
}) {
  const IconComponent = Icon

  return (
    <article className="flex min-h-[164px] flex-col gap-[7px] rounded-[10px] bg-[color:var(--dashboard-surface)] px-[17px] py-[19px] shadow-[var(--dashboard-shadow)]">
      <div className="flex items-center gap-[7px]">
        <p className="flex-1 text-start text-lg leading-7 font-semibold text-[color:var(--dashboard-text)]">
          {label}
        </p>
        <IconComponent className="size-[30px] shrink-0 stroke-[1.7] text-[color:var(--dashboard-text-soft)]" />
      </div>
      <div className="mt-auto flex items-end justify-between gap-[10px]">
        <p className="text-start text-[36px] leading-[44px] font-medium tracking-tight text-[color:var(--dashboard-text)]">
          {value}
        </p>
        <span className="flex h-[34px] items-center">
          {isCurrency ? (
            <RiyalIcon className="text-[34px] text-[color:var(--dashboard-text-soft)]" />
          ) : null}
        </span>
      </div>
    </article>
  )
}
