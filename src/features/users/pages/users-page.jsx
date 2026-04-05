import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'
import { Can } from '@/lib/permissions/can'
import { AppButton } from '@/shared/components/app-button'
import { DataTableShell } from '@/shared/components/data-table-shell'
import { ModulePlaceholderPage } from '@/shared/components/module-placeholder-page'

const rows = [
  {
    id: 'USR-001',
    name: 'Nada F.',
    role: 'Super Admin',
    email: 'nada@aqarinn.sa',
  },
  {
    id: 'USR-002',
    name: 'Omar H.',
    role: 'Operations Admin',
    email: 'omar@aqarinn.sa',
  },
]

export default function UsersPage() {
  const { t } = useTranslation('common')
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    { key: 'email', header: 'Email' },
  ]

  return (
    <ModulePlaceholderPage
      titleKey="navigation:users"
      description={t('placeholderMessage')}
      actions={
        <Can
          allOf={[createPermission(APP_RESOURCES.users, APP_ACTIONS.create)]}
        >
          <AppButton>
            <Plus className="size-4" />
            Add user
          </AppButton>
        </Can>
      }
    >
      <DataTableShell columns={columns} data={rows} />
    </ModulePlaceholderPage>
  )
}
