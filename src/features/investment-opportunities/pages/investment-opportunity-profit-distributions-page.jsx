import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  showDashboardErrorToast,
  showDashboardSuccessToast,
} from '@/components/ui/dashboard-toast'
import { InvestmentOpportunityAddDistributionDialog } from '@/features/investment-opportunities/components/investment-opportunity-add-distribution-dialog'
import { InvestmentOpportunityDetailsTabs } from '@/features/investment-opportunities/components/investment-opportunity-details-tabs'
import { InvestmentOpportunityDistributionDetailsModal } from '@/features/investment-opportunities/components/investment-opportunity-distribution-details-modal'
import { InvestmentOpportunityDistributionsTable } from '@/features/investment-opportunities/components/investment-opportunity-distributions-table'
import { investmentOpportunityDistributionDetailDefaults } from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'
import {
  useCreateProfitDistributionMutation,
  useProfitDistributionDetailsQuery,
  useProfitDistributionsQuery,
} from '@/features/investment-opportunities/hooks/use-profit-distributions-query'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'
import { useDirection } from '@/lib/i18n/direction-provider'
import { useAuthorization } from '@/lib/permissions/use-authorization'

function formatNumber(value, digits = 0) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return digits === 0 ? '0' : '0.00'
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(parsed)
}

function mapDistributionToTableRow(distribution, language) {
  const admin = distribution.distributed_by_admin
  const fullName =
    language === 'en'
      ? admin?.full_name_en || admin?.full_name_ar || '-'
      : admin?.full_name_ar || admin?.full_name_en || '-'

  return {
    id: distribution.id,
    fullName,
    userId: admin?.code || '--',
    executionDate: distribution.distribution_date,
    netProfit: distribution.net_profit_amount,
  }
}

function getProfitDistributionsCopy(language = 'ar') {
  const isEnglish = language === 'en'

  return {
    distributionDetailsTitle: isEnglish ? 'Distribution details' : 'تفاصيل التوزيع',
    distributionDetailsDescription: isEnglish
      ? 'All distribution details to review net profit, distribution date, executor, and the investor list with due profits in one place for easy monitoring.'
      : 'جميع تفاصيل التوزيع التي تُمكّنك من مراجعة صافي الربح، تاريخ التوزيع، منفّذ العملية، وقائمة المستثمرين مع أرباحهم المستحقة في مكان واحد لسهولة المتابعة والرقابة.',
    executorSectionTitle: isEnglish ? 'Executor details' : 'بيانات المنفّذ',
    investorsTitle: isEnglish
      ? 'Investors in this distribution'
      : 'قائمة المستثمرين في هذا التوزيع',
    investorsCountLabel: (count) =>
      isEnglish ? `${count} investor` : `${count} مستثمر`,
    toasts: {
      distributionSuccess: {
        title: isEnglish
          ? 'Investor profit distributions added successfully'
          : 'تم اضافة توزيعات ارباح المستثمرين بنجاح',
        description: isEnglish
          ? 'Net return was added and profit distributions were applied to investment portfolios.'
          : 'تم اضافة صافي العائد من توزيعات الارباح على المحافظ الاستثمارية',
        actionLabel: isEnglish ? 'Close' : 'إغلاق',
      },
      distributionError: {
        title: isEnglish ? 'Unable to add distribution' : 'تعذر اضافة التوزيع',
        actionLabel: isEnglish ? 'Close' : 'إغلاق',
      },
    },
    fallbackApiError: isEnglish
      ? 'Unable to complete the request. Please try again.'
      : 'تعذر تنفيذ الطلب، حاول مرة أخرى.',
  }
}

