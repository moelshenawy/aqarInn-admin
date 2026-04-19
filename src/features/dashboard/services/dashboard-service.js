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
 * @property {Array<{key: string, label: string, value: number, value_type: 'count' | 'currency'}>} [summary_cards]
 * @property {{
 *   title: string,
 *   total: number,
 *   statuses: Array<{key: string, label: string, count: number, share_pct: number, bar_pct: number}>
 * }} [opportunities_status_overview]
 * @property {{
 *   title: string,
 *   items: Array<{
 *     id: string,
 *     reference_code: string,
 *     title: string,
 *     status: string,
 *     status_label: string,
 *     city: string,
 *     neighborhood: string,
 *     cover_image_url: string | null,
 *     funded_amount: number,
 *     currency: string,
 *     funded_shares: number,
 *     total_shares: number,
 *     investors_count: number,
 *     funding_progress_pct: number
 *   }>
 * }} [featured_opportunities]
 * @property {{
 *   title: string,
 *   selected_filter: string,
 *   filters: Array<{ key: string, label: string, is_selected: boolean }>,
 *   cards: Array<{ key: string, label: string, count: number, amount: number, currency: string }>
 * }} [transactions_overview]
 */

/**
 * @typedef {Object} DashboardOverviewResponse
 * @property {string} message
 * @property {DashboardOverview} data
 */

/**
 * @param {string | null} [transactionsFilter]
 * @returns {Promise<DashboardOverview | null>}
 */
export async function getDashboardOverview(transactionsFilter = null) {
  /** @type {DashboardOverviewResponse} */
  const response = await apiGet('dashboard', {
    params: transactionsFilter
      ? { transactions_filter: transactionsFilter }
      : undefined,
  })
  return response?.data ?? null
}

/**
 * @typedef {NonNullable<DashboardOverview['transactions_overview']>} DashboardTransactionsOverview
 */

/**
 * @param {string | null} [transactionsFilter]
 * @returns {Promise<DashboardTransactionsOverview | null>}
 */
export async function getDashboardTransactionsOverview(transactionsFilter = null) {
  const overview = await getDashboardOverview(transactionsFilter)
  return overview?.transactions_overview ?? null
}
