import { ChevronUp, User } from 'lucide-react'

import { RiyalIcon } from '@/components/ui/riyal-icon'
import { investmentOpportunityDistributionDetailDefaults } from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'
import { cn } from '@/lib/utils'
import { SideModalShell } from '@/shared/components/side-modal-shell'

function UserAvatarIcon({ className, iconClassName }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-[#eae5d7] text-[#402f28]',
        className,
      )}
    >
      <User
        className={cn('stroke-[1.8]', iconClassName)}
        aria-hidden="true"
      />
    </span>
  )
}

function DistributionSummaryItem({ label, children, className }) {
  return (
    <div className={cn('flex flex-col items-end gap-[13px]', className)}>
      <span className="text-sm leading-5 font-semibold text-[#ac9063]">
        {label}
      </span>
      <span className="flex min-h-7 items-center justify-end gap-1 text-lg leading-7 font-semibold text-[#402f28]">
        {children}
      </span>
    </div>
  )
}

function DistributionSummary({ details }) {
  return (
    <div className="flex w-full items-center justify-between overflow-hidden rounded-[14px] py-2.5">
      <DistributionSummaryItem label="صافي مبلغ الربح" className="w-36">
        <RiyalIcon className="text-[22px]" />
        <span>{details.netProfit}</span>
      </DistributionSummaryItem>
      <span className="h-[49px] w-px bg-[#d6cbb2]" aria-hidden="true" />
      <DistributionSummaryItem label="تاريخ التوزيع" className="w-36">
        {details.executionDate}
      </DistributionSummaryItem>
      <span className="h-[49px] w-px bg-[#d6cbb2]" aria-hidden="true" />
      <DistributionSummaryItem label="عدد الحصص" className="w-[147px]">
        {details.shareCount}
      </DistributionSummaryItem>
    </div>
  )
}

function ExecutorDetails({ details }) {
  return (
    <section className="flex w-full flex-col gap-2.5" aria-labelledby="executor-details-title">
      <header className="flex w-full items-center justify-end gap-2.5 py-2">
        <ChevronUp className="size-5 stroke-[1.8] text-[#181927]" aria-hidden="true" />
        <h3
          id="executor-details-title"
          className="text-lg leading-7 font-semibold text-[#181927]"
        >
          {details.executorSectionTitle}
        </h3>
      </header>

      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col items-start gap-[13px] text-start font-semibold">
          <span className="text-sm leading-5 text-[#ac9063]">رقم المستخدم</span>
          <span className="w-[147px] text-lg leading-7 text-[#402f28]">
            {details.executor.userId}
          </span>
        </div>

        <div className="flex items-center justify-end gap-[22px]">
          <div className="flex w-[345px] flex-col items-end gap-2 text-right text-base leading-6 font-bold">
            <span className="w-full text-[#181927]">
              {details.executor.nameAr}
            </span>
            <span className="w-full text-[#717680]">
              {details.executor.nameEn}
            </span>
          </div>
          <UserAvatarIcon className="size-[82px]" iconClassName="size-10" />
        </div>
      </div>
    </section>
  )
}

function InvestorsTable({ details }) {
  return (
    <section
      className="w-full overflow-hidden rounded-xl border border-[#eae5d7] shadow-[0_1px_2px_rgba(10,13,18,0.05)]"
      aria-label={details.investorsTitle}
    >
      <header className="flex min-h-[71px] items-start border-b border-[#d6cbb2] bg-[#eae5d7] px-6 pt-5">
        <div className="flex w-full items-center justify-end gap-2">
          <span className="rounded-full bg-[#f8f3e8] px-4 py-1.5 text-xs leading-[18px] font-semibold text-[#5c4437]">
            {details.investorsCountLabel}
          </span>
          <h3 className="min-w-0 flex-1 text-right text-lg leading-7 font-semibold text-[#181927]">
            {details.investorsTitle}
          </h3>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] table-fixed border-collapse text-right">
          <colgroup>
            <col className="w-[299px]" />
            <col className="w-[126px]" />
            <col className="w-[184px]" />
            <col className="w-[126px]" />
            <col className="w-[126px]" />
          </colgroup>
          <thead>
            <tr className="h-11 border-b border-[#eae5d7] bg-[#f8f3e8] text-xs leading-[18px] font-bold text-[#5c4437]">
              <th className="px-6 font-bold">الاسم بالكامل</th>
              <th className="px-6 font-bold">رقم الهوية الوطنية</th>
              <th className="px-6 font-bold">رقم الجوال</th>
              <th className="px-6 font-bold">عدد الحصص</th>
              <th className="px-6 font-bold">مبلغ الربح</th>
            </tr>
          </thead>
          <tbody>
            {details.investors.map((investor) => (
              <tr
                key={investor.id}
                className="h-[72px] border-b border-[#eae5d7] text-sm leading-5 text-[#402f28] last:border-b-0"
              >
                <td className="px-6 font-medium text-[#181927]">
                  <div className="flex items-center justify-end gap-3">
                    <span>{investor.fullName}</span>
                    <UserAvatarIcon
                      className="size-10 border border-[#eae5d7] bg-[#f8f3e8]"
                      iconClassName="size-5"
                    />
                  </div>
                </td>
                <td className="px-6 font-normal">{investor.nationalId}</td>
                <td className="px-6 font-medium">{investor.mobile}</td>
                <td className="px-6 font-medium">{investor.shares}</td>
                <td className="px-6 font-medium">{investor.profitAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function InvestmentOpportunityDistributionDetailsModal({
  open,
  onOpenChange,
  distribution,
}) {
  const details =
    distribution?.details ?? investmentOpportunityDistributionDetailDefaults

  return (
    <SideModalShell
      open={open}
      onOpenChange={onOpenChange}
      title={details.title}
      closeLabel="إغلاق تفاصيل التوزيع"
      contentClassName="h-dvh overflow-visible"
      closeButtonClassName="max-sm:right-auto max-sm:left-4"
      className="flex h-full min-h-full flex-col items-end gap-[30px] overflow-x-hidden overflow-y-auto px-6 py-8 text-right sm:px-8 sm:py-[38px]"
    >
      <section className="flex w-full flex-col items-start gap-[30px]">
        <div className="flex w-full flex-col items-start gap-5">
          <header className="flex w-full items-center justify-end py-5">
            <h2 className="min-w-0 flex-1 text-right text-2xl leading-8 font-semibold text-[#181927]">
              {details.title}
            </h2>
          </header>
          <p className="w-full text-right text-lg leading-7 font-semibold text-[#6d4f3b]">
            {details.description}
          </p>
        </div>

        <DistributionSummary details={details} />
      </section>

      <ExecutorDetails details={details} />
      <InvestorsTable details={details} />
    </SideModalShell>
  )
}
