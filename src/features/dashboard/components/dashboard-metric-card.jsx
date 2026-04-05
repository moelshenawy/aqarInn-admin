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
        <IconComponent className="size-[30px] shrink-0 stroke-[1.7] text-[color:var(--dashboard-text-soft)]" />
        <p className="flex-1 text-right text-lg leading-7 font-semibold text-[color:var(--dashboard-text)]">
          {label}
        </p>
      </div>
      <div className="mt-auto flex items-end justify-start gap-[10px]">
        <span className="text-[34px] leading-[1] text-[color:var(--dashboard-text-soft)]">
          {isCurrency ? '﷼' : ''}
        </span>
        <p className="text-right text-[36px] leading-[44px] font-medium tracking-tight text-[color:var(--dashboard-text)]">
          {value}
        </p>
      </div>
    </article>
  )
}
