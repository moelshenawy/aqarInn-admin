import { Skeleton } from '@/components/ui/skeleton'

export function InvestmentOpportunitySkeletonGrid() {
  return (
    <div className="space-y-6" data-testid="investment-skeleton">
      <div
        className="flex flex-wrap items-center justify-start gap-3"
        dir="rtl"
      >
        <Skeleton className="rounded-full px-14 py-5" />
        {Array.from({ length: 7 }, (_, index) => (
          <Skeleton key={index} className="rounded-full px-10 py-5" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] shadow-[var(--dashboard-shadow)]"
          >
            <Skeleton className="aspect-[358/131] rounded-none" />
            <div className="space-y-3 px-4 pt-3 pb-4">
              <Skeleton className="rounded-lg py-4" />
              <Skeleton className="rounded-lg py-3" />
              <Skeleton className="rounded-lg py-3" />
              <Skeleton className="rounded-lg py-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
