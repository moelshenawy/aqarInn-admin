import { useQuery } from '@tanstack/react-query'

import { getCities } from '@/features/cities/services/cities-service'

export const citiesQueryKey = ['cities']

export function useCitiesQuery() {
  return useQuery({
    queryKey: citiesQueryKey,
    queryFn: () => getCities(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })
}
