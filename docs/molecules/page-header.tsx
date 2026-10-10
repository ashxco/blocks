"use client"

import Link from "next/link"
import { PlusIcon, UserPlusIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/blocks/page-header"

export default function PageHeaderDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="The first thing on every app page: what this page is, one line on what it is for, and the actions it offers."
        layout="full"
        code={`<PageHeader
  title="Projects"
  description="Every project in Acme Inc., with its status, lead and due date. Open one to see its board, timeline and docs."
  actions={
    <>
      <Button variant="outline">Browse templates</Button>
      <Button nativeButton={false} render={<Link href="/live/app/projects/new" />}>
        <PlusIcon data-icon="inline-start" />
        New project
      </Button>
    </>
  }
/>`}
      >
        <div className="p-6 @prose:p-10">
          {/* h2 in previews: the docs page already has its h1. */}
          <PageHeader as="h2" />
        </div>
      </Example>

      <Example
        title="With tabs"
        description="Pass children to put tabs or filters under the title. The hairline sits below them."
        layout="full"
        code={`<PageHeader title="Settings" description="…" divider={false} className="border-b">
  <Tabs defaultValue="general">
    <TabsList variant="line">…</TabsList>
  </Tabs>
</PageHeader>`}
      >
        <div className="p-6 @prose:p-10">
          <PageHeader
            as="h2"
            title="Settings"
            description="Manage your profile, notifications and the Acme Inc. workspace."
            divider={false}
            className="border-b border-border"
          >
            <Tabs defaultValue="general">
              <TabsList variant="line">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
            </Tabs>
          </PageHeader>
        </div>
      </Example>

      <Example
        title="One action"
        description="Most pages need a single primary action. On a tinted band the hairline still separates the header from the content."
        layout="full"
        surface="subtle"
        code={`<PageHeader
  title="Team"
  description="18 members and 6 guests can open Acme Inc. Each new member adds a seat on Pro."
  actions={
    <Button nativeButton={false} render={<Link href="/live/app/team" />}>
      <UserPlusIcon data-icon="inline-start" />
      Invite members
    </Button>
  }
/>`}
      >
        <div className="p-6 @prose:p-10">
          <PageHeader
            as="h2"
            title="Team"
            description="18 members and 6 guests can open Acme Inc. Each new member adds a seat on Pro."
            actions={
              <Button
                nativeButton={false}
                render={<Link href="/live/app/team" />}
              >
                <UserPlusIcon data-icon="inline-start" />
                Invite members
              </Button>
            }
          />
        </div>
      </Example>

      <Example
        title="In a narrow slot"
        description="The header reads its own width with a container query: actions wrap under the title, and below 20rem the title steps down to the h3 role so it doesn’t crowd a sheet or split view."
        layout="center"
        code={`<PageHeader
  as="h2"
  title="Automations"
  description="Rules that run on Website relaunch when its tasks change."
  actions={
    <Button size="sm">
      <PlusIcon data-icon="inline-start" />
      New rule
    </Button>
  }
/>`}
      >
        <div className="w-full max-w-80 rounded-(--card-radius) border border-border bg-background p-5">
          <PageHeader
            as="h2"
            title="Automations"
            description="Rules that run on Website relaunch when its tasks change."
            actions={
              <Button size="sm">
                <PlusIcon data-icon="inline-start" />
                New rule
              </Button>
            }
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Use one page header per page, at the top of the content area.",
          "Name the page with a noun the navigation also uses: “Projects”, not “Your amazing projects”.",
          "Keep one primary action. Put the rest in outline buttons or a menu.",
        ]}
        dont={[
          "Don’t add a badge, count or label above the title.",
          "Don’t repeat the title in the description.",
          "Don’t put destructive actions in the header; use a danger zone.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "title",
            type: "ReactNode",
            description:
              "Page title, set in the text-h2 role (text-h3 when the header is narrower than 20rem). Without a title the Acme projects example renders.",
          },
          {
            prop: "description",
            type: "ReactNode",
            description: "One or two sentences under the title.",
          },
          {
            prop: "actions",
            type: "ReactNode",
            description:
              "Buttons on the right. They wrap under the title in narrow slots.",
          },
          {
            prop: "children",
            type: "ReactNode",
            description: "Tabs or filters under the title row.",
          },
          {
            prop: "as",
            type: '"h1" | "h2"',
            default: '"h1"',
            description:
              "Heading element. Use h2 inside a page that already has an h1.",
          },
          {
            prop: "divider",
            type: "boolean",
            default: "true",
            description: "Draw the hairline under the header.",
          },
          {
            prop: "className",
            type: "string",
            description: "Classes for the header element.",
          },
        ]}
      />
    </Examples>
  )
}
