import { useQuery } from '@tanstack/react-query'

import { dashboardQueryKeys } from '@/features/dashboard/api/dashboard-query-keys'
import { getDashboardOverview } from '@/features/dashboard/services/dashboard-service'

export function useDashboardOverviewQuery(transactionsFilter = null) {
  return useQuery({
    queryKey: dashboardQueryKeys.overview(transactionsFilter),
    queryFn: () => getDashboardOverview(transactionsFilter),
  })
}
