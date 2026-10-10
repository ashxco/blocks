import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Container } from "@/components/ui/container"
import { Stack } from "@/components/ui/stack"

const sizes = [
  { size: "prose", width: "42rem", use: "Long-form reading" },
  { size: "narrow", width: "52rem", use: "Forms and FAQs" },
  { size: "page", width: "75rem", use: "The default page width" },
  { size: "wide", width: "85rem", use: "Wide layouts and app shells" },
] as const

export default function ContainerDocs() {
  return (
    <Examples>
      <Example
        title="Sizes"
        thumbnail
        layout="full"
        description="Four widths from the container tokens. Each one centres its content and keeps the page gutter (px-gutter) on both sides, so it never touches the edge of a phone. Switch to Tablet and Mobile: the wider sizes fill the frame minus the gutters."
        code={`<Container size="prose">…</Container>
<Container size="narrow">…</Container>
<Container>…</Container>
<Container size="wide">…</Container>`}
      >
        <Stack gap={3} className="bg-subtle py-10">
          {sizes.map(({ size, width, use }) => (
            <Container key={size} size={size}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-sm border border-border-strong bg-background px-4 py-3">
                <span className="text-title text-foreground">{size}</span>
                <span className="text-caption text-muted-foreground">
                  {width} · {use}
                </span>
              </div>
            </Container>
          ))}
        </Stack>
      </Example>

      <Example
        title="In a section"
        layout="full"
        description="A section spans the full width so its band reaches the edges; the container inside lines its content up with the rest of the page."
        code={`<section className="bg-subtle py-section-sm">
  <Container size="narrow">
    <Stack gap={8}>
      <Stack gap={3}>
        <h2 className="text-h3">Questions about billing</h2>
        <p className="text-lead text-copy">
          Plans, seats and invoices, answered by the Acme team.
        </p>
      </Stack>
      <Stack gap={1}>
        <h3 className="text-title">Can I change plans at any time?</h3>
        <p className="text-body text-copy">
          Yes. Upgrades apply straight away and downgrades at the end of the billing period.
        </p>
      </Stack>
      <Stack gap={1}>
        <h3 className="text-title">How does annual billing work?</h3>
        <p className="text-body text-copy">
          You pay for twelve months up front and save about 20%. Invoices arrive on the 1st.
        </p>
      </Stack>
    </Stack>
  </Container>
</section>`}
      >
        <section className="bg-subtle py-section-sm">
          <Container size="narrow">
            <Stack gap={8}>
              <Stack gap={3}>
                <h2 className="text-h3">Questions about billing</h2>
                <p className="text-lead text-copy">Plans, seats and invoices, answered by the Acme team.</p>
              </Stack>
              <Stack gap={1}>
                <h3 className="text-title">Can I change plans at any time?</h3>
                <p className="text-body text-copy">
                  Yes. Upgrades apply straight away and downgrades at the end of the billing period.
                </p>
              </Stack>
              <Stack gap={1}>
                <h3 className="text-title">How does annual billing work?</h3>
                <p className="text-body text-copy">
                  You pay for twelve months up front and save about 20%. Invoices arrive on the 1st.
                </p>
              </Stack>
            </Stack>
          </Container>
        </section>
      </Example>

      <Guidelines
        do={[
          "Put one container inside each full-width section, so bands of colour reach the edges and content lines up.",
          "Use page for most pages, narrow for forms and FAQs, prose for articles and wide for app shells.",
          "Render it as the element it stands for, such as main, with the render prop.",
        ]}
        dont={[
          "Don’t nest containers: the inner one adds a second set of gutters.",
          "Don’t add your own side padding to a container. The gutter is already there.",
          "Don’t use max-w-prose for the reading width. It is Tailwind’s fixed 65ch; use size=\"prose\".",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "size", type: '"prose" | "narrow" | "page" | "wide"', default: '"page"', description: "The maximum width, from --container-prose, --container-narrow, --container-page or --container-wide, plus the gutters." },
          { prop: "render", type: "ReactElement", description: "Render as another element, such as main or section." },
        ]}
      />
    </Examples>
  )
}
