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
  placeholder="you@company.com"
  successMessage={(email) => <>We’ll email {email} when the Android app is ready.</>}
/>`}
      >
        <NewsletterForm
          buttonLabel="Notify me"
          placeholder="you@company.com"
          successMessage={(email) => <>We’ll email {email} when the Android app is ready.</>}
        />
      </Example>

      <Example
        title="Invalid address"
        description="Submitting an empty or malformed address keeps the field, turns its border destructive and says what a valid address looks like. Typing clears the message."
        code={`<NewsletterForm defaultValue="maya@acme" defaultStatus="invalid" />`}
      >
        <NewsletterForm defaultValue="maya@acme" defaultStatus="invalid" />
      </Example>

      <Example
        title="Request failed"
        description="Throw from onSubscribe and the form keeps the address and asks people to try again. This handler always fails, so pressing Subscribe shows the same state."
        code={`<NewsletterForm
  onSubscribe={async (email) => {
    const res = await fetch("/api/subscribe", { method: "POST", body: email })
    if (!res.ok) throw new Error("Subscribe failed")
  }}
/>

// The failed state on its own, as shown here:
<NewsletterForm defaultValue="maya@acme.com" defaultStatus="error" />`}
      >
        <NewsletterForm defaultValue="maya@acme.com" defaultStatus="error" onSubscribe={failingSubscribe} />
      </Example>

      <Example
        title="Subscribed"
        surface="subtle"
        description="After a successful request the field gives way to the confirmation, with a way back to enter another address."
        code={`<NewsletterForm defaultValue="maya@acme.com" defaultStatus="success" />`}
      >
        <NewsletterForm defaultValue="maya@acme.com" defaultStatus="success" />
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
          { prop: "defaultValue", type: "string", default: '""', description: "Initial email address." },
          { prop: "defaultStatus", type: '"idle" | "invalid" | "error" | "success"', default: '"idle"', description: "Initial state, for docs and screenshots." },
          { prop: "className", type: "string", description: "Classes for the form." },
        ]}
      />
    </Examples>
  )
}
