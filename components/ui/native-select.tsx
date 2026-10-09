import * as React from "react"
import { cn } from "@/components/viewer/cn"
import { ChevronDownIcon } from "lucide-react"

/**
 * Blocks native select. The platform <select>, dressed as a Blocks control:
 * muted fill, input border, control height and radius, a muted chevron.
 * The option list is drawn by the operating system, so it stays fully
 * accessible and works without JavaScript.
 *
 * `className` styles the wrapper (set width there); every other prop goes to
 * the <select>.
 */
type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default" | "lg"
}

const selectSize = {
  sm: "h-(--control-height-sm) ps-3 pe-9",
  default: "h-(--control-height-md) ps-(--control-padding-x) pe-10",
  lg: "h-(--control-height-lg) ps-4 pe-11 text-base",
} as const

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit min-w-0 has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          "w-full min-w-0 cursor-pointer appearance-none truncate rounded-(--control-radius) border border-input bg-muted text-sm text-foreground dark:scheme-dark",
          "transition-[background-color,border-color,color] duration-(--duration-fast) ease-standard",
          "outline-none hover:border-foreground/25 focus-visible:border-ring focus-visible:focus-ring",
          "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
          "disabled:pointer-events-none disabled:cursor-not-allowed",
          selectSize[size]
        )}
        {...props}
      />
      <ChevronDownIcon
        aria-hidden="true"
        data-slot="native-select-icon"
        className={cn(
          "pointer-events-none absolute top-1/2 end-3 size-4 -translate-y-1/2 text-muted-foreground select-none",
          "transition-colors duration-(--duration-fast) group-hover/native-select:text-foreground",
          "group-data-[size=sm]/native-select:end-2.5 group-data-[size=lg]/native-select:end-3.5"
        )}
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-popover text-popover-foreground", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-popover font-semibold text-popover-foreground", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
