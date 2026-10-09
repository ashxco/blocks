"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { InstallCommand } from "@/components/blocks/install-command"

export default function InstallCommandDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Press the copy button. It confirms with “Copied” for a moment, and screen readers hear it too."
        code={`<InstallCommand command="npm i -g lumen" />`}
      >
        <InstallCommand />
      </Example>

      <Example
        title="On a panel"
        surface="panel"
        description="Use the panel tone inside dark panels and the call to action band."
        code={`<InstallCommand tone="panel" />`}
      >
        <InstallCommand tone="panel" />
      </Example>

      <Example
        title="Long commands"
        layout="stack"
        description="Long commands scroll sideways inside the box instead of wrapping, so they stay copy-ready. Set a width to fill a column."
        code={`<InstallCommand className="w-full" command="curl -fsSL https://get.lumen.dev/install.sh | sh" />`}
      >
        <div className="mx-auto grid w-full max-w-96 gap-3">
          <InstallCommand className="w-full" command="curl -fsSL https://get.lumen.dev/install.sh | sh" />
          <InstallCommand className="w-full" command="lumen link --project acme/web --team acme" />
        </div>
      </Example>

      <Guidelines
        do={[
          "Show the one command that gets someone started.",
          "Use the real package or script name people will paste.",
          "Pair it with a primary button for people who prefer the dashboard.",
        ]}
        dont={[
          "Don’t chain several commands with && in one box; use a code window.",
          "Don’t include the $ in the command; the prompt is drawn for you.",
          "Don’t put secrets or tokens in a copyable command.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "command", type: "string", default: '"npm i -g lumen"', description: "The command shown and copied." },
          { prop: "tone", type: '"default" | "panel"', default: '"default"', description: "Use panel inside dark panels." },
          { prop: "className", type: "string", description: "Classes for the wrapper, such as w-full." },
        ]}
      />
    </Examples>
  )
}
