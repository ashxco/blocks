"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { cx } from "./layout"

export interface RoleSpec {
  /** Role key, e.g. "display". */
  key: string
  utility: string
  description?: string
  size: string
  lineHeight: string
  tracking: string
  weight: string
}

/* Literal class names so Tailwind generates every role. */
const roleClass: Record<string, string> = {
  display: "text-display text-foreground",
  h1: "text-h1 text-foreground",
  h2: "text-h2 text-foreground",
  h3: "text-h3 text-foreground",
  h4: "text-h4 text-foreground",
  title: "text-title text-foreground",
  lead: "text-lead text-copy",
  body: "text-body text-copy",
  label: "text-label text-foreground",
  caption: "text-caption text-muted-foreground",
  code: "font-mono text-code text-foreground",
}

const defaultSample: Record<string, string> = {
  display: "Ship on every push",
  h1: "Preview every pull request",
  h2: "Logs that keep up with you",
  h3: "Roll back in one click",
  h4: "Production deployment",
  title: "lumen-web on main",
  lead: "Lumen builds, deploys and scales your app from a single git push, with a preview URL for every branch.",
  body: "Each deployment gets its own immutable URL. Promote it to production when the checks pass, or roll back to any earlier build in seconds.",
  label: "Deploy to production",
  caption: "Deployed 4 minutes ago by Priya Shah",
  code: "git push lumen main",
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
            className="grid gap-5 border-t py-8 @narrow:grid-cols-[14rem_minmax(0,1fr)] @narrow:gap-10 @narrow:py-10"
          >
            <div className="grid content-start gap-3">
              <code className="font-mono text-label text-foreground">{role.utility}</code>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-caption">
                <dt className="text-muted-foreground">Size</dt>
                <dd className="font-mono text-xs text-foreground tabular">{role.size}</dd>
                <dt className="text-muted-foreground">Line height</dt>
                <dd className="font-mono text-xs text-foreground tabular">{role.lineHeight}</dd>
                <dt className="text-muted-foreground">Tracking</dt>
                <dd className="font-mono text-xs text-foreground tabular">{role.tracking}</dd>
                <dt className="text-muted-foreground">Weight</dt>
                <dd className="font-mono text-xs text-foreground tabular">{role.weight}</dd>
              </dl>
              {role.description ? <p className="text-caption text-copy">{role.description}</p> : null}
            </div>
            <p className={cx("min-w-0 self-center break-words", roleClass[role.key] ?? "text-body")}>
              {text || defaultSample[role.key] || "Lumen deploys your app on every push"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
