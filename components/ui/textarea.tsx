import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Blocks textarea. The same filled control as <Input>: `bg-muted` and a
 * hairline `border-input` at rest, canvas colour and a violet border plus
 * focus outline while focused. It grows with its content
 * (`field-sizing: content`) from a comfortable minimum height and can be
 * resized vertically.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full min-w-0 resize-y rounded-(--control-radius) border border-input bg-muted",
        "px-(--control-padding-x) py-3 text-base leading-relaxed text-foreground md:text-sm md:leading-relaxed",
        "outline-none transition-[background-color,border-color,color] duration-(--duration-fast) ease-standard",
        "placeholder:text-muted-foreground",
        "hover:border-foreground/25",
        "focus-visible:border-ring focus-visible:bg-background focus-visible:focus-ring",
        "[&[readonly]]:resize-none [&[readonly]]:bg-background",
        "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
        "group-data-[invalid=true]/field:border-destructive! group-data-[invalid=true]/field:focus-visible:outline-destructive",
        "disabled:pointer-events-none disabled:resize-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
