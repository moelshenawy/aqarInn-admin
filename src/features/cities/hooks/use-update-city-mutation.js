import { useMutation, useQueryClient } from '@tanstack/react-query'

import { citiesQueryKey } from '@/features/cities/hooks/use-cities-query'
import { updateCity } from '@/features/cities/services/cities-service'

export function useUpdateCityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cityId, payload, config }) =>
      updateCity(cityId, payload, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: citiesQueryKey })
    },
  })
}

