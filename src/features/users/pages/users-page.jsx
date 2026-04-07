import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Edit,
  MoreVertical,
  Plus,
  Trash2,
  User,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Can } from '@/lib/permissions/can'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'
import { cn } from '@/lib/utils'

const USERS_PAGE_SIZE = 10
const TOTAL_USERS = 100

const baseUsersRows = [
  {
    id: 'user-1',
    fullName: 'عبد العزيز أحمد سالم الهاشمي',
    identifier: 'AQIN001',
    role: 'مدير العمليات',
    email: 'phoenix@AqarInn',
    phone: '+966 55 555 5555',
    status: 'نشط',
  },
  {
    id: 'user-2',
    fullName: 'ليلى حسن علي الغامدي',
    identifier: 'AQIN001',
    role: 'مدير خدمة العملاء',
    email: 'phoenix@AqarInn',
    phone: '+966 55 555 5555',
    status: 'نشط',
  },
  {
    id: 'user-3',
    fullName: 'ريم عبد الرحمن سعود البلوي',
    identifier: 'AQIN001',
    role: 'أخصائي تطوير الأعمال',
    email: 'lana@AqarInn',
    phone: '+966 55 555 5555',
    status: 'نشط',
    highlighted: true,
  },
  {
    id: 'user-4',
    fullName: 'منى فيصل حمد السبيعي',
    identifier: 'AQIN001',
    role: 'مهندس معماري',
    email: 'demi@AqarInn',
    phone: '+966 55 555 5555',
    status: 'نشط',
  },
  {
    id: 'user-5',
    fullName: 'عبير سعد مبارك الدوسري',
    identifier: 'AQIN001',
    role: 'مدير مبيعات',
    email: 'demi@AqarInn',
    phone: '+966 55 555 5555',
    status: 'نشط',
  },
  {
    id: 'user-6',
    fullName: 'نورة خالد فهد الرويلي',
    identifier: 'AQIN001',
    role: 'مدير التسويق الرقمي',
    email: 'demi@AqarInn',
    phone: '+966 55 555 5555',
    status: 'نشط',
  },
  {
    id: 'user-7',
    fullName: 'فهد عبد الله مبارك العتيبي',
    identifier: 'AQIN001',
    role: 'أخصائي قانوني عقاري',
    email: 'demi@AqarInn',
    phone: '+966 55 555 5555',
    status: 'نشط',
  },
  {
    id: 'user-8',
    fullName: 'محمد إبراهيم حسن العسيري',
    identifier: 'AQIN001',
    role: 'محاسب مالي',
    email: 'orlando@AqarInn',
    phone: '+966 55 555 5555',
    status: 'نشط',
  },
  {
    id: 'user-9',
    fullName: 'سالم علي محمد الناصر',
    identifier: 'AQIN001',
    role: 'محلل استثمار عقاري',
    email: 'andi@AqarInn',
    phone: '+966 55 555 5555',
    status: 'نشط',
  },
  {
    id: 'user-10',
    fullName: 'هند طلال عبد العزيز العتيبي',
    identifier: 'AQIN001',
    role: 'مدير مشاريع البناء',
    email: 'demi@AqarInn',
    phone: '+966 55 555 5555',
    status: 'نشط',
  },
]

const usersRows = Array.from({ length: TOTAL_USERS }, (_, index) => {
  const baseRow = baseUsersRows[index % baseUsersRows.length]
  const rowNumber = index + 1

  return {
    ...baseRow,
    id: `user-${rowNumber}`,
    identifier:
      index < USERS_PAGE_SIZE
        ? baseRow.identifier
        : `AQIN${String(rowNumber).padStart(3, '0')}`,
    highlighted: rowNumber % USERS_PAGE_SIZE === 3,
  }
})

function getUsersPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis-end', totalPages - 2, totalPages - 1, totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, 3, 'ellipsis-start', totalPages - 2, totalPages - 1, totalPages]
  }

  return [
    1,
    'ellipsis-start',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis-end',
    totalPages,
  ]
}

