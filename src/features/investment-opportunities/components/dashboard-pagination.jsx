import { ArrowLeft, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

function buildPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis-right', totalPages - 2, totalPages - 1, totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, 3, 'ellipsis-left', totalPages - 2, totalPages - 1, totalPages]
  }

  return [
    1,
    2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis-right',
    totalPages,
  ]
}

export function DashboardPagination({
  currentPage,
  totalPages,
  onPageChange,
  nextLabel,
  previousLabel,
}) {
  const items = buildPaginationItems(currentPage, totalPages)

  return (
    <nav
      dir="rtl"
      aria-label="ترقيم صفحات الفرص الاستثمارية"
      className="flex items-center justify-between gap-4 border-t border-[color:var(--dashboard-border)] pt-5"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1.5 text-sm leading-5 font-semibold text-[color:var(--dashboard-text)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowRight className="size-4 stroke-[1.9]" />
        <span>{nextLabel}</span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {items.map((item, index) => {
          if (typeof item !== 'number') {
            return (
              <span
                key={`${item}-${index}`}
                className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm leading-5 font-medium text-[color:var(--dashboard-text-soft)]"
              >
                ...
              </span>
            )
          }

          const isActive = item === currentPage

          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm leading-5 font-medium transition-colors',
                isActive
                  ? 'bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text)]'
                  : 'text-[color:var(--dashboard-text-soft)] hover:bg-[color:var(--dashboard-surface)]/70',
              )}
            >
              {item}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1.5 text-sm leading-5 font-semibold text-[color:var(--dashboard-text)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span>{previousLabel}</span>
        <ArrowLeft className="size-4 stroke-[1.9]" />
      </button>
    </nav>
  )
}
