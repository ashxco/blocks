"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { InstallCommand } from "@/components/blocks/install-command"

export default function InstallCommandDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Press the copy button. It confirms with “Copied” for a moment, and screen readers hear it too."
        code={`<InstallCommand command="npm install @acme/sdk" />`}
      >
        <InstallCommand />
      </Example>

      <Example
        title="On a panel"
        surface="panel"
        description="Use the panel tone inside dark panels, such as a developer section on a call to action band."
        code={`<InstallCommand tone="panel" />`}
      >
        <InstallCommand tone="panel" />
      </Example>

      <Example
        title="Long commands"
        layout="stack"
        description="Set a width to fill a column. A command stays on one line and scrolls sideways if the box is too narrow, so keep it short enough for the narrowest slot it appears in, or set wrap."
        code={`<InstallCommand className="w-full" command="pnpm add @acme/sdk" />`}
      >
        <div className="mx-auto grid w-full max-w-96 gap-3">
          <InstallCommand className="w-full" command="pnpm add @acme/sdk" />
          <InstallCommand className="w-full" command="yarn add @acme/sdk" />
        </div>
      </Example>

      <Example
        title="Wrapped"
        layout="stack"
        description="Set wrap where a command can’t be shortened and the slot is narrow. It wraps at spaces with a hanging indent, so nothing is cut off, and the button still copies one line."
        code={`<InstallCommand wrap className="w-full" command="npm install @acme/sdk@3.2.0 --save-exact" />`}
      >
        <div className="mx-auto grid w-full max-w-72 gap-3">
          <InstallCommand wrap className="w-full" command="npm install @acme/sdk@3.2.0 --save-exact" />
        </div>
      </Example>

      <Guidelines
        do={[
          "Show the one command that gets a developer started, such as the SDK install.",
          "Use the real package name people will paste.",
          "Pair it with a link to the API reference.",
        ]}
        dont={[
          "Don’t chain several commands with && in one box; use a code window.",
          "Don’t include the $ in the command; the prompt is drawn for you.",
          "Don’t put secrets or tokens in a copyable command.",
          "Don’t show it on pages for people who don’t write code; they need a sign-up button.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "command", type: "string", default: '"npm install @acme/sdk"', description: "The command shown and copied." },
          { prop: "tone", type: '"default" | "panel"', default: '"default"', description: "Use panel inside dark panels." },
          { prop: "wrap", type: "boolean", default: "false", description: "Wrap a long command with a hanging indent instead of scrolling it sideways. For narrow slots." },
          { prop: "className", type: "string", description: "Classes for the wrapper, such as w-full." },
        ]}
      />
    </Examples>
  )
}
