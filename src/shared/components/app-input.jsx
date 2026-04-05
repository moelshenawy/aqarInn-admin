import { forwardRef } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const AppInput = forwardRef(function AppInput(
  { className, ...props },
  ref,
) {
  return (
    <Input ref={ref} className={cn('h-11 rounded-xl', className)} {...props} />
  )
})
