"use client"

import * as React from "react"

import { ApiTable, Example, Examples, Guidelines, useReturnFocus } from "@/docs/kit"
import { appNav } from "@/components/blocks/app-shell/nav"
import { AppTopBarSlice } from "@/components/blocks/app-shell/top-bar"
import { Notifications } from "@/components/blocks/notifications"
import { UserMenu } from "@/components/blocks/user-menu"

/**
 * A top bar with the account menu already open under the avatar. The menu
 * portals into this stage, so it follows the example's theme and stays in
 * place as the page scrolls; clicking elsewhere closes it.
 */
function OpenStage() {
  const [stage, setStage] = React.useState<HTMLDivElement | null>(null)

  // The menu opens on load and takes focus; hand it back to the page.
  useReturnFocus(stage)

  return (
    <div ref={setStage} className="relative min-h-128 w-full max-w-3xl">
      <AppTopBarSlice>
        <Notifications />
        <UserMenu defaultOpen container={stage} />
      </AppTopBarSlice>
    </div>
  )
}

export default function UserMenuDocs() {
  return (
    <Examples>
      <Example
        title="Avatar"
        description="For top bars. Opens account links, an Appearance switch and sign out; the switch changes this site’s appearance (light or dark) too. Shown open; click the avatar to close it."
        code={`<UserMenu user={{ name: "Maya Patel", email: "maya@acme.com" }} />`}
      >
        <OpenStage />
      </Example>

      <Example
        title="With name and email"
        description="For the foot of a sidebar, where there is room to say who is signed in. The menu opens upwards, over the navigation."
        code={`<UserMenu variant="full" side="top" align="start" />`}
      >
        {/* A sidebar column, so the trigger sits where it lives: at the foot, under the navigation. */}
        <div className="flex h-96 w-(--sidebar-width) max-w-full flex-col justify-between rounded-(--card-radius) border bg-sidebar p-2">
          <ul aria-hidden="true" className="grid gap-0.5">
            {appNav.map((item, index) => (
              <li
                key={item.href}
                className={
                  index === 0
                    ? "flex h-(--control-height-sm) items-center gap-3 rounded-(--control-radius) bg-sidebar-accent px-2.5 text-label text-foreground"
                    : "flex h-(--control-height-sm) items-center gap-3 rounded-(--control-radius) px-2.5 text-label text-muted-foreground"
                }
              >
                <item.icon aria-hidden="true" className="size-4" />
                {item.title}
              </li>
            ))}
          </ul>
          <UserMenu variant="full" side="top" align="start" />
        </div>
      </Example>

      <Guidelines
        do={[
          "Show the person’s name and email at the top of the menu, so they know which account is active.",
          "Keep sign out last, after a separator.",
          "Let the Appearance switch apply immediately and keep the menu open.",
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
            default: "Maya Patel",
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
            prop: "defaultOpen",
            type: "boolean",
            default: "false",
            description: "Start with the menu open, for a preview of the open state. The menu is then non-modal.",
          },
          {
            prop: "container",
            type: "HTMLElement | null",
            description:
              "Portal the menu into this element instead of <body>, e.g. a preview stage. It then keeps to its side of the trigger, inside the element. null waits until the element exists.",
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
