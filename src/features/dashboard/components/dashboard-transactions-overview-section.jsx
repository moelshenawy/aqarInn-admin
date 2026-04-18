import { Banknote, HandCoins, Wallet } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { RiyalIcon } from '@/components/ui/riyal-icon'
import { DashboardActionFilterRow } from '@/features/dashboard/components/dashboard-action-filter-row'
import { useDirection } from '@/lib/i18n/direction-provider'
import { cn } from '@/lib/utils'

const transactionSummaryIcons = {
  investments: Wallet,
  withdrawal_requests: HandCoins,
  withdrawals: HandCoins,
  distributions: Banknote,
}

function TransactionAmount({ value, numberFormatter, dir }) {
  return (
    <div className="flex items-center gap-1.5" dir={dir}>
      <RiyalIcon className="text-[22px] text-[#9d7e55]" />
      <span className="text-xl leading-8 font-semibold text-[#402f28]">
        {numberFormatter.format(value)}
      </span>
    </div>
  )
}

function TransactionMetricTile({
  metricKey,
  label,
  count,
  amount,
  numberFormatter,
  dir,
}) {
  return (
    <div
      data-slot="dashboard-transactions-metric"
      data-metric-key={metricKey}
      className="rounded-lg border border-[#d6cbb2] bg-[#f8f3e8] p-4 shadow-[var(--dashboard-shadow)]"
    >
      <p className="text-xs leading-5 font-medium text-[#9d7e55]">{label}</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs leading-5 font-medium text-[#9d7e55]">Count</p>
          <p
            className="mt-1 text-[28px] leading-9 font-semibold text-[#402f28]"
            dir={dir}
          >
            {numberFormatter.format(count)}
          </p>
        </div>
        <div>
          <p className="text-xs leading-5 font-medium text-[#9d7e55]">Amount</p>
          <div className="mt-1">
            <TransactionAmount
              value={amount}
              numberFormatter={numberFormatter}
              dir={dir}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardTransactionsOverviewSection({
  transactionsOverview,
  selectedFilter,
  onSelectFilter,
}) {
  const { i18n } = useTranslation('dashboard')
  const { dir } = useDirection()

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(
        i18n.resolvedLanguage === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US',
      ),
    [i18n.resolvedLanguage],
  )

  const filterItems = useMemo(
    () =>
      (transactionsOverview?.filters ?? []).map((filter) => ({
        key: filter.key,
        label: filter.label,
      })),
    [transactionsOverview?.filters],
  )

  return (
    <section
      data-slot="dashboard-transactions-old-section"
      aria-label={transactionsOverview?.title ?? 'Transactions overview'}
      dir={dir}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2
          className={cn(
            'text-lg leading-7 font-semibold text-[#181927]',
            dir === 'ltr' ? 'text-left' : 'text-start',
          )}
        >
          {transactionsOverview?.title ?? 'Transactions overview'}
        </h2>
      </div>

      <div className="rounded-xl border border-[#d6cbb2] bg-[#f8f3e8] p-4 shadow-[var(--dashboard-shadow)] sm:p-5">
        <div className="space-y-2">
          <DashboardActionFilterRow
            items={filterItems}
            activeKey={selectedFilter ?? transactionsOverview?.selected_filter}
            onSelect={onSelectFilter}
            direction={dir}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {(transactionsOverview?.cards ?? []).map((card) => {
          const SummaryIcon = transactionSummaryIcons[card.key] ?? Wallet

          return (
            <section
              key={card.key}
              role="region"
              aria-label={card.label}
              data-slot="dashboard-transactions-panel"
              className="rounded-xl border border-[#d6cbb2] bg-[#f8f3e8] p-5 shadow-[var(--dashboard-shadow)]"
            >
              <header className="flex items-center justify-between gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-[#eae5d7] text-[#6d4f3b]">
                  <SummaryIcon
                    className="size-5 stroke-[1.8]"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="flex-1 text-lg leading-7 font-semibold text-[#402f28]">
                  {card.label}
                </h3>
              </header>

              <div className="mt-4">
                <TransactionMetricTile
                  metricKey={card.key}
                  label={card.label}
                  count={card.count ?? 0}
                  amount={card.amount ?? 0}
                  numberFormatter={numberFormatter}
                  dir={dir}
                />
              </div>
            </section>
          )
        })}
      </div>
    </section>
  )
}
