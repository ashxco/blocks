"use client"

import type * as React from "react"

import {
  mergeProps,
  useRenderElement,
  type RenderComponentProps,
} from "../render"
import {
  useRootContext,
  type QuestionnaireItemStatus,
  type RootContextValue,
} from "./shared"

type NavigationState = {
  disabled: boolean
  shortcut: "Enter" | null
  status: QuestionnaireItemStatus | null
  visible: boolean
}

export type QuestionnaireNavigationProps = RenderComponentProps<
  "button",
  NavigationState
>

/** Builds a navigation button: shown only when it applies, and inert while hidden. */
function navigationButton({
  part,
  label,
  type: defaultType = "button",
  shortcut,
  visible: isVisible,
  action,
}: {
  part: string
  label: string
  type?: "button" | "submit"
  shortcut?: "Enter"
  visible: (root: RootContextValue) => boolean
  action?: (root: RootContextValue) => void
}) {
  return function NavigationButton({
    children,
    disabled = false,
    onClick,
    render,
    tabIndex,
    type = defaultType,
    ...props
  }: QuestionnaireNavigationProps) {
    const root = useRootContext(part)
    const visible = isVisible(root)
    const activeShortcut = visible && !disabled ? (shortcut ?? null) : null
    return useRenderElement<NavigationState>({
      defaultTagName: "button",
      props: mergeProps(
        {
          "aria-hidden": !visible || undefined,
          "aria-keyshortcuts": activeShortcut ?? undefined,
          children: children ?? label,
          disabled,
          hidden: !visible,
          inert: !visible,
          onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event)
            if (!event.defaultPrevented) action?.(root)
          },
          tabIndex: visible ? tabIndex : -1,
          type,
        },
        props
      ),
      render,
      state: {
        disabled,
        shortcut: activeShortcut,
        status: root.activeItemStatus,
        visible,
      },
      stateAttributesMapping: {
        visible: (on) => ({
          "data-hidden": on ? undefined : "",
          "data-visible": on ? "" : undefined,
        }),
      },
    })
  }
}

export const Previous = navigationButton({
  part: "Questionnaire.Previous",
  label: "Previous",
  visible: (root) => root.total > 1 && !root.first,
  action: (root) => root.goPrevious(),
})

export const Skip = navigationButton({
  part: "Questionnaire.Skip",
  label: "Skip",
  visible: (root) => root.activeItemRequired === false,
  action: (root) => root.skipCurrent(),
})

export const Next = navigationButton({
  part: "Questionnaire.Next",
  label: "Next",
  shortcut: "Enter",
  visible: (root) => root.total > 1 && !root.last,
  action: (root) => root.goNext(),
})

export const Submit = navigationButton({
  part: "Questionnaire.Submit",
  label: "Submit",
  type: "submit",
  shortcut: "Enter",
  visible: (root) => root.total > 0 && root.last,
})
