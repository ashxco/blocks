import type * as React from "react"

import {
  isAnswered,
  isRadio,
  isTextEntry,
  type QuestionnaireShortcutMode,
  type RegisteredItem,
} from "./shared"

/**
 * The questionnaire's keyboard, handled on the form: Cmd/Ctrl+Enter
 * anywhere and Enter on a picked answer continue (or submit on the last
 * item), ArrowUp and ArrowDown move between answers, ArrowLeft and
 * ArrowRight move between items, and letters or numbers pick a choice.
 */
export function handleQuestionnaireKeyDown(
  event: React.KeyboardEvent<HTMLFormElement>,
  {
    advance,
    goNext,
    goPrevious,
    item,
    shortcuts,
  }: {
    advance: () => void
    goNext: () => void
    goPrevious: () => void
    item: RegisteredItem | null
    shortcuts: QuestionnaireShortcutMode | null
  }
) {
  if (
    event.defaultPrevented ||
    event.nativeEvent.isComposing ||
    event.keyCode === 229
  )
    return
  const target = event.target
  if (!item || !(target instanceof Element)) return
  const api = item.api.current
  const { key } = event
  const modified = event.metaKey || event.ctrlKey

  if (key === "Enter" && modified && !event.altKey && !event.shiftKey) {
    event.preventDefault()
    if (!event.repeat) advance()
    return
  }
  if (modified || event.altKey) return

  if (
    (key === "ArrowUp" || key === "ArrowDown") &&
    api.moveAnswerFocus(target, key === "ArrowDown" ? "next" : "previous")
  ) {
    event.preventDefault()
    return
  }

  if (
    (key === "ArrowLeft" || key === "ArrowRight") &&
    !isTextEntry(target) &&
    !isRadio(target)
  ) {
    event.preventDefault()
    if (event.repeat) return
    if (key === "ArrowLeft") goPrevious()
    else if (item.status !== "unanswered") goNext()
    return
  }

  if (key === "Enter") {
    const answer = api.getAnswerByElement(target)
    if (!answer) return
    event.preventDefault()
    if (!event.repeat && isAnswered(answer)) advance()
    return
  }

  if (!shortcuts || isTextEntry(target)) return
  const answer = api.getAnswerByShortcut(
    shortcuts === "letters" ? key.toUpperCase() : key
  )
  if (!answer) return
  event.preventDefault()
  if (event.repeat) return
  answer.element.focus()
  if (answer.type === "choice") answer.element.click()
}
