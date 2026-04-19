import { z } from 'zod'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DECIMAL_REGEX = /^\d+(\.\d+)?$/
const INTEGER_REGEX = /^\d+$/
const SAUDI_MOBILE_REGEX = /^5\d{7,8}$/
const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']
const DOCUMENT_MIME_TYPES = ['application/pdf', ...IMAGE_MIME_TYPES]
const DOCUMENT_EXTENSIONS = ['pdf', ...IMAGE_EXTENSIONS]

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

function getFileExtension(fileName) {
  const normalizedName = String(fileName ?? '').trim()
  const extension = normalizedName.split('.').pop()?.trim().toLowerCase()

  if (!extension || extension === normalizedName.toLowerCase()) {
    return ''
  }

  return extension
}

function normalizeMimeType(value) {
  const normalized = String(value ?? '').trim().toLowerCase()

  if (!normalized) {
    return ''
  }

  if (normalized === 'image/jpg' || normalized === 'image/pjpeg') {
    return 'image/jpeg'
  }

  if (normalized === 'application/x-pdf') {
    return 'application/pdf'
  }

  return normalized
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

function normalizeArabicIndicDigits(value) {
  const normalized = String(value ?? '')
  const arabicIndic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  const easternArabicIndic = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

  return normalized.replace(/[٠-٩۰-۹]/g, (digit) => {
    const arabicIndex = arabicIndic.indexOf(digit)
    if (arabicIndex >= 0) {
      return String(arabicIndex)
    }

    const easternArabicIndex = easternArabicIndic.indexOf(digit)
    if (easternArabicIndex >= 0) {
      return String(easternArabicIndex)
    }

    return digit
  })
}

function normalizeSaudiMobileInput(value) {
  let digitsOnly = normalizeArabicIndicDigits(value).replace(/\D/g, '')

  if (digitsOnly.startsWith('00966')) {
    digitsOnly = digitsOnly.slice(5)
  } else if (digitsOnly.startsWith('966')) {
    digitsOnly = digitsOnly.slice(3)
  }

  if (digitsOnly.startsWith('0')) {
    digitsOnly = digitsOnly.slice(1)
  }

  return digitsOnly
}

function hasValidSaudiMobile(value) {
  return SAUDI_MOBILE_REGEX.test(normalizeSaudiMobileInput(value))
}

function hasAllowedFileTypes(value, allowedMimeTypes = [], allowedExtensions = []) {
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

  return files.every((file) => {
    const mimeType = normalizeMimeType(file?.type)
    if (mimeType && allowedMimeTypes.includes(mimeType)) {
      return true
    }

    const extension = getFileExtension(file?.name)
    if (extension && allowedExtensions.includes(extension)) {
      return true
    }

    return false
  })
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
        (value) => hasValidSaudiMobile(value),
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
        !hasAllowedFileTypes(
          values.propertyImages,
          IMAGE_MIME_TYPES,
          IMAGE_EXTENSIONS,
        )
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['propertyImages'],
          message: t('required', { ns: 'validation' }),
        })
      }

      if (
        !hasAllowedFileTypes(
          values.propertyDocuments,
          DOCUMENT_MIME_TYPES,
          DOCUMENT_EXTENSIONS,
        )
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['propertyDocuments'],
          message: t('required', { ns: 'validation' }),
        })
      }

      if (
        !hasAllowedFileTypes(
          values.virtualTour,
          IMAGE_MIME_TYPES,
          IMAGE_EXTENSIONS,
        )
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['virtualTour'],
          message: t('required', { ns: 'validation' }),
        })
      }
    })
}
