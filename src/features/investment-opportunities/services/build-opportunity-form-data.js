function asTrimmedString(value) {
  return String(value ?? '').trim()
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

function appendIfValue(formData, key, value) {
  const nextValue = asTrimmedString(value)
  if (!nextValue) {
    return
  }

  formData.append(key, nextValue)
}

function isValidCityId(value, allowedCityIds) {
  const normalizedValue = asTrimmedString(value)
  if (!normalizedValue) {
    return false
  }

  if (!allowedCityIds) {
    return true
  }

  if (allowedCityIds instanceof Set) {
    return allowedCityIds.has(normalizedValue)
  }

  return Array.from(allowedCityIds).some(
    (cityId) => asTrimmedString(cityId) === normalizedValue,
  )
}

function getFileList(value) {
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

/**
 * @typedef {Object} CreateOpportunityPayloadForm
 * @property {string} titleAr
 * @property {string} titleEn
 * @property {string} cityId
 * @property {string} neighborhood
 * @property {string} propertyType
 * @property {string} propertyArea
 * @property {string} floorCount
 * @property {string} buildYear
 * @property {string} propertyLocation
 * @property {string} propertyPrice
 * @property {string} currency
 * @property {string} shareCount
 * @property {string} sharePrice
 * @property {string} minInvestmentShares
 * @property {string} maxSharesPerUser
 * @property {string} maxUserOwnershipPct
 * @property {string} expectedNetReturn
 * @property {string} expectedReturn
 * @property {string} returnFrequency
 * @property {string} investmentDurationMonths
 * @property {string} scheduleInvestmentStart
 * @property {string} investmentStartDate
 * @property {string} developerNameAr
 * @property {string} developerNameEn
 * @property {string} developerDescriptionAr
 * @property {string} developerDescriptionEn
 * @property {string} developerEmail
 * @property {string} developerPhone
 * @property {string} developerLocation
 * @property {FileList | File[] | null} [developerLogo]
 * @property {FileList | File[] | null} [propertyDocuments]
 * @property {FileList | File[] | null} [virtualTour]
 * @property {FileList | File[] | null} [propertyImages]
 */

/**
 * @typedef {'publish' | 'draft'} OpportunitySubmissionMode
 */

/**
 * @param {CreateOpportunityPayloadForm} values
 * @param {{ mode: OpportunitySubmissionMode, allowedCityIds?: Iterable<string> | Set<string> }} options
 */
export function buildOpportunityFormData(
  values,
  { mode, allowedCityIds } = { mode: 'publish' },
) {
  const formData = new FormData()
  void mode

  appendIfValue(formData, 'title_ar', values.titleAr)
  appendIfValue(formData, 'title_en', values.titleEn)
  appendIfValue(formData, 'title', values.titleAr || values.titleEn)
  if (isValidCityId(values.cityId, allowedCityIds)) {
    appendIfValue(formData, 'city_id', values.cityId)
  }
  appendIfValue(formData, 'neighborhood', values.neighborhood)
  appendIfValue(formData, 'latitude', values.latitude)
  appendIfValue(formData, 'longitude', values.longitude)
  appendIfValue(formData, 'asset_type', values.propertyType)
  appendIfValue(formData, 'area_m2', values.propertyArea)
  appendIfValue(formData, 'floors', values.floorCount)
  appendIfValue(formData, 'build_year', values.buildYear)
  appendIfValue(formData, 'location_text', values.propertyLocation)
  appendIfValue(formData, 'property_price', values.propertyPrice)
  appendIfValue(formData, 'currency', values.currency)
  appendIfValue(formData, 'total_shares', values.shareCount)
  appendIfValue(formData, 'share_price', values.sharePrice)
  appendIfValue(formData, 'min_investment_shares', values.minInvestmentShares)
  appendIfValue(formData, 'max_shares_per_user', values.maxSharesPerUser)
  appendIfValue(formData, 'max_user_ownership_pct', values.maxUserOwnershipPct)
  appendIfValue(formData, 'expected_net_return', values.expectedNetReturn)
  appendIfValue(formData, 'expected_annual_return_pct', values.expectedReturn)
  appendIfValue(formData, 'return_frequency', values.returnFrequency)
  appendIfValue(
    formData,
    'investment_duration_months',
    values.investmentDurationMonths,
  )
  appendIfValue(
    formData,
    'schedule_investment_start',
    values.scheduleInvestmentStart === 'yes' ? '1' : '0',
  )
  appendIfValue(formData, 'investment_start_at', values.investmentStartDate)

  appendIfValue(formData, 'operator_name_ar', values.developerNameAr)
  appendIfValue(formData, 'operator_name_en', values.developerNameEn)
  appendIfValue(formData, 'operator_name', values.developerNameEn)
  appendIfValue(
    formData,
    'operator_description',
    values.developerDescriptionAr || values.developerDescriptionEn,
  )
  appendIfValue(formData, 'operator_description_ar', values.developerDescriptionAr)
  appendIfValue(formData, 'operator_description_en', values.developerDescriptionEn)
  appendIfValue(formData, 'operator_email', values.developerEmail)
  const developerPhone = normalizeSaudiMobileInput(values.developerPhone)
  appendIfValue(
    formData,
    'operator_phone',
    developerPhone ? `+966${developerPhone}` : '',
  )
  appendIfValue(formData, 'operator_location_text', values.developerLocation)

  const developerLogoFiles = getFileList(values.developerLogo)
  if (developerLogoFiles[0]) {
    formData.append('operator_logo', developerLogoFiles[0])
  }

  const virtualTourFiles = getFileList(values.virtualTour)
  if (virtualTourFiles[0]) {
    formData.append('virtual_tour', virtualTourFiles[0])
    formData.append('virtual_tour_image', virtualTourFiles[0])
  }

  const propertyImages = getFileList(values.propertyImages)
  if (propertyImages[0]) {
    formData.append('cover_image', propertyImages[0])
  }

  if (propertyImages.length > 1) {
    propertyImages.slice(1).forEach((imageFile) => {
      formData.append('images[]', imageFile)
    })
  }

  const propertyDocuments = getFileList(values.propertyDocuments)
  propertyDocuments.forEach((documentFile) => {
    formData.append('documents[]', documentFile)
  })

  return formData
}
