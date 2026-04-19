import { describe, expect, it } from 'vitest'

import { buildOpportunityFormData } from '@/features/investment-opportunities/services/build-opportunity-form-data'

function createValues(overrides = {}) {
  return {
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
    propertyPrice: '',
    currency: 'SAR',
    shareCount: '',
    sharePrice: '',
    minInvestmentShares: '',
    maxSharesPerUser: '',
    maxUserOwnershipPct: '',
    expectedNetReturn: '',
    expectedReturn: '',
    returnFrequency: '',
    investmentDurationMonths: '',
    scheduleInvestmentStart: 'yes',
    investmentStartDate: '',
    developerNameAr: '',
    developerNameEn: '',
    developerDescriptionAr: '',
    developerDescriptionEn: '',
    developerEmail: '',
    developerPhone: '',
    developerLocation: '',
    developerLogo: [],
    propertyDocuments: [],
    virtualTour: [],
    propertyImages: [],
    ...overrides,
  }
}

describe('buildOpportunityFormData city_id handling', () => {
  it('includes city_id when it exists in allowed city ids', () => {
    const values = createValues({ cityId: 'city-riyadh' })

    const formData = buildOpportunityFormData(values, {
      mode: 'publish',
      allowedCityIds: new Set(['city-riyadh', 'city-jeddah']),
    })

    expect(formData.get('city_id')).toBe('city-riyadh')
  })

  it('omits city_id when city id value is empty', () => {
    const values = createValues({ cityId: '   ' })

    const formData = buildOpportunityFormData(values, {
      mode: 'publish',
      allowedCityIds: new Set(['city-riyadh']),
    })

    expect(formData.get('city_id')).toBeNull()
  })

  it('omits city_id when city id is not in allowed city ids', () => {
    const values = createValues({ cityId: 'city-outside-api' })

    const formData = buildOpportunityFormData(values, {
      mode: 'publish',
      allowedCityIds: new Set(['city-riyadh']),
    })

    expect(formData.get('city_id')).toBeNull()
  })

  it('keeps add flow behavior when allowed city ids are not provided', () => {
    const values = createValues({ cityId: 'city-any-value' })

    const formData = buildOpportunityFormData(values, {
      mode: 'publish',
    })

    expect(formData.get('city_id')).toBe('city-any-value')
  })

  it('appends title_ar and title_en for API compatibility', () => {
    const values = createValues({
      titleAr: 'فرصة عربية',
      titleEn: 'English Opportunity',
    })

    const formData = buildOpportunityFormData(values, {
      mode: 'draft',
    })

    expect(formData.get('title_ar')).toBe('فرصة عربية')
    expect(formData.get('title_en')).toBe('English Opportunity')
  })

  it('appends additional gallery images in draft mode', () => {
    const values = createValues({
      propertyImages: [
        new File(['cover'], 'cover.jpg', { type: 'image/jpeg' }),
        new File(['gallery-1'], 'gallery-1.jpg', { type: 'image/jpeg' }),
        new File(['gallery-2'], 'gallery-2.jpg', { type: 'image/jpeg' }),
      ],
    })

    const formData = buildOpportunityFormData(values, {
      mode: 'draft',
    })

    expect(formData.get('cover_image')).toBeInstanceOf(File)
    const galleryImages = formData.getAll('images[]')
    expect(galleryImages).toHaveLength(2)
  })

  it('normalizes operator phone with country prefix input', () => {
    const values = createValues({
      developerPhone: '+966 ٥٥٠٠٠٠١٠١',
    })

    const formData = buildOpportunityFormData(values, {
      mode: 'publish',
    })

    expect(formData.get('operator_phone')).toBe('+966550000101')
  })
})
