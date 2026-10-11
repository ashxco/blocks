"use client"

import * as React from "react"

import {
  mergeProps,
  useRenderElement,
  type RenderComponentProps,
} from "../render"
import {
  hasValue,
  keyShortcuts,
  useItemContext,
  useRequiredContext,
  type ItemContextValue,
  type QuestionnaireInputType,
} from "./shared"

type ChoiceState = {
  checked: boolean
  disabled: boolean
  invalid: boolean
  shortcut: string | null
  type: "checkbox" | "radio"
}
type InputState = { disabled: boolean; filled: boolean; invalid: boolean }
type ShortcutState = { shortcut: string | null }

type ChoiceContextValue = {
  inputProps: Record<string, unknown>
  inputRef: (element: HTMLInputElement | null) => void
  state: ChoiceState
}

const ChoiceContext = React.createContext<ChoiceContextValue | null>(null)

const useChoiceContext = (part: string) =>
  useRequiredContext(ChoiceContext, part, "Questionnaire.Choice")

const checkedAttributes = {
  checked: (value: boolean) => ({
    "data-checked": value ? "" : undefined,
    "data-unchecked": value ? undefined : "",
  }),
}

/**
 * Registers an answer's state with its Item: whether it starts picked, its
 * default (restored on reset) and, when controlled, whether it is picked.
 */
function useAnswerState(
  { dispatch, multiple, resetVersion }: ItemContextValue,
  id: string,
  defaultSelected: boolean,
  controlledSelected: boolean | undefined,
  syncKey?: unknown
) {
  const [initiallySelected] = React.useState(defaultSelected)
  React.useLayoutEffect(() => {
    dispatch({ type: "mount", id, selected: initiallySelected })
    return () => dispatch({ type: "unmount", id })
  }, [dispatch, id, initiallySelected])
  React.useLayoutEffect(
    () => dispatch({ type: "default", id, selected: defaultSelected }),
    [dispatch, id, defaultSelected]
  )
  React.useLayoutEffect(() => {
    if (controlledSelected === undefined) return
    const selected = controlledSelected
    dispatch({ type: "select", id, selected, unskip: selected })
  }, [dispatch, id, controlledSelected, multiple, resetVersion, syncKey])
}

export type QuestionnaireChoiceProps = Omit<
  RenderComponentProps<"label", ChoiceState>,
  "onChange"
> & {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

/** A label holding a native radio or checkbox (ChoiceInput); the item decides which. */
export function Choice({
  checked,
  children,
  defaultChecked = false,
  disabled: ownDisabled = false,
  onChange,
  render,
  value,
  ...props
}: QuestionnaireChoiceProps) {
  const item = useItemContext("Questionnaire.Choice")
  const { registerControl, resetVersion } = item
  const id = React.useId()
  const [input, setInput] = React.useState<HTMLInputElement | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const setInputElement = React.useCallback(
    (element: HTMLInputElement | null) => {
      inputRef.current = element
      setInput(element)
    },
    []
  )
  const controlled = checked !== undefined
  const disabled = item.disabled || ownDisabled
  const isChecked = controlled
    ? item.status !== "skipped" && checked
    : item.selectedAnswerIds.includes(id)
  const type = item.multiple ? "checkbox" : "radio"
  const shortcut = item.shortcutOf(id, value)

  useAnswerState(item, id, defaultChecked, checked)
  React.useLayoutEffect(() => {
    if (!input) return
    return registerControl({
      type: "choice",
      id,
      element: input,
      disabled,
      ownDisabled,
      value,
    })
  }, [id, ownDisabled, disabled, input, registerControl, value])
  // Keep the native default in step, so a form reset restores the right answer.
  React.useLayoutEffect(() => {
    const element = inputRef.current
    if (!element) return
    element.defaultChecked = controlled ? checked : defaultChecked
    if (resetVersion > 0) element.checked = isChecked
  }, [isChecked, controlled, checked, defaultChecked, input, resetVersion])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(event)
    if (event.defaultPrevented) return
    // Choosing the controlled answer again after a skip brings it back.
    if (
      !controlled ||
      (item.status === "skipped" && checked === event.target.checked)
    )
      item.dispatch({
        type: "select",
        id,
        selected: event.target.checked,
        unskip: true,
      })
  }

  const state: ChoiceState = {
    checked: isChecked,
    disabled,
    invalid: item.invalid,
    shortcut,
    type,
  }
  const inputProps = {
    "aria-invalid": item.invalid || undefined,
    "aria-keyshortcuts": keyShortcuts(shortcut, !disabled && isChecked),
    checked: isChecked,
    disabled,
    id,
    name: item.status === "skipped" ? undefined : item.name,
    onChange: handleChange,
    required: item.required && !item.multiple && !item.hasInputAnswer,
    type,
    value,
  }

  const rendered = useRenderElement<ChoiceState>({
    defaultTagName: "label",
    props: mergeProps({ children }, props),
    render,
    state,
    stateAttributesMapping: checkedAttributes,
  })
  return (
    <ChoiceContext.Provider
      value={{ inputProps, inputRef: setInputElement, state }}
    >
      {rendered}
    </ChoiceContext.Provider>
  )
}

