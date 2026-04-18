import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteCity } from '@/features/cities/services/cities-service'
import { citiesQueryKey } from '@/features/cities/hooks/use-cities-query'

export function useDeleteCityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (cityId) => deleteCity(cityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: citiesQueryKey })
    },
  })
}
