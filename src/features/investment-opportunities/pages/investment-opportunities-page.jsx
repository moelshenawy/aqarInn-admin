import { useEffect, useMemo, useState } from 'react'

import { buildInvestmentOpportunityDetailsPath } from '@/app/router/route-paths'
import { DashboardOpportunityCard } from '@/features/dashboard/components/dashboard-opportunity-card'
import { DashboardPagination } from '@/features/investment-opportunities/components/dashboard-pagination'
import { InvestmentLocationChips } from '@/features/investment-opportunities/components/investment-location-chips'
import { InvestmentOpportunitySkeletonGrid } from '@/features/investment-opportunities/components/investment-opportunity-skeleton-grid'
import { InvestmentOpportunitiesToolbar } from '@/features/investment-opportunities/components/investment-opportunities-toolbar'
import {
  investmentActions,
  investmentLoadingDelayMs,
  investmentLocationFilters,
  investmentOpportunities,
  investmentPageSize,
} from '@/features/investment-opportunities/constants/investment-opportunities-ui'

export default function InvestmentOpportunitiesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <div className="space-y-6" dir="rtl">
      {isLoading ? (
        <InvestmentOpportunitySkeletonGrid />
      ) : (
        <>
          <div className="flex flex-col items-stretch gap-5">
            <div className="flex justify-start">
              <InvestmentOpportunitiesToolbar />
            </div>
            <InvestmentLocationChips
              filters={investmentLocationFilters}
              selectedFilter={selectedFilter}
              onSelect={handleFilterChange}
            />
          </div>

          <section
            aria-label="بطاقات الفرص الاستثمارية"
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {paginatedOpportunities.map((opportunity) => (
              <DashboardOpportunityCard
                key={opportunity.id}
                {...opportunity}
                to={buildInvestmentOpportunityDetailsPath(opportunity.id)}
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
