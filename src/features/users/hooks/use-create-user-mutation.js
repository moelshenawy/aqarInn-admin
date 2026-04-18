import { useMutation, useQueryClient } from '@tanstack/react-query'

import { usersQueryKeys } from '@/features/users/api/users-query-keys'
import { createUser } from '@/features/users/services/users-service'

export function useCreateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
    },
  })
}

