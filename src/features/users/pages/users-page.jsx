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
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  showDashboardErrorToast,
  showDashboardSuccessToast,
} from '@/components/ui/dashboard-toast'
import { Button } from '@/components/ui/button'
import { Can } from '@/lib/permissions/can'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'
import { cn } from '@/lib/utils'
import { UserDetailsModal } from '@/features/users/components/user-details-modal'
import { ConfirmationDialog } from '@/shared/components/confirmation-dialog'
import { useUsersQuery } from '@/features/users/hooks/use-users-query'
import { useDeleteUserMutation } from '@/features/users/hooks/use-delete-user-mutation'

const USERS_PAGE_SIZE = 10
const USERS_TABLE_SKELETON_ROWS = 6

const usersCopy = {
  ar: {
    tableRegionLabel: 'جميع المستخدمين',
    tableTitle: 'جميع المستخدمين',
    usersCountSuffix: 'مستخدم',
    addUser: 'اضافة مستخدم',
    fullNameHeader: 'الاسم بالكامل',
    selectAllUsers: 'تحديد كل المستخدمين',
    identifierHeader: 'الرقم التعريفي',
    roleHeader: 'الدور الوظيفي',
    emailHeader: 'عنوان البريد الإلكتروني',
    phoneHeader: 'رقم الهاتف',
    statusHeader: 'الحالة',
    actionsHeader: 'الإجراءات',
    selectUser: 'تحديد المستخدم',
    deleteUser: 'حذف المستخدم',
    editUser: 'تعديل المستخدم',
    paginationLabel: 'ترقيم صفحات المستخدمين',
    previousPage: 'السابق',
    nextPage: 'التالي',
    emptyState: 'لا يوجد مستخدمون',
    deleteDialog: {
      title: 'حذف المستخدم',
      description:
        'هل أنت متأكد من حذف المستخدم؟ لا يمكن التراجع عن هذا الإجراء.',
      confirm: 'حذف',
      cancel: 'الغاء',
      close: 'إغلاق النافذة',
    },
    toasts: {
      deletedTitle: 'تم حذف المستخدم بنجاح',
      deletedDescription: 'تم حذف المستخدم من قائمة المستخدمين النشطين.',
      fixedSuperAdminCannotDeleteTitle: 'لا يمكن حذف السوبر أدمن الثابت',
      fixedSuperAdminCannotDeleteDescription:
        'هذا المستخدم أساسي في النظام ولا يمكن حذفه.',
      systemUserCannotDeleteTitle: 'لا يمكن حذف المستخدم السوبر ادمن',
      systemUserCannotDeleteDescription:
        'هذا المستخدم مرتبط بمهام نظامية ولا يمكن حذفه.',
      actionLabel: 'إغلاق',
    },
  },
  en: {
    tableRegionLabel: 'All users',
    tableTitle: 'All users',
    usersCountSuffix: 'users',
    addUser: 'Add user',
    fullNameHeader: 'Full name',
    selectAllUsers: 'Select all users',
    identifierHeader: 'Identifier',
    roleHeader: 'Role',
    emailHeader: 'Email',
    phoneHeader: 'Phone number',
    statusHeader: 'Status',
    actionsHeader: 'Actions',
    selectUser: 'Select user',
    deleteUser: 'Delete user',
    editUser: 'Edit user',
    paginationLabel: 'Users pagination',
    previousPage: 'Previous',
    nextPage: 'Next',
    emptyState: 'No users found',
    deleteDialog: {
      title: 'Delete user',
      description:
        'Are you sure you want to delete this user? This action cannot be undone.',
      confirm: 'Delete',
      cancel: 'Cancel',
      close: 'Close dialog',
    },
    toasts: {
      deletedTitle: 'User deleted successfully',
      deletedDescription: 'The user was removed from the active users list.',
      fixedSuperAdminCannotDeleteTitle: 'Fixed super admin cannot be deleted',
      fixedSuperAdminCannotDeleteDescription:
        'This account is protected and cannot be deleted.',
      systemUserCannotDeleteTitle: 'System user cannot be deleted',
      systemUserCannotDeleteDescription:
        'This account is critical for system operations and cannot be deleted.',
      actionLabel: 'Close',
    },
  },
}

