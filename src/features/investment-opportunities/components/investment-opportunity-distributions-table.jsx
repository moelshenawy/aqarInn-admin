import { ArrowLeft, ArrowRight, Eye, MoreVertical, Plus, User } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  investmentActions,
} from '@/features/investment-opportunities/constants/investment-opportunities-ui'
import {
  investmentOpportunityDistributionRows,
  investmentOpportunityDistributionSummary,
} from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'

const paginationItems = [1, 2, 3, 'ellipsis', 8, 9, 10]

function UserAvatarIcon() {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#eae5d7] bg-[#f8f3e8] text-[#402f28]">
      <User className="size-5 stroke-[1.8]" aria-hidden="true" />
    </span>
  )
}

export function InvestmentOpportunityDistributionsTable({ onAddDistribution }) {
  return (
    <section
      dir="rtl"
      aria-label={investmentOpportunityDistributionSummary.title}
      className="overflow-hidden rounded-xl border border-[#eae5d7] bg-[#f8f3e8] shadow-[var(--dashboard-shadow)]"
    >
      <header className="flex h-[77px] items-start border-b border-[#eae5d7] px-6 pt-5">
        <div className="flex w-full items-center gap-2">
          <MoreVertical
            className="size-5 shrink-0 stroke-[1.8] text-[#9d7e55]"
            aria-hidden="true"
          />
          <h1 className="text-lg leading-7 font-semibold text-[#181927]">
            {investmentOpportunityDistributionSummary.title}
          </h1>
          <span className="rounded-full bg-white px-3 py-1 text-xs leading-[18px] font-medium text-[#402f28]">
            {investmentOpportunityDistributionSummary.countLabel}
          </span>
          <button
            type="button"
            onClick={onAddDistribution}
            className="me-auto inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#402f28] px-5 text-sm leading-5 font-semibold text-white shadow-[var(--dashboard-shadow)] transition hover:bg-[#4c382f] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
          >
            <span>{investmentOpportunityDistributionSummary.addLabel}</span>
            <Plus className="size-5 stroke-[2]" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] table-fixed border-collapse text-right">
          <colgroup>
            <col className="w-[240px]" />
            <col className="w-[240px]" />
            <col className="w-[240px]" />
            <col className="w-[335px]" />
            <col className="w-[60px]" />
          </colgroup>
          <thead>
            <tr className="h-11 border-b border-[#eae5d7] text-xs leading-[18px] font-medium text-[#402f28]">
              <th className="px-6 font-medium">صافي مبلغ الربح</th>
              <th className="px-6 font-medium">تاريخ تنفيذ التوزيع</th>
              <th className="px-6 font-medium">معرف المستخدم</th>
              <th className="px-6 font-medium">الاسم بالكامل</th>
              <th className="px-4 font-medium" aria-label="عرض" />
            </tr>
          </thead>
          <tbody>
            {investmentOpportunityDistributionRows.map((row) => (
              <tr
                key={row.id}
                className="h-[72px] border-b border-[#eae5d7] text-sm leading-5 text-[#181927] last:border-b-0"
              >
                <td className="px-6 font-medium">{row.netProfit}</td>
                <td className="px-6 font-normal">{row.executionDate}</td>
                <td className="px-6 font-normal">{row.userId}</td>
                <td className="px-6">
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-semibold">{row.fullName}</span>
                    <UserAvatarIcon />
                  </div>
                </td>
                <td className="px-4">
                  <button
                    type="button"
                    aria-label={`عرض توزيع ${row.fullName}`}
                    className="flex size-8 items-center justify-center rounded-full text-[#6d4f3b] transition hover:bg-[#eae5d7] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
                  >
                    <Eye className="size-4 stroke-[1.8]" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav
        aria-label="ترقيم صفحات توزيعات الأرباح"
        className="flex min-h-[104px] items-center justify-between gap-4 border-t border-[#eae5d7] px-[30px] py-3"
      >
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm leading-5 font-semibold text-[#402f28]"
        >
          <ArrowRight className="size-4 stroke-[1.9]" aria-hidden="true" />
          <span>{investmentActions.nextLabel}</span>
        </button>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {paginationItems.map((item, index) => {
            if (typeof item !== 'number') {
              return (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm leading-5 font-medium text-[#ac9063]"
                >
                  ...
                </span>
              )
            }

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
          className="inline-flex items-center gap-1.5 text-sm leading-5 font-semibold text-[#402f28]"
        >
          <span>{investmentActions.previousLabel}</span>
          <ArrowLeft className="size-4 stroke-[1.9]" aria-hidden="true" />
        </button>
      </nav>
    </section>
  )
}
