import { Plus } from 'lucide-react'

import { investmentActions } from '@/features/investment-opportunities/constants/investment-opportunities-ui'

export function InvestmentOpportunitiesToolbar() {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--dashboard-surface-strong)] px-4 py-2.5 text-sm leading-5 font-semibold text-white shadow-[var(--dashboard-shadow)]"
    >
      <Plus className="size-4 stroke-[2.2]" />
      <span>{investmentActions.addOpportunityLabel}</span>
    </button>
  )
}
