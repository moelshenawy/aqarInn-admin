export const INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES = {
  referenceCode: '',
  titleAr: '',
  titleEn: '',
  cityId: '',
  neighborhood: '',
  latitude: '',
  longitude: '',
  propertyType: '',
  propertyArea: '',
  floorCount: '',
  buildYear: '',
  propertyLocation: '',
  propertyDocuments: '',
  propertyImages: '',
  developerNameAr: '',
  developerNameEn: '',
  developerDescriptionAr: '',
  developerDescriptionEn: '',
  developerEmail: '',
  developerLogo: '',
  developerPhone: '',
  developerLocation: '',
  propertyPrice: '',
  currency: 'SAR',
  shareCount: '',
  sharePrice: '',
  minInvestmentShares: '1',
  maxSharesPerUser: '',
  maxUserOwnershipPct: '',
  expectedNetReturn: '',
  expectedReturn: '',
  returnFrequency: '',
  investmentDurationMonths: '',
  virtualTour: '',
  scheduleInvestmentStart: 'yes',
  investmentStartDate: '',
}

function hasValue(value) {
  if (value === null || value === undefined) {
    return false
  }

  return String(value).trim().length > 0
}

function toStringValue(value) {
  return hasValue(value) ? String(value).trim() : ''
}

function toDateInputValue(value) {
  if (!hasValue(value)) {
    return ''
  }

  const normalizedValue = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
    return normalizedValue
  }

  const parsedDate = new Date(normalizedValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return parsedDate.toISOString().slice(0, 10)
}

function normalizePhoneValue(value) {
  const normalized = toStringValue(value)
  if (!normalized) {
    return ''
  }

  if (normalized.startsWith('+966')) {
    return normalized.slice(4).trim()
  }

  return normalized
}

function getMetricValue(details, label) {
  return details.metrics.find((metric) => metric.label === label)?.value ?? ''
}

function getInvestmentSettingValue(details, label) {
  return (
    details.investmentSettings.find((setting) => setting.label === label)
      ?.value ?? ''
  )
}

function getPropertyTypeValue(propertyType) {
  if (propertyType === 'commercial' || propertyType === 'residential') {
    return propertyType
  }

  const normalizedPropertyType = String(propertyType ?? '')
  if (normalizedPropertyType.includes('\u062a\u062c\u0627\u0631\u064a')) {
    return 'commercial'
  }

  if (normalizedPropertyType.trim()) {
    return 'residential'
  }

  return ''
}

function resolveExpectedNetReturnFromOpportunity(opportunity) {
  const explicitValue =
    opportunity?.expected_net_return ?? opportunity?.expectedNetReturn
  if (hasValue(explicitValue)) {
    return toStringValue(explicitValue)
  }

  const propertyPrice = Number(opportunity?.property_price)
  const expectedAnnualReturnPct = Number(opportunity?.expected_annual_return_pct)
  if (!Number.isFinite(propertyPrice) || !Number.isFinite(expectedAnnualReturnPct)) {
    return ''
  }

  return String((propertyPrice * expectedAnnualReturnPct) / 100)
}

function createFormValuesFromOpportunityApi(opportunity) {
  return {
    ...INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES,
    titleAr: toStringValue(
      opportunity.title_ar ??
        opportunity.title ??
        opportunity.titleAr ??
        opportunity.titleEn,
    ),
    titleEn: toStringValue(
      opportunity.title_en ??
        opportunity.title ??
        opportunity.titleEn ??
        opportunity.titleAr,
    ),
    cityId: toStringValue(opportunity.city?.id ?? opportunity.city_id),
    neighborhood: toStringValue(opportunity.neighborhood),
    latitude: toStringValue(opportunity.latitude),
    longitude: toStringValue(opportunity.longitude),
    propertyType: getPropertyTypeValue(
      opportunity.asset_type ?? opportunity.propertyType,
    ),
    propertyArea: toStringValue(opportunity.area_m2),
    floorCount: toStringValue(opportunity.floors),
    buildYear: toStringValue(opportunity.build_year),
    propertyLocation: toStringValue(opportunity.location_text),
    developerNameAr: toStringValue(
      opportunity.operator_name_ar ?? opportunity.operator_name,
    ),
    developerNameEn: toStringValue(
      opportunity.operator_name_en ?? opportunity.operator_name,
    ),
    developerDescriptionAr: toStringValue(
      opportunity.operator_description_ar ??
        opportunity.operator_description ??
        opportunity.description_ar,
    ),
    developerDescriptionEn: toStringValue(
      opportunity.operator_description_en ??
        opportunity.operator_description ??
        opportunity.description_en,
    ),
    developerEmail: toStringValue(opportunity.operator_email),
    developerPhone: normalizePhoneValue(opportunity.operator_phone),
    developerLocation: toStringValue(opportunity.operator_location_text),
    currency:
      toStringValue(opportunity.currency) ||
      INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES.currency,
    propertyPrice: toStringValue(opportunity.property_price),
    shareCount: toStringValue(opportunity.total_shares),
    sharePrice: toStringValue(opportunity.share_price),
    minInvestmentShares: toStringValue(opportunity.min_investment_shares),
    maxSharesPerUser: toStringValue(opportunity.max_shares_per_user),
    maxUserOwnershipPct: toStringValue(opportunity.max_user_ownership_pct),
    expectedNetReturn: resolveExpectedNetReturnFromOpportunity(opportunity),
    expectedReturn: toStringValue(opportunity.expected_annual_return_pct),
    returnFrequency: toStringValue(opportunity.return_frequency),
    investmentDurationMonths: toStringValue(
      opportunity.investment_duration_months,
    ),
    scheduleInvestmentStart: opportunity.schedule_investment_start ? 'yes' : 'no',
    investmentStartDate: toDateInputValue(opportunity.investment_start_at),
  }
}

