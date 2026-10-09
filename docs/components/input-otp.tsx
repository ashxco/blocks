"use client"

import * as React from "react"
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { CheckIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

type SixDigitsProps = Omit<
  React.ComponentProps<typeof InputOTP>,
  "maxLength" | "children" | "render" | "defaultValue"
> & { defaultValue?: string }

/** Six slots in two groups. Holds its own state unless `value` is passed. */
function SixDigits({ defaultValue = "", value, onChange, ...props }: SixDigitsProps) {
  const [inner, setInner] = React.useState(defaultValue)
  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      value={value ?? inner}
      onChange={(next) => {
        setInner(next)
        onChange?.(next)
      }}
      {...props}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}

function VerifySignIn() {
  const id = React.useId()
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<"idle" | "verified">("idle")
  const [resent, setResent] = React.useState(false)

  function verify(value: string) {
    if (value.length < 6) {
      setError("Enter all 6 digits from the email.")
      return
    }
    // In the demo, 000000 stands in for an expired code.
    if (value === "000000") {
      setError("That code has expired. Send a new one and try again.")
      return
    }
    setError(null)
    setStatus("verified")
  }

  if (status === "verified") {
    return (
      <div role="status" className="grid w-full max-w-96 justify-items-start gap-5 rounded-(--card-radius) border bg-card p-(--card-padding)">
        <span className="grid size-10 place-items-center rounded-full bg-success-subtle text-success">
          <CheckIcon aria-hidden="true" className="size-5" strokeWidth={2.5} />
        </span>
        <div className="grid gap-1">
          <h3 className="text-h4">You’re signed in</h3>
          <p className="text-body text-copy">This device stays trusted for 30 days.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setCode("")
            setStatus("idle")
          }}
        >
          Try again
        </Button>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        verify(code)
      }}
      className="grid w-full max-w-96 gap-6 rounded-(--card-radius) border bg-card p-(--card-padding)"
    >
      <div className="grid gap-1">
        <h3 className="text-h4">Check your email</h3>
        <p className="text-body text-copy">
          We sent a code to <span className="font-semibold text-foreground">jamie@halcyon.dev</span>. It expires in 10
          minutes.
        </p>
      </div>
      <Field data-invalid={Boolean(error)}>
        <FieldLabel htmlFor={`${id}-code`}>Verification code</FieldLabel>
        <SixDigits
          id={`${id}-code`}
          value={code}
          onChange={(value) => {
            setCode(value)
            if (error) setError(null)
          }}
          onComplete={verify}
          autoComplete="one-time-code"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          containerClassName="w-fit"
        />
        <FieldError id={`${id}-error`}>{error}</FieldError>
      </Field>
      <div className="grid gap-3">
        <Button type="submit" className="w-full">
          Verify and sign in
        </Button>
        <p className="text-center text-caption text-muted-foreground" aria-live="polite">
          {resent ? (
            "We sent a new code. Check your spam folder too."
          ) : (
            <>
              Didn’t get it?{" "}
              <button
                type="button"
                className="rounded-xs font-semibold text-foreground underline underline-offset-4 outline-none hover:text-brand focus-visible:focus-ring"
                onClick={() => setResent(true)}
              >
                Send a new code
              </button>
            </>
          )}
        </p>
      </div>
    </form>
  )
}

export default function InputOTPDocs() {
  return (
    <Examples>
      <Example
        title="Six digits"
        description="Each character gets its own slot. The active slot shows a caret and the violet focus border; filled slots turn to the canvas colour."
        code={`import { REGEXP_ONLY_DIGITS } from "input-otp"

<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`}
      >
        <SixDigits aria-label="Verification code" defaultValue="42" />
      </Example>

      <Example
        title="Letters and digits"
        description="Backup codes mix letters and digits. Split them into two groups of three so they are easy to read back."
        code={`import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
  <InputOTPGroup>…3 slots…</InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>…3 slots…</InputOTPGroup>
</InputOTP>`}
      >
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          aria-label="Backup code"
          pasteTransformer={(text) => text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Example>

      <Example
        title="States"
        layout="stack"
        description="Set aria-invalid on InputOTP and every slot turns destructive. Disabled codes dim as a whole."
        code={`<InputOTP maxLength={6} aria-invalid aria-describedby="code-error">…</InputOTP>
<FieldError id="code-error">That code is incorrect. Check the latest email.</FieldError>`}
      >
        <div className="grid gap-8">
          <Field data-invalid className="w-fit">
            <FieldLabel htmlFor="otp-invalid">Verification code</FieldLabel>
            <SixDigits id="otp-invalid" defaultValue="481920" aria-invalid aria-describedby="otp-invalid-error" />
            <FieldError id="otp-invalid-error">That code is incorrect. Check the latest email from Lumen.</FieldError>
          </Field>
          <Field className="w-fit">
            <FieldLabel htmlFor="otp-disabled">Verification code</FieldLabel>
            <SixDigits id="otp-disabled" defaultValue="4819" disabled />
            <FieldDescription>Too many attempts. Try again in 5 minutes.</FieldDescription>
          </Field>
        </div>
      </Example>

      <Example
        title="Verify sign-in"
        description="Verify as soon as the last digit lands, and keep a button for people who paste or use a screen reader. Enter 000000 to see the expired-code error."
        code={`<Field data-invalid={!!error}>
  <FieldLabel htmlFor="code">Verification code</FieldLabel>
  <InputOTP
    id="code"
    maxLength={6}
    value={code}
    onChange={setCode}
    onComplete={verify}
    autoComplete="one-time-code"
    aria-invalid={!!error}
  >…</InputOTP>
  <FieldError>{error}</FieldError>
</Field>`}
      >
        <VerifySignIn />
      </Example>

      <Guidelines
        do={[
          "Set autoComplete=\"one-time-code\" so phones offer the code from the message.",
          "Restrict input with a pattern, such as REGEXP_ONLY_DIGITS.",
          "Submit on complete, and keep a visible button as well.",
          "Say where the code was sent and when it expires.",
        ]}
        dont={[
          "Don’t clear the slots on error. Let people fix one digit.",
          "Don’t split a six-digit code into more than two groups.",
          "Don’t use slots for passwords or anything longer than ten characters.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "maxLength", type: "number", description: "Number of characters. Render one InputOTPSlot per character." },
          { prop: "pattern", type: "string", description: "Allowed characters as a regular expression string, such as REGEXP_ONLY_DIGITS." },
          { prop: "value / onChange", type: "string / (value: string) => void", description: "Controlled value. Use defaultValue for uncontrolled." },
          { prop: "onComplete", type: "(value: string) => void", description: "Called when every slot is filled." },
          { prop: "aria-invalid", type: "boolean", description: "Turns every slot destructive." },
          { prop: "disabled", type: "boolean", description: "Dims the code and blocks input." },
          { prop: "containerClassName", type: "string", description: "Classes for the wrapper that lays out the groups." },
          { prop: "InputOTPSlot index", type: "number", description: "Which character the slot shows, from 0." },
        ]}
      />
    </Examples>
  )
}
