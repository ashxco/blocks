import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Blocks alert. A flat, tinted callout with a hairline border.
 * Layout is a grid: optional icon, title and description, optional action.
 * The action sits on the right from the sm breakpoint and below the text on
 * phones, so the message never squeezes into a narrow column.
 *
 *   <Alert variant="warning">
 *     <TriangleAlertIcon />
 *     <AlertTitle>Automation runs are running low</AlertTitle>
 *     <AlertDescription>…</AlertDescription>
 *     <AlertAction><Button size="sm" variant="outline">Upgrade</Button></AlertAction>
 *   </Alert>
 */
const alertVariants = cva(
  [
    "group/alert relative grid w-full items-start gap-x-3 gap-y-1 rounded-(--card-radius) border px-4 py-3.5 text-left text-sm",
    "has-[>svg]:grid-cols-[auto_1fr]",
    // From sm up the action sits on the right; on phones it drops below the text.
    "sm:has-data-[slot=alert-action]:grid-cols-[1fr_auto]",
    "sm:has-[>svg]:has-data-[slot=alert-action]:grid-cols-[auto_1fr_auto]",
    "*:[svg]:mt-0.5 *:[svg:not([class*='size-'])]:size-4 has-data-[slot=alert-description]:*:[svg]:row-span-2",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-subtle text-foreground *:[svg]:text-foreground",
        info: "border-info/20 bg-info-subtle text-foreground *:[svg]:text-info",
        success:
          "border-success/20 bg-success-subtle text-foreground *:[svg]:text-success",
        warning:
          "border-warning/25 bg-warning-subtle text-foreground *:[svg]:text-warning",
        destructive:
          "border-destructive/20 bg-destructive-subtle text-foreground *:[svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-heading text-sm leading-snug font-bold tracking-(--text-title--letter-spacing) text-pretty text-foreground group-has-[>svg]/alert:col-start-2",
        "[&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-brand",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-pretty text-copy group-has-[>svg]/alert:col-start-2",
        "[&_a]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-brand [&_p:not(:last-child)]:mb-3",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn(
        "col-span-full mt-2 flex items-center gap-2 group-has-[>svg]/alert:pl-7",
        "sm:col-[-2/-1] sm:row-start-1 sm:mt-0 sm:self-center sm:group-has-[>svg]/alert:pl-0 sm:group-has-data-[slot=alert-description]/alert:row-[1/span_2]",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction, alertVariants }
