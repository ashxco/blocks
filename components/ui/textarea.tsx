import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Blocks textarea. The same filled control as <Input>: `bg-muted` and a
 * hairline `border-input` at rest, canvas colour and an accent border plus
 * focus outline while focused. It grows with its content
 * (`field-sizing: content`) from a comfortable minimum height, so most
 * answers need no manual resizing, and can still be resized vertically with a
 * quiet corner grip.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full min-w-0 resize-y rounded-(--control-radius) border border-input bg-muted",
        "px-(--control-padding-x) py-3 text-control leading-relaxed text-foreground",
        "transition-[background-color,border-color,color] duration-(--duration-fast) ease-standard outline-none",
        "placeholder:text-muted-foreground",
        "hover:border-foreground/25",
        "focus-visible:border-ring focus-visible:bg-background focus-visible:focus-ring",
        "[&[readonly]]:resize-none [&[readonly]]:bg-background",
        "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
        "group-data-[invalid=true]/field:border-destructive! group-data-[invalid=true]/field:focus-visible:outline-destructive",
        "disabled:pointer-events-none disabled:resize-none disabled:opacity-50",
        // The resize grip: a small muted dot inset in the corner, in place of
        // the browser's hatch, so it never traces the rounded border
        // (Chromium and Safari; other browsers keep their own grip).
        "[&::-webkit-resizer]:rounded-full [&::-webkit-resizer]:border-4 [&::-webkit-resizer]:border-transparent",
        "[&::-webkit-resizer]:bg-muted-foreground/45 [&::-webkit-resizer]:bg-clip-content",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
