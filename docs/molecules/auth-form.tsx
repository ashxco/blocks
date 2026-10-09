"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { AuthForm } from "@/components/blocks/auth-form"
import { AuthShowcase, AuthShowcaseCompact } from "@/components/blocks/auth-form/showcase"
import { Wordmark } from "@/components/blocks/wordmark"

export default function AuthFormDocs() {
  return (
    <Examples>
      <Example
        title="Sign in"
        description="Providers first, then email. Submit it empty to see inline validation; any valid email signs in."
        layout="full"
        minHeight="min-h-176"
        code={`<AuthForm mode="sign-in" />`}
      >
        <div className="flex justify-center px-(--card-padding) py-16">
          <AuthForm as="h2" />
        </div>
      </Example>

      <Example
        title="Sign up, framed"
        description="Asks for a name too, checks the password length (PASSWORD_MIN, shared with the security settings) and ends on an email confirmation. Frame it when the page behind is tinted. In narrow slots the heading steps down to the h3 role."
        layout="full"
        surface="subtle"
        minHeight="min-h-200"
        code={`<AuthForm mode="sign-up" framed termsHref="/legal/terms" privacyHref="/legal/privacy" />`}
      >
        <div className="flex justify-center px-4 py-16">
          <AuthForm mode="sign-up" framed as="h2" />
        </div>
      </Example>

      <Example
        title="Split with a panel"
        description="How the auth templates use it: the wordmark and the form on the canvas, the Lumen showcase on a dark panel beside them, with a deploy streaming in and a customer quote. In narrow containers the panel gives way to the quote on its own, under the form."
        layout="full"
        code={`import { AuthShowcase, AuthShowcaseCompact } from "@/components/blocks/auth-form/showcase"

<div className="@container">
  <div className="grid @min-[60rem]:grid-cols-2">
    <div className="flex flex-col px-6">
      <Wordmark />
      <AuthForm />
      <AuthShowcaseCompact className="@min-[60rem]:hidden" />
    </div>
    <div className="hidden p-3 @min-[60rem]:flex">
      <AuthShowcase />
    </div>
  </div>
</div>`}
      >
        <div className="@container p-4 sm:p-6">
          <div className="grid overflow-hidden rounded-(--panel-radius) border bg-background @min-[60rem]:grid-cols-2">
            <div className="flex min-w-0 flex-col px-6 @min-[60rem]:px-10">
              <div className="flex h-(--header-height) items-center">
                <Wordmark href={null} />
              </div>
              <div className="flex flex-1 flex-col items-center justify-center py-10">
                <AuthForm as="h2" />
                <AuthShowcaseCompact className="mt-12 w-full max-w-104 @min-[60rem]:hidden" />
              </div>
            </div>
            <div className="hidden min-w-0 p-3 @min-[60rem]:flex">
              <AuthShowcase />
            </div>
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Offer the providers your customers already use, then email.",
          "Show errors after the first submit, next to the field, and say how to fix them.",
          "Link to the other mode under the form, so people on the wrong page can switch.",
          "Pass as=\"h2\" when the page already has an h1.",
        ]}
        dont={[
          "Don’t ask for more than name, email and password at sign-up. Collect the rest in onboarding.",
          "Don’t clear the email after a failed attempt.",
          "Don’t put badges, labels or marketing copy above the heading.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "mode", type: '"sign-in" | "sign-up"', default: '"sign-in"', description: "Which form to show. Sign-up adds a name field, a password rule and the legal note." },
          { prop: "title", type: "ReactNode", default: "By mode", description: "Heading. “Welcome back” or “Create your account”." },
          { prop: "description", type: "ReactNode", default: "By mode", description: "Line under the heading." },
          { prop: "as", type: '"h1" | "h2"', default: '"h1"', description: "Heading level." },
          { prop: "framed", type: "boolean", default: "false", description: "Wrap the form in a bordered card." },
          { prop: "signInHref", type: "string", default: '"/live/sign-in"', description: "Link from sign-up to sign-in." },
          { prop: "signUpHref", type: "string", default: '"/live/sign-up"', description: "Link from sign-in to sign-up." },
          { prop: "forgotPasswordHref", type: "string", default: '"/live/forgot-password"', description: "Link next to the password label on sign-in." },
          { prop: "continueHref", type: "string", default: "By mode", description: "Where the success state leads: /live/app after sign-in, /live/onboarding after sign-up." },
          { prop: "termsHref", type: "string", description: "Terms link in the sign-up note. Plain text when omitted." },
          { prop: "privacyHref", type: "string", description: "Privacy link in the sign-up note. Plain text when omitted." },
          { prop: "onSubmit", type: "(values, mode) => void | Promise<void>", description: "Called with valid values. Throw to show a form error. Without it, the form simulates a request." },
          { prop: "className", type: "string", description: "Classes for the root. The form is at most max-w-104 wide." },
        ]}
      />
    </Examples>
  )
}
