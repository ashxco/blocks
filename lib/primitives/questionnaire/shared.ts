"use client"

import * as React from "react"

import type { ItemAnswersAction } from "./item-state"

export type QuestionnaireItemStatus = "unanswered" | "answered" | "skipped"
export type QuestionnaireShortcutMode = "letters" | "numbers"
export type QuestionnaireChoiceDefinition = {
  disabled?: boolean
  value: string
}
export type QuestionnaireItemDefinition = {
  choices?: readonly QuestionnaireChoiceDefinition[]
  disabled?: boolean
  name: string
  required?: boolean
}
export type QuestionnaireInputType =
  | "date"
  | "datetime-local"
  | "email"
  | "month"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"

export type RootState = {
  current: number
  first: boolean
  last: boolean
  total: number
}

/** An answer control registered by a Choice or an Input. */
export type AnswerControl =
  | {
      type: "choice"
      id: string
      element: HTMLInputElement
      disabled: boolean
      ownDisabled: boolean
      value: string
    }
  | { type: "input"; id: string; element: HTMLInputElement; disabled: boolean }

/** What an Item does on the Root's behalf. Kept in a ref, so it always sees the Item's last render. */
export type ItemApi = {
  focus: () => void
  focusInvalid: () => void
  getAnswerByElement: (element: Element) => AnswerControl | null
  getAnswerByShortcut: (key: string) => AnswerControl | null
  moveAnswerFocus: (from: Element, direction: "next" | "previous") => boolean
  reset: () => void
  skip: () => void
  validate: () => boolean
}

/** What an Item registers with the Root. */
export type RegisteredItem = {
  name: string
  element: HTMLFieldSetElement
  disabled: boolean
  required: boolean
  status: QuestionnaireItemStatus
  controls: AnswerControl[]
  api: React.RefObject<ItemApi>
}

export type RootContextValue = RootState & {
  activeItemName: string | null
  activeItemRequired: boolean | null
  activeItemStatus: QuestionnaireItemStatus | null
  domVersion: number
  goNext: () => void
  goPrevious: () => void
  itemDefinitionByName: Map<string, QuestionnaireItemDefinition> | null
  nativeValidation: boolean
  registerItem: (item: RegisteredItem) => () => void
  shortcuts: QuestionnaireShortcutMode | null
  skipCurrent: () => void
}

export type ItemContextValue = {
  active: boolean
  disabled: boolean
  hasInputAnswer: boolean
  invalid: boolean
  multiple: boolean
  name: string
  required: boolean
  resetVersion: number
  selectedAnswerIds: string[]
  shortcutOf: (id: string, value: string) => string | null
  shortcuts: QuestionnaireShortcutMode | null
  status: QuestionnaireItemStatus
  dispatch: React.Dispatch<ItemAnswersAction>
  registerControl: (control: AnswerControl) => () => void
  registerDescription: (id: string) => () => void
  registerError: (id: string) => () => void
}

export const RootContext = React.createContext<RootContextValue | null>(null)
export const ItemContext = React.createContext<ItemContextValue | null>(null)

export function useRequiredContext<T>(
  context: React.Context<T | null>,
  part: string,
  parent: string
) {
  const value = React.useContext(context)
  if (!value)
    throw new Error(`${part} must be used within a ${parent} component.`)
  return value
}

export const useRootContext = (part: string) =>
  useRequiredContext(RootContext, part, "Questionnaire.Root")

export const useItemContext = (part: string) =>
  useRequiredContext(ItemContext, part, "Questionnaire.Item")

/**
 * A list that parts add themselves to on mount. Registering an entry
 * replaces any entry `isSame` matches; the returned cleanup removes it.
 */
export function useRegistry<T>(isSame: (a: T, b: T) => boolean = Object.is) {
  const [entries, setEntries] = React.useState<T[]>([])
  const register = React.useCallback(
    (entry: T) => {
      setEntries((current) => [
        ...current.filter((other) => !isSame(other, entry)),
        entry,
      ])
      return () =>
        setEntries((current) => current.filter((other) => other !== entry))
    },
    [isSame]
  )
  return [entries, register] as const
}

export function hasValue(value: unknown) {
  if (Array.isArray(value))
    return value.some((entry) => String(entry).trim().length > 0)
  return value != null && String(value).trim().length > 0
}

export function shortcutKeys(mode: QuestionnaireShortcutMode | null) {
  if (mode === "letters")
    return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  if (mode === "numbers")
    return Array.from({ length: 9 }, (_, i) => String(i + 1))
  return []
}

/** The aria-keyshortcuts value for an answer: its shortcut, and Enter once it is picked. */
export function keyShortcuts(shortcut: string | null, enter: boolean) {
  return (
    [shortcut, enter ? "Enter" : null].filter(Boolean).join(" ") || undefined
  )
}

export function isAnswered(control: AnswerControl) {
  return control.type === "choice"
    ? control.element.checked
    : control.element.hasAttribute("name") && hasValue(control.element.value)
}

/** Fields where arrow keys and letters edit text, so they are left alone. */
export function isTextEntry(target: EventTarget | null) {
  if (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
    return true
  if (target instanceof HTMLInputElement)
    return !["button", "checkbox", "radio", "reset", "submit"].includes(
      target.type
    )
  return target instanceof HTMLElement && target.isContentEditable
}

export function isRadio(target: EventTarget | null) {
  return target instanceof HTMLInputElement && target.type === "radio"
}

export function byDocumentOrder(
  a: { element: Element },
  b: { element: Element }
) {
  if (a.element === b.element) return 0
  const position = a.element.compareDocumentPosition(b.element)
  if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
  if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
  return 0
}
