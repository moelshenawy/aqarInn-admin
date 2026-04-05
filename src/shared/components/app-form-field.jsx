import { Controller } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { AppInput } from '@/shared/components/app-input'

export function AppFormField({
  control,
  name,
  label,
  description,
  render,
  className,
  type = 'text',
  ...inputProps
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const inputId = `${name}-field`
        const messageId = `${name}-message`
        const inputClassName = cn(
          'h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40',
          fieldState.error &&
            'border-destructive focus-visible:border-destructive',
        )

        return (
          <div className={cn('space-y-2', className)}>
            {label ? (
              <Label
                htmlFor={inputId}
                className="text-foreground text-sm font-medium"
              >
                {label}
              </Label>
            ) : null}
            {render ? (
              render({ field, fieldState, inputId, inputClassName, messageId })
            ) : (
              <AppInput
                {...field}
                {...inputProps}
                id={inputId}
                type={type}
                className={inputClassName}
                aria-invalid={Boolean(fieldState.error)}
                aria-describedby={messageId}
                value={field.value ?? ''}
              />
            )}
            <div id={messageId} className="min-h-5 text-sm">
              {fieldState.error ? (
                <p className="text-destructive">{fieldState.error.message}</p>
              ) : description ? (
                <p className="text-muted-foreground">{description}</p>
              ) : null}
            </div>
          </div>
        )
      }}
    />
  )
}
