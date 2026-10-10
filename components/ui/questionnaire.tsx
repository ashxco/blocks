"use client"

import * as React from "react"
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"
import { cn } from "@/lib/utils"

import { buttonVariants, type Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"

/**
 * Blocks questionnaire. One question at a time, as a form. Choices are
 * hairline rows that turn ink-edged when picked, with a filled ink checkbox
 * or radio; letters or numbers can act as keyboard shortcuts. Progress is a
 * row of hairline segments rather than a "Question 2 of 4" label, and the
 * count stays available to screen readers.
 *
 * Pass `items` (the item names, with `required` and the choice values) so
 * the server renders the first question, the progress bar and the buttons.
 * Without it the primitive only picks a question once the items register
 * on the client; until then the first item shows, so the page never renders
 * an empty form.
 */
function Questionnaire({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className={cn(
        "flex w-full min-w-0 flex-col gap-6",
        // Before any item is active, show the first one. Beats the preflight [hidden] rule.
        "[&:not(:has(>[data-slot=questionnaire-item]:not([hidden])))>[data-slot=questionnaire-item]:first-of-type]:flex!",
        className
      )}
      {...props}
    />
  )
}

type ProgressState = { current: number; total: number }

/**
 * variant="bar" (default) draws one segment per question and fills the ones
 * reached so far. variant="text" prints the count, for dense layouts.
 */
function QuestionnaireProgress({
  className,
  variant = "bar",
  render,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Progress> & {
  variant?: "bar" | "text"
}) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      data-variant={variant}
      className={cn(
        variant === "bar"
          ? "flex min-h-1 w-full items-center gap-1"
          : "min-h-[1lh] w-fit min-w-[14ch] text-caption font-semibold text-muted-foreground tabular-nums",
        className
      )}
      render={
        render ??
        (variant === "bar"
          ? (renderProps, state) => {
              const { current, total } = state as ProgressState
              const { children: _label, ...rest } =
                renderProps as React.ComponentProps<"div">
              void _label
              return (
                <div {...rest}>
                  {Array.from({ length: total }, (_, index) => (
                    <span
                      key={index}
                      aria-hidden="true"
                      data-slot="questionnaire-progress-segment"
                      data-reached={index < current || undefined}
                      className="h-1 flex-1 rounded-full bg-border transition-colors duration-(--duration-slow) ease-out data-reached:bg-primary"
                    />
                  ))}
                </div>
              )
            }
          : undefined)
      }
      {...props}
    />
  )
}

function QuestionnaireItem({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cn(
        "flex min-w-0 flex-col gap-4 border-0 p-0 outline-none",
        "data-active:animate-in data-active:duration-(--duration-base) data-active:ease-out data-active:fade-in-0 data-active:slide-in-from-bottom-1",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

/** size="sm" sets the title in the title role, for questionnaires inside a conversation. */
function QuestionnaireTitle({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title> & {
  size?: "default" | "sm"
}) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      data-size={size}
      className={cn(
        "mb-1.5 p-0 font-heading text-pretty text-foreground",
        size === "sm" ? "text-title" : "text-h4",
        "[&:not(:has(~[data-slot=questionnaire-description]))]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cn("text-sm text-pretty text-copy", className)}
      {...props}
    />
  )
}

function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn(
        "group/questionnaire-choices grid min-w-0 gap-2",
        className
      )}
      {...props}
    />
  )
}

const subscribeToNothing = () => () => {}

/** False on the server and during hydration, true afterwards. */
function useHydrated() {
  return React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )
}

