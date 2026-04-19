import { describe, expect, it } from 'vitest'

import { createInvestmentOpportunityPublishSchema } from '@/features/investment-opportunities/schemas/investment-opportunity-form-schema'

const t = (key) => key

function buildValidPublishValues(overrides = {}) {
  return {
    titleAr: 'فرصة',
    titleEn: 'Opportunity',
    cityId: 'city-1',
    neighborhood: 'Al Malqa',
    latitude: '24.7136',
    longitude: '46.6753',
    propertyType: 'residential',
    propertyArea: '3250',
    floorCount: '8',
    buildYear: '2021',
    propertyLocation: 'Santiago del Estero، Al Malqa',
    propertyPrice: '4800000',
    currency: 'SAR',
    shareCount: '1200',
    sharePrice: '4000',
    minInvestmentShares: '1',
    maxSharesPerUser: '120',
    maxUserOwnershipPct: '10',
    expectedNetReturn: '451200',
    expectedReturn: '9.4',
    returnFrequency: 'quarterly',
    investmentDurationMonths: '24',
    scheduleInvestmentStart: 'no',
    investmentStartDate: '',
    developerEmail: 'assets@najdcapital.test',
    developerNameAr: 'نجد',
    developerNameEn: 'Najd',
    developerDescriptionAr: '',
    developerDescriptionEn: '',
    developerPhone: '550000101',
    propertyImages: [new File(['image'], 'cover.heic', { type: 'image/heic' })],
    propertyDocuments: [
      new File(['doc'], 'brochure.PDF', { type: 'application/x-pdf' }),
    ],
    virtualTour: [new File(['tour'], 'tour.heif', { type: 'image/heif' })],
    ...overrides,
  }
}

describe('createInvestmentOpportunityPublishSchema', () => {
  it('accepts common mobile image/document mime variants', () => {
    const schema = createInvestmentOpportunityPublishSchema(t)
    const result = schema.safeParse(buildValidPublishValues())

    expect(result.success).toBe(true)
  })

  it('accepts files using extension fallback when mime type is empty', () => {
    const schema = createInvestmentOpportunityPublishSchema(t)
    const result = schema.safeParse(
      buildValidPublishValues({
        propertyImages: [new File(['img'], 'mobile-capture.JPG', { type: '' })],
        propertyDocuments: [new File(['doc'], 'ownership.jpeg', { type: '' })],
      }),
    )

    expect(result.success).toBe(true)
  })

  it('rejects unsupported upload types', () => {
    const schema = createInvestmentOpportunityPublishSchema(t)
    const result = schema.safeParse(
      buildValidPublishValues({
        propertyImages: [new File(['bad'], 'archive.zip', { type: 'application/zip' })],
      }),
    )

    expect(result.success).toBe(false)
  })

  it('accepts mobile numbers with country prefix and Arabic digits', () => {
    const schema = createInvestmentOpportunityPublishSchema(t)
    const result = schema.safeParse(
      buildValidPublishValues({
        developerPhone: '+966 ٥٥٠٠٠٠١٠١',
      }),
    )

    expect(result.success).toBe(true)
  })
})
