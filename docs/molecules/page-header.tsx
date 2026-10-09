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
  description="Every app and service in Acme Inc. Push to a connected branch and Lumen builds and deploys it."
  actions={
    <>
      <Button variant="outline">Import repository</Button>
      <Button nativeButton={false} render={<Link href="/live/app/projects/new" />}>
        <PlusIcon data-icon="inline-start" />
        New project
      </Button>
    </>
  }
/>`}
      >
        <div className="p-6 md:p-10">
          <PageHeader />
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
        <div className="p-6 md:p-10">
          <PageHeader
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
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
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
      >
        <div className="p-6 md:p-10">
          <PageHeader
            title="Team"
            description="Six people can deploy to Acme Inc. Invite more on the Pro plan."
            actions={
              <Button
                nativeButton={false}
                render={<Link href="/live/app/team" />}
              >
                <UserPlusIcon data-icon="inline-start" />
                Invite member
              </Button>
            }
          />
        </div>
      </Example>

      <Example
        title="In a narrow slot"
        description="The header reads its own width with a container query, so actions wrap under the title in sheets and split views."
        layout="center"
      >
        <div className="w-full max-w-80 rounded-lg border border-border bg-background p-5">
          <PageHeader
            as="h2"
            title="Domains"
            description="Point a domain at web and Lumen issues the certificate."
            actions={
              <Button size="sm">
                <PlusIcon data-icon="inline-start" />
                Add domain
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
              "Page title, set in the text-h2 role. Without a title the Lumen projects example renders.",
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
