import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

function NotificationMenuItem({ item }) {
  return (
    <li className="flex items-start justify-end gap-4">
      <div
        aria-hidden="true"
        className="flex size-[57px] shrink-0 items-center justify-center rounded-full border border-[#eae5d7] bg-[#f8f3e8] shadow-[0_1px_2px_rgba(10,13,18,0.05),inset_0_-2px_0_rgba(10,13,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18)]"
      >
        <img
          src={item.iconSrc}
          alt=""
          className="h-[27px] w-[26px] object-contain"
        />
      </div>

      <div className="min-w-0 flex-1 text-right">
        <p className="text-base leading-6 font-semibold text-[#181927]">
          {item.title}
        </p>
        <p className="mt-1.5 text-sm leading-5 font-normal text-[#414651]">
          {item.message}
        </p>
      </div>
    </li>
  )
}

export function DashboardNotificationsMenu({
  bellIcon,
  items,
  open,
  onOpenChange,
  triggerLabel,
}) {
  const BellIconComponent = bellIcon

  return (
    <DropdownMenu
      dir="ltr"
      modal={false}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={triggerLabel}
          className={cn(
            'relative flex h-[69px] min-w-[61px] items-center justify-center rounded-xl px-4 shadow-[var(--dashboard-shadow)] transition-colors focus-visible:ring-2 focus-visible:ring-[#9d7e55]/20 focus-visible:outline-none',
            open
              ? 'bg-[color:var(--dashboard-surface-strong)] text-[#f8f3e8]'
              : 'bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text-soft)] hover:bg-[#ded6c4]',
          )}
        >
          <BellIconComponent className="size-[22px] stroke-[1.8]" />
          {!open ? (
            <span className="absolute top-[16px] left-[22px] block size-[11px] rounded-full bg-[#c99d61]" />
          ) : null}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={12}
        collisionPadding={16}
        className="w-[calc(100vw-32px)] max-w-[503px] rounded-[12px] border border-[#d6cbb2] bg-[#f8f3e8] p-0 text-[#6d4f3b] shadow-[0_12px_32px_rgba(64,47,40,0.14)] ring-0 sm:w-[503px] [&::-webkit-scrollbar]:hidden"
      >
        <div
          dir="rtl"
          className="max-h-[calc(100vh-32px)] overflow-y-auto px-[26px] py-6 sm:max-h-[919px]"
        >
          <div className="flex flex-col gap-6">
            <p className="text-right text-lg leading-7 font-semibold text-[color:var(--dashboard-text)]">
              جميع الاشعارات
            </p>

            <ul className="space-y-6">
              {items.map((item) => (
                <NotificationMenuItem key={item.id} item={item} />
              ))}
            </ul>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
