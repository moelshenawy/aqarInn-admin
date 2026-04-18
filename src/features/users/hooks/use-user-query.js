import { useQuery } from '@tanstack/react-query'

import { usersQueryKeys } from '@/features/users/api/users-query-keys'
import { getUserById } from '@/features/users/services/users-service'

export function useUserQuery(userId, enabled = true) {
  return useQuery({
    queryKey: usersQueryKeys.detail(userId),
    queryFn: () => getUserById(userId),
    enabled: Boolean(userId) && enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })
}

