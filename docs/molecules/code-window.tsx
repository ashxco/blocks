"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { CodeWindow } from "@/components/blocks/code-window"

export default function CodeWindowDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="A code sample in an editor frame: creating a task with the Acme SDK. Lines starting with // are comments, shown muted."
        code={`<CodeWindow />

// With your own code
<CodeWindow
  title="list-tasks.ts"
  lines={[
    "// Open tasks assigned to Priya",
    'const tasks = await acme.tasks.list({ assignee: "priya@acme.com", status: "open" })',
  ]}
/>`}
      >
        <CodeWindow className="mx-auto w-full max-w-narrow" />
      </Example>

      <Example
        title="Shell commands"
        layout="stack"
        surface="subtle"
        description="Lines starting with $ are commands, ✓ marks a success and → a note. Use it for a short setup sequence; a single command people copy belongs in the install command."
        code={`<CodeWindow
  title="Install the SDK"
  lines={[
    "$ npm install @acme/sdk",
    "✓ Added @acme/sdk 3.2.0",
    "$ export ACME_API_KEY=…",
    "→ Create a key in Settings → API",
  ]}
/>`}
      >
        <CodeWindow
          className="mx-auto w-full max-w-narrow"
          title="Install the SDK"
          lines={[
            "$ npm install @acme/sdk",
            "✓ Added @acme/sdk 3.2.0",
            "$ export ACME_API_KEY=…",
            "→ Create a key in Settings → API",
          ]}
        />
      </Example>

      <Example
        title="Custom content"
        layout="stack"
        description="Pass children instead of lines for anything else, such as an API response with its values picked out."
        code={`<CodeWindow title="POST /v1/tasks · 201">
  <pre>{response}</pre>
</CodeWindow>`}
      >
        <CodeWindow className="mx-auto w-full max-w-prose" title="POST /v1/tasks · 201">
          <pre className="m-0">
            {"{\n  "}
            <span className="text-panel-muted">&quot;id&quot;</span>
            {": "}
            <span className="text-panel-success">&quot;task_8kd2m1&quot;</span>
            {",\n  "}
            <span className="text-panel-muted">&quot;title&quot;</span>
            {": "}
            <span className="text-panel-success">&quot;Write launch announcement&quot;</span>
            {",\n  "}
            <span className="text-panel-muted">&quot;status&quot;</span>
            {": "}
            <span className="text-panel-success">&quot;todo&quot;</span>
            {",\n  "}
            <span className="text-panel-muted">&quot;priority&quot;</span>
            {": "}
            <span className="text-panel-success">&quot;high&quot;</span>
            {",\n  "}
            <span className="text-panel-muted">&quot;dueDate&quot;</span>
            {": "}
            <span className="text-panel-success">&quot;2026-10-24&quot;</span>
            {"\n}"}
          </pre>
        </CodeWindow>
      </Example>

      <Example
        title="On a panel"
        layout="stack"
        surface="panel"
        description="The frame is darker than panels, so it still reads as a window inside one."
        code={`<div className="rounded-(--panel-radius) bg-panel p-(--panel-padding)">
  <CodeWindow
    title="webhook.ts"
    lines={[
      "// Called when a task moves to Done",
      'acme.webhooks.on("task.completed", notifyOwner)',
    ]}
  />
</div>`}
      >
        <CodeWindow
          className="mx-auto w-full max-w-prose"
          title="webhook.ts"
          lines={["// Called when a task moves to Done", 'acme.webhooks.on("task.completed", notifyOwner)']}
        />
      </Example>

      <Example
        title="Wrapped lines"
        description="Set wrap for marketing visuals that must fit a phone. Sentence-like lines wrap at spaces with a hanging indent instead of scrolling out of view. Leave it off for code people copy: it should scroll sideways, not break apart."
        code={`<CodeWindow wrap title="Setup" lines={[…]} />`}
      >
        <CodeWindow
          wrap
          className="w-full max-w-80"
          title="Setup"
          lines={[
            "$ npm install @acme/sdk",
            "→ Create an API key in Settings and keep it out of your repository",
            "✓ Ready to create tasks in the Acme Inc. workspace",
          ]}
        />
      </Example>

      <Guidelines
        do={[
          "Show real API calls and believable values, short enough to read at a glance.",
          "Name the window after the file, command or endpoint it shows.",
          "Use it on light pages and inside panels alike; it stays dark in light and dark.",
        ]}
        dont={[
          "Don’t paste long files; five to ten lines tell the story.",
          "Don’t colour whole lines; the markers carry the meaning.",
          "Don’t wrap code people copy; let it scroll sideways.",
          "Don’t use it for a single command people should copy; use the install command.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "string", default: '"create-task.ts"', description: "Label in the title bar, also the accessible name." },
          { prop: "lines", type: "string[]", default: "An SDK example", description: "Code or output lines. // comment and → note are muted, $ is a prompt, ✓ a success." },
          { prop: "children", type: "ReactNode", description: "Custom body content. Used when lines is not set." },
          { prop: "wrap", type: "boolean", default: "false", description: "Wrap long lines with a hanging indent instead of scrolling sideways. For sentence-like output in visuals; not for code people copy." },
          { prop: "className", type: "string", description: "Classes for the frame, such as a width." },
        ]}
      />
    </Examples>
  )
}
