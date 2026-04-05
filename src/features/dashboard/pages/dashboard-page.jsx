import { DashboardMetricCard } from '@/features/dashboard/components/dashboard-metric-card'
import { DashboardOpportunityCard } from '@/features/dashboard/components/dashboard-opportunity-card'
import { DashboardProgressTable } from '@/features/dashboard/components/dashboard-progress-table'
import { DashboardSectionHeader } from '@/features/dashboard/components/dashboard-section-header'
import { DashboardSummaryCard } from '@/features/dashboard/components/dashboard-summary-card'
import {
  dashboardMetrics,
  investmentStatusRows,
  topOpportunities,
  transactionOverview,
} from '@/features/dashboard/constants/dashboard-ui'

export default function DashboardPage() {
  return (
    <div className="space-y-[30px]" dir="rtl">
      <DashboardSectionHeader title="ملخص مؤشرات الأداء الرئيسية" />

      <section
        aria-label="بطاقات مؤشرات الأداء"
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {dashboardMetrics.map((metric) => (
          <DashboardMetricCard key={metric.key} {...metric} />
        ))}
      </section>

      <DashboardProgressTable rows={investmentStatusRows} />

      <section className="space-y-6">
        <h2 className="text-right text-lg font-semibold leading-7 text-[#181927]">
          أفضل فرص الاستثمار حسب المبلغ الممول
        </h2>
        <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-6">
          {topOpportunities.map((opportunity, index) => (
            <div
              key={opportunity.key}
              className={index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}
            >
              <DashboardOpportunityCard {...opportunity} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-right text-lg font-semibold leading-7 text-[#181927]">
          نظرة عامة على المعاملات
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {transactionOverview.map((item) => (
            <DashboardSummaryCard key={item.key} {...item} />
          ))}
        </div>
      </section>
    </div>
  )
}
