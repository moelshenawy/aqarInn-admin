import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'

import {
  buildInvestmentOpportunityDetailsPath,
  ROUTE_PATHS,
} from '@/app/router/route-paths'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import { DashboardTopbar } from '@/features/dashboard/components/dashboard-topbar'
import { dashboardTopbarUser } from '@/features/dashboard/constants/dashboard-ui'
import {
  createInitialDashboardNotifications,
  formatDashboardNotificationDateTime,
} from '@/features/notifications/constants/dashboard-notifications'
import { NotificationsProvider } from '@/features/notifications/context/notifications-provider'
import * as authService from '@/features/auth/services/auth-service'
import {
  getCities,
  getOpportunities,
} from '@/features/investment-opportunities/services/investment-opportunity-service'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/language'

vi.mock(
  '@/features/investment-opportunities/services/investment-opportunity-service',
  () => ({
    getCities: vi.fn(),
    getOpportunities: vi.fn(),
  }),
)

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function TopbarTestLayout() {
  const location = useLocation()

  return (
    <div>
      <DashboardTopbar
        title="Dashboard"
        user={dashboardTopbarUser}
        onOpenSidebar={() => {}}
      />
      <main>
        <p data-testid="current-path">{location.pathname}</p>
        <Outlet />
      </main>
    </div>
  )
}

function DestinationPage({ title }) {
  return <h1>{title}</h1>
}

async function renderDashboardTopbar({
  initialEntries = ['/app/dashboard'],
  language = 'en',
} = {}) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  window.localStorage.setItem('authToken', 'test-auth-token')
  window.localStorage.setItem(
    'authUser',
    JSON.stringify({
      id: 'admin-1',
      email: 'admin@aqarinn.test',
      full_name_ar: 'مدير النظام',
      full_name_en: 'System Admin',
    }),
  )

  await act(async () => {
    await i18n.changeLanguage(language)
  })

  const topbarRoutes = {
    element: <TopbarTestLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DestinationPage title="Dashboard home" />,
      },
      {
        path: 'notifications',
        element: <DestinationPage title="Notifications page" />,
      },
      {
        path: 'users',
        element: <DestinationPage title="Users page" />,
      },
      {
        path: 'activity-logs',
        element: <DestinationPage title="Activity logs page" />,
      },
      {
        path: 'investment-opportunities/:opportunityId',
        element: <DestinationPage title="Opportunity details page" />,
      },
      {
        path: 'investment-opportunities/:opportunityId/profit-distributions',
        element: <DestinationPage title="Profit distributions page" />,
      },
    ],
  }

  const router = createMemoryRouter(
    [
      {
        path: '/app',
        ...topbarRoutes,
      },
      {
        path: '/:locale/app',
        ...topbarRoutes,
      },
      {
        path: ROUTE_PATHS.login,
        element: <DestinationPage title="Login page" />,
      },
      {
        path: '/:locale/login',
        element: <DestinationPage title="Login page" />,
      },
    ],
    { initialEntries },
  )

  return {
    router,
    ...render(
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={createTestQueryClient()}>
          <AppDirectionProvider>
            <AuthProvider>
              <NotificationsProvider>
                <RouterProvider router={router} />
                <Toaster richColors closeButton />
              </NotificationsProvider>
            </AuthProvider>
          </AppDirectionProvider>
        </QueryClientProvider>
      </I18nextProvider>,
    ),
  }
}

function getNotificationsTriggerLabel() {
  return i18n.t('notificationsBar.triggerLabel', { ns: 'notifications' })
}

function getNotificationsTitle() {
  return i18n.t('notificationsBar.title', { ns: 'notifications' })
}

function getNotificationItems() {
  return Array.from(
    document.querySelectorAll('[data-slot="dashboard-notification-item"]'),
  )
}

function getUnreadIndicator() {
  return document.querySelector(
    '[data-slot="dashboard-notifications-trigger-indicator"]',
  )
}

async function openNotificationsMenu() {
  const trigger = screen.getByRole('button', {
    name: getNotificationsTriggerLabel(),
  })

  fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false })

  expect(await screen.findByText(getNotificationsTitle())).toBeInTheDocument()

  return trigger
}

async function openUserMenu() {
  const trigger = screen.getByRole('button', {
    name: i18n.t('openAccountMenu', { ns: 'auth' }),
  })

  fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false })

  await waitFor(() => {
    expect(
      document.querySelector('[data-slot="dashboard-user-menu-content"]'),
    ).not.toBeNull()
  })

  return trigger
}

