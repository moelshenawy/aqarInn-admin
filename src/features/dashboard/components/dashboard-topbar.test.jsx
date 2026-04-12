import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
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
import { DashboardTopbar } from '@/features/dashboard/components/dashboard-topbar'
import { dashboardTopbarUser } from '@/features/dashboard/constants/dashboard-ui'
import {
  createInitialDashboardNotifications,
  formatDashboardNotificationDateTime,
} from '@/features/notifications/constants/dashboard-notifications'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/language'

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

  await act(async () => {
    await i18n.changeLanguage(language)
  })

  const router = createMemoryRouter(
    [
      {
        path: '/app',
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
      },
    ],
    { initialEntries },
  )

  return {
    router,
    ...render(
      <I18nextProvider i18n={i18n}>
        <AppDirectionProvider>
          <RouterProvider router={router} />
        </AppDirectionProvider>
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

describe('DashboardTopbar notifications bar', () => {
  afterEach(async () => {
    vi.useRealTimers()
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
    expect(within(firstNotification).getByText('Funding milestone reached')).toBeInTheDocument()

    fireEvent.click(firstNotification)

    await waitFor(() => {
      expect(screen.getByTestId('current-path')).toHaveTextContent(
        buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
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
        ROUTE_PATHS.notifications,
      )
    })
    expect(screen.getByRole('heading', { name: 'Notifications page' })).toBeInTheDocument()
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

    expect(getNotificationItems()).toHaveLength(19)

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(getNotificationItems()).toHaveLength(20)

    const firstNotification = getNotificationItems()[0]

    expect(firstNotification).toHaveAttribute(
      'data-notification-id',
      'notification-live-001',
    )
    expect(within(firstNotification).getByText('New live alert')).toBeInTheDocument()
    expect(
      within(firstNotification).getByText(
        formatDashboardNotificationDateTime(
          '2026-04-12T12:00:00.000Z',
          'en',
        ),
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
})
