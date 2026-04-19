import { useMutation, useQueryClient } from '@tanstack/react-query'

import { investmentOpportunitiesQueryKeys } from '@/features/investment-opportunities/api/investment-opportunities-query-keys'
import { updateOpportunity } from '@/features/investment-opportunities/services/investment-opportunity-service'

export function useUpdateOpportunityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ opportunityId, formData }) =>
      updateOpportunity(opportunityId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: investmentOpportunitiesQueryKeys.all,
      })
    },
  })
}
