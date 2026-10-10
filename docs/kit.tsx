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

import { tokens } from "@/design-system/generated/tokens"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ExamplesList } from "@/components/viewer/example-canvas"
import { slugify } from "@/components/viewer/nav"
import { thumbnailExample } from "@/components/viewer/thumbnail-example"
import { TokenText } from "@/components/viewer/token-text"

/**
 * One example on a preview canvas, with Preview and Code tabs, a copy button,
 * a per-example light/dark switch (Appearance) and, for layout="full", a width
 * switch. The canvas is in the site's theme in either mode.
 * Implemented as a client component in components/viewer/example-canvas.tsx.
 */
export { Example, type ExampleProps } from "@/components/viewer/example-canvas"

/*
 * Thumbnails. The viewer's index pages render each docs module as a small
 * live preview of its first example. On the server, a request-scoped flag
 * (React.cache is per request there) makes <Examples> pass on only the first
 * example and drops the guidelines and API tables, so the rest is never
 * rendered or sent. Docs modules that run on the client get the same result
 * from ExampleThumbnailContext, through ExamplesList.
 */
const thumbnailRequest = React.cache(() => ({ active: false }))

/** Called by a viewer index page before it renders docs modules as thumbnails. */
export function renderDocsAsThumbnails() {
  thumbnailRequest().active = true
}

function isThumbnailRequest() {
  return thumbnailRequest().active
}

/**
 * Wraps a page's examples with consistent spacing. On the index pages the
 * module's thumbnail is its first example, or the one marked
 * <Example thumbnail>.
 */
export function Examples({ children }: { children: React.ReactNode }) {
  if (isThumbnailRequest()) return <>{thumbnailExample(children)}</>
  return <ExamplesList>{children}</ExamplesList>
}

/** Do / don't guidance for a component or molecule. */
export function Guidelines({
  do: dos = [],
  dont = [],
  title = "Guidelines",
}: {
  do?: string[]
  dont?: string[]
  /** Section heading. Pass null where the surrounding section already has one. */
  title?: string | null
}) {
  if (isThumbnailRequest()) return null
  const id = !title ? undefined : title === "Guidelines" ? "guidelines" : `guidelines-${slugify(title)}`
  return (
    <section data-slot="guidelines" aria-labelledby={id} className="grid scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-6">
      {title ? (
        <h2 id={id} className="text-h3">
          {title}
        </h2>
      ) : null}
      <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
        <GuidelineList tone="do" title="Do" items={dos} />
        <GuidelineList tone="dont" title="Don’t" items={dont} />
      </div>
    </section>
  )
}

/**
 * One column of guidance: a strong ink rule, then hairline rows. Status
 * colour is kept to the small marks, so the two columns read as one block.
 */
