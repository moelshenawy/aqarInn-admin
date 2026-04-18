import { Fragment } from 'react'

import { RiyalIcon } from '@/components/ui/riyal-icon'
import { cn } from '@/lib/utils'
import { investmentOpportunityDetailsAssets } from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'

function SectionHeading({ children }) {
  return (
    <div
      dir="ltr"
      className="flex items-center justify-end gap-2.5 py-2 text-start"
    >
      <img
        src={investmentOpportunityDetailsAssets.chevron}
        alt=""
        className="h-2 w-4 object-cover"
        aria-hidden="true"
      />

      <h3 className="text-lg leading-7 font-semibold text-[#181927]">
        {children}
      </h3>
    </div>
  )
}

function Metric({ label, value, currency = false }) {
  return (
    <div className="flex w-36 shrink-0 flex-col items-end gap-[13px] text-start">
      <p className="w-full text-sm leading-5 font-semibold text-[#ac9063]">
        {label}
      </p>
      {currency ? (
        <div dir="ltr" className="flex items-center justify-end gap-2.5">
          <RiyalIcon
            alt=""
            aria-hidden="true"
            className="text-xl text-[#402f28]"
          />
          <p className="text-xl leading-[30px] font-semibold text-[#402f28]">
            {value}
          </p>
        </div>
      ) : (
        <p className="w-full text-xl leading-[30px] font-semibold text-[#402f28]">
          {value}
        </p>
      )}
    </div>
  )
}

function DetailValue({ label, value, className }) {
  return (
    <div
      className={cn('flex flex-col items-end gap-[13px] text-start', className)}
    >
      <p className="w-full text-sm leading-5 font-semibold text-[#ac9063]">
        {label}
      </p>
      <p className="text-xl leading-[30px] font-semibold text-[#402f28]">
        {value}
      </p>
    </div>
  )
}

function GalleryTile({ image }) {
  return (
    <div
      className={cn(
        'relative flex-1 overflow-hidden rounded-[10px] bg-[#eae5d7]',
        image.tileClassName,
      )}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="pointer-events-none absolute top-0 left-0 h-full w-full max-w-none object-cover"
      />
    </div>
  )
}

function FinancialDivider() {
  return (
    <span className="h-[49px] w-px shrink-0 bg-[#eae5d7]" aria-hidden="true" />
  )
}