function UserAvatarIcon() {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#eae5d7] bg-[#f8f3e8] text-[#402f28]">
      <User className="size-5 stroke-[1.8]" aria-hidden="true" />
    </span>
  )
}

function UserRowCheckbox({ label }) {
  return (
    <label className="relative inline-flex size-5 shrink-0 cursor-pointer items-center justify-center">
      <input type="checkbox" aria-label={label} className="peer sr-only" />
      <span
        className="pointer-events-none size-5 rounded-[6px] border border-[#d6cbb2] bg-transparent transition peer-checked:border-[#402f28] peer-checked:bg-[#402f28] peer-focus-visible:ring-3 peer-focus-visible:ring-[#9d7e55]/25"
        aria-hidden="true"
      />
      <Check
        className="pointer-events-none absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition peer-checked:opacity-100"
        aria-hidden="true"
      />
    </label>
  )
}

function UserStatusBadge({ children }) {
  return (
    <span className="inline-flex items-center justify-end gap-1 rounded-full border border-[#eae5d7] bg-[#f8f5ee] py-0.5 pe-[9px] ps-[11px] text-xs leading-[18px] font-medium text-[#402f28]">
      <span className="size-1.5 rounded-full bg-[#12b76a]" aria-hidden="true" />
      {children}
    </span>
  )
}

function UserTableAction({ label, children }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      className="size-7 rounded-md text-[#6d4f3b] hover:bg-[#eae5d7] hover:text-[#402f28] focus-visible:ring-[#9d7e55]/25"
    >
      {children}
    </Button>
  )
}