function QuestionnaireChoice({
  children,
  className,
  checked,
  defaultChecked,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice>) {
  // The primitive registers default answers in a layout effect, which never
  // runs on the server. Until hydration, render a default answer as checked so
  // it paints selected from the first frame and without JavaScript.
  const hydrated = useHydrated()
  const initialChecked =
    !hydrated && checked === undefined && defaultChecked ? true : undefined

  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      checked={checked ?? initialChecked}
      defaultChecked={defaultChecked}
      className={cn(
        "group/questionnaire-choice relative flex min-h-(--control-height-lg) cursor-pointer items-start gap-3 rounded-(--control-radius) border border-border bg-background px-4 py-3 text-start text-sm text-foreground select-none",
        "transition-[background-color,border-color] duration-(--duration-fast) ease-standard",
        "hover:border-border-strong hover:bg-subtle",
        "has-[>input:focus-visible]:focus-ring",
        "data-checked:border-foreground data-checked:bg-subtle data-checked:hover:border-foreground",
        "data-invalid:border-destructive",
        "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className={cn(
          "pointer-events-none relative mt-px flex size-(--selection-size) shrink-0 items-center justify-center rounded-xs border border-input bg-background text-primary-foreground",
          "transition-[background-color,border-color] duration-(--duration-fast) ease-standard",
          "group-data-[type=radio]/questionnaire-choice:rounded-full",
          "group-hover/questionnaire-choice:border-foreground/40",
          "group-data-checked/questionnaire-choice:border-primary group-data-checked/questionnaire-choice:bg-primary",
          "group-data-invalid/questionnaire-choice:border-destructive"
        )}
      >
        <span
          data-slot="questionnaire-choice-indicator-dot"
          className="hidden size-1.5 rounded-full bg-primary-foreground group-data-checked/questionnaire-choice:block group-data-[type=checkbox]/questionnaire-choice:hidden"
        />
        <CheckIcon
          data-slot="questionnaire-choice-indicator-check"
          strokeWidth={3}
          className="hidden size-3 group-data-checked/questionnaire-choice:block group-data-[type=radio]/questionnaire-choice:hidden"
        />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className="flex min-w-0 flex-1 flex-col gap-0.5 leading-snug font-semibold"
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        className={cn(
          "pointer-events-none ms-auto hidden h-5.5 min-w-5.5 shrink-0 items-center justify-center rounded-xs border border-border bg-muted px-1 font-mono text-xs leading-none font-medium text-muted-foreground",
          "transition-colors duration-(--duration-fast) ease-standard",
          "group-data-[shortcut]/questionnaire-choice:inline-flex",
          "group-data-checked/questionnaire-choice:border-foreground group-data-checked/questionnaire-choice:bg-primary group-data-checked/questionnaire-choice:text-primary-foreground"
        )}
      />
    </QuestionnairePrimitive.Choice>
  )
}

function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn("text-caption font-normal text-muted-foreground", className)}
      {...props}
    />
  )
}

function QuestionnaireInput({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="group/questionnaire-input relative w-full min-w-0"
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cn(
          "h-(--control-height-md) w-full min-w-0 rounded-(--control-radius) border border-input bg-muted px-(--control-padding-x) text-control text-foreground",
          "outline-none transition-[background-color,border-color,color] duration-(--duration-fast) ease-standard",
          "placeholder:text-muted-foreground hover:border-foreground/25",
          "focus-visible:border-ring focus-visible:bg-background focus-visible:focus-ring",
          "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn("text-caption font-medium text-destructive", className)}
      {...props}
    />
  )
}

function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2",
        className
      )}
      {...props}
    />
  )
}

function QuestionnairePrevious({
  children,
  className,
  size = "default",
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-1 row-start-1 justify-self-start",
        className
      )}
      {...props}
    >
      {children ?? "Back"}
    </QuestionnairePrimitive.Previous>
  )
}

function QuestionnaireSkip({
  children,
  className,
  size = "default",
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Skip> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Skip
      data-slot="questionnaire-skip"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-2 row-start-1 justify-self-end text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children ?? "Skip"}
    </QuestionnairePrimitive.Skip>
  )
}

function QuestionnaireNext({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Next> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Next
      data-slot="questionnaire-next"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-3 row-start-1 justify-self-end",
        className
      )}
      {...props}
    >
      {children ?? "Continue"}
    </QuestionnairePrimitive.Next>
  )
}

function QuestionnaireSubmit({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Submit> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Submit
      data-slot="questionnaire-submit"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-3 row-start-1 justify-self-end",
        className
      )}
      {...props}
    >
      {children ?? "Submit"}
    </QuestionnairePrimitive.Submit>
  )
}

export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
}
