"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const faq = [
  {
    value: "deploy",
    question: "How does a deployment start?",
    answer:
      "Connect a Git repository and push. Lumen builds every commit, gives each branch a preview URL and promotes main to production when the build passes.",
  },
  {
    value: "rollback",
    question: "Can I roll back a bad release?",
    answer:
      "Yes. Every deployment is kept. Open Deployments, pick a previous build and choose Promote to production. Traffic moves in a few seconds and nothing is rebuilt.",
  },
  {
    value: "domains",
    question: "Do I need to manage certificates for custom domains?",
    answer:
      "No. Add the domain, point its DNS records at Lumen and a certificate is issued within minutes. Certificates renew 30 days before they expire.",
  },
  {
    value: "regions",
    question: "Where does my app run?",
    answer:
      "In the regions you choose for each project. Static files are cached at the edge in 38 cities; functions run in the regions next to your database.",
  },
]

export default function AccordionDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Hairline-separated rows with bold titles. The plus turns ink and rotates into a cross when its row is open."
        layout="stack"
        code={`<Accordion defaultValue={["deploy"]}>
  <AccordionItem value="deploy">
    <AccordionTrigger>How does a deployment start?</AccordionTrigger>
    <AccordionContent>
      Connect a Git repository and push. …
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="rollback">…</AccordionItem>
</Accordion>`}
      >
        <Accordion defaultValue={["deploy"]} className="max-w-narrow">
          {faq.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Example>

      <Example
        title="Contained"
        description="Rows inside a bordered, rounded box, for an accordion that sits among cards."
        layout="stack"
        surface="subtle"
        code={`<Accordion variant="contained">…</Accordion>`}
      >
        <Accordion variant="contained" className="max-w-narrow">
          {faq.slice(0, 3).map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Example>

      <Example
        title="Several open at once"
        description="By default opening one row closes the others. Set multiple to let people compare answers."
        layout="stack"
        code={`<Accordion multiple defaultValue={["deploy", "rollback"]}>…</Accordion>`}
      >
        <Accordion multiple defaultValue={["deploy", "rollback"]} className="max-w-narrow">
          {faq.slice(0, 3).map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Example>

      <Example
        title="Disabled row"
        description="Disable a row whose content is not available yet, and say why in the title."
        layout="stack"
        code={`<AccordionItem value="sso" disabled>…</AccordionItem>`}
      >
        <Accordion className="max-w-narrow">
          <AccordionItem value="audit">
            <AccordionTrigger>Audit log</AccordionTrigger>
            <AccordionContent>
              Every change to projects, domains and members, kept for 90 days on the Pro plan.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sso" disabled>
            <AccordionTrigger>Single sign-on, available on Enterprise</AccordionTrigger>
            <AccordionContent>Connect Okta, Entra ID or Google Workspace.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>

      <Example
        title="Build checks"
        description="Rich content works inside a row: status, code and links. Keep the title short and put detail in the panel."
        layout="stack"
      >
        <Accordion variant="contained" defaultValue={["lint"]} className="max-w-narrow">
          <AccordionItem value="install">
            <AccordionTrigger>
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                Install dependencies
                <Badge variant="success">Passed</Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Restored 1,284 packages from cache in <span className="tabular">6.1s</span>.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="lint">
            <AccordionTrigger>
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                Type check
                <Badge variant="destructive">2 errors</Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p>The build stopped because tsc found two errors.</p>
              <pre className="overflow-x-auto rounded-(--control-radius) bg-terminal p-4 font-mono text-code text-terminal-foreground">
                {`app/deployments/page.tsx:42:7  Type 'string' is not assignable to type 'Status'.
lib/regions.ts:18:3             Property 'fra1' is missing in type 'Regions'.`}
              </pre>
              <p>
                Fix them locally with npm run typecheck, then push again. <a href="#typescript">Read the TypeScript guide</a>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="build">
            <AccordionTrigger>
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                Build
                <Badge variant="secondary">Skipped</Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p>Skipped because an earlier step failed.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>

      <Guidelines
        do={[
          "Write titles as the question or the name of the section, so people can scan without opening rows.",
          "Open the first row by default when most people need it.",
          "Use the contained variant when the accordion sits among cards.",
        ]}
        dont={[
          "Don’t hide information everyone needs, such as prices or required steps.",
          "Don’t put an accordion inside an accordion row.",
          "Don’t use an accordion for two or fewer rows. Show the content.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "variant", type: '"default" | "contained"', default: '"default"', description: "Accordion: open hairline rows, or rows in a bordered box." },
          { prop: "multiple", type: "boolean", default: "false", description: "Accordion: let more than one row be open at a time." },
          { prop: "defaultValue", type: "any[]", description: "Accordion: rows open on first render, when uncontrolled." },
          { prop: "value / onValueChange", type: "any[] / (value) => void", description: "Accordion: control which rows are open." },
          { prop: "hiddenUntilFound", type: "boolean", default: "false", description: "Accordion: keep closed content findable with the browser’s find in page." },
          { prop: "value", type: "any", description: "AccordionItem: identifies the row." },
          { prop: "disabled", type: "boolean", default: "false", description: "Accordion or AccordionItem: stop rows from opening." },
        ]}
      />
    </Examples>
  )
}