function mapApiUserToRow(user, index, isArabic) {
  const statusLabelMap = {
    active: isArabic ? 'نشط' : 'Active',
    inactive: isArabic ? 'غير نشط' : 'Inactive',
    suspended: isArabic ? 'موقوف' : 'Suspended',
  }
  const fullName =
    user.full_name_ar ?? user.full_name ?? user.full_name_en ?? user.name ?? '-'
  const fullNameEn =
    user.full_name_en ?? user.full_name ?? user.full_name_ar ?? user.name ?? '-'
  const roleValue = user.role ?? ''
  const roleLabel =
    user.role_label ?? user.role ?? (isArabic ? 'بدون دور' : 'No role')
  const secondaryRole =
    Array.isArray(user.roles) && user.roles.length > 0
      ? user.roles.filter((role) => role !== roleValue).join(' • ')
      : ''

  return {
    id: user.id,
    fullName,
    identifier:
      user.code ??
      (String(user.id ?? '')
        .slice(0, 8)
        .toUpperCase() ||
        '-'),
    role: roleLabel,
    roleValue,
    email: user.email ?? '-',
    phone: user.mobile_number ?? '-',
    status: statusLabelMap[user.status] ?? user.status ?? '-',
    highlighted: (index + 1) % USERS_PAGE_SIZE === 3,
    fullNameEn,
    secondaryRole,
    activities: [
      {
        date: user.last_login_at
          ? new Date(user.last_login_at).toLocaleDateString()
          : '-',
        title: isArabic ? 'آخر تسجيل دخول' : 'Last login',
        description: user.last_login_at
          ? new Date(user.last_login_at).toLocaleString()
          : isArabic
            ? 'لا يوجد تسجيل دخول بعد'
            : 'No login yet',
        icon: 'account',
      },
      {
        date: user.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : '-',
        title: isArabic ? 'تاريخ التسجيل' : 'Registration date',
        description: user.created_at
          ? new Date(user.created_at).toLocaleString()
          : '-',
        icon: 'notification',
      },
    ],
    fromApi: true,
    originalUser: user,
    isSystemUser: Boolean(user.is_system_protected),
    isFixedSuperAdmin: false,
  }
}

function buildEditFormPrefill(row) {
  return {
    code: row.identifier,
    fullNameAr: row.fullName,
    fullNameEn: row.fullNameEn ?? '',
    email: row.email,
    mobile: row.phone,
    role: row.roleValue ?? '',
    active: row.status === 'نشط' || row.status === 'Active',
  }
}

function getUsersPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis-end', totalPages - 2, totalPages - 1, totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      2,
      3,
      'ellipsis-start',
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
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
      <input
        type="checkbox"
        aria-label={label}
        className="peer sr-only"
        onClick={(event) => event.stopPropagation()}
      />
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

function UserStatusBadge({ status, children }) {
  const isInactive = status === 'inactive'

  return (
    <span className="inline-flex flex-nowrap items-center justify-end gap-1 rounded-full border border-[#eae5d7] bg-[#f8f5ee] py-0.5 ps-[11px] pe-[9px] text-xs leading-[18px] font-medium whitespace-nowrap text-[#402f28]">
      <span
        className={cn(
          'size-1.5 rounded-full',
          isInactive ? 'bg-[#f04438]' : 'bg-[#12b76a]',
        )}
        aria-hidden="true"
      />
      <span className="whitespace-nowrap">{children}</span>
    </span>
  )
}

function UserTableAction({ label, onClick, children }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      onClick={onClick}
      className="size-7 rounded-md text-[#6d4f3b] hover:bg-[#eae5d7] hover:text-[#402f28] focus-visible:ring-[#9d7e55]/25"
    >
      {children}
    </Button>
  )
}

