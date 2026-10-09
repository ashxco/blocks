import * as React from "react"
import { CircleCheckIcon, ClockIcon, GitBranchIcon, PlusIcon, RocketIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Guidelines } from "@/docs/kit"

import { tokenByName, toPx } from "./data"
import { IconGrid } from "./icon-grid"
import { Code, FoundationPage, Meta, Section } from "./layout"

/* Literal class names so Tailwind generates every size. */
const sizes: { step: number; className: string; use: string }[] = [
  { step: 3.5, className: "size-3.5", use: "Meta lines, extra-small buttons and badges." },
  { step: 4, className: "size-4", use: "The default: buttons, menus, inputs and navigation." },
  { step: 5, className: "size-5", use: "Large buttons, toolbar actions and app navigation." },
  { step: 6, className: "size-6", use: "Feature tiles, empty states and headings." },
]

function Sizes() {
  const unit = toPx(String(tokenByName("spacing")?.value ?? "0.25rem")) ?? 4
  return (
    <ul className="grid grid-cols-2 gap-6 @narrow:grid-cols-4">
      {sizes.map((s) => (
        <li key={s.className} className="grid content-start gap-4">
          <div className="grid h-28 place-items-center rounded-(--card-radius) border bg-subtle text-foreground">
            <RocketIcon className={s.className} />
          </div>
          <div className="grid gap-1">
            <div className="flex items-baseline justify-between gap-3">
              <Code>{s.className}</Code>
              <Meta>{s.step * unit}px</Meta>
            </div>
            <p className="text-caption text-copy">{s.use}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

const strokes: { width: number; note: string; recommended?: boolean }[] = [
  { width: 1.5, note: "Too thin beside label text. Only for illustrations at 32px and up." },
  { width: 2, note: "Lucide’s default. Matches the weight of label and body text.", recommended: true },
  { width: 2.5, note: "Too heavy; competes with headings." },
]

function Strokes() {
  return (
    <ul className="grid gap-6 @prose:grid-cols-3">
      {strokes.map((s) => (
        <li
          key={s.width}
          className={
            s.recommended
              ? "grid content-start gap-5 rounded-(--card-radius) bg-panel p-(--card-padding) text-panel-foreground"
              : "grid content-start gap-5 rounded-(--card-radius) border bg-card p-(--card-padding) text-foreground"
          }
        >
          <div className="flex items-center gap-4">
            <RocketIcon className="size-8" strokeWidth={s.width} />
            <GitBranchIcon className="size-8" strokeWidth={s.width} />
            <ClockIcon className="size-8" strokeWidth={s.width} />
          </div>
          <div className="grid gap-1">
            <p className={s.recommended ? "text-title text-panel-foreground" : "text-title text-foreground"}>
              Stroke {s.width}
              {s.recommended ? " · use this" : ""}
            </p>
            <p className={s.recommended ? "text-caption text-panel-muted" : "text-caption text-copy"}>{s.note}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Marks the vertical centre on both sides so the shared centre line is visible. */
function Aligned({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-flex items-center px-6">
      <span aria-hidden className="absolute top-1/2 left-0 h-px w-3 bg-brand" />
      {children}
      <span aria-hidden className="absolute top-1/2 right-0 h-px w-3 bg-brand" />
    </div>
  )
}

const pairings: { name: string; spec: string; sample: React.ReactNode }[] = [
  {
    name: "Button",
    spec: "size-4 · gap-2, built in",
    sample: (
      <Button type="button">
        <PlusIcon data-icon="inline-start" />
        New project
      </Button>
    ),
  },
  {
    name: "Navigation",
    spec: "size-4 · text-label · gap-2",
    sample: (
      <span className="inline-flex items-center gap-2 text-label text-foreground">
        <GitBranchIcon className="size-4" />
        Branches
      </span>
    ),
  },
  {
    name: "Meta",
    spec: "size-3.5 · text-caption · gap-1.5",
    sample: (
      <span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
        <ClockIcon className="size-3.5" />
        Deployed 4 minutes ago
      </span>
    ),
  },
  {
    name: "Status",
    spec: "size-4 · text-label · gap-1.5",
    sample: (
      <span className="inline-flex items-center gap-1.5 text-label text-success">
        <CircleCheckIcon className="size-4" />
        Ready
      </span>
    ),
  },
  {
    name: "Heading",
    spec: "size-6 · text-h4 · gap-3",
    sample: (
      <span className="inline-flex items-center gap-3 text-h4 text-foreground">
        <RocketIcon className="size-6" />
        Deployments
      </span>
    ),
  },
]

function Pairings() {
  return (
    <ul className="grid border-b">
      {pairings.map((p) => (
        <li
          key={p.name}
          className="grid gap-4 border-t py-6 @prose:grid-cols-[10rem_minmax(0,1fr)_17rem] @prose:items-center @prose:gap-8"
        >
          <p className="text-title text-foreground">{p.name}</p>
          <div className="min-w-0">
            <Aligned>{p.sample}</Aligned>
          </div>
          <Meta>{p.spec}</Meta>
        </li>
      ))}
    </ul>
  )
}

export function IconographyFoundation({ title, description }: { title: string; description: string }) {
  return (
    <FoundationPage title={title} description={description}>
      <Section
        id="library"
        title="Library"
        description={
          <>
            Blocks uses lucide-react and nothing else. These are the icons the kit already uses; reach for them first.
            Import the <Code>Icon</Code>-suffixed name and click any icon to copy it.
          </>
        }
      >
        <IconGrid />
      </Section>

      <Section
        id="sizes"
        title="Sizes"
        description="Four sizes, all on the spacing scale. Set size with a size utility, never with font size, so icons stay crisp and square."
      >
        <Sizes />
      </Section>

      <Section
        id="stroke"
        title="Stroke"
        description="Keep the default 2px stroke at every size. It sits at the same visual weight as label text, so icons and words read as one."
      >
        <Strokes />
      </Section>

      <Section
        id="with-text"
        title="Icon and text"
        description="Centre icons on the text with items-center and let them inherit the text colour. The violet ticks mark the shared centre line."
      >
        <div className="grid gap-12">
          <Pairings />
          <Guidelines
            do={[
              "Let icons inherit currentColor and tint them with text utilities.",
              "Give icon-only buttons an aria-label that says what happens.",
              "Pair status icons with a word, so colour is never the only signal.",
            ]}
            dont={[
              "Don’t mix in other icon sets or draw custom icons for things lucide has.",
              "Don’t change stroke width per instance.",
              "Don’t place icons above headings as decoration.",
            ]}
          />
        </div>
      </Section>
    </FoundationPage>
  )
}
