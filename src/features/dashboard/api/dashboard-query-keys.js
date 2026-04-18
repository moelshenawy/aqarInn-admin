export const dashboardQueryKeys = {
  all: ['dashboard'],
  overview: (transactionsFilter = null) => [
    ...dashboardQueryKeys.all,
    'overview',
    { transactionsFilter: transactionsFilter ?? null },
  ],
}
