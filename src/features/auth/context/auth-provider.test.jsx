import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { AuthProvider, useAuth } from '@/features/auth/context/auth-provider'
import { APP_ROLES } from '@/lib/permissions/constants'

function AuthSnapshot() {
  const { role, roles } = useAuth()

  return (
    <div>
      <p data-testid="role">{role}</p>
      <p data-testid="roles">{roles.join('|')}</p>
    </div>
  )
}

function AuthLoginHarness() {
  const { role, roles, login } = useAuth()

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          login({
            token: 'token-1',
            admin: {
              role: 'investmentManager',
              roles: ['readOnlyViewer', 'investmentManager', 'superAdmin'],
            },
          })
        }
      >
        login
      </button>
      <p data-testid="role">{role}</p>
      <p data-testid="roles">{roles.join('|')}</p>
    </div>
  )
}

describe('AuthProvider role normalization', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('normalizes stored auth roles and keeps a primary role', () => {
    window.localStorage.setItem('authToken', 'token-1')
    window.localStorage.setItem(
      'authUser',
      JSON.stringify({
        role: 'investmentManager',
        roles: ['operationsAdmin', 'investmentManager'],
      }),
    )

    render(
      <AuthProvider>
        <AuthSnapshot />
      </AuthProvider>,
    )

    expect(screen.getByTestId('role')).toHaveTextContent(
      APP_ROLES.operationsAdmin,
    )
    expect(screen.getByTestId('roles')).toHaveTextContent(
      `${APP_ROLES.investmentManager}|${APP_ROLES.operationsAdmin}`,
    )
  })

  it('normalizes login payload and prioritizes super admin as primary role', () => {
    render(
      <AuthProvider>
        <AuthLoginHarness />
      </AuthProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'login' }))

    expect(screen.getByTestId('role')).toHaveTextContent(APP_ROLES.superAdmin)
    expect(screen.getByTestId('roles')).toHaveTextContent(
      `${APP_ROLES.investmentManager}|${APP_ROLES.readOnlyViewer}|${APP_ROLES.superAdmin}`,
    )
  })
})