function createFormValuesFromDetailsUi(details) {
  const operator = details.operator ?? {}
  const resolvedTitle = details.title ?? details.titleAr ?? details.titleEn ?? ''
  const resolvedDescription =
    operator.description ?? operator.descriptionAr ?? operator.descriptionEn ?? ''

  return {
    ...INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES,
    titleAr: details.titleAr ?? resolvedTitle,
    titleEn: details.titleEn ?? resolvedTitle,
    cityId: details.city?.id ?? details.city_id ?? '',
    neighborhood: details.neighborhood ?? '',
    latitude: details.latitude ? String(details.latitude) : '',
    longitude: details.longitude ? String(details.longitude) : '',
    propertyType: getPropertyTypeValue(details.propertyType),
    propertyArea: details.totalArea?.match(/[\d.]+/)?.[0] ?? '',
    floorCount: details.floors?.match(/\d+/)?.[0] ?? details.floors ?? '',
    buildYear: details.buildYear ?? '',
    propertyLocation: details.location_text ?? details.location ?? '',
    developerNameAr: operator.nameAr ?? '',
    developerNameEn: operator.nameEn ?? '',
    developerDescriptionAr: operator.descriptionAr ?? resolvedDescription,
    developerDescriptionEn: operator.descriptionEn ?? resolvedDescription,
    developerEmail: operator.email ?? '',
    developerPhone: operator.phone?.replace('+966', '').trim() ?? '',
    developerLocation: operator.location ?? '',
    currency:
      details.currency ?? INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES.currency,
    propertyPrice: getMetricValue(details, '\u0633\u0639\u0631 \u0627\u0644\u0639\u0642\u0627\u0631'),
    shareCount: getMetricValue(details, '\u0639\u062f\u062f \u0627\u0644\u062d\u0635\u0635'),
    sharePrice: getMetricValue(details, '\u0633\u0639\u0631 \u0627\u0644\u062d\u0635\u0629'),
    expectedNetReturn: getMetricValue(
      details,
      '\u0627\u0644\u0639\u0627\u0626\u062f \u0627\u0644\u0635\u0627\u0641\u064a \u0627\u0644\u0645\u062a\u0648\u0642\u0639',
    ),
    expectedReturn: getMetricValue(
      details,
      '\u0627\u0644\u0639\u0627\u0626\u062f \u0627\u0644\u0645\u062a\u0648\u0642\u0639',
    ),
    returnFrequency: 'monthly',
    scheduleInvestmentStart:
      getInvestmentSettingValue(
        details,
        '\u062c\u062f\u0648\u0644\u0629 \u0628\u062f\u0627\u064a\u0629 \u0627\u0644\u0627\u0633\u062a\u062b\u0645\u0627\u0631',
      ) === '\u0646\u0639\u0645'
        ? 'yes'
        : 'no',
    investmentStartDate: getInvestmentSettingValue(
      details,
      '\u062a\u0627\u0631\u064a\u062e \u0628\u062f\u0627\u064a\u0629 \u0627\u0644\u0627\u0633\u062a\u062b\u0645\u0627\u0631',
    ),
  }
}

export function createInvestmentOpportunityFormValues(details) {
  if (!details) {
    return { ...INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES }
  }

  const hasRawApiShape =
    hasValue(details.title_ar) ||
    hasValue(details.title_en) ||
    hasValue(details.asset_type) ||
    hasValue(details.operator_name_ar) ||
    hasValue(details.operator_name_en)

  if (hasRawApiShape) {
    return createFormValuesFromOpportunityApi(details)
  }

  return createFormValuesFromDetailsUi(details)
}
