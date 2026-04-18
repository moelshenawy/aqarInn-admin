import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { investmentOpportunitiesQueryKeys } from '@/features/investment-opportunities/api/investment-opportunities-query-keys'
import {
  createOpportunityProfitDistribution,
  getProfitDistributionById,
  getOpportunityProfitDistributions,
} from '@/features/investment-opportunities/services/investment-opportunity-service'

export function useProfitDistributionsQuery(opportunityId) {
  return useQuery({
    queryKey: investmentOpportunitiesQueryKeys.profitDistributions(opportunityId),
    queryFn: () => getOpportunityProfitDistributions(opportunityId),
    enabled: Boolean(opportunityId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })
}

export function useCreateProfitDistributionMutation(opportunityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) =>
      createOpportunityProfitDistribution(opportunityId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: investmentOpportunitiesQueryKeys.profitDistributions(
          opportunityId,
        ),
      })
    },
  })
}

export function useProfitDistributionDetailsQuery(distributionId, enabled = true) {
  return useQuery({
    queryKey:
      investmentOpportunitiesQueryKeys.profitDistributionDetails(distributionId),
    queryFn: () => getProfitDistributionById(distributionId),
    enabled: enabled && Boolean(distributionId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })
}
