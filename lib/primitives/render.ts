import * as React from "react"
import { useRender } from "@base-ui/react/use-render"

/**
 * Rendering helpers shared by the Blocks primitives (lib/primitives). Parts
 * render through Base UI's useRender, so they take the same `render` prop
 * as every other Blocks component, and state turns into data-* attributes
 * (true → `data-x=""`, false or empty → absent, anything else →
 * `data-x="value"`).
 */

type AnyProps = Record<string, unknown>
type Handler = (event: { defaultPrevented?: boolean }) => void

export type RenderState = Record<string, unknown>

export type RenderComponentProps<
  Element extends React.ElementType,
  State extends RenderState = RenderState,
> = useRender.ComponentProps<Element, State>

/**
 * Merges props left to right. Later values win and undefined never
 * overrides, except: class names join, styles merge, and event handlers
 * chain so the later handler runs first and the earlier one runs only if it
 * did not call preventDefault(). Refs are not merged here: pass them to
 * useRenderElement's `ref`.
 */
export function mergeProps(...sources: Array<object | null | undefined>) {
  const merged: AnyProps = {}
  for (const source of sources) {
    for (const [key, value] of Object.entries(source ?? {})) {
      if (value === undefined) continue
      const previous = merged[key]
      if (key === "className") {
        merged[key] = [previous, value].filter(Boolean).join(" ")
      } else if (key === "style") {
        merged[key] = { ...(previous as object), ...(value as object) }
      } else if (
        /^on[A-Z]/.test(key) &&
        typeof previous === "function" &&
        typeof value === "function"
      ) {
        merged[key] = (event: { defaultPrevented?: boolean }) => {
          ;(value as Handler)(event)
          if (!event?.defaultPrevented) (previous as Handler)(event)
        }
      } else {
        merged[key] = value
      }
    }
  }
  return merged
}

/** Renders a primitive's element through Base UI's useRender, honouring the render prop. */
export function useRenderElement<State extends RenderState>(params: {
  defaultTagName: keyof React.JSX.IntrinsicElements
  props: AnyProps
  ref?: Array<React.Ref<HTMLElement> | undefined>
  render?: RenderComponentProps<"div", State>["render"]
  state?: State
  stateAttributesMapping?: {
    [Key in keyof State]?: (value: State[Key]) => AnyProps | null
  }
}) {
  return useRender<State, Element>(
    params as useRender.Parameters<State, Element, undefined>
  )
}
