/**
 * Building blocks for docs pages (docs/components/*.tsx, docs/molecules/*.tsx).
 *
 * A docs module default-exports a component that returns a list of
 * <Example>s, optionally followed by <Guidelines> and <ApiTable>. The viewer
 * renders the page title and description from lib/registry.ts, so docs
 * modules must not repeat them.
 *
 * The API of this file is a contract shared by every docs module: the viewer
 * may restyle these components, but must keep their props.
 */
import * as React from "react"

import { cn } from "@/lib/utils"

export interface ExampleProps {
  /** Short name of the example, e.g. "Variants". */
  title: string
  /** One sentence on when to use this example. */
  description?: string
  /** Source shown in the Code tab. Optional. */
  code?: string
  /**
   * How the preview canvas lays out its children.
   * - center: centred, wrapping row (default)
   * - stack: left-aligned column
   * - full: no padding, children fill the canvas (molecules, sections)
   */
  layout?: "center" | "stack" | "full"
  /** Canvas surface. Use "panel" to preview components that sit on dark panels. */
  surface?: "default" | "subtle" | "panel"
  /** Minimum canvas height, as a Tailwind class (e.g. "min-h-96"). */
  minHeight?: string
  children: React.ReactNode
}

export function Example({
  title,
  description,
  code,
  layout = "center",
  surface = "default",
  minHeight,
  children,
}: ExampleProps) {
  return (
    <section data-slot="example" className="grid gap-4">
      <header className="grid gap-1">
        <h3 className="text-title">{title}</h3>
        {description ? (
          <p className="max-w-prose text-sm text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div
        data-surface={surface}
        className={cn(
          "overflow-hidden rounded-lg border",
          surface === "subtle" && "bg-subtle",
          surface === "panel" && "border-panel-border bg-panel text-panel-foreground",
          surface === "default" && "bg-background"
        )}
      >
        <div
          className={cn(
            minHeight,
            layout === "center" && "flex flex-wrap items-center justify-center gap-4 p-10",
            layout === "stack" && "grid gap-4 p-8",
            layout === "full" && "w-full"
          )}
        >
          {children}
        </div>
        {code ? (
          <pre className="overflow-x-auto border-t bg-muted p-5 font-mono text-code text-foreground">
            <code>{code}</code>
          </pre>
        ) : null}
      </div>
    </section>
  )
}

/** Wraps a page's examples with consistent spacing. */
export function Examples({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-14">{children}</div>
}

/** Do / don't guidance for a component or molecule. */
export function Guidelines({ do: dos = [], dont = [] }: { do?: string[]; dont?: string[] }) {
  return (
    <section data-slot="guidelines" className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border p-6">
        <h3 className="mb-3 text-title">Do</h3>
        <ul className="grid gap-2 text-sm">
          {dos.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border p-6">
        <h3 className="mb-3 text-title">Don’t</h3>
        <ul className="grid gap-2 text-sm">
          {dont.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export interface ApiRow {
  prop: string
  type: string
  default?: string
  description: string
}

/** Props reference table. */
export function ApiTable({ title = "API", rows }: { title?: string; rows: ApiRow[] }) {
  return (
    <section data-slot="api" className="grid gap-4">
      <h3 className="text-title">{title}</h3>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-subtle text-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Prop</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Default</th>
              <th className="px-4 py-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.prop} className="border-t align-top">
                <td className="px-4 py-3 font-mono text-code text-foreground">{r.prop}</td>
                <td className="px-4 py-3 font-mono text-code">{r.type}</td>
                <td className="px-4 py-3 font-mono text-code">{r.default ?? "—"}</td>
                <td className="px-4 py-3">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/** Placeholder rendered until a docs module is written. */
export function Pending() {
  return (
    <div className="rounded-lg border border-dashed p-10 text-sm text-muted-foreground">
      Documentation for this entry is being written.
    </div>
  )
}
