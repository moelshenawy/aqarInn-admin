import { describe, expect, it, vi } from 'vitest'

import { apiGet } from '@/lib/api/http-methods'
import { getDashboardOverview } from '@/features/dashboard/services/dashboard-service'

vi.mock('@/lib/api/http-methods', () => ({
  apiGet: vi.fn(),
}))

describe('getDashboardOverview', () => {
  it('requests dashboard overview endpoint and returns the data payload', async () => {
    const responsePayload = {
      message: 'OK',
      data: {
        total_users: 1,
        verified_users: 0,
        total_invested_amount: 10500,
        total_returns_distributed: 0,
        total_withdrawals_paid: 0,
        total_withdrawals_requested: 0,
      },
    }
    vi.mocked(apiGet).mockResolvedValue(responsePayload)

    const result = await getDashboardOverview()

    expect(apiGet).toHaveBeenCalledWith('dashboard', { params: undefined })
    expect(result).toEqual(responsePayload.data)
  })

  it('passes transactions filter as query params when provided', async () => {
    const responsePayload = { message: 'OK', data: {} }
    vi.mocked(apiGet).mockResolvedValue(responsePayload)

    await getDashboardOverview('today')

    expect(apiGet).toHaveBeenCalledWith('dashboard', {
      params: { transactions_filter: 'today' },
    })
  })
})
