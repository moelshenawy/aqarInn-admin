import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RiyalIcon } from '@/components/ui/riyal-icon'
import { useDashboardTransactionsOverviewQuery } from '@/features/dashboard/hooks/use-dashboard-transactions-overview-query'
import { useDirection } from '@/lib/i18n/direction-provider'

const transactionCardIcons = {
  distributions:
    'https://www.figma.com/api/mcp/asset/fd02bf9b-5333-4473-8579-27d13eb7ed0f',
  withdrawal_requests:
    'https://www.figma.com/api/mcp/asset/f7277a3c-b6bd-4b2e-9765-dc1394cf7df7',
  investments:
    'https://www.figma.com/api/mcp/asset/8525e1ee-fc0e-425b-93b9-f7dccdbb590c',
}

const cardVisualOrder = ['investments', 'withdrawal_requests', 'distributions']

function sortTransactionsCards(cards) {
  const orderMap = new Map(cardVisualOrder.map((key, index) => [key, index]))
  return [...cards].sort((a, b) => {
    const aIndex = orderMap.get(a.key) ?? Number.MAX_SAFE_INTEGER
    const bIndex = orderMap.get(b.key) ?? Number.MAX_SAFE_INTEGER
    return aIndex - bIndex
  })
}

function shouldShowBadge(cardKey) {
  return cardKey === 'investments' || cardKey === 'withdrawal_requests'
}

export function DashboardTransactionsSummaryV2Section({
  transactionsOverview,
}) {
  const { i18n } = useTranslation('dashboard')
  const { dir } = useDirection()
  const [selectedFilter, setSelectedFilter] = useState(
    transactionsOverview?.selected_filter ?? null,
  )

  useEffect(() => {
    if (!selectedFilter && transactionsOverview?.selected_filter) {
      setSelectedFilter(transactionsOverview.selected_filter)
    }
  }, [transactionsOverview?.selected_filter, selectedFilter])

  const { data: liveTransactionsOverview } =
    useDashboardTransactionsOverviewQuery(selectedFilter)

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(
        i18n.resolvedLanguage === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US',
      ),
    [i18n.resolvedLanguage],
  )

  const filters =
    transactionsOverview?.filters ?? liveTransactionsOverview?.filters ?? []
  const cards =
    liveTransactionsOverview?.cards ?? transactionsOverview?.cards ?? []
  const sortedCards = sortTransactionsCards(cards)
  const activeFilter = selectedFilter ?? transactionsOverview?.selected_filter

  return (
    <section
      data-slot="dashboard-transactions-summary-v2-section"
      dir={dir}
      className="space-y-6"
    >
      <div className="flex flex-col items-start justify-start gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
        <h3 className="text-start text-lg leading-7 font-semibold text-[#181927]">
          {transactionsOverview?.title}
        </h3>

        <div
          data-slot="dashboard-transactions-summary-v2-tabs"
          className="flex w-full flex-wrap items-center gap-1 md:w-auto"
        >
          {filters.map((filter) => {
            const isActive = filter.key === activeFilter

            return (
              <button
                key={filter.key}
                type="button"
                data-slot="dashboard-transactions-summary-v2-filter-chip"
                data-state={isActive ? 'active' : 'inactive'}
                className={[
                  'flex h-9 items-center justify-center rounded-[6px] px-3 py-2 text-sm leading-5 font-medium transition-colors',
                  isActive
                    ? 'bg-[#5c4437] text-white'
                    : 'bg-transparent text-[#384250] hover:bg-[#efe8d8]',
                ].join(' ')}
                onClick={() => setSelectedFilter(filter.key)}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      <div
        data-slot="dashboard-transactions-summary-v2-cards"
        className="flex flex-col items-stretch justify-start gap-5 md:flex-row md:items-start md:justify-end"
      >
        {sortedCards.map((card) => {
          const iconSrc = transactionCardIcons[card.key]
          const showBadge = shouldShowBadge(card.key)

          return (
            <article
              key={card.key}
              data-slot="dashboard-transactions-summary-v2-card"
              data-card-key={card.key}
              className="flex h-[164px] w-full min-w-0 flex-none flex-col gap-[7px] overflow-hidden rounded-[10px] bg-[#eae5d7] px-[17px] py-[19px] md:flex-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <p className="flex-1 text-start text-lg leading-7 font-semibold text-[color:var(--dashboard-text)]">
                    {card.label}
                  </p>

                  {showBadge ? (
                    <div
                      data-slot="dashboard-transactions-summary-v2-card-badge"
                      className="rounded-full bg-[#f8f3e8] px-4 py-1.5"
                    >
                      <p className="text-center text-base leading-6 font-bold text-[#6d4f3b]">
                        {numberFormatter.format(card.count ?? 0)}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="flex size-[34px] items-center justify-center">
                  {iconSrc ? (
                    <img
                      src={iconSrc}
                      alt=""
                      className="size-[26px]"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              </div>

              <div className="flex min-h-0 flex-1 items-end">
                <div className="flex w-full items-center justify-end gap-2.5">
                  <RiyalIcon className="text-[36px] leading-[54px] text-[#ac9063]" />

                  <p className="flex-1 text-start text-[45px] leading-11 font-medium text-[#6d4f3b]">
                    {numberFormatter.format(card.amount ?? 0)}
                  </p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
