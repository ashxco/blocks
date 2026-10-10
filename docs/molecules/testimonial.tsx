"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Testimonial } from "@/components/blocks/testimonial"

export default function TestimonialDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="A large bold quote on a tinted band, the person behind it, and the result as a headline number."
        code={`<Testimonial />`}
      >
        <Testimonial />
      </Example>

      <Example
        title="Dark panel"
        layout="full"
        description="For the one quote you want people to remember. Keep it away from other dark panels on the page."
        code={`<Testimonial
  tone="panel"
  quote="Our Monday status call was an hour of reading out spreadsheets. Now everyone opens the same dashboard, and the call takes fifteen minutes."
  author={{ name: "Owen Hart", role: "Operations Director, Globex", initials: "OH", tint: "sky" }}
  metric={{ value: "15 min", label: "weekly status call" }}
/>`}
      >
        <Testimonial
          tone="panel"
          quote="Our Monday status call was an hour of reading out spreadsheets. Now everyone opens the same dashboard, and the call takes fifteen minutes."
          author={{ name: "Owen Hart", role: "Operations Director, Globex", initials: "OH", tint: "sky" }}
          metric={{ value: "15 min", label: "weekly status call" }}
        />
      </Example>

      <Example
        title="Plain, without a metric"
        layout="full"
        description="Between hairlines, for pages that already have a tinted band nearby. Drop the metric when the quote has no number."
        code={`<Testimonial
  tone="plain"
  metric={null}
  quote="Our clients comment on the tasks themselves now. Nobody forwards an email thread to find out what was agreed."
  author={{ name: "Daniela Ortiz", role: "Head of Client Services, Fieldstone", initials: "DO", tint: "sand" }}
/>`}
      >
        <Testimonial
          tone="plain"
          metric={null}
          quote="Our clients comment on the tasks themselves now. Nobody forwards an email thread to find out what was agreed."
          author={{ name: "Daniela Ortiz", role: "Head of Client Services, Fieldstone", initials: "DO", tint: "sand" }}
        />
      </Example>

      <Guidelines
        do={[
          "Quote a real customer, edited for length but not for meaning.",
          "Lead with the result, ideally a number the metric repeats.",
          "Keep quotes to two or three sentences.",
        ]}
        dont={[
          "Don’t slant the quote or set it in a light weight; it stays bold and upright.",
          "Don’t wrap the text in quotation marks; the quote icon already marks it.",
          "Don’t show more than one large testimonial per page; use a grid of short ones instead.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "quote", type: "ReactNode", default: "Elena Ruiz’s quote", description: "The quote, without quotation marks." },
          { prop: "author", type: "{ name: string; role: string; initials: string; avatarSrc?: string; tint?: \"violet\" | \"mint\" | \"sand\" | \"sky\" | \"rose\" }", default: "Elena Ruiz, COO, Northwind", description: "The person. Initials show on a flat tint when there is no photo." },
          { prop: "metric", type: "{ value: string; label: string } | null", default: '{ value: "50%", label: "fewer status meetings" }', description: "Headline result. Pass null to hide it." },
          { prop: "tone", type: '"subtle" | "panel" | "plain"', default: '"subtle"', description: "Tinted band with a hairline border, dark panel, or between hairlines." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
