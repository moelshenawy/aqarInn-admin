import { useEffect, useMemo, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { showDashboardErrorToast } from '@/components/ui/dashboard-toast'
import { RiyalIcon } from '@/components/ui/riyal-icon'

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

function isValidNetProfitAmount(value) {
  const normalized = String(value ?? '').trim()
  if (!normalized) {
    return false
  }

  const regex = /^\d{1,10}(\.\d{1,2})?$/
  if (!regex.test(normalized)) {
    return false
  }

  return Number(normalized) > 0
}

export function InvestmentOpportunityAddDistributionDialog({
  open,
  onOpenChange,
  isSubmitting = false,
  onSubmitDistribution,
}) {
  const [netReturn, setNetReturn] = useState('')
  const todayIsoDate = useMemo(() => getTodayIsoDate(), [])

  const resetForm = () => {
    setNetReturn('')
  }

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      resetForm()
    }

    onOpenChange(nextOpen)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isValidNetProfitAmount(netReturn)) {
      showDashboardErrorToast({
        title: 'قيمة صافي الربح غير صحيحة',
        description: 'أدخل قيمة رقمية أكبر من صفر بصيغة صحيحة مثل 10000.56',
        actionLabel: 'إغلاق',
      })
      return
    }

    await onSubmitDistribution?.({
      type: 'profit',
      net_profit_amount: Number(netReturn),
      currency: 'SAR',
      distribution_date: todayIsoDate,
      notes: '',
    })
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        dir="rtl"
        showCloseButton={false}
        className="block w-[min(626px,calc(100vw-32px))] max-w-none min-w-0 rounded-[17px] border-0 bg-[#f8f3e8] px-[27px] pt-5 pb-[30px] text-start text-[#402f28] shadow-[0_24px_80px_rgba(64,47,40,0.18)] ring-0"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className="flex flex-col items-end">
            <DialogTitle className="w-full text-start text-2xl leading-8 font-semibold text-[#181927]">
              اضافة توزيعات ارباح للمستثمرين
            </DialogTitle>
          </div>

          <div className="flex w-full flex-col gap-[22px]">
            <DialogDescription className="w-full text-start text-lg leading-7 font-medium text-[#402f28]">
              قم بتسجيل صافي العائد ليتم توزيع الأرباح على المحافظ الاستثمارية
            </DialogDescription>

            <div className="flex h-12 w-full items-start gap-2">
              <div
                dir="ltr"
                className="flex h-12 min-w-0 flex-1 items-center rounded-lg border border-[#bfab85] bg-[#f8f3e8] text-start shadow-[var(--dashboard-shadow)]"
              >
                <span className="shrink-0 px-3.5">
                  <RiyalIcon className="text-xl text-[#ac9063]" />
                </span>
                <input
                  dir="rtl"
                  value={netReturn}
                  onChange={(event) => setNetReturn(event.target.value)}
                  placeholder="قم بإدخال صافي العائد"
                  inputMode="decimal"
                  aria-label="صافي العائد"
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-start text-sm leading-5 font-medium text-[#6d4f3b] outline-none placeholder:text-[#6d4f3b]"
                />
              </div>

              <div
                dir="ltr"
                className="flex h-12 w-[189px] shrink-0 items-center justify-start rounded-lg border border-[#d6cbb2] bg-[#f8f3e8] px-3.5 text-left text-sm leading-5 font-medium text-[#5c4437] shadow-[var(--dashboard-shadow)]"
              >
                <input
                  value={todayIsoDate}
                  readOnly
                  aria-label="تاريخ التوزيع"
                  className="h-full min-w-0 flex-1 cursor-not-allowed bg-transparent text-left text-sm leading-5 font-medium text-[#5c4437] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex h-[47px] w-full items-start gap-2.5" dir="ltr">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative flex h-full w-[141px] items-center justify-center overflow-hidden rounded-lg border-2 border-white/10 bg-[#402f28] px-3.5 py-2.5 text-sm leading-5 font-semibold whitespace-nowrap text-white shadow-[0_1px_2px_rgba(10,13,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_rgba(10,13,18,0.05)] transition hover:bg-[#4c382f] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              اضافة التوزيعات
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCancel}
              className="relative flex h-full w-[127px] items-center justify-center overflow-hidden rounded-lg bg-[#eae5d7] px-3.5 py-2.5 text-sm leading-5 font-semibold text-[#402f28] shadow-[0_1px_2px_rgba(10,13,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_rgba(10,13,18,0.05)] transition hover:bg-[#ded6c4] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              الغاء
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
