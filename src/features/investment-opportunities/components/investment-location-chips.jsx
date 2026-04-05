import { cn } from '@/lib/utils'

export function InvestmentLocationChips({ filters, selectedFilter, onSelect }) {
  return (
    <div className="flex flex-wrap items-center justify-start gap-3" dir="rtl">
      {filters.map((filter) => {
        const isActive = filter.key === selectedFilter

        return (
          <button
            key={filter.key}
            type="button"
            onClick={() => onSelect(filter.key)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm leading-5 font-medium transition-colors',
              isActive
                ? 'border-[color:var(--dashboard-surface-strong)] bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text)]'
                : 'border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] text-[color:var(--dashboard-text-soft)]',
            )}
          >
            <span>{filter.label}</span>

            <span className="rounded-full bg-[color:var(--dashboard-surface)] px-2 py-0.5 text-xs leading-[18px] text-[color:var(--dashboard-text)]">
              {filter.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