function mapDistributionDetailsToModal(distributionDetails, language = 'ar') {
  const copy = getProfitDistributionsCopy(language)

  if (!distributionDetails) {
    return {
      ...investmentOpportunityDistributionDetailDefaults,
      title: copy.distributionDetailsTitle,
      description: copy.distributionDetailsDescription,
      executorSectionTitle: copy.executorSectionTitle,
      investorsTitle: copy.investorsTitle,
      investorsCountLabel: copy.investorsCountLabel(
        investmentOpportunityDistributionDetailDefaults.investors.length,
      ),
    }
  }

  const lines = Array.isArray(distributionDetails.lines)
    ? distributionDetails.lines
    : []
  const sharesCount = lines.reduce(
    (sum, line) => sum + Number(line.shares_at_distribution || 0),
    0,
  )
  const investors = lines.map((line, index) => ({
    id: line.id || `distribution-investor-${index + 1}`,
    fullName: line.user?.full_name || '-',
    nationalId: '--',
    mobile: line.user?.mobile_number || '--',
    shares: formatNumber(line.shares_at_distribution, 0),
    profitAmount: formatNumber(line.amount, 2),
  }))
  const admin = distributionDetails.distributed_by_admin

  return {
    ...investmentOpportunityDistributionDetailDefaults,
    title: copy.distributionDetailsTitle,
    description: copy.distributionDetailsDescription,
    executorSectionTitle: copy.executorSectionTitle,
    investorsTitle: copy.investorsTitle,
    netProfit: formatNumber(distributionDetails.net_profit_amount, 2),
    executionDate: distributionDetails.distribution_date,
    shareCount: formatNumber(sharesCount, 0),
    executor: {
      ...investmentOpportunityDistributionDetailDefaults.executor,
      userId: admin?.code || '--',
      nameAr: admin?.full_name_ar || '-',
      nameEn: admin?.full_name_en || '-',
    },
    investors,
    investorsCountLabel: copy.investorsCountLabel(investors.length),
  }
}

function resolveApiErrorMessage(error, fallbackMessage) {
  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message
  }

  return fallbackMessage
}

export default function InvestmentOpportunityProfitDistributionsPage() {
  const { i18n } = useTranslation()
  const { dir } = useDirection()
  const { opportunityId = 'investment-riyadh-001' } = useParams()
  const copy = getProfitDistributionsCopy(i18n.resolvedLanguage)
  const { hasAllPermissions } = useAuthorization()
  const [distributionDialogOpen, setDistributionDialogOpen] = useState(false)
  const [selectedDistributionId, setSelectedDistributionId] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const canAddDistribution = hasAllPermissions([
    createPermission(
      APP_RESOURCES.profitDistributions,
      APP_ACTIONS.distributeProfits,
    ),
  ])

  const { data: distributions = [], isLoading } =
    useProfitDistributionsQuery(opportunityId)
  const {
    data: distributionDetails,
    isLoading: isDistributionDetailsLoading,
    isFetching: isDistributionDetailsFetching,
    error: distributionDetailsError,
    refetch: refetchDistributionDetails,
  } = useProfitDistributionDetailsQuery(
    selectedDistributionId,
    isDetailsModalOpen,
  )
  const createDistributionMutation =
    useCreateProfitDistributionMutation(opportunityId)

  const rows = useMemo(
    () =>
      distributions.map((distribution) =>
        mapDistributionToTableRow(distribution, i18n.resolvedLanguage),
      ),
    [distributions, i18n.resolvedLanguage],
  )

  const handleDistributionDetailsOpenChange = (open) => {
    if (!open) {
      setIsDetailsModalOpen(false)
      setSelectedDistributionId(null)
    }
  }

  const handleViewDistribution = (distributionId) => {
    setSelectedDistributionId(distributionId)
    setIsDetailsModalOpen(true)
  }

  const handleCreateDistribution = async (payload) => {
    if (!canAddDistribution) {
      return
    }

    try {
      await createDistributionMutation.mutateAsync(payload)
      setDistributionDialogOpen(false)
      showDashboardSuccessToast(copy.toasts.distributionSuccess)
    } catch (error) {
      showDashboardErrorToast({
        title: copy.toasts.distributionError.title,
        description: resolveApiErrorMessage(error, copy.fallbackApiError),
        actionLabel: copy.toasts.distributionError.actionLabel,
      })
    }
  }

  return (
    <div className="-mt-[17px] space-y-4 text-start" dir={dir}>
      <InvestmentOpportunityDetailsTabs
        opportunityId={opportunityId}
        activeTab="profit-distributions"
      />
      <InvestmentOpportunityDistributionsTable
        rows={rows}
        isLoading={isLoading}
        onAddDistribution={() => setDistributionDialogOpen(canAddDistribution)}
        onViewDistribution={handleViewDistribution}
        canAddDistribution={canAddDistribution}
      />
      <InvestmentOpportunityAddDistributionDialog
        open={distributionDialogOpen}
        onOpenChange={setDistributionDialogOpen}
        isSubmitting={createDistributionMutation.isPending}
        onSubmitDistribution={handleCreateDistribution}
      />
      <InvestmentOpportunityDistributionDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={handleDistributionDetailsOpenChange}
        distribution={mapDistributionDetailsToModal(
          distributionDetails,
          i18n.resolvedLanguage,
        )}
        isLoading={
          isDistributionDetailsLoading || isDistributionDetailsFetching
        }
        error={distributionDetailsError}
        onRetry={refetchDistributionDetails}
      />
    </div>
  )
}
