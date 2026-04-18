import { useQuery } from '@tanstack/react-query'

import { usersQueryKeys } from '@/features/users/api/users-query-keys'
import { getUsers } from '@/features/users/services/users-service'

export function useUsersQuery(params = {}) {
  return useQuery({
    queryKey: usersQueryKeys.list(params),
    queryFn: () => getUsers(params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })
}

