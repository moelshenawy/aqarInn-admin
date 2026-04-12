import { Link } from 'react-router-dom'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function DashboardSidebarItem({
  icon: Icon,
  label,
  to,
  active = false,
  disabled = false,
  collapsed = false,
  onNavigate,
}) {
  const IconComponent = Icon

  const className = cn(
    'flex w-full items-center rounded-lg border py-3.5 text-start transition-[padding,gap,background-color,border-color] duration-300 ease-in-out',
    collapsed ? 'justify-center gap-0 px-3' : 'justify-start gap-2 px-3.5',
    active
      ? 'border-[color:var(--dashboard-surface-strong)] bg-[color:var(--dashboard-surface-strong)] text-[color:var(--dashboard-text-soft)]'
      : 'border-[color:var(--dashboard-border)] bg-transparent text-[color:var(--dashboard-text-soft)]',
    disabled && 'cursor-default',
  )

  const content = (
    <>
      <span className="flex size-5 shrink-0 items-center justify-center">
        <IconComponent className="size-5 stroke-[1.8] text-[color:var(--dashboard-text-soft)]" />
      </span>
      <span
        data-slot="dashboard-sidebar-label"
        aria-hidden={collapsed}
        className={cn(
          'min-w-0 overflow-hidden text-sm leading-6 font-semibold whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out',
          collapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100',
          active ? 'text-white' : 'text-[color:var(--dashboard-text-soft)]',
        )}
      >
        {label}
      </span>
    </>
  )

  const sharedProps = {
    className,
    'data-slot': 'dashboard-sidebar-item',
    'aria-label': collapsed ? label : undefined,
  }

  const item =
    disabled || !to ? (
      <div
        {...sharedProps}
        aria-disabled="true"
        tabIndex={collapsed ? 0 : undefined}
      >
        {content}
      </div>
    ) : (
      <Link to={to} {...sharedProps} onClick={onNavigate}>
        {content}
      </Link>
    )

  if (!collapsed) {
    return item
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{item}</TooltipTrigger>
      <TooltipContent side="left" sideOffset={12} dir="rtl">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
