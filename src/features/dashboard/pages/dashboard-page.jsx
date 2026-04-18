import { Skeleton } from '@/components/ui/skeleton'
import { DashboardMetricCard } from '@/features/dashboard/components/dashboard-metric-card'
import { DashboardOpportunityCard } from '@/features/dashboard/components/dashboard-opportunity-card'
import { DashboardProgressTable } from '@/features/dashboard/components/dashboard-progress-table'
import { DashboardSectionHeader } from '@/features/dashboard/components/dashboard-section-header'
import { DashboardTransactionsOverviewSection } from '@/features/dashboard/components/dashboard-transactions-overview-section'
import {
  dashboardMetrics,
  investmentStatusRows,
  topOpportunities,
} from '@/features/dashboard/constants/dashboard-ui'
import { useDashboardOverviewQuery } from '@/features/dashboard/hooks/use-dashboard-overview-query'

const EMPTY_DASHBOARD_OVERVIEW = {
  total_users: 0,
  verified_users: 0,
  total_invested_amount: 0,
  total_returns_distributed: 0,
  total_withdrawals_paid: 0,
  total_withdrawals_requested: 0,
}

const dashboardMetricValueSelectors = {
  'users-count': (overview) => overview.total_users,
  'verified-users': (overview) => overview.verified_users,
  'invested-total': (overview) => overview.total_invested_amount,
  'distributed-returns': (overview) => overview.total_returns_distributed,
  'paid-withdrawals': (overview) => overview.total_withdrawals_paid,
  'withdrawal-requests': (overview) => overview.total_withdrawals_requested,
}

function DashboardMetricCardSkeleton({ index }) {
  return (
    <article
      data-slot="dashboard-metric-card-skeleton"
      data-skeleton-index={index}
      className="flex min-h-[164px] flex-col gap-[7px] rounded-[10px] bg-[color:var(--dashboard-surface)] px-[17px] py-[19px] shadow-[var(--dashboard-shadow)]"
    >
      <div className="flex items-center gap-[7px]">
        <Skeleton className="size-[30px] shrink-0 rounded-full bg-[#d6cbb2]" />
        <Skeleton className="h-8 flex-1 rounded-md bg-[#d6cbb2]" />
      </div>
      <div className="mt-auto flex items-end justify-between gap-[10px]">
        <Skeleton className="h-[44px] w-28 rounded-md bg-[#d6cbb2]" />
        <Skeleton className="h-[34px] w-12 rounded-md bg-[#d6cbb2]" />
      </div>
    </article>
  )
}

function formatMetricValue(value) {
  return new Intl.NumberFormat('en-US').format(value ?? 0)
}

export default function DashboardPage() {
  const { data, isPending } = useDashboardOverviewQuery()
  const overview = data ?? EMPTY_DASHBOARD_OVERVIEW

  return (
    <div className="space-y-[30px]" dir="rtl">
      <DashboardSectionHeader title="ملخص مؤشرات الأداء الرئيسية" />

      <section
        aria-label="بطاقات مؤشرات الأداء"
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {isPending
          ? dashboardMetrics.map((metric, index) => (
              <DashboardMetricCardSkeleton key={metric.key} index={index} />
            ))
          : dashboardMetrics.map(({ key, ...metric }) => {
              const valueSelector = dashboardMetricValueSelectors[key]
              const nextValue = formatMetricValue(
                valueSelector ? valueSelector(overview) : 0,
              )

              return <DashboardMetricCard key={key} {...metric} value={nextValue} />
            })}
      </section>

      <DashboardProgressTable rows={investmentStatusRows} />

      <section className="space-y-6">
        <h2 className="text-right text-lg font-semibold leading-7 text-[#181927]">
          أفضل فرص الاستثمار حسب المبلغ الممول
        </h2>
        <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-6">
          {topOpportunities.map(({ key, ...opportunity }, index) => (
            <div
              key={key}
              className={index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}
            >
              <DashboardOpportunityCard {...opportunity} />
            </div>
          ))}
        </div>
      </section>

      <DashboardTransactionsOverviewSection />
    </div>
  )
}
