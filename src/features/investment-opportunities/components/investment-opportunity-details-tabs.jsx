import { NavLink } from 'react-router-dom'

import {
  buildInvestmentOpportunityDetailsPath,
  buildInvestmentOpportunityProfitDistributionsPath,
} from '@/app/router/route-paths'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'
import { useAuthorization } from '@/lib/permissions/use-authorization'
import { cn } from '@/lib/utils'

const tabs = [
  {
    key: 'details',
    label: 'تفاصيل الفرصة الاستثمارية',
    buildPath: buildInvestmentOpportunityDetailsPath,
    requiredPermissions: [
      createPermission(APP_RESOURCES.investmentOpportunities, APP_ACTIONS.view),
    ],
  },
  {
    key: 'profit-distributions',
    label: 'توزيعات الأرباح',
    buildPath: buildInvestmentOpportunityProfitDistributionsPath,
    requiredPermissions: [
      createPermission(APP_RESOURCES.profitDistributions, APP_ACTIONS.view),
    ],
  },
]

export function InvestmentOpportunityDetailsTabs({
  opportunityId,
  activeTab,
}) {
  const { canAccessRoute } = useAuthorization()
  const visibleTabs = tabs.filter((tab) =>
    canAccessRoute(tab.requiredPermissions ?? []),
  )

  return (
    <nav
      dir="rtl"
      aria-label="تبويبات تفاصيل الفرصة الاستثمارية"
      className="flex h-[69px] w-full gap-2.5 rounded-xl bg-[#eae5d7] p-2.5"
    >
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab.key

        return (
          <NavLink
            key={tab.key}
            to={tab.buildPath(opportunityId)}
            end={tab.key === 'details'}
            className={cn(
              'flex min-w-0 flex-1 items-center justify-center rounded-xl px-5 py-[13px] text-center text-lg leading-7 font-semibold transition-colors',
              isActive
                ? 'bg-[#402f28] text-[#f8f3e8]'
                : 'text-[#ac9063] hover:bg-[#f8f3e8]/70',
            )}
          >
            {tab.label}
          </NavLink>
        )
      })}
    </nav>
  )
}
