function asTrimmedString(value) {
  return String(value ?? '').trim()
}

function appendIfValue(formData, key, value) {
  const nextValue = asTrimmedString(value)
  if (!nextValue) {
    return
  }

  formData.append(key, nextValue)
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
 * @property {string} referenceCode
 * @property {string} titleAr
 * @property {string} titleEn
 * @property {string} cityId
 * @property {string} neighborhood
 * @property {string} propertyType
 * @property {string} propertyPrice
 * @property {string} currency
 * @property {string} shareCount
 * @property {string} sharePrice
 * @property {string} minInvestmentShares
 * @property {string} maxSharesPerUser
 * @property {string} maxUserOwnershipPct
 * @property {string} expectedReturn
 * @property {string} returnFrequency
 * @property {string} investmentDurationMonths
 * @property {FileList | File[] | null} [virtualTour]
 * @property {FileList | File[] | null} [propertyImages]
 */

/**
 * @typedef {'publish' | 'draft'} OpportunitySubmissionMode
 */

/**
 * @param {CreateOpportunityPayloadForm} values
 * @param {{ mode: OpportunitySubmissionMode }} options
 */
export function buildOpportunityFormData(values, { mode }) {
  const formData = new FormData()

  appendIfValue(formData, 'reference_code', values.referenceCode)
  appendIfValue(formData, 'title_ar', values.titleAr)
  appendIfValue(formData, 'title_en', values.titleEn)
  appendIfValue(formData, 'city_id', values.cityId)
  appendIfValue(formData, 'neighborhood', values.neighborhood)
  appendIfValue(formData, 'asset_type', values.propertyType)
  appendIfValue(formData, 'property_price', values.propertyPrice)
  appendIfValue(formData, 'currency', values.currency)
  appendIfValue(formData, 'total_shares', values.shareCount)
  appendIfValue(formData, 'share_price', values.sharePrice)
  appendIfValue(formData, 'min_investment_shares', values.minInvestmentShares)
  appendIfValue(formData, 'max_shares_per_user', values.maxSharesPerUser)
  appendIfValue(formData, 'max_user_ownership_pct', values.maxUserOwnershipPct)
  appendIfValue(formData, 'expected_annual_return_pct', values.expectedReturn)
  appendIfValue(formData, 'return_frequency', values.returnFrequency)
  appendIfValue(
    formData,
    'investment_duration_months',
    values.investmentDurationMonths,
  )

  const virtualTourFiles = getFileList(values.virtualTour)
  if (virtualTourFiles[0]) {
    formData.append('virtual_tour', virtualTourFiles[0])
  }

  const propertyImages = getFileList(values.propertyImages)
  if (propertyImages[0]) {
    formData.append('cover_image', propertyImages[0])
  }

  if (mode === 'publish' && propertyImages.length > 1) {
    propertyImages.slice(1).forEach((imageFile) => {
      formData.append('images[]', imageFile)
    })
  }

  return formData
}
