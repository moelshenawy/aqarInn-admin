import { useMutation, useQueryClient } from '@tanstack/react-query'

import { investmentOpportunitiesQueryKeys } from '@/features/investment-opportunities/api/investment-opportunities-query-keys'
import { deleteOpportunity } from '@/features/investment-opportunities/services/investment-opportunity-service'

export function useDeleteOpportunityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: investmentOpportunitiesQueryKeys.all,
      })
    },
  })
}