function GuidelineList({ tone, title, items }: { tone: "do" | "dont"; title: string; items: string[] }) {
  const Icon = tone === "do" ? CheckIcon : XIcon
  const color = tone === "do" ? "text-success" : "text-destructive"
  return (
    <div className="grid content-start border-t-(length:--border-width-strong) border-foreground pt-5">
      <h3 className="flex items-center gap-2.5 text-title">
        <span
          className={cn(
            "grid size-6 place-items-center rounded-full",
            tone === "do" ? "bg-success-subtle" : "bg-destructive-subtle",
            color
          )}
        >
          <Icon aria-hidden="true" className="size-3.5" strokeWidth={2.75} />
        </span>
        {title}
      </h3>
      <ul className="mt-3 grid divide-y">
        {items.map((item) => (
          <li key={item} className="flex gap-3 py-4 text-body text-copy last:pb-0">
            <Icon aria-hidden="true" className={cn("mt-1.5 size-3.5 shrink-0", color)} strokeWidth={2.5} />
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

/**
 * Splits a TypeScript type on its top-level "|", leaving unions inside
 * brackets, braces, generics and strings alone.
 */
function unionMembers(type: string): string[] {
  const parts: string[] = []
  let depth = 0
  let quote: string | null = null
  let current = ""
  for (let i = 0; i < type.length; i++) {
    const ch = type[i]
    if (quote) {
      current += ch
      if (ch === quote && type[i - 1] !== "\\") quote = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch
    else if ("([{<".includes(ch)) depth += 1
    else if (")]}".includes(ch) || (ch === ">" && type[i - 1] !== "=")) depth = Math.max(0, depth - 1)
    if (ch === "|" && depth === 0) {
      parts.push(current.trim())
      current = ""
      continue
    }
    current += ch
  }
  parts.push(current.trim())
  return parts.filter(Boolean)
}

/**
 * A type in mono. Each union member stays on one line; the line only wraps
 * at the "|" between members, never inside "outline-inverse".
 */
function TypeValue({ type }: { type: string }) {
  const members = unionMembers(type)
  return (
    <code className="font-mono text-code text-copy">
      {members.map((member, index) => (
        <React.Fragment key={`${member}-${index}`}>
          {index > 0 ? <span className="text-muted-foreground">{"\u00a0| "}</span> : null}
          <span className={member.length <= 32 ? "whitespace-nowrap" : "break-words"}>{member}</span>
        </React.Fragment>
      ))}
    </code>
  )
}

/** A description, with CSS variables such as --button-* kept whole in mono. */
function Description({ text }: { text: string }) {
  return <TokenText text={text} />
}

/** Props reference table. Becomes a list of cards in narrow columns. */
export function ApiTable({ title = "API", rows }: { title?: string; rows: ApiRow[] }) {
  if (isThumbnailRequest()) return null
  const id = `api-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
  return (
    // Sized by the column it sits in, not the window: the table needs about
    // 48rem, so narrower columns (phones, tablets, a laptop with the sidebar
    // open) get the card list.
    <section data-slot="api" aria-labelledby={id} className="@container grid scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-5">
      <h2 id={id} className="text-h3">
        {title}
      </h2>

      {/* Narrow columns: one card per prop. */}
      <dl className="grid min-w-0 divide-y rounded-(--card-radius) border @3xl:hidden">
        {rows.map((r) => (
          <div key={r.prop} className="grid min-w-0 gap-2 p-5">
            <dt className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <code className="min-w-0 font-mono text-code font-semibold text-foreground">{r.prop}</code>
              {r.default ? (
                <span className="min-w-0 font-mono text-code text-muted-foreground [overflow-wrap:anywhere]">
                  = {r.default}
                </span>
              ) : null}
            </dt>
            <dd className="grid gap-2">
              <TypeValue type={r.type} />
              <p className="text-caption text-copy">
                <Description text={r.description} />
              </p>
            </dd>
          </div>
        ))}
      </dl>

      {/* Wide columns: the system's own table, in its card variant. Shared
          column widths line up the tables stacked on one page; a column still
          grows when its content cannot fit. */}
      <div className="hidden @3xl:block">
        <Table variant="card" size="sm">
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[32%]" />
            <col className="w-[18%]" />
            <col className="w-[32%]" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Prop</TableHead>
              <TableHead scope="col">Type</TableHead>
              <TableHead scope="col">Default</TableHead>
              <TableHead scope="col">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.prop} className="align-baseline">
                <TableCell className="py-3 align-baseline whitespace-normal">
                  <code className="font-mono text-code font-semibold text-foreground">{r.prop}</code>
                </TableCell>
                <TableCell className="py-3 align-baseline whitespace-normal">
                  <TypeValue type={r.type} />
                </TableCell>
                <TableCell className="py-3 align-baseline whitespace-normal">
                  <code className="font-mono text-code text-muted-foreground">{r.default ?? "–"}</code>
                </TableCell>
                <TableCell className="py-3 align-baseline text-caption whitespace-normal text-copy">
                  <Description text={r.description} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

/**
 * A dimension token in pixels, read from the generated tokens so docs copy
 * follows the system: tokenPx("--control-height-sm") is 36 while that token
 * is 2.25rem. NaN when the token is missing or is not a rem or px length.
 */
export function tokenPx(cssVar: string): number {
  const value = tokens.find((token) => token.cssVar === cssVar)?.value
  if (typeof value !== "string") return Number.NaN
  const match = /^(-?\d*\.?\d+)(rem|px)$/.exec(value.trim())
  if (!match) return Number.NaN
  return match[2] === "rem" ? parseFloat(match[1]) * 16 : parseFloat(match[1])
}

/** Blurs whatever inside `container` has focus. */
export function blurWithin(container: HTMLElement) {
  const active = document.activeElement
  if (active instanceof HTMLElement && container.contains(active)) active.blur()
}

/**
 * A menu focuses itself when it opens, and Base UI has no option to skip
 * that. Examples that show a menu open on load call this with their stage, so
 * the page keeps focus: once the menu has opened, focus inside the stage is
 * handed back to the page.
 */
export function useReturnFocus(container: HTMLElement | null, delay = 250) {
  React.useEffect(() => {
    if (!container) return
    const timer = window.setTimeout(() => blurWithin(container), delay)
    return () => window.clearTimeout(timer)
  }, [container, delay])
}

const weightNames: Record<number, string> = {
  400: "regular",
  500: "medium",
  600: "semibold",
  700: "bold",
  800: "extra-bold",
}

/**
 * A type role read from the generated tokens, so docs copy follows the
 * system: typeRole("--text-label") is { px: 14, weight: "semibold" }. px is
 * NaN and weight undefined when the token is missing.
 */
export function typeRole(cssVar: string): { px: number; weight: string | undefined } {
  const value = tokens.find((token) => token.cssVar === cssVar)?.value as
    | { fontSize?: string; fontWeight?: number }
    | undefined
  const match = /^(-?\d*\.?\d+)(rem|px)$/.exec(value?.fontSize?.trim() ?? "")
  const px = !match ? Number.NaN : match[2] === "rem" ? parseFloat(match[1]) * 16 : parseFloat(match[1])
  return { px, weight: value?.fontWeight ? weightNames[value.fontWeight] : undefined }
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
