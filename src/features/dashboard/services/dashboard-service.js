import { apiGet } from '@/lib/api/http-methods'

/**
 * @typedef {Object} DashboardOverview
 * @property {number} total_users
 * @property {number} verified_users
 * @property {number} total_invested_amount
 * @property {number} total_returns_distributed
 * @property {number} total_withdrawals_paid
 * @property {number} total_withdrawals_requested
 * @property {number} [opportunities_count]
 * @property {Record<string, number>} [opportunities_by_status]
 */

/**
 * @typedef {Object} DashboardOverviewResponse
 * @property {string} message
 * @property {DashboardOverview} data
 */

/**
 * @returns {Promise<DashboardOverview | null>}
 */
export async function getDashboardOverview() {
  /** @type {DashboardOverviewResponse} */
  const response = await apiGet('dashboard')
  return response?.data ?? null
}
