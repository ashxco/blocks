"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { AuthForm } from "@/components/blocks/auth-form"

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
        description="Asks for a name too, checks the password length and ends on an email confirmation. Frame it when the page behind is tinted."
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
        description="How the auth templates use it: the form on the canvas, a dark panel beside it for one line of proof. The panel drops away in narrow containers."
        layout="full"
        code={`<div className="@container">
  <div className="grid overflow-hidden rounded-(--panel-radius) border @narrow:grid-cols-2">
    <aside className="hidden flex-col justify-between bg-panel p-10 text-panel-muted @narrow:flex">
      …
    </aside>
    <div className="flex justify-center px-6 py-14">
      <AuthForm />
    </div>
  </div>
</div>`}
      >
        <div className="@container p-4 sm:p-6">
          <div className="grid overflow-hidden rounded-(--panel-radius) border @narrow:grid-cols-2">
            <aside className="hidden flex-col justify-between gap-16 bg-panel p-10 text-panel-muted @narrow:flex">
              <p className="text-title text-panel-foreground">Lumen</p>
              <figure className="grid gap-6">
                <blockquote className="text-h3 text-panel-foreground">
                  “We merged 40 pull requests last week and reviewed every one on its own preview URL.”
                </blockquote>
                <figcaption className="text-sm">Priya Raman, staff engineer at Halcyon Labs</figcaption>
              </figure>
            </aside>
            <div className="flex justify-center px-(--card-padding) py-14">
              <AuthForm as="h2" />
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
