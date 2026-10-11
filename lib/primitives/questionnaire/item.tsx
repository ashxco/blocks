"use client"

import * as React from "react"

import {
  mergeProps,
  useRenderElement,
  type RenderComponentProps,
} from "../render"
import {
  initialItemAnswers,
  itemAnswersReducer,
  type ItemAnswers,
  type ItemAnswersAction,
} from "./item-state"
import {
  byDocumentOrder,
  isAnswered,
  isRadio,
  isTextEntry,
  hasValue,
  ItemContext,
  shortcutKeys,
  useItemContext,
  useRegistry,
  useRootContext,
  type AnswerControl,
  type ItemApi,
  type ItemContextValue,
  type QuestionnaireItemStatus,
  type QuestionnaireShortcutMode,
} from "./shared"

type ItemState = {
  active: boolean
  disabled: boolean
  invalid: boolean
  multiple: boolean
  required: boolean
  status: QuestionnaireItemStatus
}

export type QuestionnaireItemProps = Omit<
  React.ComponentPropsWithRef<"fieldset">,
  "name" | "value"
> & {
  invalid?: boolean
  name: string
  multiple?: boolean
  onStatusChange?: (status: QuestionnaireItemStatus) => void
  required?: boolean
}

const sameControl = (a: AnswerControl, b: AnswerControl) =>
  a.element === b.element || a.id === b.id

const TEXT_INPUT_TYPES = ["email", "password", "search", "tel", "text", "url"]

function isEmptyTextInput(control: AnswerControl | undefined) {
  return (
    control?.type === "input" &&
    TEXT_INPUT_TYPES.includes(control.element.type) &&
    !hasValue(control.element.value)
  )
}

export function Item({
  "aria-describedby": ariaDescribedBy,
  "aria-keyshortcuts": ariaKeyShortcuts,
  children,
  disabled = false,
  invalid: invalidProp = false,
  multiple = false,
  name,
  onStatusChange,
  ref,
  required = false,
  ...props
}: QuestionnaireItemProps) {
  const root = useRootContext("Questionnaire.Item")
  const { domVersion, itemDefinitionByName, registerItem, shortcuts } = root
  const [element, setElement] = React.useState<HTMLFieldSetElement | null>(null)
  const [controls, registerControl] = useRegistry(sameControl)
  const [descriptionIds, registerDescription] = useRegistry<string>()
  const [errorIds, registerError] = useRegistry<string>()
  const [answers, dispatch] = React.useReducer(
    (state: ItemAnswers, action: ItemAnswersAction) =>
      itemAnswersReducer(state, action, multiple),
    initialItemAnswers
  )
  const { attempted, resetVersion, skipped } = answers
  const [previousMultiple, setPreviousMultiple] = React.useState(multiple)

  const active = !disabled && root.activeItemName === name
  const sortedControls = React.useMemo(
    () => [...controls].sort(byDocumentOrder),
    // domVersion re-sorts after the DOM moved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [controls, domVersion]
  )
  const enabled = sortedControls.filter((control) => !control.disabled)
  const status: QuestionnaireItemStatus = skipped
    ? "skipped"
    : enabled.some((control) => answers.selected.includes(control.id))
      ? "answered"
      : "unanswered"
  const skippedOptional = status === "skipped" && !required
  const valid =
    disabled || skippedOptional || (!invalidProp && status === "answered")
  const invalid =
    !disabled && !skippedOptional && (invalidProp || (attempted && !valid))

  // With Root.items, shortcuts follow the declared choice order; without it, the rendered order.
  const keys = shortcutKeys(shortcuts)
  const declaredValues = itemDefinitionByName
    ? (itemDefinitionByName.get(name)?.choices ?? [])
        .filter((choice) => !choice.disabled)
        .map((choice) => choice.value)
    : null
  const choiceIds = enabled
    .filter((control) => control.type === "choice")
    .map((control) => control.id)
  const shortcutOf = (id: string, value: string) =>
    keys[
      declaredValues ? declaredValues.indexOf(value) : choiceIds.indexOf(id)
    ] ?? null

  const previousStatus = React.useRef(status)
  React.useLayoutEffect(() => {
    if (previousStatus.current === status) return
    previousStatus.current = status
    onStatusChange?.(status)
  }, [onStatusChange, status])

  // Turning `multiple` off keeps only the first selected answer.
  if (previousMultiple !== multiple) {
    setPreviousMultiple(multiple)
    if (previousMultiple && !multiple)
      dispatch({ type: "single", order: enabled.map((control) => control.id) })
  }

  const api = React.useRef<ItemApi>(null!)
  React.useLayoutEffect(() => {
    api.current = {
      focus: () => element?.focus(),
      focusInvalid: () => {
        const filled = element?.querySelector<HTMLElement>(
          "input[data-filled][name]:not(:disabled)"
        )
        const firstField = element?.querySelector<HTMLElement>(
          "input:not([type=hidden]):not(:disabled), textarea:not(:disabled)"
        )
        ;(filled ?? firstField ?? element)?.focus()
      },
      getAnswerByElement: (target) =>
        enabled.find((control) => control.element === target) ?? null,
      getAnswerByShortcut: (key) =>
        enabled.find(
          (control) =>
            control.type === "choice" &&
            shortcutOf(control.id, control.value) === key
        ) ?? null,
      // Radios already move with the arrow keys, so those are left to the browser.
      moveAnswerFocus: (from, direction) => {
        const index = enabled.findIndex((control) => control.element === from)
        if (
          !enabled.length ||
          (isTextEntry(from) && !isEmptyTextInput(enabled[index])) ||
          (index < 0 && from !== element)
        )
          return false
        const count = enabled.length
        const next =
          index < 0
            ? (enabled.find(isAnswered) ??
              enabled[direction === "next" ? 0 : count - 1])
            : enabled[(index + (direction === "next" ? 1 : -1) + count) % count]
        if (
          next.element === from ||
          (index >= 0 && isRadio(from) && isRadio(next.element))
        )
          return false
        next.element.focus()
        if (next.type === "choice" && isRadio(next.element))
          next.element.click()
        return true
      },
      reset: () => dispatch({ type: "reset" }),
      skip: () => {
        if (!required) dispatch({ type: "skip" })
      },
      validate: () => {
        dispatch({ type: "attempt" })
        if (!valid) return false
        if (!root.nativeValidation) return true
        const failing = enabled.find(
          (control) =>
            isAnswered(control) &&
            control.element.willValidate &&
            !control.element.validity.valid
        )
        if (!failing) return true
        failing.element.focus()
        failing.element.reportValidity()
        return false
      },
    }
  })

  React.useLayoutEffect(() => {
    if (!element) return
    return registerItem({
      api,
      controls: sortedControls,
      disabled,
      element,
      name,
      required,
      status,
    })
  }, [disabled, element, name, registerItem, required, sortedControls, status])

  const context: ItemContextValue = {
    active,
    disabled,
    hasInputAnswer: enabled.some((control) => control.type === "input"),
    invalid,
    multiple,
    name,
    required,
    resetVersion,
    selectedAnswerIds: answers.selected,
    shortcutOf,
    shortcuts,
    status,
    dispatch,
    registerControl,
    registerDescription,
    registerError,
  }

  const announced = [
    ariaKeyShortcuts,
    active && "Meta+Enter Control+Enter",
    active && enabled.length > 0 && "ArrowUp ArrowDown",
    active && !root.first && "ArrowLeft",
    active && !root.last && status !== "unanswered" && "ArrowRight",
  ]
  const rendered = useRenderElement<ItemState>({
    defaultTagName: "fieldset",
    props: mergeProps(
      {
        "aria-describedby": joinTokens([
          ...descriptionIds,
          ...(invalid ? errorIds : []),
          ariaDescribedBy,
        ]),
        "aria-invalid": invalid || undefined,
        "aria-keyshortcuts": joinTokens(announced),
        disabled,
        hidden: !active,
        inert: !active,
        tabIndex: -1,
        children,
      },
      props
    ),
    ref: [setElement as React.Ref<HTMLElement>, ref],
    state: { active, disabled, invalid, multiple, required, status },
    stateAttributesMapping: {
      active: (value) => ({ "data-active": value ? "" : undefined }),
    },
  })
  return <ItemContext.Provider value={context}>{rendered}</ItemContext.Provider>
}

