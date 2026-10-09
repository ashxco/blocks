"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { SiteFooter } from "@/components/blocks/site-footer"

export default function SiteFooterDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Wordmark and newsletter sign-up on the left, three link columns on the right, and a bottom row with legal links and live status."
        code={`<SiteFooter />`}
      >
        <SiteFooter />
      </Example>

      <Example
        title="On a tinted band"
        layout="full"
        surface="subtle"
        description="On pages that end with a white section, a tinted footer keeps the boundary clear without a heavy rule."
        code={`<SiteFooter className="bg-subtle" />`}
      >
        <SiteFooter className="bg-subtle" />
      </Example>

      <Example
        title="Four columns"
        layout="full"
        description="Pass your own columns. The grid holds up to four and drops to two columns on narrow screens."
        code={`<SiteFooter
  columns={[
    { title: "Product", links: [{ label: "Features", href: "/live/features" }, …] },
    { title: "Developers", links: […] },
    { title: "Company", links: […] },
    { title: "Legal", links: […] },
  ]}
/>`}
      >
        <SiteFooter
          columns={[
            {
              title: "Product",
              links: [
                { label: "Features", href: "/live/features" },
                { label: "Pricing", href: "/live/pricing" },
                { label: "Changelog", href: "/live/changelog" },
              ],
            },
            {
              title: "Developers",
              links: [
                { label: "Documentation", href: "#" },
                { label: "CLI reference", href: "#" },
                { label: "Status", href: "#" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About", href: "/live/about" },
                { label: "Blog", href: "/live/blog" },
                { label: "Contact", href: "/live/contact" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy", href: "#" },
                { label: "Terms", href: "#" },
                { label: "DPA", href: "#" },
              ],
            },
          ]}
        />
      </Example>

      <Guidelines
        do={[
          "Group links by what people are looking for: product, developers, company.",
          "Keep the status link honest and point it at your real status page.",
          "Use the same footer on every marketing page.",
        ]}
        dont={[
          "Don’t repeat every header link; the footer is for the long tail.",
          "Don’t add more than four columns or nest lists.",
          "Don’t use a dark panel for the footer; panels are for emphasis.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "columns", type: "{ title: string; links: { label: string; href: string }[] }[]", default: "Product, Developers, Company", description: "Link columns beside the newsletter form." },
          { prop: "className", type: "string", description: "Classes for the <footer> element." },
        ]}
      />
    </Examples>
  )
}
