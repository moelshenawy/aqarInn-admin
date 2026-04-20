import {
  ArrowLeft,
  ArrowRight,
  Eye,
  MoreVertical,
  Plus,
  User,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { investmentOpportunityDistributionSummary } from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'
import { useDirection } from '@/lib/i18n/direction-provider'

function UserAvatarIcon() {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#eae5d7] bg-[#f8f3e8] text-[#402f28]">
      <User className="size-5 stroke-[1.8]" aria-hidden="true" />
    </span>
  )
}

function formatCurrencyValue(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return value ?? '0.00'
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed)
}

function PaginationShell({ labels }) {
  const paginationItems = [1]

  return (
    <nav
      aria-label={labels.paginationAria}
      className="flex min-h-[104px] items-center justify-between gap-4 border-t border-[#eae5d7] px-[30px] py-3"
    >
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-1.5 text-sm leading-5 font-semibold text-[#402f28] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowRight className="size-4 stroke-[1.9]" aria-hidden="true" />
        <span>{labels.nextLabel}</span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {paginationItems.map((item) => {
          const isActive = item === 1

          return (
            <button
              key={item}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm leading-5 font-medium transition-colors',
                isActive
                  ? 'bg-[#eae5d7] text-[#402f28]'
                  : 'text-[#ac9063] hover:bg-[#eae5d7]/70',
              )}
            >
              {item}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        disabled
        className="inline-flex items-center gap-1.5 text-sm leading-5 font-semibold text-[#402f28] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span>{labels.previousLabel}</span>
        <ArrowLeft className="size-4 stroke-[1.9]" aria-hidden="true" />
      </button>
    </nav>
  )
}

export function InvestmentOpportunityDistributionsTable({
  rows = [],
  isLoading = false,
  onAddDistribution,
  onViewDistribution,
  canAddDistribution = true,
}) {
  const { i18n } = useTranslation()
  const { dir } = useDirection()
  const isEnglish = i18n.resolvedLanguage === 'en'
  const labels = {
    title: isEnglish
      ? 'All profit distributions'
      : investmentOpportunityDistributionSummary.title,
    totalDistributions: isEnglish
      ? `${rows.length} total distributions`
      : `${rows.length} مجموع التوزيعات`,
    addLabel: isEnglish
      ? 'Add distributions'
      : investmentOpportunityDistributionSummary.addLabel,
    columns: {
      netProfit: isEnglish ? 'Net profit amount' : 'صافي مبلغ الربح',
      executionDate: isEnglish ? 'Distribution execution date' : 'تاريخ تنفيذ التوزيع',
      userId: isEnglish ? 'User identifier' : 'معرف المستخدم',
      fullName: isEnglish ? 'Full name' : 'الاسم بالكامل',
      viewAria: isEnglish ? 'View' : 'عرض',
    },
    emptyState: isEnglish
      ? 'No profit distributions for this opportunity yet.'
      : 'لا توجد توزيعات أرباح لهذه الفرصة حتى الآن.',
    viewDistributionAria: (name) =>
      isEnglish ? `View distribution ${name}` : `عرض توزيع ${name}`,
    paginationAria: isEnglish
      ? 'Profit distributions pagination'
      : 'ترقيم صفحات توزيعات الأرباح',
    nextLabel: isEnglish ? 'Next' : 'التالي',
    previousLabel: isEnglish ? 'Previous' : 'السابق',
  }

  return (
    <section
      dir={dir}
      aria-label={labels.title}
      className="overflow-hidden rounded-xl border border-[#eae5d7] bg-[#f8f3e8] shadow-[var(--dashboard-shadow)]"
    >
      <header className="flex h-[77px] items-start border-b border-[#eae5d7] bg-[#EAE5D7] px-6 pt-5">
        <div className="flex w-full items-center gap-2">
          <MoreVertical
            className="size-5 shrink-0 stroke-[1.8] text-[#9d7e55]"
            aria-hidden="true"
          />
          <h1 className="text-lg leading-7 font-semibold text-[#181927]">
            {labels.title}
          </h1>
          <span className="rounded-full bg-white px-3 py-1 text-xs leading-[18px] font-medium text-[#402f28]">
            {labels.totalDistributions}
          </span>
          {canAddDistribution ? (
            <button
              type="button"
              onClick={onAddDistribution}
              className="ms-auto inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#402f28] px-5 text-sm leading-5 font-semibold text-white shadow-[var(--dashboard-shadow)] transition hover:bg-[#4c382f] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
            >
              <span>{labels.addLabel}</span>
              <Plus className="size-5 stroke-[2]" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] table-fixed border-collapse text-start">
          <colgroup>
            <col className="w-[240px]" />
            <col className="w-[240px]" />
            <col className="w-[240px]" />
            <col className="w-[335px]" />
            <col className="w-[60px]" />
          </colgroup>
          <thead>
            <tr className="h-11 border-b border-[#eae5d7] text-xs leading-[18px] font-medium text-[#402f28]">
              <th className="px-6 font-medium">{labels.columns.netProfit}</th>
              <th className="px-6 font-medium">{labels.columns.executionDate}</th>
              <th className="px-6 font-medium">{labels.columns.userId}</th>
              <th className="px-6 font-medium">{labels.columns.fullName}</th>
              <th className="px-4 font-medium" aria-label={labels.columns.viewAria} />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                {[...Array(3)].map((_, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="h-[72px] border-b border-[#eae5d7] text-sm leading-5 text-[#181927] last:border-b-0"
                  >
                    <td className="px-6">
                      <Skeleton className="h-4 max-w-[90px] rounded-md bg-[#d6cbb2]" />
                    </td>
                    <td className="px-6">
                      <Skeleton className="h-4 max-w-[120px] rounded-md bg-[#d6cbb2]" />
                    </td>
                    <td className="px-6">
                      <Skeleton className="h-4 max-w-[140px] rounded-md bg-[#d6cbb2]" />
                    </td>
                    <td className="px-6">
                      <Skeleton className="h-4 max-w-[180px] rounded-md bg-[#d6cbb2]" />
                    </td>
                    <td className="px-4">
                      <Skeleton className="h-9 w-9 rounded-full bg-[#d6cbb2]" />
                    </td>
                  </tr>
                ))}
              </>
            ) : null}
            {!isLoading && rows.length === 0 ? (
              <tr className="h-[72px] border-b border-[#eae5d7] text-sm leading-5 text-[#181927]">
                <td className="px-6 font-medium" colSpan={5}>
                  {labels.emptyState}
                </td>
              </tr>
            ) : null}
            {!isLoading
              ? rows.map((row) => (
                  <tr
                    key={row.id}
                    className="h-[72px] border-b border-[#eae5d7] text-sm leading-5 text-[#181927] last:border-b-0"
                  >
                    <td className="px-6 font-medium">
                      {formatCurrencyValue(row.netProfit)}
                    </td>
                    <td className="px-6 font-normal whitespace-nowrap">
                      {row.executionDate}
                    </td>
                    <td className="px-6 font-normal whitespace-nowrap">
                      {row.userId}
                    </td>
                    <td className="px-6">
                      <div className="flex items-center justify-start gap-3">
                        <span className="font-semibold">{row.fullName}</span>
                        <UserAvatarIcon />
                      </div>
                    </td>
                    <td className="px-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDistribution?.(row.id)}
                        aria-label={labels.viewDistributionAria(row.fullName)}
                        className="size-8 rounded-full text-[#6d4f3b] hover:bg-[#eae5d7] hover:text-[#6d4f3b] focus-visible:ring-[#9d7e55]/25"
                      >
                        <Eye
                          className="size-4 stroke-[1.8]"
                          aria-hidden="true"
                        />
                      </Button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      <PaginationShell labels={labels} />
    </section>
  )
}
