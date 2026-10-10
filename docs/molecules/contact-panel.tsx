"use client"

import { BookOpenIcon, LifeBuoyIcon, MessagesSquareIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { ContactPanel } from "@/components/blocks/contact-panel"

export default function ContactPanelDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="One card split in two: a dark panel with other ways to get in touch, and a form whose topics are radios shaped like buttons. Sending shows a spinner, then an inline confirmation."
        code={`<ContactPanel
  onSubmit={async (values) => {
    await fetch("/api/contact", { method: "POST", body: JSON.stringify(values) })
  }}
/>`}
      >
        <ContactPanel />
      </Example>

      <Example
        title="Support request"
        layout="full"
        surface="subtle"
        description="Change the channels, topics and confirmation to fit the page. Throw from onSubmit to show the error message."
        code={`<ContactPanel
  title="Get unstuck"
  description="Most questions are answered in the help center within a minute."
  methods={[…]}
  topics={["Projects", "Automations", "Integrations", "Billing"]}
  submitLabel="Open a ticket"
  successMessage="Ticket opened. Check your inbox for a copy."
/>`}
      >
        <ContactPanel
          title="Get unstuck"
          description="Most questions are answered in the help center within a minute. For everything else, someone on our support team picks up your ticket."
          methods={[
            { icon: BookOpenIcon, label: "Help center", value: "Guides for projects, automations and reports" },
            { icon: MessagesSquareIcon, label: "Office hours", value: "Live Q&A with Sam Okafor every Thursday" },
            { icon: LifeBuoyIcon, label: "Priority support", value: "support@acme.com", href: "mailto:support@acme.com" },
          ]}
          hours="Replies within one business day"
          topics={["Projects", "Automations", "Integrations", "Billing"]}
          submitLabel="Open a ticket"
          successMessage="Ticket opened. Check your inbox for a copy."
        />
      </Example>

      <Guidelines
        do={[
          "Say how fast you reply, and keep that promise.",
          "Keep the form short: name, email, topic and message cover most cases.",
          "Confirm inline next to the button, without leaving the page.",
        ]}
        dont={[
          "Don’t ask for a phone number unless sales will call.",
          "Don’t use more than five topics; add “Something else” instead.",
          "Don’t clear the form if sending fails.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode", default: '"Other ways to reach us"', description: "Heading on the dark panel." },
          { prop: "description", type: "ReactNode", description: "Line under the panel heading." },
          { prop: "methods", type: "ContactMethod[]", default: "Sales, Support, Help center, Offices", description: "Icon, label, value and optional href for each channel." },
          { prop: "hours", type: "ReactNode | null", default: '"Support replies Monday to Friday, from San Francisco and London"', description: "Status line at the foot of the panel." },
          { prop: "topics", type: "string[]", default: '["Sales", "Support", "Billing", "Partnerships"]', description: "Radios shaped like buttons. The first is selected." },
          { prop: "teamSizes", type: "string[]", description: "Options for the team size select." },
          { prop: "submitLabel", type: "string", default: '"Send message"', description: "Button label." },
          { prop: "successMessage", type: "ReactNode", description: "Shown beside the button after sending." },
          { prop: "onSubmit", type: "(values: ContactFormValues) => void | Promise<void>", description: "Receives name, email, company, teamSize, topic and message. Throw to show the error." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section padding." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
