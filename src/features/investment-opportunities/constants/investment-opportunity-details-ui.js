import { investmentOpportunities } from '@/features/investment-opportunities/constants/investment-opportunities-ui'

const reviewGallery1 = '/assets/investment-opportunities/review-gallery-1.png'
const reviewGallery2 = '/assets/investment-opportunities/review-gallery-2.png'
const reviewGallery3 = '/assets/investment-opportunities/review-gallery-3.png'
const reviewGallery4 = '/assets/investment-opportunities/review-gallery-4.png'
const reviewGallery5 = '/assets/investment-opportunities/review-gallery-5.png'
const reviewChevronIcon =
  '/assets/investment-opportunities/review-icon-chevron-up.svg'
const reviewEditIcon = '/assets/investment-opportunities/review-icon-edit.svg'
const reviewMapPinIcon =
  '/assets/investment-opportunities/review-icon-map-pin.svg'
const reviewTrashIcon = '/assets/investment-opportunities/review-icon-trash.svg'
const reviewOperatorLogo =
  '/assets/investment-opportunities/review-operator-logo.png'

export const investmentOpportunityDetailsAssets = {
  chevron: reviewChevronIcon,
  edit: reviewEditIcon,
  mapPin: reviewMapPinIcon,
  operatorLogo: reviewOperatorLogo,
  trash: reviewTrashIcon,
}

export const investmentOpportunityDefaultDetails = {
  id: 'investment-riyadh-001',
  title: 'Modern Residential Complex in North Riyadh',
  titleAr: 'مجمع سكني حديث في شمال الرياض',
  titleEn: 'Modern Residential Complex in North Riyadh',
  propertyType: 'عقار سكني',
  floors: '3 ادوار',
  totalArea: '185.75 م² مساحة اجمالية',
  buildYear: '2021',
  location: 'حي الياسمين، شمال الرياض',
  locationDisplay: 'حي الياسمين، شمال الرياض',
  metrics: [
    { label: 'العائد الصافي المتوقع', value: '275000' },
    { label: 'العائد المتوقع', value: '11' },
    { label: 'عدد الحصص', value: '5000' },
    { label: 'سعر الحصة', value: '500' },
    { label: 'سعر العقار', value: '2500000', currency: true },
  ],
  gallery: [
    {
      src: reviewGallery1,
      alt: 'واجهة المجمع السكني الحديث في شمال الرياض',
      tileClassName: 'h-[164px]',
    },
    {
      src: reviewGallery2,
      alt: 'مساحة معيشة داخل المجمع السكني',
      tileClassName: 'h-[164px]',
    },
    {
      src: reviewGallery3,
      alt: 'تصميم داخلي لوحدة سكنية في المجمع',
      tileClassName: 'h-[148px]',
    },
    {
      src: reviewGallery4,
      alt: 'ردهة داخل المجمع السكني',
      tileClassName: 'h-[148px]',
    },
    {
      src: reviewGallery5,
      alt: 'إطلالة خارجية للمجمع السكني',
      tileClassName: 'h-[148px]',
    },
  ],
  investmentSettings: [
    { label: 'تاريخ بداية الاستثمار', value: '2026-05-01' },
    { label: 'جدولة بداية الاستثمار', value: 'نعم' },
  ],
  operator: {
    nameAr: 'شركة الأفق العقارية',
    nameEn: 'Al Ofoq Real Estate',
    description:
      'A real estate developer focused on modern residential projects with high quality standards and a seamless living experience.',
    descriptionAr:
      'شركة تطوير عقاري متخصصة في المشاريع السكنية الحديثة مع التركيز على الجودة وتجربة الساكن.',
    descriptionEn:
      'A real estate developer focused on modern residential projects with high quality standards and a seamless living experience.',
    email: 'info@alofoq.sa',
    phone: '+966 55 555 5555',
    location: 'الرياض، المملكة العربية السعودية',
    logoAlt: 'شعار شركة الأفق العقارية',
    logoUrl: reviewOperatorLogo,
  },
}

