import 'swiper/css'
import 'swiper/css/free-mode'

import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'

import { cn } from '@/lib/utils'

export function DashboardActionFilterRow({
  action,
  items,
  activeKey,
  onSelect,
  direction = 'rtl',
}) {
  const hasAction = Boolean(action)

  return (
    <section
      dir={direction}
      role="group"
      data-slot="dashboard-action-filter-row"
      className="flex w-full min-w-0 items-center gap-3"
    >
      <div
        dir={direction}
        data-slot="dashboard-filter-swiper"
        className="min-w-0 flex-1"
      >
        <Swiper
          dir={direction}
          modules={[FreeMode]}
          freeMode
          slidesPerView="auto"
          spaceBetween={6}
          className="w-full [&_.swiper-wrapper]:items-center"
        >
          {items.map((item) => {
            const isActive = item.key === activeKey

            return (
              <SwiperSlide
                key={item.key}
                data-slot="dashboard-filter-slide"
                className="!w-auto"
              >
                <button
                  type="button"
                  dir={direction}
                  data-slot="dashboard-filter-chip"
                  data-state={isActive ? 'active' : 'inactive'}
                  aria-pressed={isActive}
                  className={cn(
                    'inline-flex items-center gap-2.5 rounded-[36px] border px-4 py-2 pl-[10px] text-sm leading-5 font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-[#9d7e55]/20 focus-visible:outline-none',
                    isActive
                      ? 'border-[#402f28] bg-[#402f28] text-[#f8f3e8]'
                      : 'border-[#eae5d7] bg-transparent text-[#6d4f3b] hover:bg-[#f4eee1]',
                  )}
                  onClick={() => onSelect(item.key)}
                >
                  <span>{item.label}</span>

                  {item.count != null ? (
                    <span
                      data-slot="dashboard-filter-count"
                      className="inline-flex min-w-[28px] items-center justify-center rounded-[24px] bg-[#eae5d7] px-[5px] text-sm leading-5 font-medium text-[#5c4437]"
                    >
                      {item.count}
                    </span>
                  ) : null}
                </button>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
      {hasAction ? (
        <button
          type="button"
          dir={direction}
          data-slot="dashboard-action-filter-trigger"
          aria-label={action.ariaLabel ?? action.label}
          className="inline-flex shrink-0 items-center gap-2.5 rounded-[36px] bg-[#402f28] px-4 py-2 ps-5 text-sm leading-5 font-medium text-[#f8f3e8] transition-colors hover:bg-[#4a3730] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/30 focus-visible:outline-none"
          onClick={action.onClick}
        >
          <span dir={direction} className="whitespace-nowrap">
            {action.label}
          </span>

          {action.icon ? (
            <span className="flex size-[26px] items-center justify-center rounded-[13px] bg-[#f8f3e8] text-[#402f28]">
              {action.icon}
            </span>
          ) : null}
        </button>
      ) : null}

      {hasAction ? (
        <div
          aria-hidden="true"
          data-slot="dashboard-action-filter-divider"
          className="h-[18px] w-px shrink-0 bg-[#d6cbb2]"
        />
      ) : null}
    </section>
  )
}
