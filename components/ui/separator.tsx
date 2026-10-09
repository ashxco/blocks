"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Blocks separator. A --border-width-hairline line, never a shadow or a fade.
 * Use `variant="panel"` on dark panels and `variant="strong"` where a line
 * needs more presence, such as the end of a group: it takes the border-strong
 * colour at --border-width-strong.
 */
const separatorVariants = cva(
  "shrink-0 data-horizontal:h-(--border-width-hairline) data-horizontal:w-full data-vertical:w-(--border-width-hairline) data-vertical:self-stretch",
  {
    variants: {
      variant: {
        default: "bg-border",
        strong:
          "bg-border-strong data-horizontal:h-(--border-width-strong) data-vertical:w-(--border-width-strong)",
        panel: "bg-panel-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Separator({
  className,
  orientation = "horizontal",
  variant = "default",
  ...props
}: SeparatorPrimitive.Props & VariantProps<typeof separatorVariants>) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      data-variant={variant}
      orientation={orientation}
      className={cn(separatorVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Separator, separatorVariants }
