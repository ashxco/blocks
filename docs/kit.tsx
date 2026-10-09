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
import { CheckIcon, PenLineIcon, XIcon } from "lucide-react"

import { cn } from "@/components/viewer/cn"

/**
 * One example on a preview canvas, with Preview and Code tabs, a copy button,
 * a per-example light/dark switch and, for layout="full", a width switch.
 * Implemented as a client component in components/viewer/example-canvas.tsx.
 */
export { Example, type ExampleProps } from "@/components/viewer/example-canvas"

/** Wraps a page's examples with consistent spacing. */
export function Examples({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-16 sm:gap-20">{children}</div>
}

/** Do / don't guidance for a component or molecule. */
export function Guidelines({ do: dos = [], dont = [] }: { do?: string[]; dont?: string[] }) {
  return (
    <section data-slot="guidelines" aria-labelledby="guidelines" className="grid scroll-mt-24 gap-5">
      <h2 id="guidelines" className="text-h3">
        Guidelines
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <GuidelineList tone="do" title="Do" items={dos} />
        <GuidelineList tone="dont" title="Don’t" items={dont} />
      </div>
    </section>
  )
}

function GuidelineList({ tone, title, items }: { tone: "do" | "dont"; title: string; items: string[] }) {
  const Icon = tone === "do" ? CheckIcon : XIcon
  return (
    <div
      className={cn(
        "grid content-start overflow-hidden rounded-(--card-radius) border border-t-2",
        tone === "do" ? "border-t-success" : "border-t-destructive"
      )}
    >
      <div className="flex items-center gap-3 px-5 pt-5 pb-3 sm:px-6">
        <span
          className={cn(
            "grid size-7 place-items-center rounded-full",
            tone === "do" ? "bg-success-subtle text-success" : "bg-destructive-subtle text-destructive"
          )}
        >
          <Icon aria-hidden="true" className="size-4" strokeWidth={2.5} />
        </span>
        <h3 className="text-title">{title}</h3>
      </div>
      <ul className="grid divide-y px-5 sm:px-6">
        {items.map((item) => (
          <li key={item} className="flex gap-3 py-3.5 text-body text-copy last:pb-5">
            <Icon
              aria-hidden="true"
              className={cn("mt-1.5 size-3.5 shrink-0", tone === "do" ? "text-success" : "text-destructive")}
              strokeWidth={2.5}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export interface ApiRow {
  prop: string
  type: string
  default?: string
  description: string
}

/** Props reference table. Becomes a list of cards on small screens. */
export function ApiTable({ title = "API", rows }: { title?: string; rows: ApiRow[] }) {
  const id = `api-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
  return (
    <section data-slot="api" aria-labelledby={id} className="grid scroll-mt-24 gap-5">
      <h2 id={id} className="text-h3">
        {title}
      </h2>

      {/* Small screens: one card per prop. */}
      <dl className="grid divide-y rounded-(--card-radius) border md:hidden">
        {rows.map((r) => (
          <div key={r.prop} className="grid gap-2 p-5">
            <dt className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <code className="font-mono text-code font-semibold text-foreground">{r.prop}</code>
              {r.default ? (
                <span className="font-mono text-code text-muted-foreground">= {r.default}</span>
              ) : null}
            </dt>
            <dd className="grid gap-2">
              <code className="font-mono text-code break-words text-copy">{r.type}</code>
              <p className="text-body text-copy">{r.description}</p>
            </dd>
          </div>
        ))}
      </dl>

      {/* Larger screens: a hairline table. */}
      <div className="hidden overflow-x-auto rounded-(--card-radius) border md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b bg-subtle">
              <th scope="col" className="h-11 px-5 text-caption font-semibold text-muted-foreground">
                Prop
              </th>
              <th scope="col" className="h-11 px-5 text-caption font-semibold text-muted-foreground">
                Type
              </th>
              <th scope="col" className="h-11 px-5 text-caption font-semibold text-muted-foreground">
                Default
              </th>
              <th scope="col" className="h-11 px-5 text-caption font-semibold text-muted-foreground">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.prop} className="align-top">
                <td className="px-5 py-4 whitespace-nowrap">
                  <code className="font-mono text-code font-semibold text-foreground">{r.prop}</code>
                </td>
                <td className="max-w-80 px-5 py-4">
                  <code className="font-mono text-code break-words text-copy">{r.type}</code>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <code className="font-mono text-code text-muted-foreground">{r.default ?? "–"}</code>
                </td>
                <td className="min-w-64 px-5 py-4 text-sm text-copy">{r.description}</td>
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
    <div className="flex flex-col items-start gap-4 rounded-(--card-radius) border border-dashed border-border-strong bg-subtle p-8 sm:flex-row sm:items-center sm:p-10">
      <span className="grid size-10 shrink-0 place-items-center rounded-full border bg-background text-muted-foreground">
        <PenLineIcon aria-hidden="true" className="size-4" />
      </span>
      <div className="grid gap-1">
        <p className="text-title text-foreground">Documentation in progress</p>
        <p className="text-body text-copy">Examples and guidance for this entry are being written.</p>
      </div>
    </div>
  )
}