export const investmentOpportunityGalleryTileClassNames = [
  'h-[164px]',
  'h-[164px]',
  'h-[148px]',
  'h-[148px]',
  'h-[148px]',
]

export const investmentOpportunityDetailsById = Object.fromEntries(
  investmentOpportunities.map((opportunity) => [
    opportunity.id,
    {
      ...investmentOpportunityDefaultDetails,
      id: opportunity.id,
      listCode: opportunity.code,
    },
  ]),
)

export function getInvestmentOpportunityDetails(opportunityId) {
  return (
    investmentOpportunityDetailsById[opportunityId] ?? {
      ...investmentOpportunityDefaultDetails,
      id: opportunityId ?? investmentOpportunityDefaultDetails.id,
    }
  )
}

function hasValue(value) {
  if (value === null || value === undefined) {
    return false
  }

  return String(value).trim().length > 0
}

function createEmptyOpportunityDetails(opportunityId) {
  return {
    ...investmentOpportunityDefaultDetails,
    id: opportunityId ?? '',
    title: '',
    titleAr: '',
    titleEn: '',
    propertyType: '',
    floors: '',
    totalArea: '',
    buildYear: '',
    location: '',
    locationDisplay: '',
    metrics: investmentOpportunityDefaultDetails.metrics.map((metric) => ({
      ...metric,
      value: '',
    })),
    gallery: [],
    investmentSettings:
      investmentOpportunityDefaultDetails.investmentSettings.map((setting) => ({
        ...setting,
        value: '',
      })),
    operator: {
      ...investmentOpportunityDefaultDetails.operator,
      nameAr: '',
      nameEn: '',
      description: '',
      descriptionAr: '',
      descriptionEn: '',
      email: '',
      phone: '',
      location: '',
      logoUrl: '',
    },
  }
}

function extractOpportunityGallerySources(opportunity) {
  const galleryFromList = Array.isArray(opportunity?.gallery)
    ? opportunity.gallery
        .map((item) => {
          if (typeof item === 'string') {
            return item
          }

          if (!item || typeof item !== 'object') {
            return ''
          }

          return item.url || item.file_url || item.path || ''
        })
        .filter(Boolean)
    : []

  const galleryFromFiles = Array.isArray(opportunity?.files)
    ? opportunity.files
        .filter((file) => {
          if (!file?.url) {
            return false
          }

          if (file.file_category === 'image') {
            return true
          }

          return (
            typeof file.mime_type === 'string' &&
            file.mime_type.startsWith('image/')
          )
        })
        .map((file) => file.url)
    : []

  return [opportunity?.cover_image_url, ...galleryFromList, ...galleryFromFiles]
    .filter(Boolean)
    .map((src) => String(src))
}

function asNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(asNumber(value))
}

function formatIsoDate(value, fallbackValue) {
  if (!value) {
    return fallbackValue
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return fallbackValue
  }

  return date.toISOString().slice(0, 10)
}

function mapAssetType(
  assetType,
  fallbackAssetType = investmentOpportunityDefaultDetails.propertyType,
) {
  const mapping = {
    residential: 'عقار سكني',
    commercial: 'عقار تجاري',
    office: 'عقار مكتبي',
    land: 'أرض',
  }

  return mapping[assetType] ?? assetType ?? fallbackAssetType
}

/**
 * @param {import('@/features/investment-opportunities/services/investment-opportunity-service').OpportunityItem | null} opportunity
 * @param {{ opportunityId?: string | null, language?: string, useStaticFallback?: boolean }} options
 */