export function InvestmentOpportunityDetailsActions({ onDelete, onEdit }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-[38px] items-center justify-center gap-1.5 rounded-full border border-[#d6cbb2] px-4 py-1 text-sm leading-5 font-semibold text-[#181927] transition hover:bg-[#eae5d7] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
      >
        <span>حذف</span>
        <img
          src={investmentOpportunityDetailsAssets.trash}
          alt=""
          className="size-[19px]"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-[38px] items-center justify-center gap-1.5 rounded-full border border-[#d6cbb2] px-4 py-1 text-sm leading-5 font-semibold text-[#181927] transition hover:bg-[#eae5d7] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
      >
        <span>تعديل</span>
        <img
          src={investmentOpportunityDetailsAssets.edit}
          alt=""
          className="size-[19px]"
          aria-hidden="true"
        />
      </button>
    </div>
  )
}

export function InvestmentOpportunityDetailsBody({ details }) {
  return (
    <>
      <section
        className="flex w-full flex-col gap-[30px]"
        aria-label="تفاصيل العقار"
      >
        <div className="flex w-full flex-col gap-5">
          <div className="flex w-full flex-col gap-5">
            <div
              dir="ltr"
              className="flex w-full items-center gap-5 lg:gap-[240px]"
            >
              <div
                dir="ltr"
                className="flex shrink-0 items-center gap-5 text-start"
              >
                <p className="max-w-[105px] truncate text-xl leading-[30px] font-semibold text-[#402f28]">
                  {details.floors}
                </p>
                <span
                  className="h-6 w-px rotate-[1.13deg] bg-[#d6cbb2]"
                  aria-hidden="true"
                />
                <p className="max-w-[120px] truncate text-xl leading-[30px] font-semibold text-[#402f28]">
                  {details.propertyType}
                </p>
              </div>
              <h2
                dir="rtl"
                className="min-w-0 flex-1 truncate text-start text-xl leading-[30px] font-semibold text-[#402f28]"
              >
                {details.titleAr}
              </h2>
            </div>

            <div
              dir="ltr"
              className="flex h-[30px] w-full items-center text-start text-xl leading-[30px] font-semibold text-[#402f28]"
            >
              <p className="shrink-0 truncate whitespace-pre">
                {details.totalArea}
              </p>
              <p className="min-w-0 flex-1 truncate text-start">
                {details.titleEn}
              </p>
            </div>
          </div>

          <div dir="ltr" className="flex w-full items-center justify-end">
            <div className="flex min-w-0 flex-1 items-center justify-end gap-2.5">
              <p className="min-w-0 flex-1 truncate text-left text-lg leading-7 font-semibold text-[#402f28]">
                {details.buildYear}
              </p>
              <p
                dir="rtl"
                className="shrink-0 truncate text-start text-lg leading-7 font-semibold text-[#402f28]"
              >
                {details.location}
              </p>
              <img
                src={investmentOpportunityDetailsAssets.mapPin}
                alt=""
                className="size-[22px] shrink-0"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div
          dir="ltr"
          className="flex w-full items-center justify-between gap-4 py-0.5"
          aria-label="المعلومات المالية"
        >
          {details.metrics.map((metric, index) => (
            <Fragment key={metric.label}>
              <Metric {...metric} />
              {index < details.metrics.length - 1 ? <FinancialDivider /> : null}
            </Fragment>
          ))}
        </div>

        <div
          dir="ltr"
          className="flex w-full flex-col gap-4"
          aria-label="صور الفرصة الاستثمارية"
        >
          <div className="flex w-full gap-3">
            <GalleryTile image={details.gallery[0]} />
            <GalleryTile image={details.gallery[1]} />
          </div>
          <div className="flex w-full gap-3.5">
            <GalleryTile image={details.gallery[2]} />
            <GalleryTile image={details.gallery[3]} />
            <GalleryTile image={details.gallery[4]} />
          </div>
        </div>
      </section>

      <section
        className="flex w-full flex-col gap-[30px]"
        aria-label="اعدادات الاستثمار"
      >
        <SectionHeading>اعدادات الاستثمار</SectionHeading>
        <div
          dir="ltr"
          className="grid w-full grid-cols-1 gap-[60px] sm:grid-cols-2"
        >
          {details.investmentSettings.map((setting) => (
            <DetailValue
              key={setting.label}
              label={setting.label}
              value={setting.value}
              className="min-w-0 flex-1"
            />
          ))}
        </div>
      </section>

      <section
        className="flex w-full flex-col gap-2.5"
        aria-label="تفاصيل المشغل"
      >
        <SectionHeading>تفاصيل المشغل</SectionHeading>
        <div className="flex w-full flex-col items-end gap-5">
          <div
            dir="ltr"
            className="flex w-full flex-col gap-5 md:flex-row md:items-center md:gap-[60px]"
          >
            <div className="flex min-w-0 flex-1 flex-col items-end gap-1.5 text-start text-sm leading-5 font-semibold text-[#9d7e55]">
              <p className="w-full truncate">{details.operator.email}</p>
              <p className="w-full truncate">{details.operator.phone}</p>
              <p className="w-full truncate">{details.operator.location}</p>
            </div>
            <div className="flex w-full shrink-0 items-center justify-end p-2.5 md:w-[511px]">
              <img
                src={investmentOpportunityDetailsAssets.operatorLogo}
                alt={details.operator.logoAlt}
                className="h-[72px] w-[60px] object-contain"
              />
            </div>
          </div>

          <div
            dir="ltr"
            className="grid w-full grid-cols-1 gap-5 text-start md:grid-cols-2 md:gap-[60px]"
          >
            <div className="flex min-w-0 flex-col items-start gap-2.5">
              <p className="w-full truncate text-lg leading-7 font-semibold text-[#181927]">
                {details.operator.nameEn}
              </p>
              <p className="h-[60px] w-full overflow-hidden text-sm leading-5 font-semibold text-[#402f28]">
                {details.operator.descriptionEn}
              </p>
            </div>
            <div className="flex min-w-0 flex-col items-start gap-2.5">
              <p className="w-full truncate text-lg leading-7 font-semibold text-[#181927]">
                {details.operator.nameAr}
              </p>
              <p className="h-[60px] w-full overflow-hidden text-sm leading-5 font-semibold text-[#402f28]">
                {details.operator.descriptionAr}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
