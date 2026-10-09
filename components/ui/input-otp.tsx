"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

/**
 * Blocks one-time code input. Each character sits in its own filled slot
 * (control height, control radius, `bg-muted`). The active slot turns to the
 * canvas colour with a violet border and focus outline, and shows a caret.
 *
 * Invalid: set `aria-invalid` on <InputOTP> (or `data-invalid` on the
 * surrounding <Field>) and every slot turns destructive.
 */
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp group/input-otp flex items-center gap-2 sm:gap-3 has-disabled:cursor-not-allowed has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-1.5 sm:gap-2", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, placeholderChar, hasFakeCaret, isActive } =
    inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={Boolean(char)}
      className={cn(
        "relative flex h-(--control-height-lg) w-10 items-center justify-center rounded-(--control-radius) border border-input bg-muted",
        "font-mono text-lg font-semibold text-foreground tabular sm:w-11",
        "transition-[background-color,border-color] duration-(--duration-fast) ease-standard",
        "group-hover/input-otp:border-foreground/25",
        "data-[filled=true]:bg-background",
        "data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:bg-background data-[active=true]:focus-ring",
        "aria-invalid:border-destructive group-has-[input[aria-invalid=true]]/input-otp:border-destructive",
        "group-data-[invalid=true]/field:border-destructive!",
        "data-[active=true]:aria-invalid:outline-destructive group-has-[input[aria-invalid=true]]/input-otp:data-[active=true]:outline-destructive",
        "group-data-[invalid=true]/field:data-[active=true]:outline-destructive",
        className
      )}
      {...props}
    >
      {char ?? (
        placeholderChar ? (
          <span className="text-muted-foreground">{placeholderChar}</span>
        ) : null
      )}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className={cn(
        "flex items-center text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      role="separator"
      {...props}
    >
      <MinusIcon aria-hidden="true" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
