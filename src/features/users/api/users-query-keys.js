export const usersQueryKeys = {
  all: ['users'],
  list: (filters = {}) => [...usersQueryKeys.all, 'list', filters],
  detail: (userId) => [...usersQueryKeys.all, 'detail', userId],
}
