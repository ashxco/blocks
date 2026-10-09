import { cn } from "@/lib/utils"

/**
 * Blocks aspect ratio. Holds media at a fixed ratio (width / height) so the
 * layout never jumps while images or video load. Direct img and video
 * children fill the frame and are cropped to cover it.
 *
 * Give it a radius and surface yourself: rounded-(--card-radius) for media
 * in cards, rounded-(--panel-radius) for large covers, bg-subtle or a tint
 * as the placeholder fill.
 */
function AspectRatio({
  ratio,
  className,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={
        {
          "--ratio": ratio,
        } as React.CSSProperties
      }
      className={cn(
        "relative aspect-(--ratio) overflow-hidden",
        "*:[img]:size-full *:[img]:object-cover *:[video]:size-full *:[video]:object-cover",
        className
      )}
      {...props}
    />
  )
}

export { AspectRatio }
