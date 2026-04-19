export const dashboardQueryKeys = {
  all: ['dashboard'],
  overview: (transactionsFilter = null) => [
    ...dashboardQueryKeys.all,
    'overview',
    { transactionsFilter: transactionsFilter ?? null },
  ],
  transactionsOverview: (transactionsFilter = null) => [
    ...dashboardQueryKeys.all,
    'transactions-overview',
    { transactionsFilter: transactionsFilter ?? null },
  ],
}
