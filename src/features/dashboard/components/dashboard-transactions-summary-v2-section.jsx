import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { RiyalIcon } from '@/components/ui/riyal-icon'
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

  const filters = transactionsOverview?.filters ?? []
  const cards = transactionsOverview?.cards ?? []
  const sortedCards = sortTransactionsCards(cards)
  const activeFilter = selectedFilter ?? transactionsOverview?.selected_filter

  return (
    <section
      data-slot="dashboard-transactions-summary-v2-section"
      dir={dir}
      className="space-y-6"
    >
      <div className="flex items-start justify-between gap-6">
        <h3 className="text-start text-lg leading-7 font-semibold text-[#181927]">
          {transactionsOverview?.title}
        </h3>
        <div
          data-slot="dashboard-transactions-summary-v2-tabs"
          className="flex items-center gap-1"
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
                onClick={() => onSelectFilter(filter.key)}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      <div
        data-slot="dashboard-transactions-summary-v2-cards"
        className="flex items-start justify-end gap-5"
      >
        {sortedCards.map((card) => {
          const iconSrc = transactionCardIcons[card.key]
          const showBadge = shouldShowBadge(card.key)

          return (
            <article
              key={card.key}
              data-slot="dashboard-transactions-summary-v2-card"
              data-card-key={card.key}
              className="flex h-[164px] min-w-0 flex-1 flex-col gap-[7px] overflow-hidden rounded-[10px] bg-[#eae5d7] px-[17px] py-[19px]"
            >
              <div className="flex items-center justify-between">
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

                <div className="flex items-center gap-1.5">
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
                  <p className="flex-1 text-start text-lg leading-7 font-semibold text-[color:var(--dashboard-text)]">
                    {card.label}
                  </p>
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
