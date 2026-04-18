import { useMutation, useQueryClient } from '@tanstack/react-query'

import { usersQueryKeys } from '@/features/users/api/users-query-keys'
import { updateUser } from '@/features/users/services/users-service'

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, payload }) => updateUser(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
      if (variables?.userId) {
        queryClient.invalidateQueries({
          queryKey: usersQueryKeys.detail(variables.userId),
        })
      }
    },
  })
}

