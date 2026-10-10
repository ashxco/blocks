import type { Metadata } from "next"
import Link from "next/link"
import { LayoutTemplateIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/blocks/data-table"
import { isActiveProject } from "@/components/blocks/data-table/data"
import { PageHeader } from "@/components/blocks/page-header"

import { ProjectHealth } from "./_components/project-health"
import { projects } from "./_data/projects"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project in the Acme Inc. workspace, with its status, lead, progress and due date, and the ones that need attention first.",
}

const activeCount = projects.filter(isActiveProject).length

export default function ProjectsPage() {
  return (
    <div className="grid gap-8 md:gap-10">
      <PageHeader
        title="Projects"
        description={`${projects.length} projects in Acme Inc., ${activeCount} of them active. Open one to see its board, timeline and docs.`}
        actions={
          <>
            <Button variant="outline" nativeButton={false} render={<Link href="/live/onboarding?step=template" />}>
              <LayoutTemplateIcon data-icon="inline-start" />
              Browse templates
            </Button>
            <Button nativeButton={false} render={<Link href="/live/onboarding?step=template" />}>
              <PlusIcon data-icon="inline-start" />
              New project
            </Button>
          </>
        }
      />

      <ProjectHealth projects={projects} />

      <section aria-labelledby="all-projects-title" className="grid gap-5">
        <h2 id="all-projects-title" className="text-h4 text-foreground">
          All projects
        </h2>
        <DataTable rows={projects} pageSize={10} />
      </section>
    </div>
  )
}
