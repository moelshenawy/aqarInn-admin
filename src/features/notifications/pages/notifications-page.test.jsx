import { afterEach, describe, expect, it } from 'vitest'
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import {
  buildInvestmentOpportunityDetailsPath,
  ROUTE_PATHS,
} from '@/app/router/route-paths'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import {
  createInitialDashboardNotifications,
  formatDashboardNotificationDateTime,
} from '@/features/notifications/constants/dashboard-notifications'
import NotificationsPage from '@/features/notifications/pages/notifications-page'
import { notificationsRouteMeta } from '@/features/notifications/routes/notifications.route'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/language'

function DestinationPage({ title }) {
  return <h1>{title}</h1>
}

async function renderNotificationsRoute({
  initialEntries = [ROUTE_PATHS.notifications],
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

  const router = createMemoryRouter(
    [
      {
        path: '/app',
        element: <DashboardLayout />,
        children: [
          {
            path: 'notifications',
            element: <NotificationsPage />,
            handle: notificationsRouteMeta,
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
    {
      initialEntries,
    },
  )

  return {
    router,
    ...render(
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <AppDirectionProvider>
            <TooltipProvider delayDuration={0}>
              <RouterProvider router={router} />
            </TooltipProvider>
          </AppDirectionProvider>
        </AuthProvider>
      </I18nextProvider>,
    ),
  }
}

async function openNotificationsMenu() {
  const trigger = screen.getByRole('button', {
    name: i18n.t('notificationsBar.triggerLabel', { ns: 'notifications' }),
  })

  fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false })

  expect(
    await screen.findByText(
      i18n.t('notificationsBar.title', { ns: 'notifications' }),
    ),
  ).toBeInTheDocument()

  return trigger
}

describe('NotificationsPage route', () => {
  afterEach(async () => {
    window.localStorage.clear()
    await act(async () => {
      await i18n.changeLanguage('ar')
    })
  })

  it('renders the full retained notifications list in newest-first order', async () => {
    const allNotifications = createInitialDashboardNotifications()

    await renderNotificationsRoute({ language: 'en' })

    expect(
      screen.getByRole('heading', {
        name: i18n.t('notifications', { ns: 'navigation' }),
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        i18n.t('notificationsPage.description', { ns: 'notifications' }),
      ),
    ).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="notifications-page-content"]'),
    ).toHaveAttribute('dir', 'ltr')

    const pageItems = Array.from(
      document.querySelectorAll('[data-slot="notifications-page-item"]'),
    )

    expect(pageItems).toHaveLength(allNotifications.length)
    expect(pageItems.length).toBeGreaterThan(20)
    expect(pageItems[0]).toHaveAttribute(
      'data-notification-id',
      'notification-001',
    )
    expect(pageItems.at(-1)).toHaveAttribute(
      'data-notification-id',
      'notification-024',
    )
    expect(
      screen.getByText(
        i18n.t('notificationsPage.list.count', {
          ns: 'notifications',
          count: allNotifications.length,
        }),
      ),
    ).toBeInTheDocument()
  })

  it('marks page notifications as read, navigates to the related record, and syncs mark-all with the bell', async () => {
    const { router } = await renderNotificationsRoute({ language: 'en' })

    const firstNotification = document.querySelector(
      '[data-slot="notifications-page-item"][data-notification-id="notification-001"]',
    )

    expect(firstNotification).toHaveAttribute('data-state', 'unread')

    fireEvent.click(firstNotification)

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(
        buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
      )
    })
    expect(
      screen.getByRole('heading', { name: 'Opportunity details page' }),
    ).toBeInTheDocument()

    await openNotificationsMenu()

    expect(
      document.querySelector(
        '[data-slot="dashboard-notification-item"][data-notification-id="notification-001"]',
      ),
    ).toHaveAttribute('data-state', 'read')

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('notificationsBar.actions.viewAllNotifications', {
          ns: 'notifications',
        }),
      }),
    )

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(ROUTE_PATHS.notifications)
    })

    const markAllButton = screen.getByRole('button', {
      name: i18n.t('notificationsPage.actions.markAllAsRead', {
        ns: 'notifications',
      }),
    })

    fireEvent.click(markAllButton)

    expect(markAllButton).toBeDisabled()
    expect(
      document.querySelectorAll(
        '[data-slot="notifications-page-item"][data-state="unread"]',
      ),
    ).toHaveLength(0)
    expect(
      document.querySelector(
        '[data-slot="dashboard-notifications-trigger-indicator"]',
      ),
    ).toBeNull()
  })

  it('localizes the notifications page labels and timestamps in Arabic', async () => {
    await renderNotificationsRoute({ language: 'ar' })

    const firstSeedNotification = createInitialDashboardNotifications()[0]
    const firstNotification = document.querySelector(
      '[data-slot="notifications-page-item"][data-notification-id="notification-001"]',
    )

    expect(
      document.querySelector('[data-slot="notifications-page-content"]'),
    ).toHaveAttribute('dir', 'rtl')
    expect(
      screen.getByRole('button', {
        name: i18n.t('notificationsPage.actions.markAllAsRead', {
          ns: 'notifications',
        }),
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        i18n.t('notificationsPage.list.title', { ns: 'notifications' }),
      ),
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
