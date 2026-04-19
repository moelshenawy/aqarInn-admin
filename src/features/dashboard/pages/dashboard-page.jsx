import { Banknote, CreditCard, User, UserCheck, Wallet } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DashboardMetricCard } from '@/features/dashboard/components/dashboard-metric-card'
import { DashboardOpportunityCard } from '@/features/dashboard/components/dashboard-opportunity-card'
import { DashboardProgressTable } from '@/features/dashboard/components/dashboard-progress-table'
import { DashboardSectionHeader } from '@/features/dashboard/components/dashboard-section-header'
import { DashboardTransactionsOverviewSection } from '@/features/dashboard/components/dashboard-transactions-overview-section'
import { DashboardTransactionsSummaryV2Section } from '@/features/dashboard/components/dashboard-transactions-summary-v2-section'
import { useDashboardOverviewQuery } from '@/features/dashboard/hooks/use-dashboard-overview-query'
import { useDirection } from '@/lib/i18n/direction-provider'
import { buildInvestmentOpportunityDetailsPath } from '@/app/router/route-paths'

const EMPTY_DASHBOARD_OVERVIEW = {
  summary_cards: [],
  opportunities_status_overview: {
    title: '',
    total: 0,
    statuses: [],
  },
  featured_opportunities: {
    title: '',
    items: [],
  },
  transactions_overview: {
    title: '',
    selected_filter: null,
    filters: [],
    cards: [],
  },
}

const summaryCardIcons = {
  total_users: User,
  verified_users: UserCheck,
  total_invested_amount: Wallet,
  total_returns_distributed: Banknote,
  total_withdrawals_requested: CreditCard,
  total_withdrawals_paid: Wallet,
}

const sharesDot = '/assets/dashboard/shares-dot.svg'

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

export default function DashboardPage() {
  const { i18n } = useTranslation(['navigation'])
  const { dir } = useDirection()
  const [selectedTransactionsFilter, setSelectedTransactionsFilter] =
    useState(null)

  const { data, isPending } = useDashboardOverviewQuery(
    selectedTransactionsFilter,
  )
  useEffect(() => {
    if (
      !selectedTransactionsFilter &&
      data?.transactions_overview?.selected_filter
    ) {
      setSelectedTransactionsFilter(data.transactions_overview.selected_filter)
    }
  }, [data?.transactions_overview?.selected_filter, selectedTransactionsFilter])

  const overview = data ?? EMPTY_DASHBOARD_OVERVIEW

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(
        i18n.resolvedLanguage === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US',
      ),
    [i18n.resolvedLanguage],
  )

  const summaryCards = overview.summary_cards ?? []
  const statusOverview =
    overview.opportunities_status_overview ??
    EMPTY_DASHBOARD_OVERVIEW.opportunities_status_overview
  const featured =
    overview.featured_opportunities ??
    EMPTY_DASHBOARD_OVERVIEW.featured_opportunities
  const transactionsOverview =
    overview.transactions_overview ??
    EMPTY_DASHBOARD_OVERVIEW.transactions_overview

  return (
    <div className="space-y-[30px]" dir={dir}>
      <DashboardSectionHeader
        title={
          i18n.resolvedLanguage === 'ar'
            ? 'ملخص مؤشرات الأداء الرئيسية'
            : 'Key Performance Summary'
        }
      />

      <section
        aria-label={
          i18n.resolvedLanguage === 'ar'
            ? 'بطاقات مؤشرات الأداء'
            : 'Summary cards'
        }
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {isPending
          ? [...Array(6)].map((_, index) => (
              <DashboardMetricCardSkeleton key={index} index={index} />
            ))
          : summaryCards.map((card) => {
              const Icon = summaryCardIcons[card.key] ?? Wallet
              const value = numberFormatter.format(card.value ?? 0)

              return (
                <DashboardMetricCard
                  key={card.key}
                  icon={Icon}
                  label={card.label}
                  value={value}
                  isCurrency={card.value_type === 'currency'}
                />
              )
            })}
      </section>

      <DashboardProgressTable
        title={statusOverview.title}
        totalLabel={numberFormatter.format(statusOverview.total ?? 0)}
        rows={statusOverview.statuses ?? []}
        dir={dir}
      />

      <section className="space-y-6">
        <h2 className="text-start text-lg leading-7 font-semibold text-[#181927]">
          {featured.title}
        </h2>
        <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-6">
          {(featured.items ?? []).map((opportunity, index) => (
            <div
              key={opportunity.id}
              className={index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}
            >
              <DashboardOpportunityCard
                to={buildInvestmentOpportunityDetailsPath(
                  opportunity.id,
                  i18n.resolvedLanguage,
                )}
                referenceCode={opportunity.reference_code}
                title={opportunity.title}
                soldShares={`${numberFormatter.format(opportunity.funded_shares ?? 0)} / ${numberFormatter.format(opportunity.total_shares ?? 0)}`}
                price={numberFormatter.format(opportunity.funded_amount ?? 0)}
                status={opportunity.status_label}
                progress={opportunity.funding_progress_pct ?? 0}
                image={opportunity.cover_image_url}
                sharesDot={sharesDot}
              />
            </div>
          ))}
        </div>
      </section>
      {/* <DashboardTransactionsOverviewSection
        transactionsOverview={transactionsOverview}
        selectedFilter={selectedTransactionsFilter}
        onSelectFilter={setSelectedTransactionsFilter}
      /> */}

      <DashboardTransactionsSummaryV2Section
        transactionsOverview={transactionsOverview}
        selectedFilter={selectedTransactionsFilter}
        onSelectFilter={setSelectedTransactionsFilter}
      />
    </div>
  )
}
