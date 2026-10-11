import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Blocks button. Flat, no shadow, in the theme's button shape (a pill in the
 * default theme). Sizes and radius come from component tokens (--button-*),
 * colours from semantic tokens.
 *
 * Render as a link:
 *   <Button nativeButton={false} render={<Link href="/pricing" />}>Pricing</Button>
 */
const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-(--button-radius) border border-transparent",
    "text-label whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,opacity,translate] duration-(--duration-fast) ease-standard",
    "outline-none focus-visible:focus-ring active:not-aria-[haspopup]:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "aria-invalid:border-destructive",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/85",
        brand: "bg-brand text-brand-foreground hover:bg-brand/88",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/65 aria-expanded:bg-secondary/65",
        // Transparent in dark, where the canvas is the darkest step and would
        // show as a hole on cards, popovers and tinted alerts.
        outline:
          "border-border-strong bg-background text-foreground hover:border-foreground aria-expanded:border-foreground dark:bg-transparent",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent",
        link: "h-auto! rounded-none! px-0! text-brand link-underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/88",
        inverse: "bg-panel-foreground text-panel hover:bg-panel-foreground/88",
        "outline-inverse":
          "border-panel-foreground/25 text-panel-foreground hover:border-panel-foreground/70 aria-expanded:border-panel-foreground/70",
      },
      size: {
        default:
          "h-(--button-height-md) px-(--button-padding-x-md) has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-(--button-height-xs) gap-1 rounded-(--button-radius-xs) px-(--button-padding-x-xs) text-caption font-semibold [&_svg:not([class*='size-'])]:size-3",
        sm: "h-(--button-height-sm) gap-1.5 rounded-(--button-radius-sm) px-(--button-padding-x-sm) has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-(--button-height-lg) px-(--button-padding-x-lg) has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-(--button-height-md)",
        "icon-xs":
          "size-(--button-height-xs) rounded-(--button-radius-xs) [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-(--button-height-sm) rounded-(--button-radius-sm) [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-(--button-height-lg)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
