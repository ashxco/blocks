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
    value: "trial",
    question: "How does the free trial work?",
    answer:
      "Pro is free for 14 days and you don’t need a card to start. When the trial ends, add a card to stay on Pro, or keep working on Free with up to 3 members and 5 projects.",
  },
  {
    value: "guests",
    question: "Can I invite people from outside my company?",
    answer:
      "Yes. On Pro and above, invite clients and contractors as guests. Guests see only the projects you share with them, and you can remove their access at any time.",
  },
  {
    value: "import",
    question: "Can I bring my work over from another tool?",
    answer:
      "Yes. Import a CSV file and Acme maps the title, assignee, due date and priority columns for you. Most teams move a project over in an afternoon.",
  },
  {
    value: "runs",
    question: "What counts as an automation run?",
    answer:
      "One run is one rule firing once. If “When a task moves to Done, notify the owner” fires for 40 tasks, that is 40 runs. Pro includes 10,000 runs a month.",
  },
]

const unmatched = [
  { name: "J. Lee", detail: "Row 42 · 3 tasks" },
  { name: "Design team", detail: "Row 118 · 7 tasks" },
]

export default function AccordionDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Hairline-separated rows with bold titles. The plus turns ink and rotates into a cross when its row is open."
        layout="stack"
        code={`<Accordion defaultValue={["trial"]}>
  <AccordionItem value="trial">
    <AccordionTrigger>How does the free trial work?</AccordionTrigger>
    <AccordionContent>
      Pro is free for 14 days and you don’t need a card to start. …
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="guests">…</AccordionItem>
</Accordion>`}
      >
        <Accordion defaultValue={["trial"]} className="max-w-narrow">
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
        code={`<Accordion multiple defaultValue={["trial", "guests"]}>…</Accordion>`}
      >
        <Accordion multiple defaultValue={["trial", "guests"]} className="max-w-narrow">
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
        code={`<AccordionItem value="residency" disabled>…</AccordionItem>`}
      >
        <Accordion className="max-w-narrow">
          <AccordionItem value="audit">
            <AccordionTrigger>Audit log</AccordionTrigger>
            <AccordionContent>
              Every change to projects, tasks, members and permissions, with who made it and when.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sso">
            <AccordionTrigger>SSO and SAML</AccordionTrigger>
            <AccordionContent>Sign in with your identity provider, on Business and Enterprise.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="residency" disabled>
            <AccordionTrigger>Data residency, available on Enterprise</AccordionTrigger>
            <AccordionContent>Keep your workspace data stored in the EU or the US.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>

      <Example
        title="Import summary"
        description="Rich content works inside a row: status, lists and links. Keep the title short and put detail in the panel."
        layout="stack"
      >
        <Accordion variant="contained" defaultValue={["assignees"]} className="max-w-narrow">
          <AccordionItem value="tasks">
            <AccordionTrigger>
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                Tasks
                <Badge variant="success">284 imported</Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Imported 284 tasks into Client projects in <span className="tabular">6 seconds</span>, with their
                due dates and priorities.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="assignees">
            <AccordionTrigger>
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                Assignees
                <Badge variant="warning">2 not matched</Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p>Two names in the file don’t match anyone in Acme Inc., so their tasks have no assignee yet.</p>
              <ul className="divide-y rounded-(--control-radius) border">
                {unmatched.map((row) => (
                  <li key={row.name} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-0.5 px-3 py-2">
                    <span className="font-semibold text-foreground">{row.name}</span>
                    <span className="text-caption text-muted-foreground tabular-nums">{row.detail}</span>
                  </li>
                ))}
              </ul>
              <p>
                Pick a member for each name, or leave the tasks unassigned. <a href="#import-guide">Read the import guide</a>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="comments">
            <AccordionTrigger>
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                Comments
                <Badge variant="secondary">Skipped</Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p>Skipped because the file has no comments column.</p>
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
