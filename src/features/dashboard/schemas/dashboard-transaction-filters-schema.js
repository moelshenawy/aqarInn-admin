import { z } from 'zod'

export function createDashboardTransactionFiltersSchema(t) {
  return z
    .object({
      startDate: z.string().min(1, {
        message: t('validation:dateRangeStartRequired'),
      }),
      endDate: z.string().min(1, {
        message: t('validation:dateRangeEndRequired'),
      }),
    })
    .refine(
      ({ startDate, endDate }) => {
        if (!startDate || !endDate) {
          return true
        }

        return startDate <= endDate
      },
      {
        message: t('validation:dateRangeInvalidOrder'),
        path: ['endDate'],
      },
    )
}
