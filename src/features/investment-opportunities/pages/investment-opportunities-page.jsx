import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  buildInvestmentOpportunityDetailsPath,
  ROUTE_PATHS,
} from '@/app/router/route-paths'
import { DashboardActionFilterRow } from '@/features/dashboard/components/dashboard-action-filter-row'
import { DashboardOpportunityCard } from '@/features/dashboard/components/dashboard-opportunity-card'
import { DashboardPagination } from '@/features/investment-opportunities/components/dashboard-pagination'
import { InvestmentOpportunitySkeletonGrid } from '@/features/investment-opportunities/components/investment-opportunity-skeleton-grid'
import {
  investmentActions,
  investmentLoadingDelayMs,
  investmentLocationFilters,
  investmentOpportunities,
  investmentPageSize,
} from '@/features/investment-opportunities/constants/investment-opportunities-ui'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'
import { useAuthorization } from '@/lib/permissions/use-authorization'

export default function InvestmentOpportunitiesPage() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const { hasAllPermissions } = useAuthorization()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const canCreateInvestmentOpportunity = hasAllPermissions([
    createPermission(APP_RESOURCES.investmentOpportunities, APP_ACTIONS.create),
  ])

  const filteredOpportunities = useMemo(() => {
    if (selectedFilter === 'all') {
      return investmentOpportunities
    }

    const activeFilter = investmentLocationFilters.find(
      (filter) => filter.key === selectedFilter,
    )

    return investmentOpportunities.filter(
      (opportunity) => opportunity.city === activeFilter?.label,
    )
  }, [selectedFilter])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOpportunities.length / investmentPageSize),
  )

  const paginatedOpportunities = useMemo(() => {
    const startIndex = (currentPage - 1) * investmentPageSize

    return filteredOpportunities.slice(
      startIndex,
      startIndex + investmentPageSize,
    )
  }, [currentPage, filteredOpportunities])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false)
    }, investmentLoadingDelayMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [currentPage, selectedFilter])

  const handleFilterChange = (filterKey) => {
    setSelectedFilter(filterKey)
    setCurrentPage(1)
    setIsLoading(true)
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return
    }

    setCurrentPage(page)
    setIsLoading(true)
  }

  const action = canCreateInvestmentOpportunity
    ? {
        label: investmentActions.addOpportunityLabel,
        ariaLabel: investmentActions.addOpportunityLabel,
        onClick: () =>
          navigate(
            ROUTE_PATHS.withLocale(
              ROUTE_PATHS.investmentOpportunityAdd,
              i18n.resolvedLanguage,
            ),
          ),
        icon: <Plus className="size-[18px] stroke-[2.1]" aria-hidden="true" />,
      }
    : undefined

  return (
    <div className="space-y-6" dir="rtl">
      {isLoading ? (
        <InvestmentOpportunitySkeletonGrid />
      ) : (
        <>
          <DashboardActionFilterRow
            action={action}
            items={investmentLocationFilters}
            activeKey={selectedFilter}
            onSelect={handleFilterChange}
          />

          <section
            aria-label="بطاقات الفرص الاستثمارية"
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {paginatedOpportunities.map((opportunity) => (
              <DashboardOpportunityCard
                key={opportunity.id}
                {...opportunity}
                to={buildInvestmentOpportunityDetailsPath(
                  opportunity.id,
                  i18n.resolvedLanguage,
                )}
              />
            ))}
          </section>

          <DashboardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            nextLabel={investmentActions.nextLabel}
            previousLabel={investmentActions.previousLabel}
          />
        </>
      )}
    </div>
  )
}
