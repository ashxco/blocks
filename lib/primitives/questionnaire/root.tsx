"use client"

import * as React from "react"

import {
  mergeProps,
  useRenderElement,
  type RenderComponentProps,
} from "../render"
import { handleQuestionnaireKeyDown } from "./keyboard"
import {
  byDocumentOrder,
  RootContext,
  useRegistry,
  useRootContext,
  type QuestionnaireItemDefinition,
  type QuestionnaireShortcutMode,
  type RegisteredItem,
  type RootContextValue,
  type RootState,
} from "./shared"
import { questionnaireWarnings } from "./warnings"

export type QuestionnaireRootProps = Omit<
  React.ComponentPropsWithRef<"form">,
  "defaultValue" | "value"
> & {
  defaultItem?: string
  item?: string
  items?: readonly QuestionnaireItemDefinition[]
  onItemChange?: (item: string) => void
  shortcuts?: QuestionnaireShortcutMode
}

type FocusTarget = { name: string; target: "item" | "invalid" }

const sameItem = (a: RegisteredItem, b: RegisteredItem) =>
  a.element === b.element || a.name === b.name

/** With Root.items, the default item if it is enabled, else the first enabled one. */
function initialItem(
  items: readonly QuestionnaireItemDefinition[] | undefined,
  name: string | undefined
) {
  if (!items) return name ?? null
  const item = items.find((entry) => entry.name === name)
  return item && !item.disabled
    ? item.name
    : (items.find((entry) => !entry.disabled)?.name ?? null)
}

