import { useMemo, useState } from 'react'
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
import { useOpportunitiesQuery } from '@/features/investment-opportunities/hooks/use-opportunities-query'
import {
  investmentActions,
  investmentCardAccentIcon,
  investmentFallbackImages,
  investmentSharesDot,
} from '@/features/investment-opportunities/constants/investment-opportunities-ui'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'
import { useAuthorization } from '@/lib/permissions/use-authorization'

const STATUS_LABELS = {
  draft: 'مسودة',
  published: 'منشورة',
  funded: 'مكتملة التمويل',
  exited: 'مكتملة',
  cancelled: 'ملغاة',
}

function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(toNumber(value))
}

function buildCardOpportunity(opportunity, index, language) {
  const fundedShares = toNumber(opportunity.funded_shares)
  const totalShares = toNumber(opportunity.total_shares)
  const progress = totalShares > 0 ? Math.round((fundedShares / totalShares) * 100) : 0
  const clampedProgress = Math.max(0, Math.min(100, progress))

  return {
    id: opportunity.id,
    code: opportunity.reference_code,
    title:
      language === 'en'
        ? opportunity.title_en || opportunity.title_ar
        : opportunity.title_ar || opportunity.title_en,
    soldShares: `${new Intl.NumberFormat('en-US').format(fundedShares)} حصة مباعة`,
    price: formatPrice(opportunity.property_price),
    status: STATUS_LABELS[opportunity.status] ?? opportunity.status,
    progress: clampedProgress,
    cityId: opportunity.city_id,
    cityLabel:
      language === 'en'
        ? opportunity.city?.name_en || opportunity.city?.name_ar || ''
        : opportunity.city?.name_ar || opportunity.city?.name_en || '',
    image:
      opportunity.cover_image_url ||
      investmentFallbackImages[index % investmentFallbackImages.length],
    sharesDot: investmentSharesDot,
    accentIcon: investmentCardAccentIcon,
  }
}

export default function InvestmentOpportunitiesPage() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const { hasAllPermissions } = useAuthorization()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const canCreateInvestmentOpportunity = hasAllPermissions([
    createPermission(APP_RESOURCES.investmentOpportunities, APP_ACTIONS.create),
  ])

  const {
    data: opportunitiesPayload,
    isLoading,
    isFetching,
  } = useOpportunitiesQuery(currentPage)

  const opportunities = useMemo(
    () =>
      (opportunitiesPayload?.data ?? []).map((opportunity, index) =>
        buildCardOpportunity(opportunity, index, i18n.resolvedLanguage),
      ),
    [opportunitiesPayload?.data, i18n.resolvedLanguage],
  )

  const locationFilters = useMemo(() => {
    const cityCounts = new Map()

    opportunities.forEach((opportunity) => {
      if (!opportunity.cityId || !opportunity.cityLabel) {
        return
      }

      const currentCount = cityCounts.get(opportunity.cityId)
      if (currentCount) {
        cityCounts.set(opportunity.cityId, {
          ...currentCount,
          count: currentCount.count + 1,
        })
        return
      }

      cityCounts.set(opportunity.cityId, {
        key: opportunity.cityId,
        label: opportunity.cityLabel,
        count: 1,
      })
    })

    return [
      { key: 'all', label: 'الكل', count: opportunitiesPayload?.total ?? 0 },
      ...Array.from(cityCounts.values()),
    ]
  }, [opportunities, opportunitiesPayload?.total])

  const filteredOpportunities = useMemo(() => {
    if (selectedFilter === 'all') {
      return opportunities
    }

    return opportunities.filter(
      (opportunity) => opportunity.cityId === selectedFilter,
    )
  }, [opportunities, selectedFilter])

  const totalPages = Math.max(1, opportunitiesPayload?.last_page ?? 1)
  const hasData = (opportunitiesPayload?.data?.length ?? 0) > 0
  const shouldShowSkeleton = (isLoading || isFetching) && !hasData

  const handleFilterChange = (filterKey) => {
    setSelectedFilter(filterKey)
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return
    }

    setCurrentPage(page)
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
      {shouldShowSkeleton ? (
        <InvestmentOpportunitySkeletonGrid />
      ) : (
        <>
          <DashboardActionFilterRow
            action={action}
            items={locationFilters}
            activeKey={selectedFilter}
            onSelect={handleFilterChange}
          />

          <section
            aria-label="بطاقات الفرص الاستثمارية"
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredOpportunities.map((opportunity) => (
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
