import * as React from "react"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
import { tintClass, tintInkClass, type CoverTint } from "@/components/blocks/post-card/post-cover"
import { cn } from "@/lib/utils"

export interface TeamMember {
  name: string
  role: string
  /** Defaults to the first letters of the first and last name. */
  initials?: string
  /** Portrait fill. Defaults to a rotation through the tints. */
  tint?: CoverTint
}

export interface TeamGridProps {
  members?: TeamMember[]
  /** Section title. Pass null to render the grid alone. */
  title?: React.ReactNode
  description?: React.ReactNode
  /** A closing tile that links to open roles. Pass null to hide it. */
  hiring?: { title: string; description?: string; href: string } | null
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

export const defaultTeam: TeamMember[] = [
  { name: "Maya Okafor", role: "Co-founder, CEO" },
  { name: "Daniel Reyes", role: "Co-founder, CTO" },
  { name: "Priya Natarajan", role: "Staff engineer" },
  { name: "Tom Lindqvist", role: "Infrastructure" },
  { name: "Hana Sato", role: "Product design" },
  { name: "Leo Martins", role: "Developer relations" },
  { name: "Grace Adeyemi", role: "Customer success" },
  { name: "Sam Cohen", role: "Platform engineer" },
]

/* Neighbours differ across and down in two, three and four columns. */
const rotation: CoverTint[] = ["violet", "mint", "sand", "panel", "sky", "rose", "mint", "violet"]

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()
}

/**
 * The people behind the product: portrait tiles in flat tints with
 * initials, then name and role. Two columns on phones, up to four wide.
 */
export function TeamGrid({
  members = defaultTeam,
  title = "Small team. Big leverage.",
  description = "Fourteen people across six time zones, building Lumen in the open and shipping a release every two weeks.",
  hiring = null,
  contained = true,
  className,
}: TeamGridProps) {
  return (
    <section data-slot="team-grid" className={cn(contained && "container-page py-section", className)}>
      <div className="@container grid gap-14">
        {title != null ? <SectionHeading title={title} description={description} /> : null}

        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 @prose:grid-cols-3 @prose:gap-x-6 @narrow:grid-cols-4">
          {members.map((member, i) => {
            const tint = member.tint ?? rotation[i % rotation.length]
            return (
              <li key={member.name} className="grid content-start gap-4">
                <div
                  aria-hidden="true"
                  className={cn(
                    "relative flex aspect-4/5 items-end overflow-hidden rounded-(--card-radius) p-5",
                    tintClass[tint]
                  )}
                >
                  <span className={cn("text-h1 leading-none", tintInkClass[tint])}>
                    {member.initials ?? initialsOf(member.name)}
                  </span>
                </div>
                <div className="grid gap-0.5">
                  <h3 className="text-title text-foreground">{member.name}</h3>
                  <p className="text-caption text-muted-foreground">{member.role}</p>
                </div>
              </li>
            )
          })}

          {hiring ? (
            <li>
              <Link
                href={hiring.href}
                className="group grid content-start gap-4 rounded-(--card-radius) outline-none focus-visible:focus-ring"
              >
                {/* Same frame as a portrait, with the arrow where the initials sit. */}
                <span className="flex aspect-4/5 items-end rounded-(--card-radius) border bg-subtle p-5 transition-colors duration-(--duration-fast) group-hover:border-border-strong">
                  <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-(--duration-base) ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <ArrowUpRightIcon className="size-5" aria-hidden="true" />
                  </span>
                </span>
                <span className="grid gap-0.5">
                  <span className="text-title text-foreground underline-offset-4 group-hover:underline">
                    {hiring.title}
                  </span>
                  {hiring.description ? (
                    <span className="text-caption text-muted-foreground">{hiring.description}</span>
                  ) : null}
                </span>
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  )
}
