import { useQuery } from '@tanstack/react-query'

import { dashboardQueryKeys } from '@/features/dashboard/api/dashboard-query-keys'
import { getDashboardOverview } from '@/features/dashboard/services/dashboard-service'

export function useDashboardOverviewQuery() {
  return useQuery({
    queryKey: dashboardQueryKeys.overview(null),
    queryFn: () => getDashboardOverview(),
  })
}
