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
  if (propertyType?.includes('تجاري')) {
    return 'commercial'
  }

  if (propertyType) {
    return 'residential'
  }

  return ''
}

export function createInvestmentOpportunityFormValues(details) {
  const resolvedTitle = details.title ?? details.titleAr ?? details.titleEn ?? ''
  const resolvedDescription =
    details.operator.description ??
    details.operator.descriptionAr ??
    details.operator.descriptionEn ??
    ''

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
    developerNameAr: details.operator.nameAr ?? '',
    developerNameEn: details.operator.nameEn ?? '',
    developerDescriptionAr: details.operator.descriptionAr ?? resolvedDescription,
    developerDescriptionEn: details.operator.descriptionEn ?? resolvedDescription,
    developerEmail: details.operator.email ?? '',
    developerPhone: details.operator.phone?.replace('+966', '').trim() ?? '',
    developerLocation: details.operator.location ?? '',
    currency:
      details.currency ?? INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES.currency,
    propertyPrice: getMetricValue(details, 'سعر العقار'),
    shareCount: getMetricValue(details, 'عدد الحصص'),
    sharePrice: getMetricValue(details, 'سعر الحصة'),
    expectedNetReturn: getMetricValue(details, 'العائد الصافي المتوقع'),
    expectedReturn: getMetricValue(details, 'العائد المتوقع'),
    returnFrequency: 'monthly',
    scheduleInvestmentStart:
      getInvestmentSettingValue(details, 'جدولة بداية الاستثمار') === 'نعم'
        ? 'yes'
        : 'no',
    investmentStartDate: getInvestmentSettingValue(
      details,
      'تاريخ بداية الاستثمار',
    ),
  }
}

