import { ROUTE_PATHS } from '@/app/router/route-paths'

export const loginRouteMeta = {
  key: 'login',
  titleKey: 'navigation.login',
  breadcrumbKey: 'navigation.login',
  descriptionKey: 'auth.loginDescription',
  requiredPermissions: [],
  showInNav: false,
}

export const loginRoute = {
  path: ROUTE_PATHS.login,
  async lazy() {
    const module = await import('@/features/auth/pages/login-page')
    return { Component: module.default, handle: loginRouteMeta }
  },
}
