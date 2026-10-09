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
  quote="Our on-call rotation used to dread Fridays. Now a bad deploy is a two-second rollback, and we ship on Fridays like any other day."
  author={{ name: "Marcus Lee", role: "Head of Platform, Tidewater", initials: "ML", tint: "sky" }}
  metric={{ value: "2.3s", label: "median rollback" }}
/>`}
      >
        <Testimonial
          tone="panel"
          quote="Our on-call rotation used to dread Fridays. Now a bad deploy is a two-second rollback, and we ship on Fridays like any other day."
          author={{ name: "Marcus Lee", role: "Head of Platform, Tidewater", initials: "ML", tint: "sky" }}
          metric={{ value: "2.3s", label: "median rollback" }}
        />
      </Example>

      <Example
        title="Plain, without a metric"
        layout="full"
        description="Between hairlines, for pages that already have a tinted band nearby. Drop the metric when the quote has no number."
        code={`<Testimonial
  tone="plain"
  metric={null}
  quote="The preview URLs changed how we review. Designers comment on the real thing instead of screenshots."
  author={{ name: "Sofia Alvarez", role: "Design Lead, Northwind", initials: "SA", tint: "sand" }}
/>`}
      >
        <Testimonial
          tone="plain"
          metric={null}
          quote="The preview URLs changed how we review. Designers comment on the real thing instead of screenshots."
          author={{ name: "Sofia Alvarez", role: "Design Lead, Northwind", initials: "SA", tint: "sand" }}
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
          { prop: "quote", type: "ReactNode", default: "Priya Shah’s quote", description: "The quote, without quotation marks." },
          { prop: "author", type: "{ name: string; role: string; initials: string; avatarSrc?: string; tint?: \"violet\" | \"mint\" | \"sand\" | \"sky\" | \"rose\" }", default: "Priya Shah, CTO", description: "The person. Initials show on a flat tint when there is no photo." },
          { prop: "metric", type: "{ value: string; label: string } | null", default: '{ value: "4×", label: "faster releases" }', description: "Headline result. Pass null to hide it." },
          { prop: "tone", type: '"subtle" | "panel" | "plain"', default: '"subtle"', description: "Tinted band, dark panel or between hairlines." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
