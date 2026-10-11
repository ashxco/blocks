import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

/**
 * Blocks container: a centred column with the page gutters (px-gutter) on
 * both sides, capped at one of the container widths. It is the container-*
 * utility as a component:
 *
 *   <Container>…</Container>                  container-page, 75rem
 *   <Container size="narrow" render={<main />}>…</Container>
 *
 * Sizes: prose (42rem, long-form reading), narrow (52rem, forms and FAQs),
 * page (75rem, the default) and wide (85rem, wide layouts and app shells).
 * Sections stay full width and put a container inside, so their band of
 * colour reaches the edges while the content lines up with the page.
 */
const containerSizes = {
  prose: "container-prose",
  narrow: "container-narrow",
  page: "container-page",
  wide: "container-wide",
} as const

type ContainerSize = keyof typeof containerSizes

function Container({
  className,
  size = "page",
  render,
  ...props
}: useRender.ComponentProps<"div"> & { size?: ContainerSize }) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn(containerSizes[size], className) },
      props
    ),
    render,
    state: { slot: "container", size },
  })
}

export { Container, containerSizes, type ContainerSize }