export function mapOpportunityApiToDetails(
  opportunity,
  { opportunityId, language = 'ar', useStaticFallback = true } = {},
) {
  const fallbackDetails = useStaticFallback
    ? {
        ...investmentOpportunityDefaultDetails,
        id: opportunityId ?? investmentOpportunityDefaultDetails.id,
      }
    : createEmptyOpportunityDetails(opportunityId)

  if (!opportunity) {
    return fallbackDetails
  }

  const hasPropertyPrice = hasValue(opportunity.property_price)
  const hasExpectedAnnualReturnPct = hasValue(
    opportunity.expected_annual_return_pct,
  )
  const propertyPrice = asNumber(opportunity.property_price)
  const expectedAnnualReturnPct = asNumber(opportunity.expected_annual_return_pct)
  const expectedNetReturn =
    hasPropertyPrice && hasExpectedAnnualReturnPct
      ? (propertyPrice * expectedAnnualReturnPct) / 100
      : null

  const gallerySources = Array.from(
    new Set(extractOpportunityGallerySources(opportunity)),
  )
  const gallery = gallerySources
    .slice(0, investmentOpportunityGalleryTileClassNames.length)
    .map((src, index) => ({
      src,
      alt:
        fallbackDetails.gallery[index]?.alt ||
        investmentOpportunityDefaultDetails.gallery[index]?.alt ||
        '',
      tileClassName: investmentOpportunityGalleryTileClassNames[index],
    }))

  const cityName =
    language === 'en'
      ? opportunity.city?.name_en || opportunity.city?.name_ar
      : opportunity.city?.name_ar || opportunity.city?.name_en

  const titleAr =
    opportunity.title_ar || opportunity.title || fallbackDetails.titleAr
  const titleEn =
    opportunity.title_en || opportunity.title || fallbackDetails.titleEn
  const title =
    language === 'en'
      ? titleEn || titleAr || fallbackDetails.title
      : titleAr || titleEn || fallbackDetails.title
  const location =
    opportunity.location_text ||
    [opportunity.neighborhood, cityName].filter(Boolean).join('، ') ||
    fallbackDetails.location

  const floorsUnitLabel = investmentOpportunityDefaultDetails.floors
    .replace(/[\d.,]+/g, '')
    .trim()
  const totalAreaUnitLabel = investmentOpportunityDefaultDetails.totalArea
    .replace(/^[\d.,]+\s*/, '')
    .trim()
  const hasFloors = hasValue(opportunity.floors)
  const hasArea = hasValue(opportunity.area_m2)

  return {
    ...fallbackDetails,
    id: opportunity.id || opportunityId || fallbackDetails.id,
    title,
    titleAr,
    titleEn,
    propertyType: mapAssetType(opportunity.asset_type, fallbackDetails.propertyType),
    floors: hasFloors
      ? `${formatNumber(opportunity.floors, 0)} ${floorsUnitLabel}`.trim()
      : fallbackDetails.floors,
    totalArea: hasArea
      ? `${formatNumber(opportunity.area_m2, 2)} ${totalAreaUnitLabel}`.trim()
      : fallbackDetails.totalArea,
    buildYear: hasValue(opportunity.build_year)
      ? String(opportunity.build_year)
      : fallbackDetails.buildYear,
    location,
    locationDisplay: location,
    metrics: [
      {
        label: 'العائد الصافي المتوقع',
        value:
          expectedNetReturn === null
            ? fallbackDetails.metrics[0].value
            : formatNumber(expectedNetReturn, 0),
      },
      {
        label: 'العائد المتوقع',
        value: hasExpectedAnnualReturnPct
          ? formatNumber(expectedAnnualReturnPct, 2)
          : fallbackDetails.metrics[1].value,
      },
      {
        label: 'عدد الحصص',
        value: hasValue(opportunity.total_shares)
          ? formatNumber(opportunity.total_shares, 0)
          : fallbackDetails.metrics[2].value,
      },
      {
        label: 'سعر الحصة',
        value: hasValue(opportunity.share_price)
          ? formatNumber(opportunity.share_price, 0)
          : fallbackDetails.metrics[3].value,
      },
      {
        label: 'سعر العقار',
        value: hasPropertyPrice
          ? formatNumber(opportunity.property_price, 0)
          : fallbackDetails.metrics[4].value,
        currency: true,
      },
    ],
    gallery,
    investmentSettings: [
      {
        label: 'تاريخ بداية الاستثمار',
        value: formatIsoDate(
          opportunity.investment_start_at,
          fallbackDetails.investmentSettings[0].value,
        ),
      },
      {
        label: 'جدولة بداية الاستثمار',
        value:
          typeof opportunity.schedule_investment_start === 'boolean'
            ? opportunity.schedule_investment_start
              ? 'نعم'
              : 'لا'
            : fallbackDetails.investmentSettings[1].value,
      },
    ],
    operator: {
      ...fallbackDetails.operator,
      nameAr:
        opportunity.operator_name_ar ||
        opportunity.operator_name ||
        fallbackDetails.operator.nameAr,
      nameEn:
        opportunity.operator_name_en ||
        opportunity.operator_name ||
        fallbackDetails.operator.nameEn,
      description:
        opportunity.operator_description ||
        opportunity.description ||
        fallbackDetails.operator.description,
      descriptionAr:
        opportunity.operator_description_ar ||
        opportunity.operator_description ||
        opportunity.description_ar ||
        opportunity.description ||
        fallbackDetails.operator.descriptionAr,
      descriptionEn:
        opportunity.operator_description_en ||
        opportunity.operator_description ||
        opportunity.description_en ||
        opportunity.description ||
        fallbackDetails.operator.descriptionEn,
      email: opportunity.operator_email || fallbackDetails.operator.email,
      phone: opportunity.operator_phone || fallbackDetails.operator.phone,
      location:
        opportunity.operator_location_text ||
        fallbackDetails.operator.location,
      logoUrl: opportunity.operator_logo_url || fallbackDetails.operator.logoUrl,
    },
  }
}

