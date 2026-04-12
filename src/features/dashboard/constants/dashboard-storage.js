export const DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY =
  'aqarinn.backoffice.sidebar-collapsed'

export function getInitialDashboardSidebarCollapsed() {
  if (typeof window === 'undefined') {
    return false
  }

  return (
    window.localStorage.getItem(DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY) ===
    'true'
  )
}

export function persistDashboardSidebarCollapsed(collapsed) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(
      DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY,
      collapsed ? 'true' : 'false',
    )
  }
}
