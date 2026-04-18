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
    descriptionAr:
      'شركة تطوير عقاري متخصصة في المشاريع السكنية الحديثة مع التركيز على الجودة وتجربة الساكن.',
    descriptionEn:
      'A real estate developer focused on modern residential projects with high quality standards and a seamless living experience.',
    email: 'info@alofoq.sa',
    phone: '+966 55 555 5555',
    location: 'الرياض، المملكة العربية السعودية',
    logoAlt: 'شعار شركة الأفق العقارية',
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

function mapAssetType(assetType) {
  const mapping = {
    residential: 'عقار سكني',
    commercial: 'عقار تجاري',
    office: 'عقار مكتبي',
    land: 'أرض',
  }

  return mapping[assetType] ?? assetType ?? investmentOpportunityDefaultDetails.propertyType
}

/**
 * @param {import('@/features/investment-opportunities/services/investment-opportunity-service').OpportunityItem | null} opportunity
 * @param {{ opportunityId?: string | null, language?: string }} options
 */
export function mapOpportunityApiToDetails(
  opportunity,
  { opportunityId, language = 'ar' } = {},
) {
  if (!opportunity) {
    return {
      ...investmentOpportunityDefaultDetails,
      id: opportunityId ?? investmentOpportunityDefaultDetails.id,
    }
  }

  const propertyPrice = asNumber(opportunity.property_price)
  const expectedAnnualReturnPct = asNumber(opportunity.expected_annual_return_pct)
  const expectedNetReturn = (propertyPrice * expectedAnnualReturnPct) / 100

  const apiGallery = Array.isArray(opportunity.gallery) ? opportunity.gallery : []
  const gallerySources = [opportunity.cover_image_url, ...apiGallery].filter(Boolean)
  const gallery = gallerySources
    .slice(0, investmentOpportunityGalleryTileClassNames.length)
    .map((src, index) => ({
      src,
      alt: investmentOpportunityDefaultDetails.gallery[index]?.alt ?? '',
      tileClassName: investmentOpportunityGalleryTileClassNames[index],
    }))

  const cityName =
    language === 'en'
      ? opportunity.city?.name_en || opportunity.city?.name_ar
      : opportunity.city?.name_ar || opportunity.city?.name_en

  return {
    ...investmentOpportunityDefaultDetails,
    id: opportunity.id || opportunityId || investmentOpportunityDefaultDetails.id,
    titleAr: opportunity.title_ar || investmentOpportunityDefaultDetails.titleAr,
    titleEn: opportunity.title_en || investmentOpportunityDefaultDetails.titleEn,
    propertyType: mapAssetType(opportunity.asset_type),
    floors: `${opportunity.floors ?? 0} ادوار`,
    totalArea: `${formatNumber(opportunity.area_m2, 2)} م² مساحة اجمالية`,
    buildYear:
      String(opportunity.build_year ?? '') ||
      investmentOpportunityDefaultDetails.buildYear,
    location:
      opportunity.location_text ||
      [opportunity.neighborhood, cityName].filter(Boolean).join('، ') ||
      investmentOpportunityDefaultDetails.location,
    metrics: [
      {
        label: 'العائد الصافي المتوقع',
        value: formatNumber(expectedNetReturn, 0),
      },
      {
        label: 'العائد المتوقع',
        value: formatNumber(expectedAnnualReturnPct, 2),
      },
      {
        label: 'عدد الحصص',
        value: formatNumber(opportunity.total_shares, 0),
      },
      {
        label: 'سعر الحصة',
        value: formatNumber(opportunity.share_price, 0),
      },
      {
        label: 'سعر العقار',
        value: formatNumber(opportunity.property_price, 0),
        currency: true,
      },
    ],
    gallery,
    investmentSettings: [
      {
        label: 'تاريخ بداية الاستثمار',
        value: formatIsoDate(
          opportunity.investment_start_at,
          investmentOpportunityDefaultDetails.investmentSettings[0].value,
        ),
      },
      {
        label: 'جدولة بداية الاستثمار',
        value: opportunity.schedule_investment_start ? 'نعم' : 'لا',
      },
    ],
    operator: {
      ...investmentOpportunityDefaultDetails.operator,
      nameAr:
        opportunity.operator_name_ar || investmentOpportunityDefaultDetails.operator.nameAr,
      nameEn:
        opportunity.operator_name_en || investmentOpportunityDefaultDetails.operator.nameEn,
      descriptionAr:
        opportunity.operator_description_ar ||
        investmentOpportunityDefaultDetails.operator.descriptionAr,
      descriptionEn:
        opportunity.operator_description_en ||
        investmentOpportunityDefaultDetails.operator.descriptionEn,
      email:
        opportunity.operator_email || investmentOpportunityDefaultDetails.operator.email,
      phone:
        opportunity.operator_phone || investmentOpportunityDefaultDetails.operator.phone,
      location:
        opportunity.operator_location_text ||
        investmentOpportunityDefaultDetails.operator.location,
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


