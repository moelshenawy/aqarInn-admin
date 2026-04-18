import { z } from 'zod'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DECIMAL_REGEX = /^\d+(\.\d+)?$/
const INTEGER_REGEX = /^\d+$/
const SAUDI_MOBILE_REGEX = /^5\d{8}$/

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

function boundedString(t, min, max) {
  return requiredString(t)
    .min(min, t('minCharacters', { ns: 'validation', count: min }))
    .max(max, t('required', { ns: 'validation' }))
}

function requiredDecimalString(t) {
  return requiredString(t).refine((value) => DECIMAL_REGEX.test(value), {
    message: t('required', { ns: 'validation' }),
  })
}

function hasAllowedFileTypes(value, allowedMimeTypes) {
  if (!value) {
    return true
  }

  const files =
    typeof FileList !== 'undefined' && value instanceof FileList
      ? Array.from(value)
      : Array.isArray(value)
        ? value
        : []

  if (!files.length) {
    return true
  }

  return files.every((file) => allowedMimeTypes.includes(file?.type))
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
      referenceCode: boundedString(t, 2, 250),
      titleAr: boundedString(t, 2, 250),
      titleEn: boundedString(t, 2, 250),
      cityId: requiredString(t),
      neighborhood: boundedString(t, 2, 250),
      latitude: requiredDecimalString(t),
      longitude: requiredDecimalString(t),
      propertyType: requiredString(t),
      propertyArea: requiredDecimalString(t),
      floorCount: z
        .string()
        .trim()
        .optional()
        .refine((value) => !value || (INTEGER_REGEX.test(value) && value.length <= 2), {
          message: t('required', { ns: 'validation' }),
        }),
      buildYear: z
        .string()
        .trim()
        .optional()
        .refine((value) => !value || /^\d{4}$/.test(value), {
          message: t('required', { ns: 'validation' }),
        }),
      propertyLocation: requiredString(t),
      propertyPrice: requiredDecimalString(t),
      currency: requiredString(t),
      shareCount: requiredString(t).refine(
        (value) => INTEGER_REGEX.test(value) && value.length >= 2 && value.length <= 6,
        {
          message: t('required', { ns: 'validation' }),
        },
      ),
      sharePrice: requiredDecimalString(t),
      minInvestmentShares: requiredString(t).refine(
        (value) => INTEGER_REGEX.test(value),
        {
          message: t('required', { ns: 'validation' }),
        },
      ),
      maxSharesPerUser: requiredString(t).refine(
        (value) => INTEGER_REGEX.test(value),
        {
          message: t('required', { ns: 'validation' }),
        },
      ),
      maxUserOwnershipPct: requiredDecimalString(t),
      expectedNetReturn: requiredDecimalString(t),
      expectedReturn: requiredDecimalString(t),
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
      developerNameAr: boundedString(t, 2, 100),
      developerNameEn: boundedString(t, 2, 100),
      developerDescriptionAr: z.string().trim().max(500, t('required', { ns: 'validation' })).optional(),
      developerDescriptionEn: z.string().trim().max(500, t('required', { ns: 'validation' })).optional(),
      developerPhone: requiredString(t).refine(
        (value) => SAUDI_MOBILE_REGEX.test(value),
        {
          message: t('required', { ns: 'validation' }),
        },
      ),
      propertyImages: z.any().refine(hasAtLeastOneFile, {
        message: t('required', { ns: 'validation' }),
      }),
      propertyDocuments: z.any().refine(hasAtLeastOneFile, {
        message: t('required', { ns: 'validation' }),
      }),
      virtualTour: z.any().optional(),
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

      if (values.scheduleInvestmentStart === 'yes') {
        const selectedDate = new Date(values.investmentStartDate)
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        if (Number.isNaN(selectedDate.getTime()) || selectedDate < now) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['investmentStartDate'],
            message: t('required', { ns: 'validation' }),
          })
        }
      }

      if (
        !hasAllowedFileTypes(values.propertyImages, ['image/jpeg', 'image/png'])
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['propertyImages'],
          message: t('required', { ns: 'validation' }),
        })
      }

      if (
        !hasAllowedFileTypes(values.propertyDocuments, [
          'application/pdf',
          'image/jpeg',
          'image/png',
        ])
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['propertyDocuments'],
          message: t('required', { ns: 'validation' }),
        })
      }

      if (
        !hasAllowedFileTypes(values.virtualTour, ['image/jpeg', 'image/png'])
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['virtualTour'],
          message: t('required', { ns: 'validation' }),
        })
      }
    })
}
