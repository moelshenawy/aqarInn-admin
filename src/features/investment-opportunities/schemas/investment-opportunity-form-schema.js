import { z } from 'zod'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function hasAtLeastOneFile(value) {
  if (!value) {
    return false
  }

  if (typeof FileList !== 'undefined' && value instanceof FileList) {
    return value.length > 0
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  return false
}

function requiredString(t) {
  return z.string().trim().min(1, t('required', { ns: 'validation' }))
}

export function createInvestmentOpportunityDraftSchema(t) {
  return z.object({
    titleAr: requiredString(t),
    titleEn: requiredString(t),
  })
}

export function createInvestmentOpportunityPublishSchema(t) {
  return z
    .object({
      referenceCode: requiredString(t),
      titleAr: requiredString(t),
      titleEn: requiredString(t),
      cityId: requiredString(t),
      neighborhood: requiredString(t),
      propertyType: requiredString(t),
      propertyPrice: requiredString(t),
      currency: requiredString(t),
      shareCount: requiredString(t),
      sharePrice: requiredString(t),
      minInvestmentShares: requiredString(t),
      maxSharesPerUser: requiredString(t),
      maxUserOwnershipPct: requiredString(t),
      expectedReturn: requiredString(t),
      returnFrequency: requiredString(t),
      investmentDurationMonths: requiredString(t),
      scheduleInvestmentStart: z.string().optional(),
      investmentStartDate: z.string().optional(),
      developerEmail: requiredString(t).refine(
        (value) => EMAIL_REGEX.test(value),
        {
          message: t('invalidEmail', { ns: 'validation' }),
        },
      ),
      developerNameAr: requiredString(t),
      developerNameEn: requiredString(t),
      developerPhone: requiredString(t),
      propertyImages: z.any().refine(hasAtLeastOneFile, {
        message: t('required', { ns: 'validation' }),
      }),
    })
    .superRefine((values, context) => {
      if (
        values.scheduleInvestmentStart === 'yes' &&
        !String(values.investmentStartDate ?? '').trim()
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['investmentStartDate'],
          message: t('required', { ns: 'validation' }),
        })
      }
    })
}
