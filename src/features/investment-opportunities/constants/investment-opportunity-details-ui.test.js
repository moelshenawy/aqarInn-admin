import { describe, expect, it } from 'vitest'

import {
  investmentOpportunityDefaultDetails,
  mapOpportunityApiToDetails,
} from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'

describe('mapOpportunityApiToDetails', () => {
  it('returns an empty structured payload when API data is missing and static fallback is disabled', () => {
    const details = mapOpportunityApiToDetails(null, {
      opportunityId: 'missing-opportunity-id',
      useStaticFallback: false,
    })

    expect(details.id).toBe('missing-opportunity-id')
    expect(details.title).toBe('')
    expect(details.location).toBe('')
    expect(details.gallery).toEqual([])
    expect(details.operator.nameAr).toBe('')
    expect(details.operator.logoUrl).toBe('')
    expect(details.metrics.every((metric) => metric.value === '')).toBe(true)
    expect(
      details.investmentSettings.every((setting) => setting.value === ''),
    ).toBe(true)
  })

  it('maps localized titles and image sources from details API payload', () => {
    const details = mapOpportunityApiToDetails(
      {
        id: 'opportunity-1',
        title: 'Generic title',
        title_ar: 'Opportunity AR',
        title_en: 'Opportunity EN',
        asset_type: 'commercial',
        floors: 8,
        area_m2: '3250',
        property_price: '4800000',
        expected_annual_return_pct: '9.4',
        total_shares: 1200,
        share_price: '4000',
        location_text: 'Riyadh, SA',
        cover_image_url: 'https://example.test/cover.jpg',
        files: [
          {
            file_category: 'image',
            url: 'https://example.test/image-1.jpg',
            mime_type: 'image/jpeg',
          },
          {
            file_category: 'document',
            url: 'https://example.test/file.pdf',
            mime_type: 'application/pdf',
          },
          {
            file_category: 'asset',
            url: 'https://example.test/image-2.png',
            mime_type: 'image/png',
          },
        ],
        operator_logo_url: 'https://example.test/logo.png',
      },
      {
        language: 'ar',
        useStaticFallback: false,
      },
    )

    expect(details.title).toBe('Opportunity AR')
    expect(details.titleAr).toBe('Opportunity AR')
    expect(details.titleEn).toBe('Opportunity EN')
    expect(details.gallery.map((image) => image.src)).toEqual([
      'https://example.test/cover.jpg',
      'https://example.test/image-1.jpg',
      'https://example.test/image-2.png',
    ])
    expect(details.operator.logoUrl).toBe('https://example.test/logo.png')
  })

  it('keeps static fallback data when static fallback is enabled', () => {
    const details = mapOpportunityApiToDetails(null, {
      opportunityId: 'unknown-opportunity',
      useStaticFallback: true,
    })

    expect(details.id).toBe('unknown-opportunity')
    expect(details.title).toBe(investmentOpportunityDefaultDetails.title)
    expect(details.operator.nameAr).toBe(
      investmentOpportunityDefaultDetails.operator.nameAr,
    )
  })
})

