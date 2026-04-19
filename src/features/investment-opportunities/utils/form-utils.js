export function toStringValue(value) {
  return String(value ?? '').trim()
}

export function hasValue(value) {
  return toStringValue(value).length > 0
}

export function toDateInputValue(value) {
  const normalizedValue = toStringValue(value)

  if (!normalizedValue) {
    return ''
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
    return normalizedValue
  }

  const parsedDate = new Date(normalizedValue)
  return Number.isNaN(parsedDate.getTime())
    ? ''
    : parsedDate.toISOString().slice(0, 10)
}

export function parseFormNumber(value) {
  const normalizedValue = toStringValue(value).replace(/,/g, '')

  if (!normalizedValue) {
    return null
  }

  const parsedNumber = Number(normalizedValue)
  return Number.isFinite(parsedNumber) ? parsedNumber : null
}

export function normalizeArabicIndicDigits(value) {
  const digitMap = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
  }

  return String(value ?? '').replace(/[٠-٩۰-۹]/g, (digit) => digitMap[digit])
}

export function normalizeSaudiMobileInput(value) {
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

export function getFileList(value) {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  if (typeof FileList !== 'undefined' && value instanceof FileList) {
    return Array.from(value)
  }

  return []
}

export function getFileExtension(fileName, fallback = '') {
  const normalizedName = toStringValue(fileName)
  const extension = normalizedName.split('.').pop()?.trim().toLowerCase()

  if (!extension || extension === normalizedName.toLowerCase()) {
    return fallback
  }

  return extension
}

export function normalizeMimeType(value) {
  const normalizedValue = toStringValue(value).toLowerCase()

  if (normalizedValue === 'image/jpg' || normalizedValue === 'image/pjpeg') {
    return 'image/jpeg'
  }

  if (normalizedValue === 'application/x-pdf') {
    return 'application/pdf'
  }

  return normalizedValue
}

export function withManagedUploadFiles(values, managedFiles = {}) {
  return {
    ...values,
    developerPhone: normalizeSaudiMobileInput(values?.developerPhone),
    propertyDocuments: managedFiles.propertyDocuments ?? [],
    propertyImages: managedFiles.propertyImages ?? [],
    virtualTour: managedFiles.virtualTour ?? [],
    developerLogo: managedFiles.developerLogo ?? [],
  }
}
