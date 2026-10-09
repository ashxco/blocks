"use client"

import * as React from "react"
import { cn } from "cn"

/**
 * Blocks label. Label-role type (14px, semibold) in full ink. Associate it
 * with a control through `htmlFor`, or wrap the control.
 *
 * It dims with a disabled peer control or a disabled <Field>.
 */
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-snug font-semibold text-foreground select-none",
        "[&>svg]:shrink-0 [&>svg]:text-muted-foreground [&>svg:not([class*='size-'])]:size-4",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 group-data-[disabled=true]/field:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