function joinTokens(tokens: Array<string | false | undefined>) {
  return tokens.filter(Boolean).join(" ") || undefined
}

/** Registers an element's id with its Item (for aria-describedby) and returns the id. */
function useRegisteredId(
  idProp: string | undefined,
  register: (id: string) => () => void
) {
  const generatedId = React.useId()
  const id = idProp ?? generatedId
  React.useLayoutEffect(() => register(id), [id, register])
  return id
}

export type QuestionnaireTitleProps = RenderComponentProps<"legend">

export function Title({ render, ...props }: QuestionnaireTitleProps) {
  useItemContext("Questionnaire.Title")
  return useRenderElement({ defaultTagName: "legend", props, render })
}

export type QuestionnaireDescriptionProps = RenderComponentProps<"p">

export function Description({
  id: idProp,
  render,
  ...props
}: QuestionnaireDescriptionProps) {
  const { registerDescription } = useItemContext("Questionnaire.Description")
  const id = useRegisteredId(idProp, registerDescription)
  return useRenderElement({
    defaultTagName: "p",
    props: mergeProps({ id }, props),
    render,
  })
}

type ChoicesState = { shortcuts: QuestionnaireShortcutMode | null }
export type QuestionnaireChoicesProps = RenderComponentProps<
  "div",
  ChoicesState
>

export function Choices({ render, ...props }: QuestionnaireChoicesProps) {
  const { shortcuts } = useItemContext("Questionnaire.Choices")
  return useRenderElement<ChoicesState>({
    defaultTagName: "div",
    props,
    render,
    state: { shortcuts },
  })
}

type ErrorState = { invalid: boolean }
export type QuestionnaireErrorProps = RenderComponentProps<"p", ErrorState>

export function ErrorMessage({
  children,
  id: idProp,
  render,
  ...props
}: QuestionnaireErrorProps) {
  const { invalid, registerError, required } = useItemContext(
    "Questionnaire.Error"
  )
  const id = useRegisteredId(idProp, registerError)
  return useRenderElement<ErrorState>({
    defaultTagName: "p",
    props: mergeProps(
      {
        children:
          children ??
          (required
            ? "Choose an answer to continue."
            : "Choose an answer or skip this question."),
        hidden: !invalid,
        id,
        role: invalid ? "alert" : undefined,
      },
      props
    ),
    render,
    state: { invalid },
  })
}
