"use client"

import { PlusIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { AppShell } from "@/components/blocks/app-shell"
import { DataTable } from "@/components/blocks/data-table"
import { PageHeader } from "@/components/blocks/page-header"

export default function AppShellDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Sidebar navigation with the active page from the URL, recent projects, automation-run usage and a workspace switcher. The top bar holds the sidebar toggle, the page title, search (Cmd+K in your app; off here, where it opens the site search), notifications and the user menu."
        layout="full"
        code={`// app/(live)/live/app/layout.tsx
import { AppShell } from "@/components/blocks/app-shell"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}`}
      >
        <AppShell preview hotkey={false} activeHref="/live/app" />
      </Example>

      <Example
        title="With a page"
        description="Children render in a wide container with comfortable padding. Collapse the sidebar to icons with the toggle, the rail or Cmd+B; switch this canvas to the tablet width to see it fold to a rail, or to the phone width, where the toggle opens it as a sheet."
        layout="full"
        code={`<AppShell activeHref="/live/app/projects">
  <div className="grid gap-8">
    <PageHeader title="Projects" description="…" actions={<Button>New project</Button>} />
    <DataTable />
  </div>
</AppShell>`}
      >
        <AppShell
          preview
          hotkey={false}
          title="Projects"
          activeHref="/live/app/projects"
          className="h-200"
        >
          <div className="grid gap-8">
            <PageHeader
              as="h2"
              title="Projects"
              description="26 projects in Acme Inc., 24 of them active."
              actions={
                <Button>
                  <PlusIcon data-icon="inline-start" />
                  New project
                </Button>
              }
            />
            <DataTable pageSize={6} hiddenColumns={["updated"]} />
          </div>
        </AppShell>
      </Example>

      <Guidelines
        do={[
          "Use the shell once, in the app layout, so navigation state survives page changes.",
          "Start every page inside it with a page header.",
          "Keep the main navigation to five or six destinations; put the rest in settings.",
        ]}
        dont={[
          "Don’t nest another container inside the content area; it already has one.",
          "Don’t add a second search box to pages; the top bar search covers them.",
          "Don’t put marketing links in the sidebar.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "children",
            type: "ReactNode",
            description:
              "Page content, rendered in container-wide. Without children a sample overview renders.",
          },
          {
            prop: "title",
            type: "string",
            description:
              "Title in the top bar. Defaults to the navigation item that matches the URL.",
          },
          {
            prop: "activeHref",
            type: "string",
            description:
              "Navigation item to highlight, by href. Defaults to the item that matches the URL; in previews, to the item named by title, then the first.",
          },
          {
            prop: "preview",
            type: "boolean",
            default: "false",
            description:
              "Contain the shell in its parent instead of the viewport, for docs and previews. The layout then follows the parent’s width: icons below 48rem, the phone sheet below 40rem. Set the height with className (default h-176).",
          },
          {
            prop: "hotkey",
            type: "boolean",
            default: "true",
            description: "Open search with Cmd+K or Ctrl+K.",
          },
          {
            prop: "className",
            type: "string",
            description: "Classes for the outer wrapper.",
          },
        ]}
      />
    </Examples>
  )
}