function UsersPagination({ currentPage, totalPages, onPageChange }) {
  const paginationItems = getUsersPaginationItems(currentPage, totalPages)

  return (
    <nav
      aria-label="ترقيم صفحات المستخدمين"
      className="flex min-h-[104px] items-center justify-between gap-4 border-t border-[#eae5d7] px-[30px] py-3"
    >
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex items-center gap-1.5 text-sm leading-5 font-semibold text-[#402f28] transition disabled:cursor-not-allowed disabled:opacity-45"
      >
        <span>السابق</span>
        <ArrowLeft className="size-4 stroke-[1.9]" aria-hidden="true" />
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {paginationItems.map((item, index) => {
          if (typeof item !== 'number') {
            return (
              <span
                key={`${item}-${index}`}
                className="inline-flex size-10 items-center justify-center rounded-lg text-sm leading-5 font-medium text-[#bfab85]"
              >
                ...
              </span>
            )
          }

          const isActive = item === currentPage

          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex size-10 items-center justify-center rounded-lg text-sm leading-5 font-medium transition-colors',
                isActive
                  ? 'bg-[#eae5d7] text-[#6d4f3b]'
                  : 'text-[#bfab85] hover:bg-[#eae5d7]/70',
              )}
            >
              {item}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex items-center gap-1.5 text-sm leading-5 font-semibold text-[#402f28] transition disabled:cursor-not-allowed disabled:opacity-45"
      >
        <ArrowRight className="size-4 stroke-[1.9]" aria-hidden="true" />
        <span>التالي</span>
      </button>
    </nav>
  )
}

function UsersManagementTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(usersRows.length / USERS_PAGE_SIZE)
  const visibleUsersRows = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PAGE_SIZE

    return usersRows.slice(startIndex, startIndex + USERS_PAGE_SIZE)
  }, [currentPage])

  function handlePageChange(nextPage) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  return (
    <section
      dir="rtl"
      aria-label="جميع المستخدمين"
      className="overflow-hidden rounded-xl border border-[#eae5d7] bg-[#f8f3e8] shadow-[var(--dashboard-shadow)]"
    >
      <header className="flex h-[77px] items-start border-b border-[#eae5d7] bg-[#eae5d7] px-6 pt-5">
        <div className="flex w-full items-start gap-2">
          <MoreVertical
            className="size-5 shrink-0 stroke-[1.8] text-[#9d7e55]"
            aria-hidden="true"
          />
          <h1 className="text-lg leading-7 font-semibold text-[#181927]">
            جميع المستخدمين
          </h1>
          <span className="rounded-full bg-[#f8f3e8] px-4 py-1.5 text-center text-xs leading-[18px] font-medium text-[#6d4f3b]">
            {usersRows.length} مستخدم
          </span>
          <Can allOf={[createPermission(APP_RESOURCES.users, APP_ACTIONS.create)]}>
            <Button
              type="button"
              dir="ltr"
              size="lg"
              className="ms-auto gap-2.5 rounded-full bg-[#402f28] px-5 py-2 text-sm leading-5 font-medium text-[#f8f3e8] hover:bg-[#4c382f] focus-visible:ring-[#9d7e55]/25"
            >
              <span>اضافة مستخدم</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-[#f8f3e8] text-[#402f28]">
                <Plus className="size-3.5 stroke-[2.4]" aria-hidden="true" />
              </span>
            </Button>
          </Can>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1116px] table-fixed border-collapse text-right">
          <colgroup>
            <col className="w-[329px]" />
            <col className="w-[85px]" />
            <col className="w-[188px]" />
            <col className="w-[159px]" />
            <col className="w-[159px]" />
            <col className="w-[106px]" />
            <col className="w-[90px]" />
          </colgroup>
          <thead>
            <tr className="h-11 border-b border-[#eae5d7] bg-[#f8f3e8] text-xs leading-[18px] font-bold text-[#5c4437]">
              <th className="px-6 font-bold">
                <div className="flex items-center justify-end gap-3" dir="ltr">
                  <span className="whitespace-nowrap">الاسم بالكامل</span>
                  <UserRowCheckbox label="تحديد كل المستخدمين" />
                </div>
              </th>
              <th className="px-6 font-bold">الرقم التعريفي</th>
              <th className="px-6 font-bold">الدور الوظيفي</th>
              <th className="px-6 font-bold">عنوان البريد الإلكتروني</th>
              <th className="px-6 font-bold">رقم الهاتف</th>
              <th className="px-6 font-bold">
                <div className="flex items-center justify-end gap-1">
                  <span>الحالة</span>
                  <ArrowDown className="size-3 stroke-[2]" aria-hidden="true" />
                </div>
              </th>
              <th className="px-4 font-bold" aria-label="الإجراءات" />
            </tr>
          </thead>
          <tbody>
            {visibleUsersRows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'h-[72px] border-b border-[#eae5d7] text-sm leading-5 text-[#402f28] last:border-b-0',
                  row.highlighted && 'bg-[#eae5d7]',
                )}
              >
                <td className="px-6 font-medium whitespace-nowrap text-[#181927]">
                  <div className="flex items-center justify-end gap-3" dir="ltr">
                    <span className="whitespace-nowrap">{row.fullName}</span>
                    <UserAvatarIcon />
                    <UserRowCheckbox label={`تحديد المستخدم ${row.fullName}`} />
                  </div>
                </td>
                <td className="px-6 font-normal">{row.identifier}</td>
                <td className="px-6 font-medium">{row.role}</td>
                <td className="px-6 font-normal">{row.email}</td>
                <td className="px-6 font-normal">{row.phone}</td>
                <td className="px-6">
                  <UserStatusBadge>{row.status}</UserStatusBadge>
                </td>
                <td className="px-4">
                  <div className="flex items-center justify-start gap-0.5" dir="ltr">
                    <UserTableAction label={`حذف المستخدم ${row.fullName}`}>
                      <Trash2 className="size-4 stroke-[1.8]" aria-hidden="true" />
                    </UserTableAction>
                    <UserTableAction label={`تعديل المستخدم ${row.fullName}`}>
                      <Edit className="size-4 stroke-[1.8]" aria-hidden="true" />
                    </UserTableAction>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UsersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  )
}

export default function UsersPage() {
  return (
    <div className="-mt-[17px]" dir="rtl">
      <UsersManagementTable />
    </div>
  )
}
