import { describe, expect, it, vi } from 'vitest'

import { apiGet, apiPut } from '@/lib/api/http-methods'
import {
  getOpportunities,
  updateOpportunity,
} from '@/features/investment-opportunities/services/investment-opportunity-service'

vi.mock('@/lib/api/http-methods', () => ({
  apiGet: vi.fn(),
  apiPut: vi.fn(),
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

describe('investment-opportunity-service:updateOpportunity', () => {
  it('sends multipart put request to update an opportunity', async () => {
    const formData = new FormData()
    formData.append('title_ar', 'فرصة محدثة')

    vi.mocked(apiPut).mockResolvedValue({
      message: 'Opportunity updated.',
      data: {
        id: 'opportunity-1',
      },
    })

    await updateOpportunity('opportunity-1', formData)

    expect(apiPut).toHaveBeenCalledWith('opportunities/opportunity-1', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  })
})
