import { ROUTE_PATHS } from '@/app/router/route-paths'

export const forgotPasswordRouteMeta = {
  key: 'forgot-password',
  titleKey: 'navigation.forgotPassword',
  breadcrumbKey: 'navigation.forgotPassword',
  descriptionKey: 'auth.forgotPasswordDescription',
  requiredPermissions: [],
  showInNav: false,
}

export const forgotPasswordRoute = {
  path: 'forgot-password',
  async lazy() {
    const module = await import('@/features/auth/pages/forgot-password-page')
    return { Component: module.default, handle: forgotPasswordRouteMeta }
  },
}
