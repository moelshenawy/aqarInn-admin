import {
  dashboardActions,
  dashboardSectionIcons,
} from '@/features/dashboard/constants/dashboard-ui'
import { useTranslation } from 'react-i18next'

export function DashboardSectionHeader({
  title,
  actionLabel = dashboardActions.refreshLabel,
  onRefresh,
  isRefreshing = false,
}) {
  const { i18n } = useTranslation()
  const RefreshIcon = dashboardSectionIcons.refresh
  const localizedActionLabel =
    i18n.resolvedLanguage === 'en' ? 'Refresh' : actionLabel

  return (
    <div className="flex items-start justify-between gap-6">
      <p className="flex-1 text-start text-lg leading-7 font-semibold text-[#181927]">
        {title}
      </p>
      <button
        type="button"
        aria-busy={isRefreshing}
        disabled={isRefreshing}
        onClick={onRefresh}
        className="inline-flex items-center gap-3 text-lg leading-7 font-semibold text-[color:var(--dashboard-text-soft)] transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span>{localizedActionLabel}</span>
        <RefreshIcon
          className={[
            'size-[22px] stroke-[1.8] transition-transform duration-300 ease-linear',
            isRefreshing ? 'animate-spin' : '',
          ].join(' ')}
        />
      </button>
    </div>
  )
}
