import { cn } from '@/lib/utils'

export function RiyalIcon({ className, alt = 'ريال', style, ...props }) {
  return (
    <span
      role="img"
      aria-label={alt}
      className={cn(
        'inline-flex shrink-0 items-center justify-center text-[20px] leading-none font-normal text-current',
        className,
      )}
      style={{
        fontFamily: 'saudi_riyal',
        ...style,
      }}
      {...props}
    >
      {'\u20C1'}
    </span>
  )
}
