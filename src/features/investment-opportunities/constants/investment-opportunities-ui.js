import { Megaphone } from 'lucide-react'

import opportunityOne from '/assets/dashboard/opportunity-1.png'
import opportunityTwo from '/assets/dashboard/opportunity-2.png'
import opportunityThree from '/assets/dashboard/opportunity-3.png'
import opportunityFour from '/assets/dashboard/opportunity-4.png'
import opportunityFive from '/assets/dashboard/opportunity-5.png'
import sharesDot from '/assets/dashboard/shares-dot.svg'

export const investmentPageSize = 9
export const investmentLoadingDelayMs = 450

export const investmentActions = {
  addOpportunityLabel: 'إضافة فرصة استثمارية',
  nextLabel: 'التالي',
  previousLabel: 'السابق',
}

const investmentImagePool = [
  opportunityOne,
  opportunityTwo,
  opportunityThree,
  opportunityFour,
  opportunityFive,
]

const investmentCityProfiles = [
  { key: 'riyadh', label: 'الرياض', code: 'RYD', count: 22 },
  { key: 'jeddah', label: 'جدة', code: 'JED', count: 18 },
  { key: 'makkah', label: 'مكة المكرمة', code: 'MKK', count: 15 },
  { key: 'madinah', label: 'المدينة', code: 'MAD', count: 11 },
  { key: 'hail', label: 'حائل', code: 'HAL', count: 10 },
  { key: 'dammam', label: 'الدمام', code: 'DMM', count: 12 },
  { key: 'khobar', label: 'الخبر', code: 'KBR', count: 8 },
]

function createInvestmentOpportunities() {
  let sequence = 1

  return investmentCityProfiles.flatMap((city, cityIndex) =>
    Array.from({ length: city.count }, (_, itemIndex) => {
      const codeIndex = String(sequence).padStart(3, '0')
      const progress = 62 + ((cityIndex * 7 + itemIndex * 3) % 36)
      const shares = 1400 + ((cityIndex * 110 + itemIndex * 65) % 1250)
      const priceBase = 1182500 + cityIndex * 42000 + itemIndex * 9500

      sequence += 1

      return {
        id: `investment-${city.key}-${codeIndex}`,
        code: `RES-${city.code}-${codeIndex}`,
        title: 'شقة 2 غرفة نوم في حي الربيع',
        soldShares: `${shares} حصة مباعة`,
        price: new Intl.NumberFormat('en-US').format(priceBase),
        status: 'منشورة',
        progress,
        city: city.label,
        image:
          investmentImagePool[
            (cityIndex + itemIndex) % investmentImagePool.length
          ],
        sharesDot,
        accentIcon: Megaphone,
      }
    }),
  )
}

export const investmentOpportunities = createInvestmentOpportunities()

export const investmentLocationFilters = [
  { key: 'all', label: 'الكل', count: investmentOpportunities.length },
  ...investmentCityProfiles.map((city) => ({
    key: city.key,
    label: city.label,
    count: investmentOpportunities.filter((item) => item.city === city.label)
      .length,
  })),
]
