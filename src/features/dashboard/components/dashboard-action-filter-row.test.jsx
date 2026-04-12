import { Plus } from 'lucide-react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DashboardActionFilterRow } from '@/features/dashboard/components/dashboard-action-filter-row'

const filterItems = [
  { key: 'all', label: 'الكل', count: 96 },
  { key: 'riyadh', label: 'الرياض', count: 22 },
  { key: 'yanbu', label: 'ينبع' },
]

describe('DashboardActionFilterRow', () => {
  it('renders the action, swiper slides, and active filter state', () => {
    const handleAction = vi.fn()
    const handleSelect = vi.fn()

    render(
      <DashboardActionFilterRow
        action={{
          label: 'إضافة فرصة استثمارية',
          onClick: handleAction,
          icon: <Plus className="size-[18px]" aria-hidden="true" />,
        }}
        items={filterItems}
        activeKey="riyadh"
        onSelect={handleSelect}
      />,
    )

    const row = document.querySelector(
      '[data-slot="dashboard-action-filter-row"]',
    )
    expect(row).not.toBeNull()
    expect(
      document.querySelector('[data-slot="dashboard-filter-swiper"]'),
    ).not.toBeNull()
    expect(
      document.querySelectorAll('[data-slot="dashboard-filter-slide"]'),
    ).toHaveLength(filterItems.length)

    const activeFilter = screen.getByRole('button', { name: /الرياض/ })
    const inactiveFilter = screen.getByRole('button', { name: /ينبع/ })

    expect(activeFilter).toHaveAttribute('data-state', 'active')
    expect(inactiveFilter).toHaveAttribute('data-state', 'inactive')
    expect(
      inactiveFilter.querySelector('[data-slot="dashboard-filter-count"]'),
    ).toBeNull()

    fireEvent.click(inactiveFilter)
    fireEvent.click(
      screen.getByRole('button', { name: 'إضافة فرصة استثمارية' }),
    )

    expect(handleSelect).toHaveBeenCalledWith('yanbu')
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  it('omits the action button and divider when no action is provided', () => {
    render(
      <DashboardActionFilterRow
        items={filterItems}
        activeKey="all"
        onSelect={vi.fn()}
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'إضافة فرصة استثمارية' }),
    ).not.toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="dashboard-action-filter-divider"]'),
    ).toBeNull()
    expect(
      document.querySelector('[data-slot="dashboard-filter-swiper"]'),
    ).not.toBeNull()
  })
})
