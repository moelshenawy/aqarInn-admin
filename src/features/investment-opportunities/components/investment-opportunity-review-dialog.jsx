import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'

import { InvestmentOpportunityDetailsBody } from '@/features/investment-opportunities/components/investment-opportunity-details-content'
import { investmentOpportunityDefaultDetails } from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'
import { useDirection } from '@/lib/i18n/direction-provider'

const reviewCloseIcon = '/assets/investment-opportunities/review-icon-close.svg'

export function InvestmentOpportunityReviewDialog({
  open,
  onOpenChange,
  onPublish,
  details = investmentOpportunityDefaultDetails,
  isPublishing = false,
}) {
  const { t } = useTranslation('navigation')
  const { dir } = useDirection()
  const reviewDialogCopy = t('investmentOpportunity.reviewDialog', {
    returnObjects: true,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir={dir}
        showCloseButton={false}
        className="block max-h-[calc(100vh-48px)] w-[min(1100px,calc(100vw-32px))] max-w-none overflow-x-hidden overflow-y-auto rounded-[20px] border-0 bg-[#f8f3e8] px-[30px] py-5 text-start text-[#402f28] shadow-[0_24px_80px_rgba(64,47,40,0.18)] ring-0"
      >
        <div className="flex flex-col gap-[30px]">
          <header
            dir={dir}
            className="flex w-full items-center justify-end gap-[58px] py-2.5"
          >
            <DialogClose asChild>
              <button
                type="button"
                aria-label={reviewDialogCopy.closeAria}
                className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#eae5d7] bg-[#f8f3e8] p-3.5 shadow-[0_1px_2px_rgba(10,13,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_rgba(10,13,18,0.05)] transition hover:bg-[#efe7d7] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
              >
                <img
                  src={reviewCloseIcon}
                  alt=""
                  className="size-5"
                  aria-hidden="true"
                />
              </button>
            </DialogClose>
            <DialogTitle
              dir={dir}
              className="min-w-0 flex-1 text-start text-2xl leading-8 font-semibold text-[#181927]"
            >
              {reviewDialogCopy.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {reviewDialogCopy.description}
            </DialogDescription>
          </header>

          <InvestmentOpportunityDetailsBody details={details} />

          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            className="relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-lg border-2 border-white/10 bg-[#402f28] px-3.5 py-2.5 text-sm leading-5 font-semibold text-white shadow-[0_1px_2px_rgba(10,13,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_rgba(10,13,18,0.05)] transition hover:bg-[#4c382f] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPublishing
              ? reviewDialogCopy.publishingLabel
              : reviewDialogCopy.publishLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
