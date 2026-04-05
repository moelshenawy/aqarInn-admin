export const profitDistributionsQueryKeys = {
  all: ['profit-distributions'],
  list: (filters = {}) => [
    ...profitDistributionsQueryKeys.all,
    'list',
    filters,
  ],
}
