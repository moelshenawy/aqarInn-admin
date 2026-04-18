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

function mapDistributionDetailsToModal(distributionDetails) {
  if (!distributionDetails) {
    return investmentOpportunityDistributionDetailDefaults
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
    investorsCountLabel: `${investors.length} مستثمر`,
  }
}

const distributionSuccessToast = {
  title: 'تم اضافة توزيعات ارباح المستثمرين بنجاح',
  description:
    'تم اضافة صافي العائد من توزيعات الارباح على المحافظ الاستثمارية',
  actionLabel: 'إغلاق',
}

function resolveApiErrorMessage(error) {
  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message
  }

  return 'تعذر تنفيذ الطلب، حاول مرة أخرى.'
}

export default function InvestmentOpportunityProfitDistributionsPage() {
  const { i18n } = useTranslation()
  const { opportunityId = 'investment-riyadh-001' } = useParams()
  const [distributionDialogOpen, setDistributionDialogOpen] = useState(false)
  const [selectedDistributionId, setSelectedDistributionId] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

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
    try {
      await createDistributionMutation.mutateAsync(payload)
      setDistributionDialogOpen(false)
      showDashboardSuccessToast(distributionSuccessToast)
    } catch (error) {
      showDashboardErrorToast({
        title: 'تعذر اضافة التوزيع',
        description: resolveApiErrorMessage(error),
        actionLabel: 'إغلاق',
      })
    }
  }

  return (
    <div className="-mt-[17px] space-y-4 text-right" dir="rtl">
      <InvestmentOpportunityDetailsTabs
        opportunityId={opportunityId}
        activeTab="profit-distributions"
      />
      <InvestmentOpportunityDistributionsTable
        rows={rows}
        isLoading={isLoading}
        onAddDistribution={() => setDistributionDialogOpen(true)}
        onViewDistribution={handleViewDistribution}
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
        distribution={mapDistributionDetailsToModal(distributionDetails)}
        isLoading={isDistributionDetailsLoading || isDistributionDetailsFetching}
        error={distributionDetailsError}
        onRetry={refetchDistributionDetails}
      />
    </div>
  )
}