function UsersPagination({ copy, currentPage, totalPages, onPageChange }) {
  const paginationItems = getUsersPaginationItems(currentPage, totalPages)

  return (
    <nav
      aria-label={copy.paginationLabel}
      className="flex min-h-[104px] items-center justify-between gap-4 border-t border-[#eae5d7] px-[30px] py-3"
    >
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex items-center gap-1.5 text-sm leading-5 font-semibold text-[#402f28] transition disabled:cursor-not-allowed disabled:opacity-45"
      >
        <ArrowRight className="size-4 stroke-[1.9]" aria-hidden="true" />
        <span>{copy.nextPage}</span>
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
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex items-center gap-1.5 text-sm leading-5 font-semibold text-[#402f28] transition disabled:cursor-not-allowed disabled:opacity-45"
      >
        <span>{copy.previousPage}</span>
        <ArrowLeft className="size-4 stroke-[1.9]" aria-hidden="true" />
      </button>
    </nav>
  )
}

function UsersTableSkeleton({ copy, isArabic }) {
  return (
    <tbody aria-label="users-loading">
      {Array.from({ length: USERS_TABLE_SKELETON_ROWS }, (_, index) => (
        <tr
          key={`users-skeleton-${index + 1}`}
          className="h-[72px] border-b border-[#eae5d7] text-sm leading-5 last:border-b-0"
        >
          <td className="px-6">
            <div
              className="flex items-center justify-start gap-3"
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <span className="size-5 rounded-[6px] bg-[#ece3d2]" />
              <span className="size-10 rounded-full bg-[#ece3d2]" />
              <span className="h-4 w-40 rounded-full bg-[#ece3d2]" />
            </div>
          </td>
          <td className="px-6">
            <span className="block h-4 w-16 rounded-full bg-[#ece3d2]" />
          </td>
          <td className="px-6">
            <span className="mx-auto block h-4 w-28 rounded-full bg-[#ece3d2]" />
          </td>
          <td className="px-6">
            <span className="block h-4 w-32 rounded-full bg-[#ece3d2]" />
          </td>
          <td className="px-6">
            <span className="block h-4 w-24 rounded-full bg-[#ece3d2]" />
          </td>
          <td className="px-6">
            <span className="block h-6 w-20 rounded-full bg-[#ece3d2]" />
          </td>
          <td className="px-4">
            <div className="flex items-center gap-2">
              <span className="size-7 rounded-md bg-[#ece3d2]" />
              <span className="size-7 rounded-md bg-[#ece3d2]" />
            </div>
          </td>
        </tr>
      ))}
      <tr className="sr-only">
        <td colSpan={7}>{copy.tableTitle}</td>
      </tr>
    </tbody>
  )
}

function UsersManagementTable() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [deletedUserIds, setDeletedUserIds] = useState([])
  const [pendingDeleteUser, setPendingDeleteUser] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const isArabic = i18n.resolvedLanguage !== 'en'
  const copy = isArabic ? usersCopy.ar : usersCopy.en
  const { data: usersResponse, isLoading, isPending } = useUsersQuery()
  const deleteUserMutation = useDeleteUserMutation()

  const apiUsersRows = useMemo(() => {
    const users = Array.isArray(usersResponse?.data) ? usersResponse.data : []
    return users.map((user, index) => mapApiUserToRow(user, index, isArabic))
  }, [isArabic, usersResponse])

  const activeUsersRows = useMemo(
    () => apiUsersRows.filter((row) => !deletedUserIds.includes(row.id)),
    [apiUsersRows, deletedUserIds],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(activeUsersRows.length / USERS_PAGE_SIZE),
  )

  const safeCurrentPage = Math.min(currentPage, totalPages)
  const visibleUsersRows = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * USERS_PAGE_SIZE
    return activeUsersRows.slice(startIndex, startIndex + USERS_PAGE_SIZE)
  }, [activeUsersRows, safeCurrentPage])

  function handlePageChange(nextPage) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  function handleEditUser(row) {
    navigate(
      ROUTE_PATHS.withLocale(ROUTE_PATHS.usersAdd, i18n.resolvedLanguage),
      {
        state: {
          mode: 'edit',
          userId: row.id,
          userFormPrefill: buildEditFormPrefill(row),
        },
      },
    )
  }

  function handleOpenUserDetails(row) {
    setSelectedUser(row)
  }

  function handleDeleteUser(event, row) {
    event.stopPropagation()
    setPendingDeleteUser(row)
  }

  function handleEditUserFromTable(event, row) {
    event.stopPropagation()
    handleEditUser(row)
  }

  function handleDeleteFromDetails() {
    if (!selectedUser) {
      return
    }

    setPendingDeleteUser(selectedUser)
    setSelectedUser(null)
  }

  function handleEditFromDetails() {
    if (!selectedUser) {
      return
    }

    const userToEdit = selectedUser
    setSelectedUser(null)
    handleEditUser(userToEdit)
  }

  function showDeleteBlockedToast(title, description) {
    showDashboardErrorToast({
      title,
      description,
      actionLabel: copy.toasts.actionLabel,
    })
  }

  function handleConfirmDelete() {
    if (!pendingDeleteUser) {
      return
    }

    if (pendingDeleteUser.isFixedSuperAdmin) {
      showDeleteBlockedToast(
        copy.toasts.fixedSuperAdminCannotDeleteTitle,
        copy.toasts.fixedSuperAdminCannotDeleteDescription,
      )
      setPendingDeleteUser(null)
      return
    }

    if (pendingDeleteUser.isSystemUser) {
      showDeleteBlockedToast(
        copy.toasts.systemUserCannotDeleteTitle,
        copy.toasts.systemUserCannotDeleteDescription,
      )
      setPendingDeleteUser(null)
      return
    }

    deleteUserMutation.mutate(pendingDeleteUser.id, {
      onSuccess: () => {
        setDeletedUserIds((prev) => [...prev, pendingDeleteUser.id])
        if (selectedUser?.id === pendingDeleteUser.id) {
          setSelectedUser(null)
        }
        setPendingDeleteUser(null)
        showDashboardSuccessToast({
          title: copy.toasts.deletedTitle,
          description: copy.toasts.deletedDescription,
          actionLabel: copy.toasts.actionLabel,
        })
      },
      onError: () => {
        setPendingDeleteUser(null)
        showDashboardErrorToast({
          title: isArabic ? 'فشل الحذف' : 'Delete failed',
          description: isArabic
            ? 'تعذر حذف المستخدم. حاول مرة أخرى.'
            : 'Unable to delete user. Please try again.',
          actionLabel: copy.toasts.actionLabel,
        })
      },
    })
  }

  const isTableLoading = Boolean(isLoading || isPending)
  const showEmptyState = !isTableLoading && visibleUsersRows.length === 0

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-label={copy.tableRegionLabel}
      className="overflow-hidden rounded-xl border border-[#eae5d7] bg-[#f8f3e8] shadow-[var(--dashboard-shadow)]"
    >
      <header className="flex h-[77px] items-start border-b border-[#eae5d7] bg-[#eae5d7] px-6 pt-5">
        <div className="flex w-full items-start gap-2">
          <MoreVertical
            className="size-5 shrink-0 stroke-[1.8] text-[#9d7e55]"
            aria-hidden="true"
          />
          <h1 className="text-lg leading-7 font-semibold text-[#181927]">
            {copy.tableTitle}
          </h1>
          <span className="rounded-full bg-[#f8f3e8] px-4 py-1.5 text-center text-xs leading-[18px] font-medium text-[#6d4f3b]">
            {isTableLoading ? '...' : activeUsersRows.length}{' '}
            {copy.usersCountSuffix}
          </span>
          <Can
            allOf={[createPermission(APP_RESOURCES.users, APP_ACTIONS.create)]}
          >
            <Button
              type="button"
              dir={isArabic ? 'rtl' : 'ltr'}
              size="lg"
              onClick={() =>
                navigate(
                  ROUTE_PATHS.withLocale(
                    ROUTE_PATHS.usersAdd,
                    i18n.resolvedLanguage,
                  ),
                )
              }
              className="ms-auto gap-2.5 rounded-full bg-[#402f28] px-5 py-2 text-sm leading-5 font-medium text-[#f8f3e8] hover:bg-[#4c382f] focus-visible:ring-[#9d7e55]/25"
            >
              <span>{copy.addUser}</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-[#f8f3e8] text-[#402f28]">
                <Plus className="size-3.5 stroke-[2.4]" aria-hidden="true" />
              </span>
            </Button>
          </Can>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1116px] table-fixed border-collapse text-start">
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
                <div
                  className="flex items-center justify-start gap-3"
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  <span className="whitespace-nowrap">
                    {copy.fullNameHeader}
                  </span>
                  <UserRowCheckbox label={copy.selectAllUsers} />
                </div>
              </th>
              <th className="px-6 font-bold">{copy.identifierHeader}</th>
              <th className="px-6 font-bold">{copy.roleHeader}</th>
              <th className="px-6 font-bold">{copy.emailHeader}</th>
              <th className="px-6 font-bold">{copy.phoneHeader}</th>
              <th className="px-6 font-bold">
                <div className="flex items-center justify-end gap-1">
                  <span>{copy.statusHeader}</span>
                  <ArrowDown className="size-3 stroke-[2]" aria-hidden="true" />
                </div>
              </th>
              <th className="px-4 font-bold" aria-label={copy.actionsHeader} />
            </tr>
          </thead>

          {isTableLoading ? (
            <UsersTableSkeleton copy={copy} isArabic={isArabic} />
          ) : null}

          {!isTableLoading ? (
            <tbody>
              {visibleUsersRows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'min-h-[72px] cursor-pointer border-b border-[#eae5d7] text-sm leading-5 text-[#402f28] last:border-b-0',
                    row.highlighted && 'bg-[#eae5d7]',
                  )}
                  onClick={() => handleOpenUserDetails(row)}
                >
                  <td className="px-6 py-3 align-top font-medium text-[#181927]">
                    <div
                      className="flex min-w-0 items-center justify-start gap-3"
                      dir={isArabic ? 'rtl' : 'ltr'}
                    >
                      <UserRowCheckbox
                        label={`${copy.selectUser} ${row.fullName}`}
                      />
                      <UserAvatarIcon />
                      <span
                        title={row.fullName}
                        className="block min-w-0 flex-1 whitespace-normal break-words [overflow-wrap:anywhere]"
                      >
                        {row.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-top font-normal whitespace-nowrap">
                    {row.identifier}
                  </td>
                  <td className="px-6 py-3 align-top text-center font-medium">
                    <span
                      title={row.role}
                      className="block whitespace-normal break-words [overflow-wrap:anywhere]"
                    >
                      {row.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 align-top font-normal">
                    <span
                      dir="ltr"
                      title={row.email}
                      className="block text-start whitespace-normal break-words [overflow-wrap:anywhere]"
                    >
                      {row.email}
                    </span>
                  </td>
                  <td className="px-6 py-3 align-top font-normal">
                    <span
                      dir="ltr"
                      title={row.phone}
                      className="block text-start whitespace-normal break-words [overflow-wrap:anywhere]"
                    >
                      {row.phone}
                    </span>
                  </td>
                  <td className="px-6 py-3 align-top">
                    <UserStatusBadge status={row.originalUser?.status}>
                      {row.status}
                    </UserStatusBadge>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Can
                      allOf={[
                        createPermission(APP_RESOURCES.users, APP_ACTIONS.edit),
                      ]}
                    >
                      <div
                        className="flex items-center justify-start gap-0.5"
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        <UserTableAction
                          label={`${copy.deleteUser} ${row.fullName}`}
                          onClick={(event) => handleDeleteUser(event, row)}
                        >
                          <Trash2
                            className="size-4 stroke-[1.8]"
                            aria-hidden="true"
                          />
                        </UserTableAction>
                        <UserTableAction
                          label={`${copy.editUser} ${row.fullName}`}
                          onClick={(event) =>
                            handleEditUserFromTable(event, row)
                          }
                        >
                          <Edit
                            className="size-4 stroke-[1.8]"
                            aria-hidden="true"
                          />
                        </UserTableAction>
                      </div>
                    </Can>
                  </td>
                </tr>
              ))}

              {showEmptyState ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center text-sm font-medium text-[#6d4f3b]"
                  >
                    {copy.emptyState}
                  </td>
                </tr>
              ) : null}
            </tbody>
          ) : null}
        </table>
      </div>

      {!isTableLoading && activeUsersRows.length > 0 ? (
        <UsersPagination
          copy={copy}
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : null}

      <ConfirmationDialog
        open={Boolean(pendingDeleteUser)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setPendingDeleteUser(null)
          }
        }}
        title={copy.deleteDialog.title}
        description={copy.deleteDialog.description}
        confirmLabel={copy.deleteDialog.confirm}
        cancelLabel={copy.deleteDialog.cancel}
        closeLabel={copy.deleteDialog.close}
        confirmVariant="destructive"
        dir={isArabic ? 'rtl' : 'ltr'}
        onConfirm={handleConfirmDelete}
      />

      <UserDetailsModal
        open={Boolean(selectedUser)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setSelectedUser(null)
          }
        }}
        user={selectedUser}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteFromDetails}
        isArabic={isArabic}
      />
    </section>
  )
}

export default function UsersPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.resolvedLanguage !== 'en'

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="-mt-[31px] flex flex-col gap-6 px-[26px] py-5 pb-8"
    >
      <UsersManagementTable />
    </div>
  )
}
