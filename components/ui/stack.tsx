import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

/**
 * Gaps for Stack and Inline: steps of the spacing unit (--spacing, 4px), so
 * gap={4} is gap-4, 16px, plus "stack" for the --spacing-stack token (24px),
 * the default gap between stacked blocks in a section. Written out in full
 * so Tailwind generates every class.
 */
const gapClasses = {
  0: "gap-0",
  0.5: "gap-0.5",
  1: "gap-1",
  1.5: "gap-1.5",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
  stack: "gap-stack",
} as const

type Gap = keyof typeof gapClasses

const stackAlign = {
  stretch: "items-stretch",
  start: "items-start",
  center: "items-center",
  end: "items-end",
} as const

/**
 * Blocks stack: children in a vertical flow with one gap between them.
 *
 *   <Stack>…</Stack>                       gap-stack (24px), full width children
 *   <Stack gap={2} align="start">…</Stack>  8px, children keep their own width
 *
 * Use it for the rhythm inside a section, a card or a form: heading, text
 * and actions, or a list of fields. It sets only gap and alignment, so
 * spacing never comes from margins on the children.
 */
function Stack({
  className,
  gap = "stack",
  align = "stretch",
  render,
  ...props
}: useRender.ComponentProps<"div"> & {
  gap?: Gap
  align?: keyof typeof stackAlign
}) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn("flex min-w-0 flex-col", gapClasses[gap], stackAlign[align], className) },
      props
    ),
    render,
    state: { slot: "stack", gap: String(gap), align },
  })
}

export { Stack, gapClasses, type Gap }
