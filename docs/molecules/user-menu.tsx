"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Notifications } from "@/components/blocks/notifications"
import { UserMenu } from "@/components/blocks/user-menu"

/** A slice of the app top bar, so the trigger reads in the place it lives. */
function TopBarSlice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-(--header-height-sm) w-full max-w-xl items-center gap-3 rounded-(--card-radius) border bg-background pr-2 pl-5">
      <span className="text-label text-muted-foreground">Acme Inc.</span>
      <span aria-hidden="true" className="text-label text-muted-foreground">
        /
      </span>
      <span className="text-label text-foreground">Overview</span>
      <div className="ml-auto flex items-center gap-1">{children}</div>
    </div>
  )
}

export default function UserMenuDocs() {
  return (
    <Examples>
      <Example
        title="Avatar"
        description="For top bars. Opens account links, a theme switch and sign out. The theme switch changes this site’s theme too."
        minHeight="min-h-56"
        code={`<UserMenu user={{ name: "Maya Chen", email: "maya@acme.dev" }} />`}
      >
        <TopBarSlice>
          <Notifications />
          <UserMenu />
        </TopBarSlice>
      </Example>

      <Example
        title="With name and email"
        description="For the foot of a sidebar, where there is room to say who is signed in."
        layout="full"
        surface="subtle"
        code={`<UserMenu variant="full" side="top" align="start" />`}
      >
        <div className="flex min-h-72 items-end p-6">
          <div className="w-64 rounded-lg border border-border bg-sidebar p-2">
            <UserMenu
              variant="full"
              side="top"
              align="start"
              user={{ name: "Daniel Okafor", email: "daniel@acme.dev" }}
            />
          </div>
        </div>
      </Example>

      <Guidelines
        do={[
          "Show the person’s name and email at the top of the menu, so they know which account is active.",
          "Keep sign out last, after a separator.",
          "Let the theme switch apply immediately and keep the menu open.",
        ]}
        dont={[
          "Don’t put workspace switching here; use a workspace switcher.",
          "Don’t add more than five account links.",
          "Don’t show a keyboard shortcut the app doesn’t support.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "user",
            type: "{ name: string; email: string; initials?: string; image?: string; tone?: string }",
            default: "Maya Chen",
            description:
              "The signed-in person. The avatar fill comes from the shared people list, so the same person looks the same in the team list and the activity feed; tone overrides it.",
          },
          {
            prop: "variant",
            type: '"avatar" | "full"',
            default: '"avatar"',
            description: "Full adds the name and email to the trigger.",
          },
          {
            prop: "side",
            type: '"top" | "bottom" | "left" | "right"',
            default: '"bottom"',
            description: "Which side of the trigger the menu opens on.",
          },
          {
            prop: "align",
            type: '"start" | "center" | "end"',
            default: '"end"',
            description: "Alignment against the trigger.",
          },
          {
            prop: "signOutHref",
            type: "string",
            default: '"/live/sign-in"',
            description: "Where sign out leads.",
          },
          {
            prop: "className",
            type: "string",
            description: "Classes for the trigger.",
          },
        ]}
      />
    </Examples>
  )
}
