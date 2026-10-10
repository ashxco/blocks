"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { SiteFooter } from "@/components/blocks/site-footer"

export default function SiteFooterDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Wordmark and a monthly product-updates sign-up on the left, three columns of long-tail links on the right, and a bottom row with legal links and live status."
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
        title="Without the sign-up"
        layout="full"
        description="On pages that already ask for an email, such as a blog with its own newsletter band, turn the footer form off. A short line about the product takes its place."
        code={`<SiteFooter newsletter={false} />`}
      >
        <SiteFooter newsletter={false} />
      </Example>

      <Example
        title="Four columns"
        layout="full"
        description="Pass your own columns. The grid holds up to four and drops to two columns on narrow screens. Fill them with the long tail, not the header links."
        code={`<SiteFooter
  columns={[
    { title: "Product", links: [{ label: "Integrations", href: "/integrations" }, …] },
    { title: "Developers", links: […] },
    { title: "Company", links: […] },
    { title: "Resources", links: […] },
  ]}
/>`}
      >
        <SiteFooter
          columns={[
            {
              title: "Product",
              links: [
                { label: "Integrations", href: "#" },
                { label: "Templates", href: "#" },
                { label: "Security", href: "#" },
              ],
            },
            {
              title: "Developers",
              links: [
                { label: "API reference", href: "#" },
                { label: "SDK", href: "#" },
                { label: "Webhooks", href: "#" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "Careers", href: "/live/about#careers" },
                { label: "Customers", href: "#" },
                { label: "Press", href: "#" },
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "Guides", href: "/live/blog" },
                { label: "Help center", href: "#" },
                { label: "Partners", href: "#" },
              ],
            },
          ]}
        />
      </Example>

      <Guidelines
        do={[
          "Group links by what people are looking for: product, developers, company.",
          "Keep the status link honest and point it at your real status page.",
          "Use the same footer on every marketing page; only the sign-up comes and goes.",
        ]}
        dont={[
          "Don’t repeat every header link; the footer is for the long tail.",
          "Don’t add more than four columns or nest lists.",
          "Don’t use a dark panel for the footer; panels are for emphasis.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "columns", type: "{ title: string; links: { label: string; href: string }[] }[]", default: "Product, Resources, Company", description: "Link columns beside the newsletter form. The defaults hold long-tail pages, none of the header links." },
          { prop: "newsletter", type: "boolean", default: "true", description: "Show the newsletter sign-up. Turn it off on pages with their own sign-up." },
          { prop: "className", type: "string", description: "Classes for the <footer> element." },
        ]}
      />
    </Examples>
  )
}
