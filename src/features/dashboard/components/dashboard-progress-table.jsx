export function DashboardProgressTable({
  title,
  totalLabel,
  rows,
  dir = 'rtl',
}) {
  const isRTL = dir === 'rtl'

  return (
    <section
      dir={dir}
      className="rounded-xl border border-[color:var(--dashboard-border)] bg-[#f8f3e8] shadow-[var(--dashboard-shadow)]"
    >
      <div className="flex items-center justify-between gap-4 bg-[#EAE5D7] px-6 py-4">
        <h2 className="text-start text-lg font-semibold text-[color:var(--dashboard-text)]">
          {title}
        </h2>
        <p className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--dashboard-text-soft)] shadow-[var(--dashboard-shadow)]">
          {totalLabel}
        </p>
      </div>

      <div className="border-t border-[color:var(--dashboard-border)] px-4 pt-3 pb-4">
        <div
          className={`flex items-center gap-4 px-2 pb-3 text-xs font-medium text-[color:var(--dashboard-text-soft)] ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}
        >
          <span className="w-[84px] shrink-0 text-start">الحالة</span>
          <span className="w-[72px] shrink-0 text-start">العدد</span>
          <span className="flex-1"></span>
        </div>

        <div className="space-y-5">
          {rows.map((row) => (
            <div
              key={row.key}
              className={`flex items-center gap-4 px-2 ${
                isRTL ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <span className="w-[84px] shrink-0 text-start text-xs font-medium text-[color:var(--dashboard-text)]">
                {row.label}
              </span>

              <span className="w-[72px] shrink-0 text-start text-xs font-medium text-[color:var(--dashboard-text)]">
                {row.count}
              </span>

              <div className="flex-1 overflow-hidden rounded-full bg-[#efe8d8]">
                <div
                  className={`h-2 rounded-full bg-[#876647] ${
                    isRTL ? 'ml-auto' : 'mr-auto'
                  }`}
                  style={{ width: `${row.bar_pct ?? row.progress ?? 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
