import {
  BellRing,
  Building2,
  ChartColumnDecreasing,
  LineChart,
  UserCheck,
  UserCircle2,
} from 'lucide-react'

import { SideModalShell } from '@/shared/components/side-modal-shell'
import { cn } from '@/lib/utils'

const activityIconByType = {
  account: UserCheck,
  opportunity: LineChart,
  search: Building2,
  watchlist: ChartColumnDecreasing,
  notification: BellRing,
}

const modalCopy = {
  ar: {
    title: 'عرض تفاصيل المستخدم',
    edit: 'تعديل',
    delete: 'حذف',
    status: 'نشط',
    identifier: 'الرقم التعريفي',
    email: 'عنوان البريد الإلكتروني',
    phone: 'رقم الهاتف',
    recentActivity: 'الانشطة الأخيرة',
    closeLabel: 'إغلاق النافذة',
  },
  en: {
    title: 'View user details',
    edit: 'Edit',
    delete: 'Delete',
    status: 'Active',
    identifier: 'Identifier',
    email: 'Email',
    phone: 'Phone',
    recentActivity: 'Recent activity',
    closeLabel: 'Close details panel',
  },
}

function ActivityCard({ activity }) {
  const Icon = activityIconByType[activity.icon] ?? BellRing

  return (
    <article className="flex items-start justify-between gap-3 rounded-[10px] border border-[#eae5d7] bg-[#f8f3e8] px-2.5 py-4">
      <div className="shrink-0 rounded-full border border-[#d6cbb2] p-2 text-[#6d4f3b]">
        <Icon className="size-5 stroke-[1.8]" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1 text-right">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h4 className="text-sm leading-5 font-semibold text-black">
            {activity.title}
          </h4>
          <p className="text-xs leading-[18px] font-medium text-[#717680]">
            {activity.date}
          </p>
        </div>
        <p className="text-sm leading-5 font-medium text-[#6d4f3b]">
          {activity.description}
        </p>
      </div>
    </article>
  )
}

export function UserDetailsModal({
  open,
  onOpenChange,
  user,
  onEdit,
  onDelete,
  isArabic = true,
}) {
  const copy = isArabic ? modalCopy.ar : modalCopy.en

  return (
    <SideModalShell
      open={open}
      onOpenChange={onOpenChange}
      title={copy.title}
      closeLabel={copy.closeLabel}
      side={isArabic ? 'left' : 'right'}
      className="h-full overflow-y-auto px-8 py-[38px]"
      closeButtonClassName={cn(
        'sm:top-[48px]',
        isArabic ? 'sm:-right-[72px]' : 'sm:-left-[72px]',
      )}
    >
      {user ? (
        <div className="flex flex-col gap-[24px] text-[#402f28]">
          <header className="flex items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d6cbb2] px-4 py-2 text-sm leading-5 font-semibold text-[#181927] transition hover:bg-[#efe7d7] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
              >
                <TrashIcon />
                {copy.delete}
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d6cbb2] px-4 py-2 text-sm leading-5 font-semibold text-[#181927] transition hover:bg-[#efe7d7] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
              >
                <EditIcon />
                {copy.edit}
              </button>
            </div>
            <h2 className="text-[42px] leading-8 font-semibold text-[#181927]">
              {copy.title}
            </h2>
          </header>

          <section className="space-y-[38px]">
            <div className="flex items-center justify-between gap-6">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eae5d7] py-1 ps-2.5 pe-3 text-2xl leading-6 font-semibold text-[#402f28]">
                <span className="size-2 rounded-full bg-[#12b76a]" />
                {copy.status}
              </span>
              <div className="flex items-start gap-[22px]">
                <div className="space-y-3 text-right">
                  <p className="text-2xl leading-6 font-bold text-[#181927]">
                    {user.fullName}
                  </p>
                  <p className="text-2xl leading-6 font-bold text-[#717680]">
                    {user.fullNameEn}
                  </p>
                  <p className="text-2xl leading-6 font-semibold text-[#6d4f3b]">
                    {user.secondaryRole
                      ? `${user.secondaryRole} • ${user.role}`
                      : user.role}
                  </p>
                </div>
                <span className="flex size-[82px] items-center justify-center rounded-full bg-[#eae5d7] text-[#402f28]">
                  <UserCircle2
                    className="size-10 stroke-[1.6]"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>

            <div className="rounded-[14px] border border-[#eae5d7] p-[18px]">
              <div className="flex items-center justify-between gap-6">
                <div className="w-36 text-right">
                  <p className="mb-3 text-sm leading-5 font-semibold text-[#ac9063]">
                    {copy.identifier}
                  </p>
                  <p className="text-[30px] leading-7 font-semibold text-[#402f28]">
                    {user.identifier}
                  </p>
                </div>
                <div className="h-12 w-px bg-[#d6cbb2]" />
                <div className="w-36 text-right">
                  <p className="mb-3 text-sm leading-5 font-semibold text-[#ac9063]">
                    {copy.email}
                  </p>
                  <p className="text-[30px] leading-7 font-semibold break-words text-[#402f28]">
                    {user.email}
                  </p>
                </div>
                <div className="h-12 w-px bg-[#d6cbb2]" />
                <div className="w-36 text-right">
                  <p className="mb-3 text-sm leading-5 font-semibold text-[#ac9063]">
                    {copy.phone}
                  </p>
                  <p className="text-[30px] leading-7 font-semibold text-[#402f28]">
                    {user.phone}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="text-lg leading-7 font-semibold text-[#402f28]">
              {copy.recentActivity}
            </h3>
            <div className="space-y-[15px]">
              {user.activities.map((activity) => (
                <ActivityCard
                  key={`${activity.date}-${activity.title}`}
                  activity={activity}
                />
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </SideModalShell>
  )
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="size-4 text-[#6d4f3b]"
      aria-hidden="true"
    >
      <path
        d="M2.5 5h15M7.5 2.5h5M8.333 8.333v5M11.667 8.333v5M4.167 5l.833 10a1.667 1.667 0 001.667 1.5h6.666A1.667 1.667 0 0015 15l.833-10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="size-4 text-[#6d4f3b]"
      aria-hidden="true"
    >
      <path
        d="M10.833 3.333H5A1.667 1.667 0 003.333 5v10A1.667 1.667 0 005 16.667h10A1.667 1.667 0 0016.667 15v-5.833M15.488 2.845a1.768 1.768 0 112.5 2.5L10 13.333l-3.333.833L7.5 10l7.988-7.155z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
