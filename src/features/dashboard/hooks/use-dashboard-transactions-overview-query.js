import { useQuery } from '@tanstack/react-query'

import { dashboardQueryKeys } from '@/features/dashboard/api/dashboard-query-keys'
import { getDashboardTransactionsOverview } from '@/features/dashboard/services/dashboard-service'

export function useDashboardTransactionsOverviewQuery(transactionsFilter = null) {
  return useQuery({
    queryKey: dashboardQueryKeys.transactionsOverview(transactionsFilter),
    queryFn: () => getDashboardTransactionsOverview(transactionsFilter),
    enabled: Boolean(transactionsFilter),
  })
}
