import { useQuery } from '@tanstack/react-query'

import { investmentOpportunitiesQueryKeys } from '@/features/investment-opportunities/api/investment-opportunities-query-keys'
import { getOpportunityById } from '@/features/investment-opportunities/services/investment-opportunity-service'

export function useOpportunityDetailsQuery(opportunityId) {
  return useQuery({
    queryKey: investmentOpportunitiesQueryKeys.details(opportunityId),
    queryFn: () => getOpportunityById(opportunityId),
    enabled: Boolean(opportunityId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })
}
