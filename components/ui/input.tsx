import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Blocks input. A filled control: `bg-muted` with a hairline `border-input`
 * at rest, the canvas colour and a violet border plus focus outline while
 * focused. Height, padding and radius come from the --control-* tokens.
 *
 * Invalid: set `aria-invalid` on the input, or `data-invalid` on the
 * surrounding <Field>. Pair it with a <FieldError> that says how to fix it.
 */
const inputVariants = cva(
  [
    "w-full min-w-0 rounded-(--control-radius) border border-input bg-muted text-foreground",
    "outline-none transition-[background-color,border-color,color] duration-(--duration-fast) ease-standard",
    "placeholder:text-muted-foreground",
    "hover:border-foreground/25",
    "focus-visible:border-ring focus-visible:bg-background focus-visible:focus-ring",
    "[&[readonly]]:bg-background",
    "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
    "group-data-[invalid=true]/field:border-destructive! group-data-[invalid=true]/field:focus-visible:outline-destructive",
    "disabled:pointer-events-none disabled:opacity-50",
    "file:mr-3 file:h-7 file:rounded-(--button-radius) file:border-0 file:bg-secondary file:px-3 file:text-xs file:font-semibold file:text-secondary-foreground",
  ],
  {
    variants: {
      size: {
        sm: "h-(--control-height-sm) px-3 text-sm [&[type=file]]:py-0.75",
        default:
          "h-(--control-height-md) px-(--control-padding-x) text-base md:text-sm [&[type=file]]:py-1.75",
        lg: "h-(--control-height-lg) px-4 text-base [&[type=file]]:py-2.25",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>

function Input({ className, type, size = "default", ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants, type InputProps }
