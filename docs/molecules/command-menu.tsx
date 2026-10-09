"use client"

import * as React from "react"
import { CommandIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  CommandMenu,
  CommandMenuButton,
  CommandMenuPanel,
} from "@/components/blocks/command-menu"
import { AppTopBarSlice } from "@/components/blocks/app-shell/top-bar"
import { Notifications } from "@/components/blocks/notifications"
import { UserMenu } from "@/components/blocks/user-menu"

/** A slice of the app top bar, so the trigger reads in the place it lives. */
function TopBar() {
  return (
    <AppTopBarSlice className="max-w-3xl">
      <CommandMenu hotkey={false} className="mr-1" />
      <Notifications />
      <UserMenu />
    </AppTopBarSlice>
  )
}

function ControlledExample() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <CommandIcon data-icon="inline-start" />
        Open command menu
      </Button>
      <CommandMenu
        trigger="none"
        hotkey={false}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

export default function CommandMenuDocs() {
  return (
    <Examples>
      <Example
        title="Open"
        description="What the trigger opens: one search field over three groups, Navigation, Actions and Theme. Arrow keys move, Enter runs the item, Esc closes. Shown inline here with CommandMenuPanel, which renders the palette on a bordered surface as wide as a dialog, without a trigger or the dialog. In the app it opens in a dialog in the upper third of the screen."
        layout="full"
        surface="subtle"
        code={`// The open state on its own surface, for previews or a page that keeps search open
<CommandMenuPanel />`}
      >
        <div className="grid justify-items-center gap-3 px-4 py-10 @prose:px-10">
          <TopBar />
          <CommandMenuPanel />
        </div>
      </Example>

      <Example
        title="In the top bar"
        description="A search field that opens the palette. In your app Cmd+K or Ctrl+K also opens it; the hotkey is off here because this site uses it for its own search. The trigger reads its container: in a top bar narrower than 44rem the field becomes an icon."
        minHeight="min-h-56"
        code={`<header className="@container/topbar …">
  …
  <CommandMenu />
</header>`}
      >
        <TopBar />
      </Example>

      <Example
        title="Triggers"
        description="Force the field or the icon, for example in a top bar that sets its own breakpoints."
        minHeight="min-h-56"
        code={`<CommandMenu trigger="search" hotkey={false} />
<CommandMenu trigger="icon" hotkey={false} />`}
      >
        <CommandMenu trigger="search" hotkey={false} />
        <CommandMenu trigger="icon" hotkey={false} />
      </Example>

      <Example
        title="Opened from your own control"
        description="Render no trigger and control open yourself. Use CommandMenuButton if you want the standard search field in a layout of your own."
        minHeight="min-h-56"
        code={`const [open, setOpen] = React.useState(false)

<Button variant="outline" onClick={() => setOpen(true)}>Open command menu</Button>
<CommandMenu trigger="none" open={open} onOpenChange={setOpen} />

// or the standard trigger
<CommandMenuButton onClick={() => setOpen(true)} />`}
      >
        <ControlledExample />
      </Example>

      <Example
        title="On a tinted band"
        description="The field’s muted fill matches bg-subtle, so on a tinted band give it the card fill with className to keep its edge."
        surface="subtle"
        minHeight="min-h-56"
        code={`<CommandMenuButton className="w-80 bg-card" />`}
      >
        <CommandMenuButton className="w-80 bg-card" />
      </Example>

      <Guidelines
        do={[
          "Keep one command menu per page with the hotkey on. Turn it off for extra instances, or where the page already uses Cmd+K.",
          "Name actions as verbs: “Create project”, “Invite members”.",
          "Add keywords so people find an action by the word they think of first.",
        ]}
        dont={[
          "Don’t put destructive actions in the palette without a confirmation step.",
          "Don’t list every page of a large app; navigation, frequent actions and theme are enough.",
          "Don’t show a shortcut the app doesn’t support.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "open",
            type: "boolean",
            description: "Controlled open state.",
          },
          {
            prop: "onOpenChange",
            type: "(open: boolean) => void",
            description: "Called when the palette opens or closes.",
          },
          {
            prop: "hotkey",
            type: "boolean",
            default: "true",
            description: "Open and close with Cmd+K or Ctrl+K.",
          },
          {
            prop: "trigger",
            type: '"auto" | "search" | "icon" | "none"',
            default: '"auto"',
            description:
              "Which trigger to render. Auto is an icon until its container (the top bar) is 44rem wide, then a field.",
          },
          {
            prop: "placeholder",
            type: "string",
            default: '"Search pages and actions"',
            description: "Placeholder for the search input.",
          },
          {
            prop: "className",
            type: "string",
            description: "Classes for the trigger.",
          },
        ]}
      />
      <ApiTable
        title="CommandMenuPanel"
        rows={[
          {
            prop: "placeholder",
            type: "string",
            default: '"Search pages and actions"',
            description: "Placeholder for the search input.",
          },
          {
            prop: "className",
            type: "string",
            description: "Classes for the surface.",
          },
        ]}
      />
    </Examples>
  )
}
