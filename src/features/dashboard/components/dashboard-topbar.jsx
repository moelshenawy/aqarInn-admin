import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  dashboardActions,
  dashboardSectionIcons,
} from '@/features/dashboard/constants/dashboard-ui'

export function DashboardTopbar({ title, user, onOpenSidebar }) {
  const BellIcon = dashboardSectionIcons.notification
  const SettingsIcon = dashboardSectionIcons.chevron
  const SearchIcon = dashboardSectionIcons.search

  return (
    <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
      <div className="flex h-[69px] min-w-0 flex-1 items-center justify-end gap-3 rounded-xl bg-[color:var(--dashboard-surface)] px-4 py-[13px] shadow-[var(--dashboard-shadow)]">
        <p className="min-w-0 flex-1 truncate text-right text-lg leading-7 font-semibold text-[color:var(--dashboard-text)]">
          {title}
        </p>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-9 rounded-lg text-[color:var(--dashboard-text-soft)] hover:bg-transparent lg:hidden"
          onClick={onOpenSidebar}
        >
          <Menu className="size-5" />
          <span className="sr-only">فتح القائمة</span>
        </Button>

        <SearchIcon className="size-[22px] shrink-0 stroke-[1.8] text-[color:var(--dashboard-text-soft)]" />
        <div className="h-[18px] w-px bg-[color:var(--dashboard-border)]" />
        <SettingsIcon className="size-[22px] shrink-0 stroke-[1.8] text-[color:var(--dashboard-text-soft)]" />
      </div>

      <div className="flex h-[69px] min-w-[225px] items-center justify-between rounded-xl bg-[color:var(--dashboard-surface)] px-3 py-[13px] shadow-[var(--dashboard-shadow)]">
        <div className="flex items-center gap-[13px]">
          <img
            src={user.avatar}
            alt={user.name}
            className="size-[41px] rounded-full object-cover"
          />
          <div className="text-right">
            <p className="text-[14px] leading-5 font-medium text-[color:var(--dashboard-text-soft)]">
              {user.name}
            </p>
            <p className="text-base leading-6 font-semibold text-[color:var(--dashboard-text)]">
              {user.role}
            </p>
          </div>
        </div>

        <span className="flex size-5 items-center justify-center text-[color:var(--dashboard-text-soft)]">
          <svg viewBox="0 0 20 20" className="size-5 fill-none stroke-current">
            <path
              d="M5 7.5L10 12.5L15 7.5"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <button
        type="button"
        className="relative flex h-[69px] min-w-[61px] items-center justify-center rounded-xl bg-[color:var(--dashboard-surface)] px-4 text-[color:var(--dashboard-text-soft)] shadow-[var(--dashboard-shadow)]"
        aria-label={dashboardActions.topbar.notificationLabel}
      >
        <BellIcon className="size-[22px] stroke-[1.8]" />
        <span className="absolute top-[16px] left-[22px] block size-[11px] rounded-full bg-[#c99d61]" />
      </button>
    </div>
  )
}
