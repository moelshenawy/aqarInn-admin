import { useQuery } from '@tanstack/react-query'

import { investmentOpportunitiesQueryKeys } from '@/features/investment-opportunities/api/investment-opportunities-query-keys'
import { getOpportunities } from '@/features/investment-opportunities/services/investment-opportunity-service'

export function useOpportunitiesQuery(
  page,
  search = '',
  options = {},
  filters = {},
) {
  const normalizedFilters = {
    cityId: filters.cityId ?? '',
    status: filters.status ?? '',
  }

  return useQuery({
    queryKey: investmentOpportunitiesQueryKeys.list({
      page,
      search,
      ...normalizedFilters,
    }),
    queryFn: () =>
      getOpportunities({
        page,
        search,
        ...normalizedFilters,
      }),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    ...options,
  })
}
