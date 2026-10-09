"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { NewsletterForm } from "@/components/blocks/newsletter-form"

async function failingSubscribe() {
  await new Promise((resolve) => setTimeout(resolve, 600))
  throw new Error("Network error")
}

export default function NewsletterFormDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Type an address and press Subscribe. The field gives way to an inline confirmation in the same spot."
        code={`<NewsletterForm onSubscribe={(email) => subscribe(email)} />`}
      >
        <NewsletterForm />
      </Example>

      <Example
        title="On a panel"
        surface="panel"
        description="Use the panel tone inside dark panels. The button switches to the inverse style."
        code={`<NewsletterForm tone="panel" />`}
      >
        <NewsletterForm tone="panel" />
      </Example>

      <Example
        title="Custom labels"
        surface="subtle"
        description="Change the button and confirmation to match what people sign up for."
        code={`<NewsletterForm
  buttonLabel="Notify me"
  placeholder="you@acme.dev"
  successMessage={(email) => <>We’ll email {email} when regions in Asia go live.</>}
/>`}
      >
        <NewsletterForm
          buttonLabel="Notify me"
          placeholder="you@acme.dev"
          successMessage={(email) => <>We’ll email {email} when regions in Asia go live.</>}
        />
      </Example>

      <Example
        title="Errors"
        description="Submit an empty or malformed address to see validation. Here the handler always fails, to show the request error."
        code={`<NewsletterForm onSubscribe={async (email) => {
  const res = await fetch("/api/subscribe", { method: "POST", body: email })
  if (!res.ok) throw new Error("Subscribe failed")
}} />`}
      >
        <NewsletterForm onSubscribe={failingSubscribe} />
      </Example>

      <Guidelines
        do={[
          "Say how often you’ll email and that people can leave any time.",
          "Confirm inline, in the same place, so the page doesn’t jump.",
          "Use double opt-in and say so in the confirmation.",
        ]}
        dont={[
          "Don’t ask for anything but an email address.",
          "Don’t open a dialog or toast to confirm.",
          "Don’t pre-tick marketing consent.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "onSubscribe", type: "(email: string) => void | Promise<void>", description: "Called with a valid address. Throw to show the error message. Without it the form simulates a request." },
          { prop: "buttonLabel", type: "string", default: '"Subscribe"', description: "Submit button text." },
          { prop: "placeholder", type: "string", default: '"you@company.com"', description: "Field placeholder." },
          { prop: "label", type: "string", default: '"Email address"', description: "Accessible label for the field." },
          { prop: "successMessage", type: "(email: string) => ReactNode", description: "Confirmation shown after subscribing." },
          { prop: "tone", type: '"default" | "panel"', default: '"default"', description: "Use panel on dark panels." },
          { prop: "className", type: "string", description: "Classes for the form." },
        ]}
      />
    </Examples>
  )
}
