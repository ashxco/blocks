import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"
import { gapClasses, type Gap } from "@/components/ui/stack"

const inlineAlign = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
} as const

const inlineJustify = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const

/**
 * Blocks inline: children side by side, wrapping onto the next line when
 * the row runs out of room.
 *
 *   <Inline>…</Inline>                       8px gap, centred on the cross axis
 *   <Inline justify="between">…</Inline>     title on the left, actions on the right
 *   <Inline gap={1.5} wrap={false}>…</Inline> one line, for badges in a table cell
 *
 * Use it for clusters: buttons, badges, avatars, metadata, a title with its
 * actions. Gaps are the same steps as Stack's.
 */
function Inline({
  className,
  gap = 2,
  align = "center",
  justify = "start",
  wrap = true,
  render,
  ...props
}: useRender.ComponentProps<"div"> & {
  gap?: Gap
  align?: keyof typeof inlineAlign
  justify?: keyof typeof inlineJustify
  /** Wrap onto more lines when the row is full. */
  wrap?: boolean
}) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex min-w-0 flex-row",
          wrap ? "flex-wrap" : "flex-nowrap",
          gapClasses[gap],
          inlineAlign[align],
          inlineJustify[justify],
          className
        ),
      },
      props
    ),
    render,
    state: { slot: "inline", gap: String(gap), align, justify, wrap },
  })
}

export { Inline }
