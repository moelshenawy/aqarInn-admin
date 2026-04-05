export const investmentOpportunitiesQueryKeys = {
  all: ['investment-opportunities'],
  list: (filters = {}) => [
    ...investmentOpportunitiesQueryKeys.all,
    'list',
    filters,
  ],
}
