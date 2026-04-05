import { ROUTE_PATHS } from '@/app/router/route-paths'

export const resetPasswordRouteMeta = {
  key: 'reset-password',
  titleKey: 'navigation.resetPassword',
  breadcrumbKey: 'navigation.resetPassword',
  descriptionKey: 'auth.resetPasswordDescription',
  requiredPermissions: [],
  showInNav: false,
}

export const resetPasswordRoute = {
  path: ROUTE_PATHS.resetPassword,
  async lazy() {
    const module = await import('@/features/auth/pages/reset-password-page')
    return { Component: module.default, handle: resetPasswordRouteMeta }
  },
}
