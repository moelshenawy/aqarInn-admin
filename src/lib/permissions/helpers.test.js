import { describe, expect, it } from 'vitest'

import {
  APP_ACTIONS,
  APP_RESOURCES,
  APP_ROLES,
  createPermission,
} from '@/lib/permissions/constants'
import { canAccessRoute, hasPermission } from '@/lib/permissions/helpers'

describe('permission helpers', () => {
  it('grants super admin access to privileged actions', () => {
    expect(
      hasPermission(
        APP_ROLES.superAdmin,
        createPermission(
          APP_RESOURCES.profitDistributions,
          APP_ACTIONS.distributeProfits,
        ),
      ),
    ).toBe(true)
  })

  it('prevents read only viewer from create actions', () => {
    expect(
      hasPermission(
        APP_ROLES.readOnlyViewer,
        createPermission(APP_RESOURCES.users, APP_ACTIONS.create),
      ),
    ).toBe(false)
  })

  it('uses all required permissions for route access', () => {
    expect(
      canAccessRoute(APP_ROLES.operationsAdmin, [
        createPermission(
          APP_RESOURCES.investmentOpportunities,
          APP_ACTIONS.view,
        ),
        createPermission(
          APP_RESOURCES.investmentOpportunities,
          APP_ACTIONS.publish,
        ),
      ]),
    ).toBe(true)
    expect(
      canAccessRoute(APP_ROLES.investmentManager, [
        createPermission(
          APP_RESOURCES.investmentOpportunities,
          APP_ACTIONS.view,
        ),
        createPermission(
          APP_RESOURCES.investmentOpportunities,
          APP_ACTIONS.publish,
        ),
      ]),
    ).toBe(false)
  })

  it('blocks non-super-admin roles from dashboard', () => {
    expect(
      hasPermission(
        APP_ROLES.operationsAdmin,
        createPermission(APP_RESOURCES.dashboard, APP_ACTIONS.view),
      ),
    ).toBe(false)
    expect(
      hasPermission(
        APP_ROLES.investmentManager,
        createPermission(APP_RESOURCES.dashboard, APP_ACTIONS.view),
      ),
    ).toBe(false)
  })

  it('limits users module to super admin only', () => {
    expect(
      hasPermission(
        APP_ROLES.readOnlyViewer,
        createPermission(APP_RESOURCES.users, APP_ACTIONS.view),
      ),
    ).toBe(false)
    expect(
      hasPermission(
        APP_ROLES.operationsAdmin,
        createPermission(APP_RESOURCES.users, APP_ACTIONS.view),
      ),
    ).toBe(false)
  })

  it('supports role-union permission checks', () => {
    expect(
      hasPermission(
        [APP_ROLES.readOnlyViewer, APP_ROLES.investmentManager],
        createPermission(
          APP_RESOURCES.profitDistributions,
          APP_ACTIONS.distributeProfits,
        ),
      ),
    ).toBe(true)
    expect(
      hasPermission(
        ['investmentManager', 'readOnlyViewer'],
        createPermission(
          APP_RESOURCES.profitDistributions,
          APP_ACTIONS.distributeProfits,
        ),
      ),
    ).toBe(true)
  })

  it('enforces investment manager action boundaries', () => {
    expect(
      hasPermission(
        APP_ROLES.investmentManager,
        createPermission(APP_RESOURCES.investmentOpportunities, APP_ACTIONS.view),
      ),
    ).toBe(true)
    expect(
      hasPermission(
        APP_ROLES.investmentManager,
        createPermission(APP_RESOURCES.profitDistributions, APP_ACTIONS.view),
      ),
    ).toBe(true)
    expect(
      hasPermission(
        APP_ROLES.investmentManager,
        createPermission(
          APP_RESOURCES.profitDistributions,
          APP_ACTIONS.distributeProfits,
        ),
      ),
    ).toBe(true)
    expect(
      hasPermission(
        APP_ROLES.investmentManager,
        createPermission(
          APP_RESOURCES.investmentOpportunities,
          APP_ACTIONS.create,
        ),
      ),
    ).toBe(false)
    expect(
      hasPermission(
        APP_ROLES.investmentManager,
        createPermission(
          APP_RESOURCES.investmentOpportunities,
          APP_ACTIONS.edit,
        ),
      ),
    ).toBe(false)
    expect(
      hasPermission(
        APP_ROLES.investmentManager,
        createPermission(
          APP_RESOURCES.investmentOpportunities,
          APP_ACTIONS.delete,
        ),
      ),
    ).toBe(false)
    expect(
      hasPermission(
        APP_ROLES.investmentManager,
        createPermission(
          APP_RESOURCES.investmentOpportunities,
          APP_ACTIONS.publish,
        ),
      ),
    ).toBe(false)
  })
})
