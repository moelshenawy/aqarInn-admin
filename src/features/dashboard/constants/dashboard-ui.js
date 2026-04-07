import {
  Banknote,
  Bell,
  CreditCard,
  Grid2x2,
  HandCoins,
  LayoutDashboard,
  Megaphone,
  RefreshCw,
  Search,
  Settings2,
  SlidersHorizontal,
  User,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react'

import avatarImage from '@/assets/dashboard/avatar-omar.png'
import logoMark from '@/assets/dashboard/logo-mark.svg'
import logoTypo from '@/assets/dashboard/logo-typo.svg'
import opportunityOne from '@/assets/dashboard/opportunity-1.png'
import opportunityTwo from '@/assets/dashboard/opportunity-2.png'
import opportunityThree from '@/assets/dashboard/opportunity-3.png'
import opportunityFour from '@/assets/dashboard/opportunity-4.png'
import opportunityFive from '@/assets/dashboard/opportunity-5.png'
import sharesDot from '@/assets/dashboard/shares-dot.svg'
import { ROUTE_PATHS } from '@/app/router/route-paths'

export const dashboardBrand = {
  mark: logoMark,
  typo: logoTypo,
}

export const dashboardTopbarUser = {
  name: 'عمر مجدي',
  role: 'مدير النظام',
  avatar: avatarImage,
}

export const dashboardRouteTitles = {
  dashboard: 'لوحة المعلومات',
  'investment-opportunities': 'الفرص الاستثمارية',
  'investment-opportunity-add': 'الفرص الاستثمارية',
  'investment-opportunity-details': 'الفرص الاستثمارية',
  'investment-opportunity-profit-distributions': 'الفرص الاستثمارية',
  users: 'ادارة المستخدمين',
}

export const dashboardActions = {
  topbar: {
    notificationLabel: 'الإشعارات',
    searchLabel: 'البحث',
    settingsLabel: 'الإعدادات',
  },
  refreshLabel: 'تحديث',
}

export const dashboardNavItems = [
  {
    key: 'dashboard',
    label: 'لوحة المعلومات',
    path: ROUTE_PATHS.dashboard,
    icon: LayoutDashboard,
  },
  {
    key: 'investment-opportunities',
    label: 'الفرص الاستثمارية',
    path: ROUTE_PATHS.investmentOpportunities,
    icon: Grid2x2,
  },
  {
    key: 'users',
    label: 'ادارة المستخدمين',
    path: ROUTE_PATHS.users,
    icon: Users,
  },
]

export const dashboardSettingsItem = {
  label: 'الاعدادات',
  icon: Settings2,
  disabled: true,
}

export const dashboardMetrics = [
  {
    key: 'invested-total',
    label: 'إجمالي المبلغ المستثمر',
    value: '106,444,039',
    icon: Wallet,
    isCurrency: true,
  },
  {
    key: 'verified-users',
    label: 'المستخدمين الموثقين',
    value: '1,548',
    icon: UserCheck,
  },
  {
    key: 'users-count',
    label: 'عدد المستخدمين',
    value: '2,404',
    icon: User,
  },
  {
    key: 'paid-withdrawals',
    label: 'إجمالي السحوبات المدفوعة',
    value: '504,039',
    icon: Wallet,
    isCurrency: true,
  },
  {
    key: 'withdrawal-requests',
    label: 'إجمالي طلبات السحب',
    value: '10,548',
    icon: CreditCard,
  },
  {
    key: 'distributed-returns',
    label: 'إجمالي العوائد الموزعة',
    value: '1,444,039',
    icon: Banknote,
    isCurrency: true,
  },
]

export const investmentStatusRows = [
  { key: 'draft', label: 'مسودة', count: 23, progress: 45 },
  { key: 'published', label: 'منشور', count: 58, progress: 88 },
  { key: 'funded', label: 'ممّول', count: 34, progress: 60 },
  { key: 'closed', label: 'مغلق', count: 17, progress: 38 },
  { key: 'cancelled', label: 'ملغي', count: 5, progress: 18 },
]

export const topOpportunities = [
  {
    key: 'opp-1',
    code: 'RES-RUH-001',
    title: 'شقة 2 غرفة نوم في حي الربيع',
    soldShares: '2495 حصة مباعة',
    price: '1,282,500',
    status: 'منشورة',
    progress: 87,
    image: opportunityOne,
    sharesDot,
    accentIcon: Megaphone,
  },
  {
    key: 'opp-2',
    code: 'RES-RUH-001',
    title: 'شقة 2 غرفة نوم في حي الربيع',
    soldShares: '2495 حصة مباعة',
    price: '1,282,500',
    status: 'منشورة',
    progress: 87,
    image: opportunityTwo,
    sharesDot,
    accentIcon: Megaphone,
  },
  {
    key: 'opp-3',
    code: 'RES-RUH-001',
    title: 'شقة 2 غرفة نوم في حي الربيع',
    soldShares: '2495 حصة مباعة',
    price: '1,282,500',
    status: 'منشورة',
    progress: 87,
    image: opportunityThree,
    sharesDot,
    accentIcon: Megaphone,
  },
  {
    key: 'opp-4',
    code: 'RES-RUH-001',
    title: 'شقة 2 غرفة نوم في حي الربيع',
    soldShares: '2495 حصة مباعة',
    price: '1,282,500',
    status: 'منشورة',
    progress: 87,
    image: opportunityFour,
    sharesDot,
    accentIcon: Megaphone,
  },
  {
    key: 'opp-5',
    code: 'RES-RUH-001',
    title: 'شقة 2 غرفة نوم في حي الربيع',
    soldShares: '2495 حصة مباعة',
    price: '1,282,500',
    status: 'منشورة',
    progress: 87,
    image: opportunityFive,
    sharesDot,
    accentIcon: Megaphone,
  },
]

export const transactionOverview = [
  {
    key: 'distributions',
    label: 'التوزيعات',
    value: '89,000',
    icon: Banknote,
    isCurrency: true,
  },
  {
    key: 'withdrawals',
    label: 'طلبات السحب',
    value: '480,000',
    icon: HandCoins,
    isCurrency: true,
  },
  {
    key: 'investments',
    label: 'الاستثمارات',
    value: '285,000',
    icon: Wallet,
    isCurrency: true,
  },
]

export const dashboardSectionIcons = {
  notification: Bell,
  chevron: SlidersHorizontal,
  search: Search,
  refresh: RefreshCw,
}
