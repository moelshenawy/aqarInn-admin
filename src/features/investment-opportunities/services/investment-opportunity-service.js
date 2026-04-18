import { apiGet, apiPost } from '@/lib/api/http-methods'

/**
 * @typedef {Object} CityItem
 * @property {string} id
 * @property {string} name_ar
 * @property {string} name_en
 * @property {string | null} [cover_image]
 * @property {string | null} [cover_image_url]
 * @property {string | null} [latitude]
 * @property {string | null} [longitude]
 */

/**
 * @typedef {Object} PaginatedCities
 * @property {CityItem[]} data
 */

/**
 * @typedef {Object} CitiesResponse
 * @property {string} message
 * @property {PaginatedCities} data
 */

/**
 * @returns {Promise<CityItem[]>}
 */
export async function getCities() {
  /** @type {CitiesResponse} */
  const response = await apiGet('cities')
  return response?.data?.data ?? []
}

/**
 * @typedef {Object} OpportunityCity
 * @property {string} id
 * @property {string} name_ar
 * @property {string} name_en
 *
 * @typedef {Object} OpportunityItem
 * @property {string} id
 * @property {string} reference_code
 * @property {string} title_ar
 * @property {string} title_en
 * @property {string} status
 * @property {string} city_id
 * @property {number} total_shares
 * @property {number} funded_shares
 * @property {string} property_price
 * @property {string | null} [cover_image_url]
 * @property {OpportunityCity | null} [city]
 *
 * @typedef {Object} OpportunitiesPagination
 * @property {number} current_page
 * @property {number} last_page
 * @property {number} total
 * @property {number} per_page
 * @property {OpportunityItem[]} data
 *
 * @typedef {Object} OpportunitiesResponse
 * @property {string} message
 * @property {OpportunitiesPagination | OpportunityItem[]} data
 */

function buildEmptyOpportunitiesPagination() {
  return {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 20,
    data: [],
  }
}

/**
 * @param {OpportunitiesResponse | null | undefined} response
 * @returns {OpportunitiesPagination}
 */
function normalizeOpportunitiesResponse(response) {
  const payload = response?.data

  if (Array.isArray(payload)) {
    return {
      current_page: 1,
      last_page: 1,
      total: payload.length,
      per_page: Math.max(payload.length, 1),
      data: payload,
    }
  }

  if (payload && Array.isArray(payload.data)) {
    return {
      current_page: Number(payload.current_page) || 1,
      last_page: Number(payload.last_page) || 1,
      total: Number(payload.total) || payload.data.length,
      per_page: Number(payload.per_page) || Math.max(payload.data.length, 1),
      data: payload.data,
    }
  }

  return buildEmptyOpportunitiesPagination()
}

/**
 * @param {{ page?: number }} params
 * @returns {Promise<OpportunitiesPagination>}
 */
export async function getOpportunities({ page = 1 } = {}) {
  /** @type {OpportunitiesResponse} */
  const response = await apiGet('opportunities', {
    params: { page },
  })

  return normalizeOpportunitiesResponse(response)
}

/**
 * @typedef {Object} OpportunityDetailsResponse
 * @property {string} message
 * @property {OpportunityItem} data
 */

/**
 * @param {string} opportunityId
 * @returns {Promise<OpportunityItem | null>}
 */
export async function getOpportunityById(opportunityId) {
  if (!opportunityId) {
    return null
  }

  /** @type {OpportunityDetailsResponse} */
  const response = await apiGet(`opportunities/${opportunityId}`)
  return response?.data ?? null
}

/**
 * @typedef {Object} ProfitDistributionLine
 * @property {string} id
 * @property {number} shares_at_distribution
 * @property {string} amount
 * @property {{ full_name?: string, mobile_number?: string } | null} [user]
 *
 * @typedef {Object} ProfitDistributionItem
 * @property {string} id
 * @property {string} net_profit_amount
 * @property {string} currency
 * @property {string} distribution_date
 * @property {string} status
 * @property {{ code?: string, full_name_ar?: string, full_name_en?: string } | null} [distributed_by_admin]
 * @property {ProfitDistributionLine[] | null} [lines]
 *
 * @typedef {Object} ProfitDistributionsResponse
 * @property {string} message
 * @property {ProfitDistributionItem[]} data
 */

/**
 * @typedef {Object} ProfitDistributionLineItem
 * @property {string} id
 * @property {number} shares_at_distribution
 * @property {string} amount
 * @property {{
 *  id?: string,
 *  full_name?: string,
 *  email?: string,
 *  mobile_number?: string,
 * } | null} [user]
 *
 * @typedef {Object} ProfitDistributionDetailsItem
 * @property {string} id
 * @property {string} investment_opportunity_id
 * @property {string} type
 * @property {string} net_profit_amount
 * @property {string} currency
 * @property {string} distribution_date
 * @property {string} status
 * @property {string | null} [notes]
 * @property {{
 *  id?: string,
 *  code?: string,
 *  full_name_ar?: string,
 *  full_name_en?: string,
 * } | null} [distributed_by_admin]
 * @property {ProfitDistributionLineItem[] | null} [lines]
 *
 * @typedef {Object} ProfitDistributionDetailsResponse
 * @property {string} message
 * @property {ProfitDistributionDetailsItem} data
 */

/**
 * @param {string} opportunityId
 * @returns {Promise<ProfitDistributionItem[]>}
 */
export async function getOpportunityProfitDistributions(opportunityId) {
  if (!opportunityId) {
    return []
  }

  /** @type {ProfitDistributionsResponse} */
  const response = await apiGet(`opportunities/${opportunityId}/profit-distributions`)
  return response?.data ?? []
}

/**
 * @param {string} distributionId
 * @returns {Promise<ProfitDistributionDetailsItem | null>}
 */
export async function getProfitDistributionById(distributionId) {
  if (!distributionId) {
    return null
  }

  /** @type {ProfitDistributionDetailsResponse} */
  const response = await apiGet(`profit-distributions/${distributionId}`)
  return response?.data ?? null
}

/**
 * @param {string} opportunityId
 * @param {{
 *  type: 'profit',
 *  net_profit_amount: number,
 *  currency: string,
 *  distribution_date: string,
 *  notes?: string,
 * }} payload
 */
export async function createOpportunityProfitDistribution(opportunityId, payload) {
  return apiPost(`opportunities/${opportunityId}/profit-distributions`, payload)
}

export async function createOpportunity(formData) {
  return apiPost('opportunities', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function createOpportunityDraft(formData) {
  return apiPost('opportunities/drafts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