export function Root({
  defaultItem,
  item,
  items,
  noValidate = true,
  onItemChange,
  onReset,
  onSubmit,
  ref,
  shortcuts: shortcutsProp,
  ...props
}: QuestionnaireRootProps) {
  const itemByName = React.useMemo(
    () => (items ? new Map(items.map((entry) => [entry.name, entry])) : null),
    [items]
  )
  const [registered, registerItem] = useRegistry(sameItem)
  const [uncontrolledItem, setUncontrolledItem] = React.useState(() =>
    initialItem(items, defaultItem)
  )
  const [form, setForm] = React.useState<HTMLFormElement | null>(null)
  const [domVersion, setDomVersion] = React.useState(0)
  /** The item to focus once it becomes active, and whether to focus its first invalid answer. */
  const [pendingFocus, setPendingFocus] = React.useState<FocusTarget | null>(
    null
  )
  const controlled = item !== undefined
  const activeName = controlled ? item : uncontrolledItem
  const previousActiveName = React.useRef(activeName)
  const shortcuts = shortcutsProp ?? null
  const warned = React.useRef(new Set<string>())

  React.useLayoutEffect(() => {
    if (process.env.NODE_ENV === "production") return
    if (!items || !form) {
      warned.current.clear()
      return
    }
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      const next = new Set(
        questionnaireWarnings(items, registered, defaultItem, shortcuts)
      )
      for (const message of next)
        if (!warned.current.has(message))
          console.warn(`[Questionnaire] ${message}`)
      warned.current = next
    })
    return () => {
      cancelled = true
    }
  }, [items, defaultItem, registered, form, shortcuts])

  // Items can move in the DOM; re-sort them when the form's children change.
  React.useLayoutEffect(() => {
    if (!form) return
    const observer = new MutationObserver(() => setDomVersion((v) => v + 1))
    observer.observe(form, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [form])

  const enabledRegistered = React.useMemo(
    () => registered.filter((entry) => !entry.disabled).sort(byDocumentOrder),
    // domVersion re-sorts after the DOM moved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [domVersion, registered]
  )
  const registeredByName = new Map(
    enabledRegistered.map((entry) => [entry.name, entry])
  )
  const enabledItems = React.useMemo(
    () => items?.filter((entry) => !entry.disabled),
    [items]
  )
  // With Root.items the sequence is known before anything registers.
  const sequence: ReadonlyArray<{ name: string; required?: boolean }> =
    enabledItems ?? enabledRegistered
  const activeIndex = sequence.findIndex((entry) => entry.name === activeName)
  const activeItem =
    activeIndex < 0 || !activeName
      ? null
      : (registeredByName.get(activeName) ?? null)
  const activeDefinition = activeName ? itemByName?.get(activeName) : undefined
  const total = sequence.length
  const state: RootState = {
    current: activeIndex < 0 ? 0 : activeIndex + 1,
    first: total > 0 && activeIndex === 0,
    last: total > 0 && activeIndex === total - 1,
    total,
  }

  const goTo = React.useCallback(
    (name: string, target: FocusTarget["target"] = "item") => {
      if (name === activeName) return
      setPendingFocus({ name, target })
      if (!controlled) setUncontrolledItem(name)
      onItemChange?.(name)
    },
    [activeName, controlled, onItemChange]
  )

  // Uncontrolled and nothing picked yet (the items registered on the client):
  // start at the first item. Set during render, so it never paints empty.
  if (total > 0 && activeIndex < 0 && !controlled && activeName === null) {
    setUncontrolledItem(sequence[0].name)
  }

  // Keep a valid active item, and move focus to it after navigation.
  React.useLayoutEffect(() => {
    if (total === 0) return
    if (activeIndex < 0) {
      if (!controlled && activeName === null) return
      // The active item is gone or never existed: move to the first one, as navigation would.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      goTo(sequence[0].name)
      return
    }
    const pending = pendingFocus
    const changed = previousActiveName.current !== activeName
    previousActiveName.current = activeName
    if (pending?.name !== activeName) {
      if (controlled && changed) {
        setPendingFocus(null)
        activeItem?.api.current.focus()
      }
      return
    }
    if (pending.target === "invalid") activeItem?.api.current.focusInvalid()
    else activeItem?.api.current.focus()
    setPendingFocus(null)
  }, [
    activeItem,
    activeName,
    controlled,
    activeIndex,
    sequence,
    goTo,
    pendingFocus,
    total,
  ])

  /** Validates the active item, moving focus to its first invalid answer if it fails. */
  function validateActive() {
    if (!activeItem) return false
    if (activeItem.api.current.validate()) return true
    activeItem.api.current.focusInvalid()
    return false
  }

  function goPrevious() {
    if (activeIndex > 0) goTo(sequence[activeIndex - 1].name)
  }

  function goNext() {
    if (activeIndex >= total - 1 || !validateActive()) return
    goTo(sequence[activeIndex + 1].name)
  }

  /** Enter and Cmd/Ctrl+Enter: continue, or submit on the last item. */
  function advance() {
    if (!validateActive()) return
    if (state.last) form?.requestSubmit()
    else goTo(sequence[activeIndex + 1].name)
  }

  function skipCurrent() {
    if (!activeItem || activeItem.required) return
    activeItem.api.current.skip()
    if (!state.last) goTo(sequence[activeIndex + 1].name)
    // Let the skip render (the item drops its name) before the form submits.
    else queueMicrotask(() => form?.requestSubmit())
  }

  function handleReset(event: React.FormEvent<HTMLFormElement>) {
    onReset?.(event)
    if (event.defaultPrevented) return
    for (const entry of registered) entry.api.current.reset()
    const target = items
      ? initialItem(items, defaultItem)
      : (enabledRegistered.find((entry) => entry.name === defaultItem)?.name ??
        enabledRegistered[0]?.name)
    if (target) goTo(target)
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    const ordered = enabledItems
      ? enabledItems.flatMap(({ name }) => registeredByName.get(name) ?? [])
      : enabledRegistered
    const invalid = ordered.find((entry) => !entry.api.current.validate())
    if (!invalid) return onSubmit?.(event)
    event.preventDefault()
    if (invalid.name === activeName) invalid.api.current.focusInvalid()
    else goTo(invalid.name, "invalid")
  }

  const context: RootContextValue = {
    ...state,
    activeItemName: activeName,
    activeItemRequired:
      activeIndex < 0
        ? null
        : activeDefinition
          ? !!activeDefinition.required
          : (activeItem?.required ?? false),
    activeItemStatus:
      activeIndex < 0
        ? null
        : (activeItem?.status ?? (activeName ? "unanswered" : null)),
    domVersion,
    goNext,
    goPrevious,
    itemDefinitionByName: itemByName,
    nativeValidation: noValidate === false,
    registerItem,
    shortcuts,
    skipCurrent,
  }
  const element = useRenderElement<RootState>({
    defaultTagName: "form",
    props: mergeProps(
      {
        "data-shortcuts": shortcuts ?? undefined,
        onKeyDown: (event: React.KeyboardEvent<HTMLFormElement>) =>
          handleQuestionnaireKeyDown(event, {
            advance,
            goNext,
            goPrevious,
            item: activeItem,
            shortcuts,
          }),
        onReset: handleReset,
        onSubmit: handleSubmit,
        noValidate,
      },
      props
    ),
    ref: [setForm as React.Ref<HTMLElement>, ref],
    state,
  })
  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

export type QuestionnaireProgressProps = RenderComponentProps<"div", RootState>

export function Progress({
  children,
  render,
  ...props
}: QuestionnaireProgressProps) {
  const { current, first, last, total } = useRootContext(
    "Questionnaire.Progress"
  )
  const valueText = total ? `Question ${current} of ${total}` : undefined
  return useRenderElement<RootState>({
    defaultTagName: "div",
    props: mergeProps(
      {
        "aria-label": "Questionnaire progress",
        "aria-live": "polite",
        "aria-valuemax": total || undefined,
        "aria-valuemin": total ? 1 : undefined,
        "aria-valuenow": total ? current : undefined,
        "aria-valuetext": valueText,
        children: children ?? valueText,
        role: "progressbar",
      },
      props
    ),
    render,
    state: { current, first, last, total },
  })
}
