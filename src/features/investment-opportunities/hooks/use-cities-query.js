import { useQuery } from '@tanstack/react-query'

import { investmentOpportunitiesQueryKeys } from '@/features/investment-opportunities/api/investment-opportunities-query-keys'
import { getCities } from '@/features/investment-opportunities/services/investment-opportunity-service'

export function useCitiesQuery() {
  return useQuery({
    queryKey: investmentOpportunitiesQueryKeys.cities(),
    queryFn: getCities,
  })
}
