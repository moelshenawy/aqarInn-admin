import { useMutation, useQueryClient } from '@tanstack/react-query'

import { citiesQueryKey } from '@/features/cities/hooks/use-cities-query'
import { createCity } from '@/features/cities/services/cities-service'

export function useCreateCityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ payload, config }) => createCity(payload, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: citiesQueryKey })
    },
  })
}

