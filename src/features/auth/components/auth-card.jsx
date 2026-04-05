import { cn } from '@/lib/utils'

const variantClassNames = {
  login: 'auth-panel-card--login',
  compact: 'auth-panel-card--compact',
}

export function AuthCard({ className, children, variant = 'login' }) {
  return (
    <section
      className={cn(
        'auth-panel-card',
        variantClassNames[variant],
        className,
      )}
    >
      {children}
    </section>
  )
}
