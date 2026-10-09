"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  CircleCheckIcon,
  EyeIcon,
  EyeOffIcon,
  MailCheckIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { Kern } from "@/components/ui/kern"

export type AuthMode = "sign-in" | "sign-up"

export interface AuthFormValues {
  name: string
  email: string
  password: string
}

export interface AuthFormProps {
  /** Sign in to an existing account, or create a new one. */
  mode?: AuthMode
  /** Heading. Defaults to copy for the current mode. */
  title?: React.ReactNode
  /** Supporting line under the heading. */
  description?: React.ReactNode
  /** Heading level. Use "h2" when the page already has an h1. */
  as?: "h1" | "h2"
  /** Wrap the form in a bordered card. */
  framed?: boolean
  signInHref?: string
  signUpHref?: string
  forgotPasswordHref?: string
  /** Where the success state leads. Defaults to the dashboard (sign in) or onboarding (sign up). */
  continueHref?: string
  /** Links for the sign-up legal note. Rendered as plain text when omitted. */
  termsHref?: string
  privacyHref?: string
  /** Called with valid values. Without it, the form simulates a short request. */
  onSubmit?: (values: AuthFormValues, mode: AuthMode) => void | Promise<void>
  className?: string
}

type FieldName = keyof AuthFormValues
type Provider = "GitHub" | "Google"
type Status =
  | { state: "idle" }
  | { state: "pending"; via: "email" | Provider }
  | { state: "done"; via: "email" | Provider }

const COPY = {
  "sign-in": {
    title: "Welcome back",
    description: "Sign in to deploy, review previews and read your logs.",
    submit: "Sign in",
    pending: "Signing in",
    switchPrompt: "New to Lumen?",
    switchLabel: "Create an account",
    continueHref: "/live/app",
  },
  "sign-up": {
    title: "Create your account",
    description: "Deploy from your first Git push. 14 days of Pro, no card needed.",
    submit: "Create account",
    pending: "Creating account",
    switchPrompt: "Already have an account?",
    switchLabel: "Sign in",
    continueHref: "/live/onboarding",
  },
} as const

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Shortest password Lumen accepts. Sign-up and the security settings both read it. */
export const PASSWORD_MIN = 12

