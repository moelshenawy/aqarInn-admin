import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AppButton({ className, ...props }) {
  return <Button className={cn('rounded-xl', className)} {...props} />
}