export type QuestionnaireChoiceInputProps = Omit<
  RenderComponentProps<"input", ChoiceState>,
  | "checked"
  | "defaultChecked"
  | "disabled"
  | "name"
  | "onChange"
  | "required"
  | "type"
  | "value"
>

export function ChoiceInput({
  ref,
  render,
  ...props
}: QuestionnaireChoiceInputProps) {
  const { inputProps, inputRef, state } = useChoiceContext(
    "Questionnaire.ChoiceInput"
  )
  return useRenderElement<ChoiceState>({
    defaultTagName: "input",
    props: mergeProps(inputProps, props),
    ref: [inputRef as React.Ref<HTMLElement>, ref],
    render,
    state,
    stateAttributesMapping: checkedAttributes,
  })
}

export type QuestionnaireChoiceLabelProps = RenderComponentProps<"span">

export function ChoiceLabel({
  render,
  ...props
}: QuestionnaireChoiceLabelProps) {
  useChoiceContext("Questionnaire.ChoiceLabel")
  return useRenderElement({ defaultTagName: "span", props, render })
}

export type QuestionnaireChoiceShortcutProps = RenderComponentProps<
  "span",
  ShortcutState
>

export function ChoiceShortcut({
  children,
  render,
  ...props
}: QuestionnaireChoiceShortcutProps) {
  const { shortcut } = useChoiceContext("Questionnaire.ChoiceShortcut").state
  return useRenderElement<ShortcutState>({
    defaultTagName: "span",
    props: mergeProps(
      {
        "aria-hidden": true,
        children: children ?? shortcut,
        hidden: shortcut === null,
      },
      props
    ),
    render,
    state: { shortcut },
  })
}

export type QuestionnaireInputProps = Omit<
  RenderComponentProps<"input", InputState>,
  "form" | "name" | "type"
> & {
  type?: QuestionnaireInputType
}

/** A native input. Empty, it leaves the form, so it submits nothing. */
export function Input({
  defaultValue,
  disabled: ownDisabled = false,
  onChange,
  ref,
  render,
  type = "text",
  value,
  ...props
}: QuestionnaireInputProps) {
  const item = useItemContext("Questionnaire.Input")
  const { registerControl, resetVersion } = item
  const id = React.useId()
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const controlled = value !== undefined
  const defaultFilled = hasValue(defaultValue)
  const valueFilled = hasValue(value)
  const [typedFilled, setTypedFilled] = React.useState(defaultFilled)
  const [resetSeen, setResetSeen] = React.useState(resetVersion)
  const disabled = item.disabled || ownDisabled
  const selected = item.selectedAnswerIds.includes(id)

  // A reset restores the default value, so "filled" follows it again.
  if (!controlled && resetVersion > 0 && resetSeen !== resetVersion) {
    setResetSeen(resetVersion)
    setTypedFilled(defaultFilled)
  }
  const filled = controlled ? valueFilled : typedFilled

  useAnswerState(
    item,
    id,
    defaultFilled,
    controlled ? valueFilled : undefined,
    value
  )
  React.useLayoutEffect(() => {
    const element = inputRef.current
    if (!element) return
    return registerControl({ type: "input", id, element, disabled })
  }, [disabled, id, registerControl])
  React.useLayoutEffect(() => {
    if (inputRef.current && controlled)
      inputRef.current.defaultValue = String(value)
  }, [controlled, value])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(event)
    if (event.defaultPrevented || controlled) return
    const nowFilled = event.target.value.trim().length > 0
    setTypedFilled(nowFilled)
    item.dispatch({ type: "select", id, selected: nowFilled, unskip: true })
  }

  return useRenderElement<InputState>({
    defaultTagName: "input",
    props: mergeProps(
      {
        "aria-invalid": item.invalid || undefined,
        "aria-keyshortcuts": keyShortcuts(
          null,
          !disabled && filled && selected
        ),
        defaultValue: controlled ? undefined : defaultValue,
        disabled,
        form: selected ? undefined : "",
        id,
        name: selected ? item.name : undefined,
        onChange: handleChange,
        type,
        value: controlled ? value : undefined,
      },
      props
    ),
    ref: [inputRef as React.Ref<HTMLElement>, ref],
    render,
    state: { disabled, filled, invalid: item.invalid },
    stateAttributesMapping: {
      filled: (on) => ({
        "data-empty": on ? undefined : "",
        "data-filled": on ? "" : undefined,
      }),
    },
  })
}
