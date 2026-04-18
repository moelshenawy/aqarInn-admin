import {
  dashboardActions,
  dashboardSectionIcons,
} from '@/features/dashboard/constants/dashboard-ui'

export function DashboardSectionHeader({
  title,
  actionLabel = dashboardActions.refreshLabel,
}) {
  const RefreshIcon = dashboardSectionIcons.refresh

  return (
    <div className="flex items-start justify-between gap-6">
      <p className="flex-1 text-start text-lg leading-7 font-semibold text-[#181927]">
        {title}
      </p>
      <button
        type="button"
        className="inline-flex items-center gap-3 text-lg leading-7 font-semibold text-[color:var(--dashboard-text-soft)]"
      >
        <span>{actionLabel}</span>
        <RefreshIcon className="size-[22px] stroke-[1.8]" />
      </button>
    </div>
  )
}
