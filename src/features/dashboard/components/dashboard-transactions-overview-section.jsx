import { zodResolver } from '@hookform/resolvers/zod'
import { Banknote, HandCoins, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { RiyalIcon } from '@/components/ui/riyal-icon'
import { DashboardActionFilterRow } from '@/features/dashboard/components/dashboard-action-filter-row'
import {
  createDashboardTransactionRecords,
  DASHBOARD_TRANSACTION_RANGE_PRESETS,
  DASHBOARD_TRANSACTION_TYPES,
  dashboardTransactionCityKeys,
  dashboardTransactionIoKeys,
  DASHBOARD_WITHDRAWAL_STATUSES,
} from '@/features/dashboard/constants/dashboard-transactions'
import { createDashboardTransactionFiltersSchema } from '@/features/dashboard/schemas/dashboard-transaction-filters-schema'
import { useDirection } from '@/lib/i18n/direction-provider'
import { cn } from '@/lib/utils'

const WITHDRAWAL_STATUS_ORDER = [
  DASHBOARD_WITHDRAWAL_STATUSES.inProgress,
  DASHBOARD_WITHDRAWAL_STATUSES.depositMade,
]

const summaryIcons = {
  [DASHBOARD_TRANSACTION_TYPES.investment]: Wallet,
  [DASHBOARD_TRANSACTION_TYPES.withdrawal]: HandCoins,
  [DASHBOARD_TRANSACTION_TYPES.distribution]: Banknote,
}

function startOfDay(date) {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

function endOfDay(date) {
  const nextDate = new Date(date)
  nextDate.setHours(23, 59, 59, 999)
  return nextDate
}

function parseDateInput(value) {
  if (!value) {
    return null
  }

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

function getPresetRange(rangePreset, referenceDate) {
  const endDate = endOfDay(referenceDate)
  const startDate = startOfDay(referenceDate)

  if (rangePreset === 'today') {
    return { startDate, endDate }
  }

  if (rangePreset === 'last7Days') {
    const nextStartDate = new Date(startDate)
    nextStartDate.setDate(nextStartDate.getDate() - 6)
    return { startDate: nextStartDate, endDate }
  }

  if (rangePreset === 'last30Days') {
    const nextStartDate = new Date(startDate)
    nextStartDate.setDate(nextStartDate.getDate() - 29)
    return { startDate: nextStartDate, endDate }
  }

  return null
}

function summarizeRecords(records) {
  return records.reduce(
    (summary, record) => ({
      count: summary.count + 1,
      totalAmount: summary.totalAmount + record.amount,
    }),
    { count: 0, totalAmount: 0 },
  )
}

function TransactionsFilterField({
  id,
  label,
  error,
  align = 'right',
  children,
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={cn(
          'block text-sm leading-5 font-medium text-[#402f28]',
          align === 'left' ? 'text-left' : 'text-right',
        )}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          role="alert"
          className={cn(
            'text-xs leading-5 font-medium text-[#b93815]',
            align === 'left' ? 'text-left' : 'text-right',
          )}
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}

function TransactionsSelectField({
  id,
  label,
  value,
  options,
  onChange,
  align,
}) {
  return (
    <TransactionsFilterField id={id} label={label} align={align}>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            'h-12 w-full appearance-none rounded-lg border border-[#bfab85] bg-[color:var(--dashboard-bg)] py-3.5 pr-3 pl-12 text-sm leading-5 font-medium text-[#5c4437] shadow-[var(--dashboard-shadow)] transition outline-none focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20',
            align === 'left' ? 'text-left' : 'text-right',
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center justify-center text-[#bfab85]">
          <svg
            viewBox="0 0 20 20"
            className="size-5 fill-none stroke-current"
            aria-hidden="true"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </TransactionsFilterField>
  )
}

function TransactionsDateField({ id, label, registration, error, align }) {
  return (
    <TransactionsFilterField id={id} label={label} error={error} align={align}>
      <input
        id={id}
        type="date"
        aria-invalid={error ? 'true' : 'false'}
        className={cn(
          'h-12 w-full rounded-lg border border-[#bfab85] bg-[color:var(--dashboard-bg)] px-3 py-3.5 text-sm leading-5 font-medium text-[#402f28] shadow-[var(--dashboard-shadow)] transition outline-none focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20',
          align === 'left' ? 'text-left' : 'text-right',
        )}
        {...registration}
      />
    </TransactionsFilterField>
  )
}

function TransactionAmount({ value, numberFormatter }) {
  return (
    <div className="flex items-center gap-1.5" dir="ltr">
      <RiyalIcon className="text-[22px] text-[#9d7e55]" />
      <span className="text-xl leading-8 font-semibold text-[#402f28]">
        {numberFormatter.format(value)}
      </span>
    </div>
  )
}

function TransactionMetricTile({
  metricKey,
  label,
  value,
  type = 'count',
  numberFormatter,
}) {
  return (
    <div
      data-slot="dashboard-transactions-metric"
      data-metric-key={metricKey}
      className="rounded-lg border border-[#d6cbb2] bg-[#f8f3e8] p-4 shadow-[var(--dashboard-shadow)]"
    >
      <p className="text-xs leading-5 font-medium text-[#9d7e55]">{label}</p>
      {type === 'amount' ? (
        <div className="mt-2">
          <TransactionAmount value={value} numberFormatter={numberFormatter} />
        </div>
      ) : (
        <p
          className="mt-2 text-[28px] leading-9 font-semibold text-[#402f28]"
          dir="ltr"
        >
          {numberFormatter.format(value)}
        </p>
      )}
    </div>
  )
}

function TransactionsSummaryPanel({
  title,
  metricLabels,
  summary,
  icon,
  numberFormatter,
  statusBreakdownTitle,
  breakdownRows,
}) {
  const SummaryIcon = icon

  return (
    <section
      role="region"
      aria-label={title}
      data-slot="dashboard-transactions-panel"
      className="rounded-xl border border-[#d6cbb2] bg-[#f8f3e8] p-5 shadow-[var(--dashboard-shadow)]"
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-[#eae5d7] text-[#6d4f3b]">
          <SummaryIcon className="size-5 stroke-[1.8]" aria-hidden="true" />
        </div>
        <h3 className="flex-1 text-lg leading-7 font-semibold text-[#402f28]">
          {title}
        </h3>
      </header>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <TransactionMetricTile
          metricKey="count"
          label={metricLabels.count}
          value={summary.count}
          numberFormatter={numberFormatter}
        />
        <TransactionMetricTile
          metricKey="total-amount"
          label={metricLabels.totalAmount}
          value={summary.totalAmount}
          type="amount"
          numberFormatter={numberFormatter}
        />
      </div>

      {breakdownRows ? (
        <div className="mt-4 rounded-lg border border-[#d6cbb2] bg-[#f8f3e8] p-4 shadow-[var(--dashboard-shadow)]">
          <p className="text-sm leading-5 font-semibold text-[#402f28]">
            {statusBreakdownTitle}
          </p>
          <div className="mt-3 space-y-3">
            {breakdownRows.map((row) => (
              <div
                key={row.key}
                data-slot="dashboard-transactions-breakdown-row"
                data-breakdown-key={row.key}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#eae5d7] bg-white px-3 py-2.5"
              >
                <p className="text-sm leading-5 font-medium text-[#5c4437]">
                  {row.label}
                </p>
                <div className="flex flex-wrap items-center gap-4" dir="ltr">
                  <p className="text-sm leading-5 font-medium text-[#6d4f3b]">
                    {row.countLabel}:{' '}
                    {numberFormatter.format(row.summary.count)}
                  </p>
                  <div className="flex items-center gap-1.5 text-sm leading-5 font-medium text-[#6d4f3b]">
                    <span>{row.amountLabel}:</span>
                    <TransactionAmount
                      value={row.summary.totalAmount}
                      numberFormatter={numberFormatter}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export function DashboardTransactionsOverviewSection() {
  const { t, i18n } = useTranslation(['dashboard', 'validation'])
  const { dir } = useDirection()
  const [rangePreset, setRangePreset] = useState('today')
  const [io, setIo] = useState('all')
  const [status, setStatus] = useState('all')
  const [city, setCity] = useState('all')

  const schema = useMemo(() => createDashboardTransactionFiltersSchema(t), [t])
  const referenceDate = useMemo(() => new Date(), [])
  const records = useMemo(
    () => createDashboardTransactionRecords(referenceDate),
    [referenceDate],
  )
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(
        i18n.resolvedLanguage === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US',
      ),
    [i18n.resolvedLanguage],
  )
  const {
    control,
    register,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: '',
      endDate: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const [startDate = '', endDate = ''] = useWatch({
    control,
    name: ['startDate', 'endDate'],
  })
  const customRangeResult = schema.safeParse({ startDate, endDate })

  const startDateRegistration = register('startDate', {
    onChange: () => {
      void trigger(['startDate', 'endDate'])
    },
  })
  const endDateRegistration = register('endDate', {
    onChange: () => {
      void trigger(['startDate', 'endDate'])
    },
  })

  const rangeItems = useMemo(
    () =>
      DASHBOARD_TRANSACTION_RANGE_PRESETS.map((key) => ({
        key,
        label: t(`transactionsOverview.rangePresets.${key}`),
      })),
    [t],
  )
  const ioOptions = useMemo(
    () => [
      { value: 'all', label: t('transactionsOverview.filters.all') },
      ...dashboardTransactionIoKeys.map((key) => ({
        value: key,
        label: t(`transactionsOverview.filters.ioOptions.${key}`),
      })),
    ],
    [t],
  )
  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('transactionsOverview.filters.all') },
      ...WITHDRAWAL_STATUS_ORDER.map((key) => ({
        value: key,
        label: t(`transactionsOverview.filters.statusOptions.${key}`),
      })),
    ],
    [t],
  )
  const cityOptions = useMemo(
    () => [
      { value: 'all', label: t('transactionsOverview.filters.all') },
      ...dashboardTransactionCityKeys.map((key) => ({
        value: key,
        label: t(`transactionsOverview.filters.cityOptions.${key}`),
      })),
    ],
    [t],
  )

  const filteredRecords = useMemo(() => {
    let nextRecords = records

    if (io !== 'all') {
      nextRecords = nextRecords.filter((record) => record.ioKey === io)
    }

    if (city !== 'all') {
      nextRecords = nextRecords.filter((record) => record.cityKey === city)
    }

    if (rangePreset === 'custom') {
      if (!customRangeResult.success) {
        return nextRecords
      }

      const rangeStartDate = startOfDay(parseDateInput(startDate))
      const rangeEndDate = endOfDay(parseDateInput(endDate))

      return nextRecords.filter((record) => {
        const recordDate = new Date(record.createdAt)
        return recordDate >= rangeStartDate && recordDate <= rangeEndDate
      })
    }

    const range = getPresetRange(rangePreset, referenceDate)
    if (!range) {
      return nextRecords
    }

    return nextRecords.filter((record) => {
      const recordDate = new Date(record.createdAt)
      return recordDate >= range.startDate && recordDate <= range.endDate
    })
  }, [
    city,
    customRangeResult.success,
    endDate,
    io,
    rangePreset,
    records,
    referenceDate,
    startDate,
  ])

  const investments = filteredRecords.filter(
    (record) => record.type === DASHBOARD_TRANSACTION_TYPES.investment,
  )
  const distributions = filteredRecords.filter(
    (record) => record.type === DASHBOARD_TRANSACTION_TYPES.distribution,
  )
  const withdrawalsPool = filteredRecords.filter(
    (record) => record.type === DASHBOARD_TRANSACTION_TYPES.withdrawal,
  )
  const withdrawals =
    status === 'all'
      ? withdrawalsPool
      : withdrawalsPool.filter((record) => record.withdrawalStatus === status)

  const investmentSummary = summarizeRecords(investments)
  const withdrawalSummary = summarizeRecords(withdrawals)
  const distributionSummary = summarizeRecords(distributions)

  const withdrawalBreakdownRows = WITHDRAWAL_STATUS_ORDER.map((statusKey) => ({
    key: statusKey,
    label: t(`transactionsOverview.filters.statusOptions.${statusKey}`),
    countLabel: t('transactionsOverview.metrics.count'),
    amountLabel: t('transactionsOverview.metrics.totalAmount'),
    summary: summarizeRecords(
      withdrawals.filter((record) => record.withdrawalStatus === statusKey),
    ),
  }))

  function handleRangePresetSelect(nextPreset) {
    setRangePreset(nextPreset)

    if (nextPreset !== 'custom') {
      setValue('startDate', '')
      setValue('endDate', '')
      clearErrors()
      return
    }

    void trigger(['startDate', 'endDate'])
  }

  return (
    <section
      aria-label={t('transactionsOverview.title')}
      dir={dir}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2
          className={cn(
            'text-lg leading-7 font-semibold text-[#181927]',
            dir === 'ltr' ? 'text-left' : 'text-right',
          )}
        >
          {t('transactionsOverview.title')}
        </h2>
        <p
          className={cn(
            'text-sm leading-6 font-medium text-[#717680]',
            dir === 'ltr' ? 'text-left' : 'text-right',
          )}
        >
          {t('transactionsOverview.description')}
        </p>
      </div>

      <div className="rounded-xl border border-[#d6cbb2] bg-[#f8f3e8] p-4 shadow-[var(--dashboard-shadow)] sm:p-5">
        <div className="space-y-5">
          <div className="space-y-2">
            <p
              className={cn(
                'text-sm leading-5 font-medium text-[#402f28]',
                dir === 'ltr' ? 'text-left' : 'text-right',
              )}
            >
              {t('transactionsOverview.filters.dateRange')}
            </p>
            <DashboardActionFilterRow
              items={rangeItems}
              activeKey={rangePreset}
              onSelect={handleRangePresetSelect}
              direction={dir}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <TransactionsSelectField
              id="transactions-io-filter"
              label={t('transactionsOverview.filters.io')}
              value={io}
              options={ioOptions}
              onChange={setIo}
              align={dir === 'ltr' ? 'left' : 'right'}
            />
            <TransactionsSelectField
              id="transactions-status-filter"
              label={t('transactionsOverview.filters.status')}
              value={status}
              options={statusOptions}
              onChange={setStatus}
              align={dir === 'ltr' ? 'left' : 'right'}
            />
            <TransactionsSelectField
              id="transactions-city-filter"
              label={t('transactionsOverview.filters.city')}
              value={city}
              options={cityOptions}
              onChange={setCity}
              align={dir === 'ltr' ? 'left' : 'right'}
            />
          </div>

          {rangePreset === 'custom' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TransactionsDateField
                id="transactions-start-date"
                label={t('transactionsOverview.filters.startDate')}
                registration={startDateRegistration}
                error={errors.startDate?.message}
                align={dir === 'ltr' ? 'left' : 'right'}
              />
              <TransactionsDateField
                id="transactions-end-date"
                label={t('transactionsOverview.filters.endDate')}
                registration={endDateRegistration}
                error={errors.endDate?.message}
                align={dir === 'ltr' ? 'left' : 'right'}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <TransactionsSummaryPanel
          title={t('transactionsOverview.cards.investments')}
          metricLabels={{
            count: t('transactionsOverview.metrics.count'),
            totalAmount: t('transactionsOverview.metrics.totalAmount'),
          }}
          summary={investmentSummary}
          icon={summaryIcons[DASHBOARD_TRANSACTION_TYPES.investment]}
          numberFormatter={numberFormatter}
        />
        <TransactionsSummaryPanel
          title={t('transactionsOverview.cards.withdrawals')}
          metricLabels={{
            count: t('transactionsOverview.metrics.count'),
            totalAmount: t('transactionsOverview.metrics.totalAmount'),
          }}
          summary={withdrawalSummary}
          icon={summaryIcons[DASHBOARD_TRANSACTION_TYPES.withdrawal]}
          numberFormatter={numberFormatter}
          statusBreakdownTitle={t(
            'transactionsOverview.metrics.statusBreakdown',
          )}
          breakdownRows={withdrawalBreakdownRows}
        />
        <TransactionsSummaryPanel
          title={t('transactionsOverview.cards.distributions')}
          metricLabels={{
            count: t('transactionsOverview.metrics.count'),
            totalAmount: t('transactionsOverview.metrics.totalAmount'),
          }}
          summary={distributionSummary}
          icon={summaryIcons[DASHBOARD_TRANSACTION_TYPES.distribution]}
          numberFormatter={numberFormatter}
        />
      </div>
    </section>
  )
}
