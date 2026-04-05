import { cn } from '@/lib/utils'

export function AuthBackground({ className }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-y-0 left-0 w-full overflow-hidden lg:w-1/2',
        className,
      )}
    >
      <img
        src={'/assets/imgs/Logo-mark.png'}
        alt="عقار إن"
        className="absolute top-0 left-0 h-full w-full object-cover opacity-10"
      />
    </div>
  )
}
