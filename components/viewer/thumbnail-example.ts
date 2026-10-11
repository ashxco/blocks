import * as React from "react"

/**
 * The example an index thumbnail shows: the first direct child of <Examples>
 * marked `thumbnail`, otherwise the first one. Shared by the server half of
 * <Examples> (docs/kit.tsx) and its client half (ExamplesList).
 */
export function thumbnailExample(children: React.ReactNode): React.ReactNode {
  const list = React.Children.toArray(children)
  const marked = list.find(
    (child) =>
      React.isValidElement<{ thumbnail?: boolean }>(child) &&
      child.props.thumbnail === true
  )
  return marked ?? list[0] ?? null
}
