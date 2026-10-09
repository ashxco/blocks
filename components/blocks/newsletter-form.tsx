"use client"

import * as React from "react"
import { CircleAlertIcon, CircleCheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export interface NewsletterFormProps {
  /** Accessible label for the email field. */
  label?: string
  placeholder?: string
  /** Text on the submit button. */
  buttonLabel?: string
  /** Called with the email address. Throw to show the error message. Without it, the form simulates a short request. */
  onSubscribe?: (email: string) => void | Promise<void>
  /** Message shown after a successful sign-up. */
  successMessage?: (email: string) => React.ReactNode
  /** Use "panel" on dark panels. */
  tone?: "default" | "panel"
  /** Initial email address. */
  defaultValue?: string
  /**
   * Initial state, for docs and screenshots: "invalid" shows the format
   * message, "error" the request failure, "success" the confirmation.
   */
  defaultStatus?: NewsletterFormStatus
  className?: string
}

export type NewsletterFormStatus = "idle" | "invalid" | "error" | "success"

type Status = NewsletterFormStatus | "submitting"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const defaultSuccess = (email: string) => (
  <>
    Almost done. Confirm the link we sent to <span className="font-semibold">{email}</span>.
  </>
)

/**
 * Inline email capture: one pill-shaped field with the button inside, and an
 * inline confirmation that replaces the field once subscribed.
 */
export function NewsletterForm({
  label = "Email address",
  placeholder = "you@company.com",
  buttonLabel = "Subscribe",
  onSubscribe,
  successMessage = defaultSuccess,
  tone = "default",
  defaultValue = "",
  defaultStatus = "idle",
  className,
}: NewsletterFormProps) {
  const panel = tone === "panel"
  const id = React.useId()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [email, setEmail] = React.useState(defaultValue)
  const [status, setStatus] = React.useState<Status>(defaultStatus)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (!EMAIL.test(value)) {
      setStatus("invalid")
      inputRef.current?.focus()
      return
    }
    setStatus("submitting")
    try {
      if (onSubscribe) await onSubscribe(value)
      else await new Promise((resolve) => setTimeout(resolve, 700))
      setEmail(value)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  function reset() {
    setEmail("")
    setStatus("idle")
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const invalid = status === "invalid" || status === "error"
  const message =
    status === "invalid"
      ? "Enter an email address like you@company.com."
      : status === "error"
        ? "We couldn’t subscribe you just now. Try again in a minute."
        : null

  if (status === "success") {
    return (
      <div
        data-slot="newsletter-form"
        data-status="success"
        role="status"
        className={cn(
          "@container/newsletter flex min-h-(--control-height-lg) w-full max-w-112 items-center rounded-(--control-radius) border px-4 py-2.5",
          panel ? "border-panel-border bg-panel-raised" : "border-border bg-subtle",
          className
        )}
      >
        {/* The button sits beside the message from 24rem; narrower, it drops under it, aligned with the text. */}
        <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 @min-[24rem]/newsletter:grid-cols-[auto_minmax(0,1fr)_auto]">
          <CircleCheckIcon
            aria-hidden="true"
            className={cn("mt-0.5 size-4 shrink-0", panel ? "text-panel-success" : "text-success")}
          />
          <p className={cn("text-sm", panel ? "text-panel-foreground" : "text-foreground")}>{successMessage(email)}</p>
          <button
            type="button"
            onClick={reset}
            className={cn(
              "col-start-2 justify-self-start rounded-xs text-sm font-semibold underline-offset-4 outline-none hover:underline focus-visible:focus-ring",
              "@min-[24rem]/newsletter:col-start-3 @min-[24rem]/newsletter:self-center",
              panel ? "text-panel-muted hover:text-panel-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Use another email
          </button>
        </div>
      </div>
    )
  }

  return (
    <form
      data-slot="newsletter-form"
      data-status={status}
      noValidate
      onSubmit={handleSubmit}
      className={cn("grid w-full max-w-112 gap-2", className)}
    >
      <div
        className={cn(
          "flex h-(--control-height-lg) items-center gap-2 rounded-(--button-radius) border p-1.5 pl-5",
          "transition-colors duration-(--duration-fast) ease-standard",
          "has-[input:focus-visible]:border-ring has-[input:focus-visible]:focus-ring",
          panel ? "border-panel-border bg-panel-raised" : "border-input bg-background hover:border-foreground/30",
          invalid &&
            (panel
              ? "border-panel-destructive has-[input:focus-visible]:border-panel-destructive"
              : "border-destructive has-[input:focus-visible]:border-destructive")
        )}
      >
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <Input
          ref={inputRef}
          id={id}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          placeholder={placeholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (invalid) setStatus("idle")
          }}
          disabled={status === "submitting"}
          aria-invalid={invalid || undefined}
          aria-describedby={message ? `${id}-message` : undefined}
          className={cn(
            "h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-base md:text-sm",
            "ring-0 outline-none! focus-visible:ring-0 focus-visible:outline-none! aria-invalid:ring-0",
            "disabled:bg-transparent disabled:opacity-100 dark:bg-transparent dark:disabled:bg-transparent",
            panel ? "text-panel-foreground placeholder:text-panel-muted" : "text-foreground placeholder:text-muted-foreground"
          )}
        />
        <Button
          type="submit"
          size="sm"
          variant={panel ? "inverse" : "default"}
          disabled={status === "submitting"}
          className="shrink-0"
        >
          {status === "submitting" ? <Spinner data-icon="inline-start" aria-label="Subscribing" /> : null}
          {buttonLabel}
        </Button>
      </div>
      {message ? (
        <p
          id={`${id}-message`}
          role="alert"
          className={
            panel
              ? "flex items-center gap-1.5 pl-5 text-caption text-panel-foreground"
              : "flex items-center gap-1.5 pl-5 text-caption text-destructive"
          }
        >
          <CircleAlertIcon aria-hidden="true" className={panel ? "size-3.5 shrink-0 text-panel-destructive" : "size-3.5 shrink-0"} />
          {message}
        </p>
      ) : null}
    </form>
  )
}