const distributionNames = [
  'عبد العزيز أحمد سالم الهاشمي',
  'ليلى حسن علي الغامدي',
  'ريم عبد الرحمن سعود البلوي',
  'منى فيصل حمد السبيعي',
  'عبير سعد مبارك الدوسري',
  'نورة خالد فهد الرويلي',
  'فهد عبد الله مبارك العتيبي',
  'محمد إبراهيم حسن العسيري',
  'سالم علي محمد الناصر',
  'هند طلال عبد العزيز العتيبي',
]

const distributionInvestorNames = [
  'محمد عبد الله العتيبي',
  'ليلى حسن علي الغامدي',
  'ريم عبد الرحمن سعود البلوي',
  'منى فيصل حمد السبيعي',
  'عبير سعد مبارك الدوسري',
  'نورة خالد فهد الرويلي',
  'فهد عبد الله مبارك العتيبي',
  'محمد إبراهيم حسن العسيري',
  'سالم علي محمد الناصر',
  'هند طلال عبد العزيز العتيبي',
]

export const investmentOpportunityDistributionDetailDefaults = {
  title: 'تفاصيل التوزيع',
  description:
    'جميع تفاصيل التوزيع التي تُمكّنك من مراجعة صافي الربح، تاريخ التوزيع، منفّذ العملية، وقائمة المستثمرين مع أرباحهم المستحقة في مكان واحد لسهولة المتابعة والرقابة.',
  netProfit: '125,430.75',
  executionDate: '2026-04-15',
  shareCount: '1,200',
  executorSectionTitle: 'بيانات المنفّذ',
  executor: {
    nameAr: 'أحمد خالد السبيعي',
    nameEn: 'Abdulaziz Ahmed Salem Al-Hashimi',
    userId: 'U-2048',
  },
  investorsTitle: 'قائمة المستثمرين في هذا التوزيع',
  investorsCountLabel: '10 مستثمر',
  investors: distributionInvestorNames.map((fullName, index) => ({
    id: `distribution-investor-${index + 1}`,
    fullName,
    nationalId: index === 0 ? '1023456789' : '5,540,000',
    mobile: '966500123456',
    shares: '1,200',
    profitAmount: '45,800.25',
  })),
}

export const investmentOpportunityDistributionSummary = {
  title: 'جميع توزيعات الارباح',
  countLabel: '243 مجموع التوزيعات',
  addLabel: 'اضافة توزيعات',
}

export const investmentOpportunityDistributionRows = distributionNames.map(
  (fullName, index) => ({
    id: `distribution-${index + 1}`,
    fullName,
    userId: 'AQIN001',
    executionDate: '22/1/2026',
    netProfit: '5,540,000',
    details: investmentOpportunityDistributionDetailDefaults,
  }),
)


