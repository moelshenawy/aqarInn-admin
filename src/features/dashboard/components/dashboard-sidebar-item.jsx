import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

export function DashboardSidebarItem({
  icon: Icon,
  label,
  to,
  active = false,
  disabled = false,
  onNavigate,
}) {
  const IconComponent = Icon
  const className = cn(
    'flex w-full items-center justify-start gap-2 rounded-lg border px-3.5 py-3.5 text-start transition-colors',
    active
      ? 'border-[color:var(--dashboard-surface-strong)] bg-[color:var(--dashboard-surface-strong)] text-[color:var(--dashboard-text-soft)]'
      : 'border-[color:var(--dashboard-border)] bg-transparent text-[color:var(--dashboard-text-soft)]',
    !disabled && '',
    disabled && 'cursor-default',
  )

  const content = (
    <>
      <span className="flex size-5 items-center justify-center">
        <IconComponent
          className={cn(
            'size-5 stroke-[1.8]',
            active
              ? 'text-[color:var(--dashboard-text-soft)]'
              : 'text-[color:var(--dashboard-text-soft)]',
          )}
        />
      </span>
      <span
        className={cn(
          'text-sm leading-6 font-semibold text-[color:var(--dashboard-muted)]',
          active && 'text-white',
        )}
      >
        {label}
      </span>
    </>
  )

  if (disabled || !to) {
    return (
      <div aria-disabled="true" className={className}>
        {content}
      </div>
    )
  }

  return (
    <Link to={to} className={className} onClick={onNavigate}>
      {content}
    </Link>
  )
}
