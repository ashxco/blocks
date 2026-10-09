import type { Metadata } from "next"
import Link from "next/link"
import { FolderGit2Icon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/blocks/data-table"
import { PageHeader } from "@/components/blocks/page-header"

import { ProjectHealth } from "./_components/project-health"
import { projects } from "./_data/projects"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every app and service in the Acme Inc. workspace on Lumen, with build status, traffic and the latest deployment of each.",
}

export default function ProjectsPage() {
  return (
    <div className="grid gap-8 md:gap-10">
      <PageHeader
        title="Projects"
        description={`The ${projects.length} apps and services in Acme Inc. Push to a connected branch and Lumen builds, checks and deploys it.`}
        actions={
          <>
            <Button variant="outline" nativeButton={false} render={<Link href="/live/onboarding" />}>
              <FolderGit2Icon data-icon="inline-start" />
              Import repository
            </Button>
            <Button nativeButton={false} render={<Link href="/live/onboarding" />}>
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