function validate(values: AuthFormValues, mode: AuthMode) {
  const errors: Partial<Record<FieldName, string>> = {}
  if (mode === "sign-up" && !values.name.trim()) errors.name = "Enter your name."
  if (!values.email.trim()) errors.email = "Enter your email address."
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = "Enter an email address like maya@acme.dev."
  if (!values.password)
    errors.password = mode === "sign-in" ? "Enter your password." : "Choose a password."
  else if (mode === "sign-up" && values.password.length < PASSWORD_MIN)
    errors.password = `Use at least ${PASSWORD_MIN} characters.`
  return errors
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function AuthForm({
  mode = "sign-in",
  title,
  description,
  as: Heading = "h1",
  framed = false,
  signInHref = "/live/sign-in",
  signUpHref = "/live/sign-up",
  forgotPasswordHref = "/live/forgot-password",
  continueHref,
  termsHref,
  privacyHref,
  onSubmit,
  className,
}: AuthFormProps) {
  const copy = COPY[mode]
  const id = React.useId()
  const [values, setValues] = React.useState<AuthFormValues>({ name: "", email: "", password: "" })
  const [touched, setTouched] = React.useState<Partial<Record<FieldName, boolean>>>({})
  const [attempted, setAttempted] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [status, setStatus] = React.useState<Status>({ state: "idle" })
  const [formError, setFormError] = React.useState<string | null>(null)

  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  const errors = validate(values, mode)
  const errorFor = (field: FieldName) =>
    attempted || touched[field] ? errors[field] : undefined
  const pending = status.state === "pending"

  function update(field: FieldName) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setValues((v) => ({ ...v, [field]: value }))
      setFormError(null)
    }
  }

  function blur(field: FieldName) {
    return () => {
      if (values[field]) setTouched((t) => ({ ...t, [field]: true }))
    }
  }

  async function run(via: "email" | Provider) {
    setStatus({ state: "pending", via })
    try {
      if (via === "email" && onSubmit) await onSubmit(values, mode)
      else await wait(900)
      setStatus({ state: "done", via })
    } catch {
      setStatus({ state: "idle" })
      setFormError(
        mode === "sign-in"
          ? "We couldn’t sign you in. Check your details and try again."
          : "We couldn’t create your account. Try again in a moment."
      )
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setAttempted(true)
    const first = (Object.keys(validate(values, mode)) as FieldName[])[0]
    if (first) {
      const target = { name: nameRef, email: emailRef, password: passwordRef }[first]
      target.current?.focus()
      return
    }
    void run("email")
  }

  function reset() {
    setStatus({ state: "idle" })
    setAttempted(false)
    setTouched({})
    setValues((v) => ({ ...v, password: "" }))
  }

  const describedBy = (field: FieldName, hasHint = false) => {
    if (errorFor(field)) return `${id}-${field}-error`
    return hasHint ? `${id}-${field}-hint` : undefined
  }

  return (
    // The root is the container; the frame inside it pads more once the form has its full width.
    <div data-slot="auth-form" data-mode={mode} className={cn("@container w-full max-w-104", className)}>
      <div className={cn(framed && "rounded-(--card-radius) border bg-card p-(--card-padding) @min-[24rem]:p-10")}>
        {status.state === "done" ? (
          <AuthSuccess
            mode={mode}
            Heading={Heading}
            email={status.via === "email" ? values.email.trim() : undefined}
            provider={status.via === "email" ? undefined : status.via}
            continueHref={continueHref ?? copy.continueHref}
            onReset={reset}
          />
        ) : (
          <>
            <header className="grid gap-3">
              {/* Steps down a role in narrow slots (a framed card in a sidebar, a phone), like PageHeader. */}
              <Heading className="text-h2 text-foreground @max-[22rem]:text-h3">
                <Kern>{title ?? copy.title}</Kern>
              </Heading>
              <p className="text-body text-copy">{description ?? copy.description}</p>
            </header>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {(["GitHub", "Google"] as const).map((provider) => {
                const Icon = provider === "GitHub" ? GitHubMark : GoogleMark
                const busy = status.state === "pending" && status.via === provider
                return (
                  <Button
                    key={provider}
                    type="button"
                    variant="outline"
                    size="lg"
                    disabled={pending}
                    aria-label={`Continue with ${provider}`}
                    onClick={() => void run(provider)}
                  >
                    {busy ? <Spinner data-icon="inline-start" /> : <Icon data-icon="inline-start" />}
                    {provider}
                  </Button>
                )
              })}
            </div>

            <div className="my-7 flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-border" />
              <span className="text-caption text-muted-foreground">or with email</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form noValidate onSubmit={handleSubmit} aria-busy={pending}>
              <FieldGroup>
                {mode === "sign-up" ? (
                  <Field data-invalid={Boolean(errorFor("name"))}>
                    <FieldLabel htmlFor={`${id}-name`}>Full name</FieldLabel>
                    <Input
                      ref={nameRef}
                      id={`${id}-name`}
                      name="name"
                      autoComplete="name"
                      placeholder="Maya Chen"
                      value={values.name}
                      onChange={update("name")}
                      onBlur={blur("name")}
                      aria-invalid={Boolean(errorFor("name"))}
                      aria-describedby={describedBy("name")}
                    />
                    <FieldError id={`${id}-name-error`}>{errorFor("name")}</FieldError>
                  </Field>
                ) : null}

                <Field data-invalid={Boolean(errorFor("email"))}>
                  <FieldLabel htmlFor={`${id}-email`}>Work email</FieldLabel>
                  <Input
                    ref={emailRef}
                    id={`${id}-email`}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="maya@acme.dev"
                    value={values.email}
                    onChange={update("email")}
                    onBlur={blur("email")}
                    aria-invalid={Boolean(errorFor("email"))}
                    aria-describedby={describedBy("email")}
                  />
                  <FieldError id={`${id}-email-error`}>{errorFor("email")}</FieldError>
                </Field>

                <Field data-invalid={Boolean(errorFor("password"))}>
                  <div className="flex items-center justify-between gap-4">
                    <FieldLabel htmlFor={`${id}-password`}>Password</FieldLabel>
                    {mode === "sign-in" ? (
                      <Link
                        href={forgotPasswordHref}
                        className="rounded-xs text-caption font-semibold text-brand underline-offset-4 outline-none hover:underline focus-visible:focus-ring"
                      >
                        Forgot password?
                      </Link>
                    ) : null}
                  </div>
                  <InputGroup>
                    <InputGroupInput
                      ref={passwordRef}
                      id={`${id}-password`}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                      placeholder={mode === "sign-in" ? "Your password" : `At least ${PASSWORD_MIN} characters`}
                      value={values.password}
                      onChange={update("password")}
                      onBlur={blur("password")}
                      aria-invalid={Boolean(errorFor("password"))}
                      aria-describedby={describedBy("password", mode === "sign-up")}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        size="icon-xs"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {errorFor("password") ? (
                    <FieldError id={`${id}-password-error`}>{errorFor("password")}</FieldError>
                  ) : mode === "sign-up" ? (
                    <FieldDescription id={`${id}-password-hint`}>
                      Use {PASSWORD_MIN} or more characters. A few unrelated words work well.
                    </FieldDescription>
                  ) : null}
                </Field>

                {formError ? (
                  <p role="alert" className="rounded-(--control-radius) bg-destructive-subtle px-4 py-3 text-sm text-destructive">
                    {formError}
                  </p>
                ) : null}

                <Button type="submit" size="lg" className="w-full" disabled={pending}>
                  {status.state === "pending" && status.via === "email" ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      {copy.pending}
                    </>
                  ) : (
                    <>
                      {copy.submit}
                      <ArrowRightIcon data-icon="inline-end" />
                    </>
                  )}
                </Button>
              </FieldGroup>
            </form>

            {mode === "sign-up" ? (
              <p className="mt-5 text-caption text-muted-foreground">
                By creating an account you agree to the{" "}
                <LegalLink href={termsHref}>Terms of Service</LegalLink> and{" "}
                <LegalLink href={privacyHref}>Privacy Policy</LegalLink>.
              </p>
            ) : null}

            <p className="mt-8 border-t pt-6 text-sm text-copy">
              {copy.switchPrompt}{" "}
              <Link
                href={mode === "sign-in" ? signUpHref : signInHref}
                className="rounded-xs font-semibold text-brand underline-offset-4 outline-none hover:underline focus-visible:focus-ring"
              >
                {copy.switchLabel}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

/*
 * Provider marks, drawn in currentColor so they follow the button's ink in
 * both themes. Sized by the button's data-icon rules, like Lucide icons.
 */
function GitHubMark(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-1.96c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function GoogleMark(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.32 2.98-7.35Z" />
      <path d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.5c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z" />
      <path d="M6.41 13.91a6 6 0 0 1 0-3.82V7.5H3.07a10 10 0 0 0 0 9l3.34-2.59Z" />
      <path d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.97 9.97 0 0 0 12 2a10 10 0 0 0-8.93 5.5l3.34 2.59C7.2 7.74 9.4 5.98 12 5.98Z" />
    </svg>
  )
}

function LegalLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return <span className="font-semibold text-foreground">{children}</span>
  return (
    <Link
      href={href}
      className="rounded-xs font-semibold text-foreground underline underline-offset-4 outline-none hover:text-brand focus-visible:focus-ring"
    >
      {children}
    </Link>
  )
}

function AuthSuccess({
  mode,
  Heading,
  email,
  provider,
  continueHref,
  onReset,
}: {
  mode: AuthMode
  Heading: "h1" | "h2"
  email?: string
  provider?: Provider
  continueHref: string
  onReset: () => void
}) {
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  React.useEffect(() => headingRef.current?.focus(), [])

  const verifyEmail = mode === "sign-up" && !provider
  const Icon = verifyEmail ? MailCheckIcon : CircleCheckIcon

  return (
    <div className="grid animate-in gap-6 duration-(--duration-base) ease-out fade-in-0 slide-in-from-bottom-1" role="status">
      <span className="grid size-12 place-items-center rounded-full bg-success-subtle text-success">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="grid gap-3">
        <Heading ref={headingRef} tabIndex={-1} className="text-h2 text-foreground outline-none @max-[22rem]:text-h3">
          {verifyEmail ? "Check your inbox" : mode === "sign-up" ? "Account created" : "You’re signed in"}
        </Heading>
        <p className="text-body text-copy">
          {verifyEmail ? (
            <>
              We sent a confirmation link to <span className="font-semibold text-foreground">{email}</span>.
              Open it to verify your address, then set up your workspace.
            </>
          ) : mode === "sign-up" && provider ? (
            <>Your Lumen account is linked to {provider}. Set up a workspace to deploy your first project.</>
          ) : provider ? (
            <>Signed in with {provider}. Your projects and previews are ready where you left them.</>
          ) : (
            <>
              Signed in as <span className="font-semibold text-foreground">{email}</span>. Your projects and
              previews are ready where you left them.
            </>
          )}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button nativeButton={false} size="lg" render={<Link href={continueHref} />}>
          {mode === "sign-in" ? "Go to dashboard" : "Set up your workspace"}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={onReset}>
          {verifyEmail ? "Use a different email" : "Use another account"}
        </Button>
      </div>
    </div>
  )
}