describe('DashboardTopbar notifications bar', () => {
  beforeEach(() => {
    vi.mocked(getCities).mockResolvedValue([
      {
        id: 'city-riyadh',
        name_ar: 'الرياض',
        name_en: 'Riyadh',
      },
      {
        id: 'city-jeddah',
        name_ar: 'جدة',
        name_en: 'Jeddah',
      },
    ])
    vi.mocked(getOpportunities).mockResolvedValue({
      current_page: 1,
      last_page: 1,
      total: 1,
      per_page: 20,
      data: [
        {
          id: 'opp-001',
          reference_code: 'IO-RYD-001',
          title: 'Riyadh Opportunity',
          status: 'published',
          city_id: 'city-riyadh',
          neighborhood: 'Al Olaya',
          property_price: '100000.00',
          total_shares: 10,
          funded_shares: 2,
          city: {
            id: 'city-riyadh',
            name_ar: 'الرياض',
            name_en: 'Riyadh',
          },
        },
      ],
    })
  })

  afterEach(async () => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    window.localStorage.clear()
    await act(async () => {
      await i18n.changeLanguage('ar')
    })
  })

  it('renders notification details and marks a selected notification as read after navigation', async () => {
    await renderDashboardTopbar({ language: 'en' })

    expect(getUnreadIndicator()).not.toBeNull()

    await openNotificationsMenu()

    expect(
      screen.getByText(
        i18n.t('notificationsBar.header.unreadCount', {
          ns: 'notifications',
          count: 7,
        }),
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: i18n.t('notificationsBar.actions.markAllAsRead', {
          ns: 'notifications',
        }),
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: i18n.t('notificationsBar.actions.viewAllNotifications', {
          ns: 'notifications',
        }),
      }),
    ).toBeInTheDocument()

    const firstNotification = document.querySelector(
      '[data-notification-id="notification-001"]',
    )
    const secondNotification = document.querySelector(
      '[data-notification-id="notification-002"]',
    )

    expect(firstNotification).toHaveAttribute('data-state', 'unread')
    expect(secondNotification).toHaveAttribute('data-state', 'unread')
    expect(
      within(firstNotification).getByText('Funding milestone reached'),
    ).toBeInTheDocument()

    fireEvent.click(firstNotification)

    await waitFor(() => {
      expect(screen.getByTestId('current-path')).toHaveTextContent(
        buildInvestmentOpportunityDetailsPath('investment-riyadh-001', 'en'),
      )
    })

    await openNotificationsMenu()

    expect(
      document.querySelector('[data-notification-id="notification-001"]'),
    ).toHaveAttribute('data-state', 'read')
    expect(
      document.querySelector('[data-notification-id="notification-002"]'),
    ).toHaveAttribute('data-state', 'unread')
    expect(
      screen.getByText(
        i18n.t('notificationsBar.header.unreadCount', {
          ns: 'notifications',
          count: 6,
        }),
      ),
    ).toBeInTheDocument()
  })

  it('marks all notifications as read and navigates to the notifications list', async () => {
    await renderDashboardTopbar({ language: 'en' })

    await openNotificationsMenu()

    const markAllButton = screen.getByRole('button', {
      name: i18n.t('notificationsBar.actions.markAllAsRead', {
        ns: 'notifications',
      }),
    })

    fireEvent.click(markAllButton)

    expect(markAllButton).toBeDisabled()
    expect(
      screen.getByText(
        i18n.t('notificationsBar.header.unreadCount', {
          ns: 'notifications',
          count: 0,
        }),
      ),
    ).toBeInTheDocument()
    expect(
      document.querySelectorAll(
        '[data-slot="dashboard-notification-item"][data-state="unread"]',
      ),
    ).toHaveLength(0)
    expect(getUnreadIndicator()).toBeNull()

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('notificationsBar.actions.viewAllNotifications', {
          ns: 'notifications',
        }),
      }),
    )

    await waitFor(() => {
      expect(screen.getByTestId('current-path')).toHaveTextContent(
        ROUTE_PATHS.withLocale(ROUTE_PATHS.notifications, 'en'),
      )
    })
    expect(
      screen.getByRole('heading', { name: 'Notifications page' }),
    ).toBeInTheDocument()
  })

  it('inserts one live notification after five seconds and keeps the list capped at twenty items', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-12T12:00:00.000Z'))

    await renderDashboardTopbar({ language: 'en' })
    const trigger = screen.getByRole('button', {
      name: getNotificationsTriggerLabel(),
    })

    fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false })

    expect(screen.getByText(getNotificationsTitle())).toBeInTheDocument()

    expect(getNotificationItems()).toHaveLength(20)

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(getNotificationItems()).toHaveLength(20)

    const firstNotification = getNotificationItems()[0]

    expect(firstNotification).toHaveAttribute(
      'data-notification-id',
      'notification-live-001',
    )
    expect(
      within(firstNotification).getByText('New live alert'),
    ).toBeInTheDocument()
    expect(
      within(firstNotification).getByText(
        formatDashboardNotificationDateTime('2026-04-12T12:00:00.000Z', 'en'),
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        i18n.t('notificationsBar.header.unreadCount', {
          ns: 'notifications',
          count: 8,
        }),
      ),
    ).toBeInTheDocument()
    expect(
      document.querySelector('[data-notification-id="notification-020"]'),
    ).toBeNull()
  })

  it('localizes the menu content and timestamps in Arabic with right-to-left direction', async () => {
    await renderDashboardTopbar({ language: 'ar' })
    await openNotificationsMenu()

    const notificationsContent = document.querySelector(
      '[data-slot="dashboard-notifications-content"]',
    )
    const firstNotification = document.querySelector(
      '[data-notification-id="notification-001"]',
    )
    const firstSeedNotification = createInitialDashboardNotifications()[0]

    expect(notificationsContent).toHaveAttribute('dir', 'rtl')
    expect(
      screen.getByText(
        i18n.t('notificationsBar.header.unreadCount', {
          ns: 'notifications',
          count: 7,
        }),
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: i18n.t('notificationsBar.actions.markAllAsRead', {
          ns: 'notifications',
        }),
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: i18n.t('notificationsBar.actions.viewAllNotifications', {
          ns: 'notifications',
        }),
      }),
    ).toBeInTheDocument()
    expect(
      within(firstNotification).getByText(
        i18n.t('notificationsBar.items.fundingMilestone.title', {
          ns: 'notifications',
        }),
      ),
    ).toBeInTheDocument()
    expect(
      within(firstNotification).getByText(
        formatDashboardNotificationDateTime(
          firstSeedNotification.createdAt,
          'ar',
        ),
      ),
    ).toBeInTheDocument()
  })

  it('opens the account menu, confirms logout, clears session, and redirects to login', async () => {
    const logoutSpy = vi
      .spyOn(authService, 'logout')
      .mockResolvedValue({ message: 'Logged out.', data: null })

    await renderDashboardTopbar({ language: 'en' })
    await openUserMenu()

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('logout', { ns: 'auth' }),
      }),
    )

    const dialog = await screen.findByRole('dialog', {
      name: i18n.t('logoutConfirmTitle', { ns: 'auth' }),
    })

    fireEvent.click(
      within(dialog).getByRole('button', {
        name: i18n.t('logoutConfirmConfirm', { ns: 'auth' }),
      }),
    )

    await waitFor(() => {
      expect(logoutSpy).toHaveBeenCalledWith('test-auth-token')
    })

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Login page' }),
      ).toBeInTheDocument()
    })

    expect(window.localStorage.getItem('authToken')).toBeNull()
    expect(window.localStorage.getItem('authUser')).toBeNull()
  })

  it('opens filter modal and handles apply/reset/cancel actions', async () => {
    await renderDashboardTopbar({ language: 'en' })

    fireEvent.click(screen.getByRole('button', { name: 'الإعدادات' }))

    expect(
      await screen.findByRole('heading', { name: 'Filter opportunities' }),
    ).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'city-riyadh' },
    })
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'published' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Filter opportunities' })).toBeNull()
    })

    fireEvent.click(screen.getByRole('button', { name: 'الإعدادات' }))
    expect(screen.getByLabelText('City')).toHaveValue('city-riyadh')
    expect(screen.getByLabelText('Status')).toHaveValue('published')

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByLabelText('City')).toHaveValue('')
    expect(screen.getByLabelText('Status')).toHaveValue('')

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Filter opportunities' })).toBeNull()
    })
  })

  it('uses API query with search and applied filters in search modal', async () => {
    await renderDashboardTopbar({ language: 'en' })

    fireEvent.click(screen.getByRole('button', { name: 'البحث' }))
    expect(
      await screen.findByRole('heading', { name: 'Search opportunities' }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(getOpportunities).toHaveBeenCalledWith({
        page: 1,
        search: '',
        cityId: '',
        status: '',
      })
    })

    fireEvent.change(
      screen.getByPlaceholderText('Search opportunities'),
      { target: { value: 'riyadh' } },
    )

    await waitFor(() => {
      expect(getOpportunities).toHaveBeenCalledWith({
        page: 1,
        search: 'riyadh',
        cityId: '',
        status: '',
      })
    })

    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.click(screen.getByRole('button', { name: 'الإعدادات' }))
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'city-riyadh' },
    })
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'published' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))

    fireEvent.click(screen.getByRole('button', { name: 'البحث' }))
    fireEvent.change(
      screen.getByPlaceholderText('Search opportunities'),
      { target: { value: 'riyadh' } },
    )

    await waitFor(() => {
      expect(getOpportunities).toHaveBeenCalledWith({
        page: 1,
        search: 'riyadh',
        cityId: 'city-riyadh',
        status: 'published',
      })
    })
  })
})
