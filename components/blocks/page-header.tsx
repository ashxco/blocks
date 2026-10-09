import * as React from "react"
import Link from "next/link"
import { FolderGit2Icon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Kern } from "@/components/ui/kern"

export interface PageHeaderProps {
  /** Page title. Rendered as an h1 in the text-h2 role, or text-h3 when the header is narrower than 20rem. */
  title?: React.ReactNode
  /** One or two sentences under the title. */
  description?: React.ReactNode
  /** Buttons on the right. Wraps under the title in narrow slots. */
  actions?: React.ReactNode
  /** Extra content under the title row, such as tabs or filters. */
  children?: React.ReactNode
  /** Heading level. Use h2 when the page already has an h1. */
  as?: "h1" | "h2"
  /** Draw the hairline under the header. */
  divider?: boolean
  className?: string
}

/**
 * Title, description and actions at the top of an app page, with a hairline
 * below. Lays itself out with a container query, so it also works in narrow
 * slots such as a split view or a sheet.
 *
 * Rendered with no props it shows the Lumen projects page header.
 */
export function PageHeader({
  title,
  description,
  actions,
  children,
  as: Heading = "h1",
  divider = true,
  className,
}: PageHeaderProps) {
  const demo = title === undefined
  const resolvedTitle = demo ? "Projects" : title
  const resolvedDescription = demo
    ? "Every app and service in Acme Inc. Push to a connected branch and Lumen builds and deploys it."
    : description
  const resolvedActions = demo ? (
    <>
      <Button variant="outline">
        <FolderGit2Icon data-icon="inline-start" />
        Import repository
      </Button>
      <Button nativeButton={false} render={<Link href="/live/app/projects" />}>
        <PlusIcon data-icon="inline-start" />
        New project
      </Button>
    </>
  ) : (
    actions
  )

  return (
    <header
      data-slot="page-header"
      className={cn(
        "@container/page-header grid gap-6",
        divider && "border-b border-border pb-8",
        className
      )}
    >
      <div className="flex flex-col gap-5 @min-[40rem]/page-header:flex-row @min-[40rem]/page-header:items-end @min-[40rem]/page-header:justify-between @min-[40rem]/page-header:gap-10">
        <div className="grid min-w-0 gap-3">
          {/* The role scales with the viewport, so in a narrow slot on a wide screen it steps down a size. */}
          <Heading className="text-h2 text-foreground @max-xs/page-header:text-h3">
            <Kern>{resolvedTitle}</Kern>
          </Heading>
          {resolvedDescription ? (
            <p className="max-w-prose text-body text-copy">
              {resolvedDescription}
            </p>
          ) : null}
        </div>
        {resolvedActions ? (
          <div
            data-slot="page-header-actions"
            className="flex shrink-0 flex-wrap items-center gap-2"
          >
            {resolvedActions}
          </div>
        ) : null}
      </div>
      {children}
    </header>
  )
}
