"use client"

import * as React from "react"
import { OTPInputContext, REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS, type RenderProps } from "input-otp"
import { CheckIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field"
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

/**
 * A still picture of a code mid-entry: three digits typed and the fourth slot
 * active, with its caret. It feeds the real slots a fixed context, so the
 * active state can be read without clicking.
 */
const typingSnapshot: RenderProps = {
  isFocused: true,
  isHovering: false,
  slots: ["4", "8", "1", null, null, null].map((char, index) => ({
    char,
    placeholderChar: null,
    isActive: index === 3,
    hasFakeCaret: index === 3,
  })),
}

function TypingSnapshot() {
  return (
    <OTPInputContext.Provider value={typingSnapshot}>
      <div
        role="img"
        aria-label="Three digits typed; the fourth slot is active"
        className="group/input-otp flex items-center gap-2 sm:gap-3"
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
      </div>
    </OTPInputContext.Provider>
  )
}

/** One row of the States example: a real field, with the state it shows named underneath, as on the Input page. */
function StateCell({ state, children }: { state: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3">
      {children}
      <p className="border-t pt-2.5 text-caption text-muted-foreground">{state}</p>
    </div>
  )
}

function BackupCode({ id, ...props }: { id: string; "aria-describedby"?: string }) {
  const [code, setCode] = React.useState("K7F2QX")
  return (
    <InputOTP
      id={id}
      {...props}
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      value={code}
      onChange={(next) => setCode(next.toUpperCase())}
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
      setError("This code expired. Send a new one.")
      return
    }
    setError(null)
    setStatus("verified")
  }

  if (status === "verified") {
    return (
      <Card role="status" className="w-full max-w-md">
        <CardHeader className="justify-items-center text-center">
          <span className="mb-3 grid size-10 place-items-center rounded-full bg-success-subtle text-success">
            <CheckIcon aria-hidden="true" className="size-5" strokeWidth={2.5} />
          </span>
          <CardTitle>You’re signed in</CardTitle>
          <CardDescription className="text-pretty">Welcome back to Acme Inc. This device stays trusted for 30 days.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setCode("")
              setStatus("idle")
            }}
          >
            Try again
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          verify(code)
        }}
        className="contents"
      >
        <CardHeader className="justify-items-center text-center">
          <CardTitle>Confirm it’s you</CardTitle>
          <CardDescription className="text-balance">
            We sent a code to <span className="font-semibold whitespace-nowrap text-foreground">maya@acme.com</span>.
            It expires in 10&nbsp;minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor={`${id}-code`} className="justify-center">
              Verification code
            </FieldLabel>
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
              containerClassName="justify-center"
            />
            <FieldError id={`${id}-error`} className="justify-center text-center">
              {error}
            </FieldError>
          </Field>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
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
        </CardFooter>
      </form>
    </Card>
  )
}

export default function InputOTPDocs() {
  return (
    <Examples>
      <Example
        title="Six digits"
        layout="stack"
        description="Each character gets its own slot with the same fill as Input, empty or not. Click a slot to type: the active slot is drawn under States."
        code={`import { REGEXP_ONLY_DIGITS } from "input-otp"

<Field className="w-fit">
  <FieldLabel htmlFor="code">Verification code</FieldLabel>
  <InputOTP id="code" maxLength={6} pattern={REGEXP_ONLY_DIGITS} autoComplete="one-time-code" aria-describedby="code-hint">
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
  <FieldDescription id="code-hint">Enter the code we emailed to maya@acme.com.</FieldDescription>
</Field>`}
      >
        <Field className="w-fit">
          <FieldLabel htmlFor="otp-six">Verification code</FieldLabel>
          <SixDigits id="otp-six" defaultValue="42" autoComplete="one-time-code" aria-describedby="otp-six-hint" />
          <FieldDescription id="otp-six-hint">Enter the code we emailed to maya@acme.com.</FieldDescription>
        </Field>
      </Example>

      <Example
        title="Letters and digits"
        layout="stack"
        description="Backup codes mix letters and digits. Split them into two groups of three so they are easy to read back."
        code={`import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

const [code, setCode] = React.useState("")

<FieldLabel htmlFor="backup-code">Backup code</FieldLabel>
<InputOTP
  id="backup-code"
  maxLength={6}
  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
  value={code}
  onChange={(next) => setCode(next.toUpperCase())}
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
</InputOTP>`}
      >
        <Field className="w-fit">
          <FieldLabel htmlFor="otp-backup">Backup code</FieldLabel>
          <BackupCode id="otp-backup" aria-describedby="otp-backup-hint" />
          <FieldDescription id="otp-backup-hint">Use one of the codes you saved when you turned on two-factor authentication.</FieldDescription>
        </Field>
      </Example>

      <Example
        title="States"
        layout="stack"
        description="While someone types, the next slot turns to the canvas colour with a caret and the violet focus border. Set aria-invalid on InputOTP and every slot turns destructive. Disabled codes dim as a whole."
        code={`<Field data-invalid className="w-fit">
  <FieldLabel htmlFor="code">Verification code</FieldLabel>
  <InputOTP id="code" maxLength={6} pattern={REGEXP_ONLY_DIGITS} defaultValue="481920" aria-invalid aria-describedby="code-error">
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
  <FieldError id="code-error">That code is incorrect. Check the latest email from Acme.</FieldError>
</Field>

<Field className="w-fit">
  <FieldLabel htmlFor="code-locked">Verification code</FieldLabel>
  <InputOTP id="code-locked" maxLength={6} pattern={REGEXP_ONLY_DIGITS} defaultValue="4819" disabled>
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
  <FieldDescription>Too many attempts. Try again in 5 minutes.</FieldDescription>
</Field>`}
      >
        {/* One width for every row, so the rules under them line up. */}
        <div className="grid w-fit max-w-full gap-8">
          <StateCell state="Active">
            <Field>
              <FieldTitle>Verification code</FieldTitle>
              <TypingSnapshot />
              <FieldDescription>Enter the code we emailed to maya@acme.com.</FieldDescription>
            </Field>
          </StateCell>
          <StateCell state="Invalid">
            <Field data-invalid>
              <FieldLabel htmlFor="otp-invalid">Verification code</FieldLabel>
              <SixDigits id="otp-invalid" defaultValue="481920" aria-invalid aria-describedby="otp-invalid-error" />
              <FieldError id="otp-invalid-error">That code is incorrect. Check the latest email from Acme.</FieldError>
            </Field>
          </StateCell>
          <StateCell state="Disabled">
            <Field>
              <FieldLabel htmlFor="otp-disabled">Verification code</FieldLabel>
              <SixDigits id="otp-disabled" defaultValue="4819" disabled />
              <FieldDescription>Too many attempts. Try again in 5 minutes.</FieldDescription>
            </Field>
          </StateCell>
        </div>
      </Example>

      <Example
        title="Verify sign-in"
        description="Verify as soon as the last digit lands, and keep a button for people who paste or use a screen reader. Enter 000000 to see the expired-code error."
        surface="subtle"
        code={`<Field data-invalid={!!error}>
  <FieldLabel htmlFor="code" className="justify-center">
    Verification code
  </FieldLabel>
  <InputOTP
    id="code"
    maxLength={6}
    pattern={REGEXP_ONLY_DIGITS}
    value={code}
    onChange={setCode}
    onComplete={verify}
    autoComplete="one-time-code"
    aria-invalid={!!error}
    aria-describedby={error ? "code-error" : undefined}
    containerClassName="justify-center"
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
  <FieldError id="code-error" className="justify-center text-center">
    {error}
  </FieldError>
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
