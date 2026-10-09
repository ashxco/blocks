"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { CodeWindow } from "@/components/blocks/code-window"

export default function CodeWindowDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="stack"
        description="Shell output. Lines starting with $ are commands, ✓ marks a success and → a progress note."
        code={`<CodeWindow title="lumen — deploy" />

// With your own output
<CodeWindow
  lines={[
    "$ lumen deploy",
    "→ Building acme/web from main (a41c9e2)",
    "✓ Live at https://web.acme.dev",
  ]}
/>`}
      >
        <CodeWindow className="mx-auto w-full max-w-narrow" title="lumen — deploy" />
      </Example>

      <Example
        title="Logs"
        layout="stack"
        surface="subtle"
        description="Plain lines keep the terminal colour, which suits request logs and metrics."
        code={`<CodeWindow
  title="lumen logs --follow"
  lines={[
    "$ lumen logs web --follow",
    "12:04:01  GET   /              200    8ms",
    "12:04:02  POST  /api/login     200   41ms",
    "→ p95 latency 112ms, error rate 0.0%",
  ]}
/>`}
      >
        <CodeWindow
          className="mx-auto w-full max-w-narrow"
          title="lumen logs --follow"
          lines={[
            "$ lumen logs web --follow",
            "12:04:01  GET   /              200    8ms",
            "12:04:02  POST  /api/login     200   41ms",
            "12:04:02  GET   /dashboard     200   23ms",
            "12:04:05  GET   /api/projects  200   17ms",
            "→ p95 latency 112ms, error rate 0.0%",
          ]}
        />
      </Example>

      <Example
        title="Custom content"
        layout="stack"
        description="Pass children instead of lines for anything else, such as a config file."
        code={`<CodeWindow title="lumen.toml">
  <pre>{config}</pre>
</CodeWindow>`}
      >
        <CodeWindow className="mx-auto w-full max-w-prose" title="lumen.toml">
          <pre className="m-0">
            <span className="text-panel-muted"># Detected on first push. Edit to override.</span>
            {"\n"}
            <span className="text-panel-foreground">[build]</span>
            {"\ncommand = "}
            <span className="text-panel-success">&quot;npm run build&quot;</span>
            {"\noutput  = "}
            <span className="text-panel-success">&quot;.next&quot;</span>
            {"\n\n"}
            <span className="text-panel-foreground">[deploy]</span>
            {"\nregion   = "}
            <span className="text-panel-success">&quot;fra1&quot;</span>
            {"\nreplicas = 2"}
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
    lines={[
      "$ lumen domains add acme.dev",
      "→ Waiting for DNS",
      "✓ Certificate issued for acme.dev",
    ]}
  />
</div>`}
      >
        <CodeWindow
          className="mx-auto w-full max-w-prose"
          title="terminal"
          lines={["$ lumen domains add acme.dev", "→ Waiting for DNS", "✓ Certificate issued for acme.dev"]}
        />
      </Example>

      <Example
        title="Wrapped lines"
        description="Set wrap for marketing visuals that must fit a phone. Sentence-like lines wrap at spaces with a hanging indent instead of scrolling out of view. Leave it off for logs and tables: columns should scroll sideways, not break apart."
        code={`<CodeWindow wrap title="lumen deploy" lines={[…]} />`}
      >
        <CodeWindow
          wrap
          className="w-full max-w-80"
          title="lumen deploy"
          lines={[
            "$ lumen deploy",
            "→ Building acme/web from main and restoring the build cache",
            "✓ Live at web.acme.dev once every health check passed",
          ]}
        />
      </Example>

      <Guidelines
        do={[
          "Show real commands and believable output, short enough to read at a glance.",
          "Name the window after the command or file it shows.",
          "Use it on light pages and inside panels alike; it stays dark in both themes.",
        ]}
        dont={[
          "Don’t paste long logs; five to eight lines tell the story.",
          "Don’t colour whole lines; the markers carry the meaning.",
          "Don’t wrap columns such as log lines or tables; let them scroll sideways.",
          "Don’t use it for a single command people should copy; use the install command.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "string", default: '"terminal"', description: "Label in the title bar, also the accessible name." },
          { prop: "lines", type: "string[]", default: "A deploy log", description: "Output lines. $ prompt, ✓ success, → muted." },
          { prop: "children", type: "ReactNode", description: "Custom body content. Used when lines is not set." },
          { prop: "wrap", type: "boolean", default: "false", description: "Wrap long lines with a hanging indent instead of scrolling sideways. For sentence-like output in visuals; not for logs, tables or code people copy." },
          { prop: "className", type: "string", description: "Classes for the frame, such as a width." },
        ]}
      />
    </Examples>
  )
}
