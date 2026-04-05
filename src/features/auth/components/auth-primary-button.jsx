import { cn } from '@/lib/utils'

export function AuthPrimaryButton({ className, children, ...props }) {
  return (
    <button
      type="submit"
      className={cn(
        'flex h-12 w-full items-center justify-center rounded-[8px] bg-[#402f28] px-4 text-sm leading-5 font-semibold text-white shadow-[inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_rgba(10,13,18,0.05),0_1px_2px_rgba(10,13,18,0.05)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
