export const notificationsQueryKeys = {
  all: ['notifications'],
  list: (filters = {}) => [...notificationsQueryKeys.all, 'list', filters],
}
