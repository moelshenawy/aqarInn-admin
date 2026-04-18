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
  return {
    ...INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES,
    titleAr: details.titleAr ?? '',
    titleEn: details.titleEn ?? '',
    propertyType: getPropertyTypeValue(details.propertyType),
    propertyArea: details.totalArea?.match(/[\d.]+/)?.[0] ?? '',
    floorCount: details.floors?.match(/\d+/)?.[0] ?? details.floors ?? '',
    buildYear: details.buildYear ?? '',
    propertyLocation: details.location ?? '',
    developerNameAr: details.operator.nameAr ?? '',
    developerNameEn: details.operator.nameEn ?? '',
    developerDescriptionAr: details.operator.descriptionAr ?? '',
    developerDescriptionEn: details.operator.descriptionEn ?? '',
    developerEmail: details.operator.email ?? '',
    developerPhone: details.operator.phone?.replace('+966', '').trim() ?? '',
    developerLocation: details.operator.location ?? '',
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
