import { useMutation } from '@tanstack/react-query'

import {
  createOpportunity,
  createOpportunityDraft,
} from '@/features/investment-opportunities/services/investment-opportunity-service'

export function useCreateOpportunityMutation() {
  return useMutation({
    mutationFn: createOpportunity,
  })
}

export function useCreateOpportunityDraftMutation() {
  return useMutation({
    mutationFn: createOpportunityDraft,
  })
}
