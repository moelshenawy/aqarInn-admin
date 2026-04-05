export const activityLogsQueryKeys = {
  all: ['activity-logs'],
  list: (filters = {}) => [...activityLogsQueryKeys.all, 'list', filters],
}
