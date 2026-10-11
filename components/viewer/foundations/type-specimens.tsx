"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Kern } from "@/components/ui/kern"
import { cn } from "@/lib/utils"

import { ThemeText, type PerTheme } from "./by-theme"

export interface RoleSpec {
  /** Role key, e.g. "display". */
  key: string
  utility: string
  description?: string
  /** Size · line height · tracking · weight in each theme. A size range means the role is fluid. */
  meta: PerTheme
  /** Size and line height from each breakpoint up, for roles that change with the viewport. */
  responsive?: string[]
}

/* Literal class names so Tailwind generates every role. */
const roleClass: Record<string, string> = {
  hero: "text-hero text-foreground",
  display: "text-display text-foreground",
  h1: "text-h1 text-foreground",
  h2: "text-h2 text-foreground",
  h3: "text-h3 text-foreground",
  h4: "text-h4 text-foreground",
  title: "text-title text-foreground",
  lead: "text-lead text-copy",
  body: "text-body text-copy",
  label: "text-label text-foreground",
  control: "text-control text-foreground",
  caption: "text-caption text-muted-foreground",
  code: "font-mono text-code text-foreground",
}

/* Display-size roles, whose word-ending punctuation needs kerning. */
const kernedRoles = new Set(["hero", "display", "h1", "h2"])

const defaultSample: Record<string, string> = {
  hero: "Work, sorted",
  /* Acme's pitch as a hero headline: display is the hero role. */
  display: "Plan it. Track it. Ship it together.",
  h1: "Every project, four views",
  h2: "Automations that clear the busywork",
  h3: "See who has too much on",
  h4: "Website relaunch",
  title: "Review homepage copy",
  lead: "Acme brings projects, tasks, docs and reports into one workspace, so everyone knows what to work on next.",
  body: "Give each task an owner, a due date and a priority, and break it into subtasks. Comments keep the discussion next to the work instead of lost in a chat thread.",
  label: "Create project",
  control: "maya@acme.com",
  caption: "Updated 4 minutes ago by Maya Patel",
  code: "npm install @acme/sdk",
}

export function TypeSpecimens({ roles }: { roles: RoleSpec[] }) {
  const [sample, setSample] = React.useState("")
  const inputId = React.useId()
  const text = sample.trim()

  return (
    <div className="grid gap-8">
      <div className="grid max-w-prose gap-3">
        <label htmlFor={inputId} className="text-label text-foreground">
          Sample text
        </label>
        <div className="flex items-center gap-2">
          <Input
            id={inputId}
            className="h-(--control-height-md)"
            value={sample}
            maxLength={140}
            placeholder="Type to preview every role"
            onChange={(e) => setSample(e.target.value)}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label="Reset sample text"
            disabled={!sample}
            onClick={() => setSample("")}
          >
            <RotateCcwIcon />
          </Button>
        </div>
      </div>

      <ul className="grid">
        {roles.map((role) => (
          <li
            key={role.key}
            className="grid gap-4 border-t py-6 @narrow:grid-cols-[16rem_minmax(0,1fr)] @narrow:items-baseline @narrow:gap-10 @narrow:py-8"
          >
            <div className="grid content-start gap-1">
              <code className="font-mono text-label text-foreground">
                {role.utility}
              </code>
              {/* Size · line height · tracking · weight, for the theme the page is on. A size range means the role is fluid. */}
              <span
                className="font-mono text-xs text-muted-foreground tabular"
                title="Size · line height · tracking · weight"
              >
                <ThemeText value={role.meta} />
              </span>
              {role.responsive?.map((line) => (
                <span
                  key={line}
                  className="font-mono text-xs text-muted-foreground tabular"
                >
                  {line}
                </span>
              ))}
              {role.description ? (
                <p className="mt-1 text-caption text-copy">
                  {role.description}
                </p>
              ) : null}
            </div>
            {/* Display-size samples wrap balanced, so a headline never leaves one word on its last line. */}
            <p
              className={cn(
                "min-w-0 break-words",
                kernedRoles.has(role.key) && "text-balance",
                roleClass[role.key] ?? "text-body text-copy"
              )}
            >
              {kernedRoles.has(role.key) ? (
                <Kern>{text || defaultSample[role.key]}</Kern>
              ) : (
                text ||
                defaultSample[role.key] ||
                "Plan, track and ship your team’s work in one place"
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
