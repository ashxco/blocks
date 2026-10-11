/**
 * Questionnaire primitive: an unstyled, one-question-at-a-time form.
 *
 * - Each Item is a fieldset; only the active one is shown (the others are
 *   hidden and inert). Root keeps the active item, controlled (item,
 *   onItemChange) or not (defaultItem).
 * - Choices are native radios (or checkboxes with `multiple`), Input is a
 *   native input, so the form submits real FormData. A skipped item drops its
 *   name, so it submits nothing.
 * - Keyboard (keyboard.ts): Enter on an answer, or Cmd/Ctrl+Enter anywhere,
 *   continues (and submits on the last item); ArrowLeft and ArrowRight go
 *   back and forward; ArrowUp and ArrowDown move between answers; letters or
 *   numbers pick a choice (shortcuts). Every shortcut is announced with
 *   aria-keyshortcuts.
 * - Validation: a required item needs an answer, an optional one can be
 *   skipped; with noValidate={false} native constraints are checked as well.
 *   Errors are announced (role="alert") and linked with aria-describedby.
 * - Progress is a progressbar with "Question 2 of 4" as its value text.
 *
 * Pass `items` so the server can render the first question, the progress and
 * the buttons before the parts register on the client.
 *
 * The behaviour follows @shadcn/react's Questionnaire 0.3.1 (MIT License,
 * Copyright (c) 2023 shadcn, https://github.com/shadcn-ui/ui), rewritten for
 * Blocks so it carries no dependency on that package.
 */

import {
  Choice,
  ChoiceInput,
  ChoiceLabel,
  ChoiceShortcut,
  Input,
} from "./answers"
import { Choices, Description, ErrorMessage, Item, Title } from "./item"
import { Next, Previous, Skip, Submit } from "./navigation"
import { Progress, Root } from "./root"

export type {
  QuestionnaireChoiceDefinition,
  QuestionnaireInputType,
  QuestionnaireItemDefinition,
  QuestionnaireItemStatus,
  QuestionnaireShortcutMode,
} from "./shared"
export type { QuestionnaireRootProps, QuestionnaireProgressProps } from "./root"
export type {
  QuestionnaireChoicesProps,
  QuestionnaireDescriptionProps,
  QuestionnaireErrorProps,
  QuestionnaireItemProps,
  QuestionnaireTitleProps,
} from "./item"
export type {
  QuestionnaireChoiceInputProps,
  QuestionnaireChoiceLabelProps,
  QuestionnaireChoiceProps,
  QuestionnaireChoiceShortcutProps,
  QuestionnaireInputProps,
} from "./answers"
export type { QuestionnaireNavigationProps } from "./navigation"

export const Questionnaire = {
  Root,
  Progress,
  Item,
  Title,
  Description,
  Choices,
  Choice,
  ChoiceInput,
  ChoiceLabel,
  ChoiceShortcut,
  Input,
  Error: ErrorMessage,
  Previous,
  Skip,
  Next,
  Submit,
}
