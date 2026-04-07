import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { investmentActions } from '@/features/investment-opportunities/constants/investment-opportunities-ui'
import { Can } from '@/lib/permissions/can'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'

export function InvestmentOpportunitiesToolbar() {
  const navigate = useNavigate()

  return (
    <Can
      allOf={[
        createPermission(APP_RESOURCES.investmentOpportunities, APP_ACTIONS.create),
      ]}
    >
      <button
        type="button"
        onClick={() => navigate(ROUTE_PATHS.investmentOpportunityAdd)}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--dashboard-surface-strong)] px-4 py-2.5 text-sm leading-5 font-semibold text-white shadow-[var(--dashboard-shadow)]"
      >
        <Plus className="size-4 stroke-[2.2]" />
        <span>{investmentActions.addOpportunityLabel}</span>
      </button>
    </Can>
  )
}
