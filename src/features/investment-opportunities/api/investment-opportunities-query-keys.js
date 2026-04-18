export const investmentOpportunitiesQueryKeys = {
  all: ['investment-opportunities'],
  list: (filters = {}) => [
    ...investmentOpportunitiesQueryKeys.all,
    'list',
    filters,
  ],
  details: (opportunityId) => [
    ...investmentOpportunitiesQueryKeys.all,
    'details',
    opportunityId,
  ],
  profitDistributions: (opportunityId) => [
    ...investmentOpportunitiesQueryKeys.all,
    'profit-distributions',
    opportunityId,
  ],
  profitDistributionDetails: (distributionId) => [
    ...investmentOpportunitiesQueryKeys.all,
    'profit-distribution-details',
    distributionId,
  ],
  cities: () => [...investmentOpportunitiesQueryKeys.all, 'cities'],
}
