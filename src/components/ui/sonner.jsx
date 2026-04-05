import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { Toaster as Sonner } from 'sonner'

import { useDirection } from '@/lib/i18n/direction-provider'

export function Toaster(props) {
  const { dir } = useDirection()

  return (
    <Sonner
      dir={'rtl'}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      position={dir === 'rtl' ? 'top-left' : 'top-right'}
      toastOptions={{
        classNames: {
          toast:
            'rounded-2xl border border-border bg-background text-foreground shadow-lg',
        },
      }}
      {...props}
    />
  )
}
