"use client"

import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { CircleAlertIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

/**
 * Blocks field. Lays out a label, a control, a description and an error with
 * one rhythm: 8px inside a field, 24px between fields in a <FieldGroup>.
 *
 * Mark a field invalid with `data-invalid` on <Field> (controls inside turn
 * destructive) and `aria-invalid` on the control, then render a <FieldError>
 * that says what went wrong and how to fix it.
 *
 * Wrap a <Field> in a <FieldLabel> to make a choice card for a radio,
 * checkbox or switch.
 */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex min-w-0 flex-col gap-5",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 text-foreground",
        "data-[variant=legend]:text-lg data-[variant=legend]:leading-snug data-[variant=legend]:font-bold data-[variant=legend]:tracking-tight",
        "data-[variant=label]:mb-2.5 data-[variant=label]:text-sm data-[variant=label]:leading-snug data-[variant=label]:font-semibold",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-6",
        "data-[slot=checkbox-group]:gap-3.5 *:data-[slot=field-group]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva("group/field flex w-full gap-2", {
  variants: {
    orientation: {
      vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
      horizontal: [
        "flex-row items-center gap-3",
        "*:data-[slot=field-label]:flex-auto *:data-[slot=field-label]:font-medium",
        "has-[>[data-slot=field-content]]:items-start",
        "has-[>[data-slot=field-content]]:[&>[role=checkbox]]:mt-px has-[>[data-slot=field-content]]:[&>[role=radio]]:mt-px",
        "has-[>[data-slot=field-content]]:[&>[data-slot=switch]]:-mt-0.5",
      ],
      responsive: [
        "flex-col *:w-full [&>.sr-only]:w-auto",
        "@prose/field-group:flex-row @prose/field-group:items-center @prose/field-group:gap-3 @prose/field-group:*:w-auto",
        "@prose/field-group:has-[>[data-slot=field-content]]:items-start @prose/field-group:*:data-[slot=field-label]:flex-auto",
        "@prose/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox]]:mt-px @prose/field-group:has-[>[data-slot=field-content]]:[&>[role=radio]]:mt-px",
      ],
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex min-w-0 flex-1 flex-col gap-1 leading-snug",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug",
        "group-data-[disabled=true]/field:opacity-50",
        // Choice card: a label that wraps a <Field>.
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:gap-0",
        "has-[>[data-slot=field]]:rounded-(--control-radius) has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-border has-[>[data-slot=field]]:bg-background",
        "has-[>[data-slot=field]]:transition-[background-color,border-color] has-[>[data-slot=field]]:duration-(--duration-fast) has-[>[data-slot=field]]:ease-standard",
        "has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:cursor-pointer",
        "has-[>[data-slot=field]]:not-has-[[data-checked],:disabled,[data-disabled]]:hover:border-foreground/25",
        "has-[>[data-slot=field]]:has-data-checked:border-primary has-[>[data-slot=field]]:has-data-checked:bg-muted",
        "has-[>[data-slot=field]]:has-[:focus-visible]:focus-ring",
        "has-[>[data-slot=field]]:has-[[data-disabled]]:opacity-50",
        "*:data-[slot=field]:p-4",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-semibold text-foreground",
        "group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-left text-(length:--text-caption) leading-(--text-caption--line-height) font-normal text-pretty text-muted-foreground",
        "group-has-data-horizontal/field:text-balance",
        "[[data-slot=field-legend]+&]:-mt-2 [[data-slot=field]>[data-slot=field-label]+&]:-mt-1",
        "[&>a]:font-semibold [&>a]:text-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-brand",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "flex items-center gap-3 py-1 text-(length:--text-caption) leading-(--text-caption--line-height) font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      <Separator className="flex-1" />
      {children && (
        <>
          <span data-slot="field-separator-content" className="shrink-0">
            {children}
          </span>
          <Separator className="flex-1" />
        </>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        "flex items-start gap-1.5 text-(length:--text-caption) leading-(--text-caption--line-height) font-medium text-destructive",
        className
      )}
      {...props}
    >
      <CircleAlertIcon aria-hidden="true" className="mt-px size-3.5 shrink-0" strokeWidth={2.25} />
      <div className="min-w-0">{content}</div>
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
