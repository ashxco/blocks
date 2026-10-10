"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, MailCheckIcon, RotateCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const RESEND_AFTER_SECONDS = 30

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const textLink =
  "rounded-xs font-semibold text-brand underline-offset-4 outline-none hover:underline focus-visible:focus-ring"

function validate(email: string) {
  const value = email.trim()
  if (!value) return "Enter the email address you sign in with."
  if (!EMAIL_PATTERN.test(value)) return "Enter an email address like maya@acme.com."
  return undefined
}

/**
 * Request a password reset link: one email field, a pending state while the
 * link is sent, then a confirmation with a resend countdown.
 */
export function ResetRequestForm({ signInHref = "/live/sign-in" }: { signInHref?: string }) {
  const id = React.useId()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [email, setEmail] = React.useState("")
  const [touched, setTouched] = React.useState(false)
  const [attempted, setAttempted] = React.useState(false)
  const [status, setStatus] = React.useState<"idle" | "pending" | "sent">("idle")

  const error = validate(email)
  const shownError = attempted || touched ? error : undefined
  const pending = status === "pending"

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setAttempted(true)
    if (error) {
      inputRef.current?.focus()
      return
    }
    setStatus("pending")
    await wait(900)
    setStatus("sent")
  }

  function reset() {
    setStatus("idle")
    setAttempted(false)
    setTouched(false)
    setEmail("")
  }

  if (status === "sent") {
    return <ResetLinkSent email={email.trim()} signInHref={signInHref} onReset={reset} />
  }

  return (
    <div data-slot="reset-request-form" className="w-full">
      <header className="grid gap-3">
        <h1 className="text-h2 text-foreground">Reset your password</h1>
        <p className="text-body text-copy">
          Enter the email you sign in with and we’ll send you a link to choose a new password.
        </p>
      </header>

      <form noValidate onSubmit={handleSubmit} aria-busy={pending} className="mt-8">
        <FieldGroup>
          <Field data-invalid={Boolean(shownError)}>
            <FieldLabel htmlFor={`${id}-email`}>Work email</FieldLabel>
            <Input
              ref={inputRef}
              id={`${id}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              placeholder="maya@acme.com"
              value={email}
              disabled={pending}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => {
                if (email) setTouched(true)
              }}
              aria-invalid={Boolean(shownError)}
              aria-describedby={shownError ? `${id}-email-error` : undefined}
            />
            <FieldError id={`${id}-email-error`}>{shownError}</FieldError>
          </Field>

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Spinner data-icon="inline-start" />
                Sending link
              </>
            ) : (
              <>
                Send reset link
                <ArrowRightIcon data-icon="inline-end" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-8 border-t pt-6 text-sm text-copy">
        Remembered it?{" "}
        <Link href={signInHref} className={textLink}>
          Back to sign in
        </Link>
      </p>
    </div>
  )
}

function ResetLinkSent({
  email,
  signInHref,
  onReset,
}: {
  email: string
  signInHref: string
  onReset: () => void
}) {
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_AFTER_SECONDS)
  const [resending, setResending] = React.useState(false)

  React.useEffect(() => headingRef.current?.focus(), [])

  React.useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  async function resend() {
    setResending(true)
    await wait(800)
    setResending(false)
    setSecondsLeft(RESEND_AFTER_SECONDS)
    toast.add({
      title: "Reset link sent again",
      description: `The newest link to ${email} replaces the one before it.`,
    })
  }

  const canResend = secondsLeft <= 0 && !resending

  return (
    <div
      data-slot="reset-request-form"
      data-state="sent"
      className="grid w-full animate-in gap-6 duration-(--duration-base) ease-out fade-in-0 slide-in-from-bottom-1"
    >
      <span className="grid size-12 place-items-center rounded-full bg-success-subtle text-success">
        <MailCheckIcon className="size-5" aria-hidden="true" />
      </span>
      <div className="grid gap-3">
        <h1 ref={headingRef} tabIndex={-1} className="text-h2 text-foreground outline-none">
          Check your email
        </h1>
        <p className="text-body text-copy">
          If <span className="font-semibold break-all text-foreground">{email}</span> has an Acme account, a reset
          link is on its way. It works once and expires in 30 minutes.
        </p>
      </div>
      <Button size="lg" className="w-full" nativeButton={false} render={<Link href={signInHref} />}>
        Back to sign in
        <ArrowRightIcon data-icon="inline-end" />
      </Button>

      <div className="mt-2 grid gap-4 border-t pt-6">
        <p className="text-sm text-copy">
          Nothing after a few minutes? Check your spam folder, then send the link again.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" disabled={!canResend} onClick={() => void resend()}>
            {resending ? <Spinner data-icon="inline-start" /> : <RotateCwIcon data-icon="inline-start" />}
            {resending ? (
              "Sending"
            ) : secondsLeft > 0 ? (
              <span className="tabular">Resend in {secondsLeft}s</span>
            ) : (
              "Resend link"
            )}
          </Button>
          <Button type="button" variant="ghost" onClick={onReset}>
            Use a different email
          </Button>
        </div>
      </div>
    </div>
  )
}
