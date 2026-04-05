export function DashboardProgressTable({ rows }) {
  return (
    <section className="rounded-xl border border-[color:var(--dashboard-border)] bg-[#fbf7ef] shadow-[var(--dashboard-shadow)]">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <p className="rounded-full bg-white px-3 py-1 text-xs font-medium leading-[18px] text-[color:var(--dashboard-text-soft)] shadow-[var(--dashboard-shadow)]">
          137 فرصة
        </p>
        <h2 className="text-right text-lg font-semibold leading-7 text-[color:var(--dashboard-text)]">
          إجمالي فرص الاستثمار
        </h2>
      </div>
      <div className="border-t border-[color:var(--dashboard-border)] px-4 pb-4 pt-3">
        <div className="grid grid-cols-[minmax(0,1fr)_72px_84px] items-center gap-x-4 px-2 pb-3 text-xs font-medium leading-5 text-[color:var(--dashboard-text-soft)]">
          <span className="text-right"> </span>
          <span className="text-right">العدد</span>
          <span className="text-right">الحالة</span>
        </div>
        <div className="space-y-5">
          {rows.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[minmax(0,1fr)_72px_84px] items-center gap-x-4 px-2"
            >
              <div className="h-2 rounded-full bg-[#efe8d8]">
                <div
                  className="h-2 rounded-full bg-[color:var(--dashboard-border-strong)]"
                  style={{ width: `${row.progress}%` }}
                />
              </div>
              <span className="text-right text-xs font-medium leading-5 text-[color:var(--dashboard-text)]">
                {row.count}
              </span>
              <span className="text-right text-xs font-medium leading-5 text-[color:var(--dashboard-text)]">
                {row.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
