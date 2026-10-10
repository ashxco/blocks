"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Blocks chat bubble. Calm and flat: the person using the app speaks in ink
 * (default), the assistant speaks plainly on the canvas (ghost). Bubbles
 * nearest the speaker get a tighter corner, so a run of bubbles reads as one
 * voice. Render BubbleContent as a button or link to make it interactive.
 */
function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[align=end]:justify-self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/85",
        secondary:
          "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-secondary/65",
        // A system note: a quiet fill, a hairline and muted text, so it never reads as either speaker.
        muted:
          "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-muted *:data-[slot=bubble-content]:text-muted-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-accent [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground",
        tinted:
          "*:data-[slot=bubble-content]:bg-brand-subtle *:data-[slot=bubble-content]:text-brand-subtle-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:border-brand/30",
        outline:
          "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:border-border-strong [&>[data-slot=bubble-content]:is(button,a):hover]:bg-subtle",
        ghost:
          "*:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:text-copy",
        destructive:
          "*:data-[slot=bubble-content]:bg-destructive-subtle *:data-[slot=bubble-content]:text-destructive [&>[data-slot=bubble-content]:is(button,a):hover]:border-destructive/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "w-fit max-w-full min-w-0 overflow-hidden rounded-lg border border-transparent px-4 py-2.5 text-sm/6 wrap-break-word",
          "group-data-[align=end]/bubble:self-end",
          // In a conversation, the top corner nearest the speaker is tighter.
          "group-data-[align=start]/message:rounded-ss-xs group-data-[align=end]/message:rounded-se-xs group-data-[align=end]/bubble:rounded-se-xs",
          "[&_a]:underline [&_a]:underline-offset-3 [&_code]:font-mono [&_code]:text-code [&_p+p]:mt-3",
          "[button]:text-left [button,a]:transition-colors [button,a]:duration-(--duration-fast) [button,a]:ease-standard [button,a]:outline-none [button,a]:focus-visible:focus-ring",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  })
}

const bubbleReactionsVariants = cva(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-(--badge-radius) border border-border bg-background px-2 py-0.5 text-xs font-semibold text-foreground tabular-nums outline-2 outline-background has-[button]:p-0.5 [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "left-3",
        end: "right-3",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  }
)

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }
