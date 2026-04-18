import { useMutation, useQueryClient } from '@tanstack/react-query'

import { usersQueryKeys } from '@/features/users/api/users-query-keys'
import { deleteUser } from '@/features/users/services/users-service'

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
    },
  })
}

