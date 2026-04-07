import reviewGallery1 from '@/assets/investment-opportunities/review-gallery-1.png'
import reviewGallery2 from '@/assets/investment-opportunities/review-gallery-2.png'
import reviewGallery3 from '@/assets/investment-opportunities/review-gallery-3.png'
import reviewGallery4 from '@/assets/investment-opportunities/review-gallery-4.png'
import reviewGallery5 from '@/assets/investment-opportunities/review-gallery-5.png'
import reviewChevronIcon from '@/assets/investment-opportunities/review-icon-chevron-up.svg'
import reviewEditIcon from '@/assets/investment-opportunities/review-icon-edit.svg'
import reviewMapPinIcon from '@/assets/investment-opportunities/review-icon-map-pin.svg'
import reviewRiyalIcon from '@/assets/investment-opportunities/review-icon-riyal.svg'
import reviewTrashIcon from '@/assets/investment-opportunities/review-icon-trash.svg'
import reviewOperatorLogo from '@/assets/investment-opportunities/review-operator-logo.png'
import { investmentOpportunities } from '@/features/investment-opportunities/constants/investment-opportunities-ui'

export const investmentOpportunityDetailsAssets = {
  chevron: reviewChevronIcon,
  edit: reviewEditIcon,
  mapPin: reviewMapPinIcon,
  operatorLogo: reviewOperatorLogo,
  riyal: reviewRiyalIcon,
  trash: reviewTrashIcon,
}

export const investmentOpportunityDefaultDetails = {
  id: 'investment-riyadh-001',
  titleAr: 'مجمع سكني حديث في شمال الرياض',
  titleEn: 'Modern Residential Complex in North Riyadh',
  propertyType: 'عقار سكني',
  floors: '3 ادوار',
  totalArea: '185.75 م²  مساحة اجمالية',
  buildYear: '2021',
  location: 'حي الياسمين، شمال الرياض',
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
  }),
)
