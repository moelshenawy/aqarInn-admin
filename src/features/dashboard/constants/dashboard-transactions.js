export const DASHBOARD_TRANSACTION_TYPES = Object.freeze({
  investment: 'investment',
  withdrawal: 'withdrawal',
  distribution: 'distribution',
})

export const DASHBOARD_WITHDRAWAL_STATUSES = Object.freeze({
  inProgress: 'in_progress',
  depositMade: 'deposit_made',
})

export const DASHBOARD_TRANSACTION_RANGE_PRESETS = Object.freeze([
  'today',
  'last7Days',
  'last30Days',
  'custom',
])

const transactionSeeds = [
  {
    id: 'txn-investment-001',
    type: DASHBOARD_TRANSACTION_TYPES.investment,
    amount: 120000,
    daysAgo: 0,
    ioKey: 'riyadhResidences',
    ioLabel: 'Riyadh Residences',
    cityKey: 'riyadh',
    cityLabel: 'Riyadh',
  },
  {
    id: 'txn-investment-002',
    type: DASHBOARD_TRANSACTION_TYPES.investment,
    amount: 45000,
    daysAgo: 0,
    ioKey: 'jeddahCorniche',
    ioLabel: 'Jeddah Corniche',
    cityKey: 'jeddah',
    cityLabel: 'Jeddah',
  },
  {
    id: 'txn-withdrawal-001',
    type: DASHBOARD_TRANSACTION_TYPES.withdrawal,
    amount: 80000,
    daysAgo: 0,
    ioKey: 'riyadhResidences',
    ioLabel: 'Riyadh Residences',
    cityKey: 'riyadh',
    cityLabel: 'Riyadh',
    withdrawalStatus: DASHBOARD_WITHDRAWAL_STATUSES.inProgress,
  },
  {
    id: 'txn-distribution-001',
    type: DASHBOARD_TRANSACTION_TYPES.distribution,
    amount: 35000,
    daysAgo: 0,
    ioKey: 'dammamHeights',
    ioLabel: 'Dammam Heights',
    cityKey: 'dammam',
    cityLabel: 'Dammam',
  },
  {
    id: 'txn-investment-003',
    type: DASHBOARD_TRANSACTION_TYPES.investment,
    amount: 95000,
    daysAgo: 2,
    ioKey: 'riyadhResidences',
    ioLabel: 'Riyadh Residences',
    cityKey: 'riyadh',
    cityLabel: 'Riyadh',
  },
  {
    id: 'txn-withdrawal-002',
    type: DASHBOARD_TRANSACTION_TYPES.withdrawal,
    amount: 65000,
    daysAgo: 3,
    ioKey: 'jeddahCorniche',
    ioLabel: 'Jeddah Corniche',
    cityKey: 'jeddah',
    cityLabel: 'Jeddah',
    withdrawalStatus: DASHBOARD_WITHDRAWAL_STATUSES.depositMade,
  },
  {
    id: 'txn-distribution-002',
    type: DASHBOARD_TRANSACTION_TYPES.distribution,
    amount: 42000,
    daysAgo: 5,
    ioKey: 'jeddahCorniche',
    ioLabel: 'Jeddah Corniche',
    cityKey: 'jeddah',
    cityLabel: 'Jeddah',
  },
  {
    id: 'txn-withdrawal-003',
    type: DASHBOARD_TRANSACTION_TYPES.withdrawal,
    amount: 38000,
    daysAgo: 6,
    ioKey: 'dammamHeights',
    ioLabel: 'Dammam Heights',
    cityKey: 'dammam',
    cityLabel: 'Dammam',
    withdrawalStatus: DASHBOARD_WITHDRAWAL_STATUSES.inProgress,
  },
  {
    id: 'txn-investment-004',
    type: DASHBOARD_TRANSACTION_TYPES.investment,
    amount: 150000,
    daysAgo: 10,
    ioKey: 'dammamHeights',
    ioLabel: 'Dammam Heights',
    cityKey: 'dammam',
    cityLabel: 'Dammam',
  },
  {
    id: 'txn-distribution-003',
    type: DASHBOARD_TRANSACTION_TYPES.distribution,
    amount: 58000,
    daysAgo: 12,
    ioKey: 'riyadhResidences',
    ioLabel: 'Riyadh Residences',
    cityKey: 'riyadh',
    cityLabel: 'Riyadh',
  },
  {
    id: 'txn-withdrawal-004',
    type: DASHBOARD_TRANSACTION_TYPES.withdrawal,
    amount: 102000,
    daysAgo: 15,
    ioKey: 'riyadhResidences',
    ioLabel: 'Riyadh Residences',
    cityKey: 'riyadh',
    cityLabel: 'Riyadh',
    withdrawalStatus: DASHBOARD_WITHDRAWAL_STATUSES.depositMade,
  },
  {
    id: 'txn-investment-005',
    type: DASHBOARD_TRANSACTION_TYPES.investment,
    amount: 87000,
    daysAgo: 20,
    ioKey: 'jeddahCorniche',
    ioLabel: 'Jeddah Corniche',
    cityKey: 'jeddah',
    cityLabel: 'Jeddah',
  },
  {
    id: 'txn-distribution-004',
    type: DASHBOARD_TRANSACTION_TYPES.distribution,
    amount: 27000,
    daysAgo: 23,
    ioKey: 'jeddahCorniche',
    ioLabel: 'Jeddah Corniche',
    cityKey: 'jeddah',
    cityLabel: 'Jeddah',
  },
  {
    id: 'txn-investment-006',
    type: DASHBOARD_TRANSACTION_TYPES.investment,
    amount: 130000,
    daysAgo: 34,
    ioKey: 'riyadhResidences',
    ioLabel: 'Riyadh Residences',
    cityKey: 'riyadh',
    cityLabel: 'Riyadh',
  },
  {
    id: 'txn-withdrawal-005',
    type: DASHBOARD_TRANSACTION_TYPES.withdrawal,
    amount: 54000,
    daysAgo: 36,
    ioKey: 'dammamHeights',
    ioLabel: 'Dammam Heights',
    cityKey: 'dammam',
    cityLabel: 'Dammam',
    withdrawalStatus: DASHBOARD_WITHDRAWAL_STATUSES.inProgress,
  },
  {
    id: 'txn-distribution-005',
    type: DASHBOARD_TRANSACTION_TYPES.distribution,
    amount: 63000,
    daysAgo: 40,
    ioKey: 'dammamHeights',
    ioLabel: 'Dammam Heights',
    cityKey: 'dammam',
    cityLabel: 'Dammam',
  },
]

export const dashboardTransactionIoKeys = [
  'riyadhResidences',
  'jeddahCorniche',
  'dammamHeights',
]

export const dashboardTransactionCityKeys = ['riyadh', 'jeddah', 'dammam']

function createRelativeDate(referenceDate, daysAgo) {
  const nextDate = new Date(referenceDate)
  nextDate.setHours(12, 0, 0, 0)
  nextDate.setDate(nextDate.getDate() - daysAgo)
  return nextDate.toISOString()
}

export function createDashboardTransactionRecords(referenceDate = new Date()) {
  return transactionSeeds.map((record) => ({
    ...record,
    createdAt: createRelativeDate(referenceDate, record.daysAgo),
  }))
}
