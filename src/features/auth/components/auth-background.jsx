import { cn } from '@/lib/utils'

export function AuthBackground({ className }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-y-0 end-0 w-full overflow-hidden lg:w-1/2',
        className,
      )}
    >
      <img
        src="/assets/imgs/Logo-mark.png"
        alt="عقار إن"
        className="auth-background-img absolute start-0 top-0 h-full w-full object-cover opacity-10"
      />
    </div>
  )
}
