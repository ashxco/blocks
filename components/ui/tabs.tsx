"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Blocks tabs.
 *
 * - `variant="default"`: underline tabs on a full-width hairline. A 2px ink
 *   indicator slides to the active tab.
 * - `variant="line"`: the same underline without the hairline track, for
 *   tabs that sit on an existing border (a page header, a card edge).
 * - `variant="segmented"`: a pill track where the active tab turns ink,
 *   matching the segmented toggle group.
 *
 * Heights come from --tabs-height (default) and --control-height-sm (sm).
 */
function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-6 data-horizontal:flex-col data-vertical:flex-row",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list relative isolate flex shrink-0 text-muted-foreground data-vertical:h-fit data-vertical:flex-col data-vertical:items-stretch",
  {
    variants: {
      variant: {
        default:
          "gap-6 border-border data-horizontal:w-full data-horizontal:items-stretch data-horizontal:border-b data-vertical:gap-0.5 data-vertical:border-l",
        line: "w-fit gap-6 border-transparent data-horizontal:items-stretch data-horizontal:border-b data-vertical:gap-0.5 data-vertical:border-l",
        segmented:
          "w-fit items-center gap-1 rounded-(--button-radius) border border-border bg-muted p-0.75 data-vertical:rounded-(--card-radius)",
      },
      size: {
        default: "data-horizontal:h-(--tabs-height)",
        sm: "data-horizontal:h-(--control-height-sm)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type TabsListVariant = NonNullable<VariantProps<typeof tabsListVariants>["variant"]>
type TabsListSize = NonNullable<VariantProps<typeof tabsListVariants>["size"]>

const TabsListContext = React.createContext<{ variant: TabsListVariant; size: TabsListSize }>({
  variant: "default",
  size: "default",
})

const tabsIndicatorVariants = cva(
  "pointer-events-none absolute top-0 left-0 -z-10 transition-[translate,width,height] duration-(--duration-base) ease-out",
  {
    variants: {
      variant: {
        // A 2px ink bar laid over the hairline.
        default:
          "bg-foreground data-horizontal:top-auto data-horizontal:-bottom-px data-horizontal:h-(--border-width-strong) data-horizontal:w-(--active-tab-width) data-horizontal:translate-x-(--active-tab-left) data-vertical:-left-px data-vertical:h-(--active-tab-height) data-vertical:w-(--border-width-strong) data-vertical:translate-y-(--active-tab-top)",
        line: "bg-foreground data-horizontal:top-auto data-horizontal:-bottom-px data-horizontal:h-(--border-width-strong) data-horizontal:w-(--active-tab-width) data-horizontal:translate-x-(--active-tab-left) data-vertical:-left-px data-vertical:h-(--active-tab-height) data-vertical:w-(--border-width-strong) data-vertical:translate-y-(--active-tab-top)",
        // An ink pill behind the active tab.
        segmented:
          "h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top) rounded-(--button-radius) bg-primary data-vertical:rounded-(--control-radius)",
      },
    },
  }
)

function TabsList({
  className,
  variant,
  size,
  children,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  const resolved = React.useMemo(
    () => ({ variant: variant ?? "default", size: size ?? "default" }),
    [variant, size]
  )

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={resolved.variant}
      data-size={resolved.size}
      className={cn(tabsListVariants(resolved), className)}
      {...props}
    >
      <TabsListContext.Provider value={resolved}>{children}</TabsListContext.Provider>
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        renderBeforeHydration
        className={tabsIndicatorVariants({ variant: resolved.variant })}
      />
    </TabsPrimitive.List>
  )
}

const tabsTriggerVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 text-label whitespace-nowrap text-muted-foreground select-none",
    "transition-colors duration-(--duration-fast) ease-standard outline-none",
    "hover:text-foreground focus-visible:focus-ring data-active:text-foreground",
    "data-disabled:pointer-events-none data-disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default:
          "rounded-xs data-vertical:h-(--control-height-sm) data-vertical:justify-start data-vertical:px-4",
        line: "rounded-xs data-vertical:h-(--control-height-sm) data-vertical:justify-start data-vertical:px-4",
        segmented:
          "h-full flex-1 rounded-(--button-radius) data-active:text-primary-foreground data-active:hover:text-primary-foreground data-vertical:h-(--control-height-sm) data-vertical:flex-none data-vertical:justify-start data-vertical:rounded-(--control-radius)",
      },
      size: {
        default: "",
        sm: "",
      },
    },
    compoundVariants: [
      { variant: "segmented", size: "default", className: "px-4" },
      { variant: "segmented", size: "sm", className: "px-3" },
    ],
  }
)

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  const { variant, size } = React.useContext(TabsListContext)

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        "min-w-0 flex-1 text-body text-copy outline-none focus-visible:focus-ring",
        "transition-opacity duration-(--duration-base) ease-out data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
