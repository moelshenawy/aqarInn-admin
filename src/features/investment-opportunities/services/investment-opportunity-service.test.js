import { describe, expect, it, vi } from 'vitest'

import { apiGet } from '@/lib/api/http-methods'
import { getOpportunities } from '@/features/investment-opportunities/services/investment-opportunity-service'

vi.mock('@/lib/api/http-methods', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiDelete: vi.fn(),
}))

describe('investment-opportunity-service:getOpportunities', () => {
  it('sends search, city_id, and status params when provided', async () => {
    vi.mocked(apiGet).mockResolvedValue({
      message: 'OK',
      data: [],
    })

    await getOpportunities({
      page: 2,
      search: 'riyadh',
      cityId: 'city-riyadh',
      status: 'published',
    })

    expect(apiGet).toHaveBeenCalledWith('opportunities', {
      params: {
        page: 2,
        search: 'riyadh',
        city_id: 'city-riyadh',
        status: 'published',
      },
    })
  })

  it('omits empty optional filters', async () => {
    vi.mocked(apiGet).mockResolvedValue({
      message: 'OK',
      data: [],
    })

    await getOpportunities({ page: 1, search: '   ', cityId: '', status: '' })

    expect(apiGet).toHaveBeenCalledWith('opportunities', {
      params: {
        page: 1,
      },
    })
  })
})
