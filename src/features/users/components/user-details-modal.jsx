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
      <div className="min-w-0 flex-1 text-start">
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
            <h2 className="text-[24px] leading-8 font-semibold text-[#181927]">
              {copy.title}
            </h2>

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
          </header>

          <section className="space-y-[38px]">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-start gap-[22px]">
                <span className="flex size-[82px] items-center justify-center rounded-full bg-[#eae5d7] text-[#402f28]">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M41.0002 43.0504C41.0002 40.1895 41.0002 38.759 40.6471 37.595C39.8521 34.9743 37.8013 32.9235 35.1805 32.1285C34.0166 31.7754 32.5861 31.7754 29.7252 31.7754H19.4752C16.6143 31.7754 15.1838 31.7754 14.0199 32.1285C11.3991 32.9235 9.34828 34.9743 8.55329 37.595C8.2002 38.759 8.2002 40.1895 8.2002 43.0504M33.8252 15.3754C33.8252 20.4702 29.695 24.6004 24.6002 24.6004C19.5054 24.6004 15.3752 20.4702 15.3752 15.3754C15.3752 10.2806 19.5054 6.15039 24.6002 6.15039C29.695 6.15039 33.8252 10.2806 33.8252 15.3754Z"
                      stroke="#402F28"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <div className="space-y-3 text-start">
                  <p className="m-0 text-[16px] leading-6 font-bold text-[#181927]">
                    {user.fullName}
                  </p>
                  <p className="text-[16px] leading-6 font-bold text-[#717680]">
                    {user.fullNameEn}
                  </p>
                  <p className="text-[16px] leading-6 font-semibold text-[#6d4f3b]">
                    {user.secondaryRole
                      ? `${user.secondaryRole} • ${user.role}`
                      : user.role}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#eae5d7] py-1 ps-2.5 pe-3 text-[16px] leading-6 font-semibold text-[#402f28]">
                <span className="size-2 rounded-full bg-[#12b76a]" />
                {copy.status}
              </span>
            </div>

            <div className="rounded-[14px] border border-[#eae5d7] p-[18px]">
              <div className="flex items-center justify-between gap-6">
                <div className="w-36 text-start">
                  <p className="mb-3 text-sm leading-5 font-semibold text-[#ac9063]">
                    {copy.identifier}
                  </p>
                  <p className="text-[16px] leading-7 font-semibold text-[#402f28]">
                    {user.identifier}
                  </p>
                </div>
                <div className="h-12 w-px bg-[#d6cbb2]" />
                <div className="w-36 text-start">
                  <p className="mb-3 text-sm leading-5 font-semibold text-[#ac9063]">
                    {copy.email}
                  </p>
                  <p className="text-[16px] leading-7 font-semibold break-words text-[#402f28]">
                    {user.email}
                  </p>
                </div>
                <div className="h-12 w-px bg-[#d6cbb2]" />
                <div className="w-36 text-start">
                  <p className="mb-3 text-sm leading-5 font-semibold text-[#ac9063]">
                    {copy.phone}
                  </p>
                  <p className="text-[16px] leading-7 font-semibold text-[#402f28]">
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
