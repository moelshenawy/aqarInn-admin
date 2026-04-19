import {
  getFileList,
  normalizeSaudiMobileInput,
  toStringValue,
} from '@/features/investment-opportunities/utils/form-utils'

function appendIfValue(formData, key, value) {
  const nextValue = toStringValue(value)

  if (nextValue) {
    formData.append(key, nextValue)
  }
}

function hasAllowedCityId(cityId, allowedCityIds) {
  const normalizedCityId = toStringValue(cityId)

  if (!normalizedCityId) {
    return false
  }

  if (!allowedCityIds) {
    return true
  }

  return Array.from(allowedCityIds).some(
    (allowedCityId) => toStringValue(allowedCityId) === normalizedCityId,
  )
}

function appendFirstFile(formData, key, files) {
  const [file] = getFileList(files)

  if (file) {
    formData.append(key, file)
  }
}

function appendFiles(formData, key, files) {
  getFileList(files).forEach((file) => {
    formData.append(key, file)
  })
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
 * @param {CreateOpportunityPayloadForm} values
 * @param {{ allowedCityIds?: Iterable<string> | Set<string> }} options
 */
export function buildOpportunityFormData(values, { allowedCityIds } = {}) {
  const formData = new FormData()
  const developerPhone = normalizeSaudiMobileInput(values.developerPhone)
  const propertyImages = getFileList(values.propertyImages)
  const [coverImage, ...galleryImages] = propertyImages
  const [virtualTourFile] = getFileList(values.virtualTour)

  appendIfValue(formData, 'title_ar', values.titleAr)
  appendIfValue(formData, 'title_en', values.titleEn)
  appendIfValue(formData, 'title', values.titleAr || values.titleEn)

  if (hasAllowedCityId(values.cityId, allowedCityIds)) {
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
  appendIfValue(formData, 'operator_phone', developerPhone && `+966${developerPhone}`)
  appendIfValue(formData, 'operator_location_text', values.developerLocation)

  appendFirstFile(formData, 'operator_logo', values.developerLogo)

  if (virtualTourFile) {
    formData.append('virtual_tour', virtualTourFile)
    formData.append('virtual_tour_image', virtualTourFile)
  }

  if (coverImage) {
    formData.append('cover_image', coverImage)
  }

  galleryImages.forEach((imageFile) => {
    formData.append('images[]', imageFile)
  })

  appendFiles(formData, 'documents[]', values.propertyDocuments)

  return formData
}
