"use client"

import * as React from "react"
import { CommandIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  CommandMenu,
  CommandMenuButton,
} from "@/components/blocks/command-menu"

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
        title="Default"
        description="A search field that opens the palette. In your app Cmd+K or Ctrl+K also opens it; the hotkey is off here because this site uses it for its own search. Below the md breakpoint the field becomes an icon."
        minHeight="min-h-56"
        code={`<CommandMenu />`}
      >
        <CommandMenu hotkey={false} />
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

      <Example title="On a tinted band" surface="subtle" minHeight="min-h-56">
        <CommandMenuButton className="w-80" />
      </Example>

      <Guidelines
        do={[
          "Keep one command menu per page with the hotkey on. Turn it off for extra instances, or where the page already uses Cmd+K.",
          "Name actions as verbs: “Create project”, “Invite a teammate”.",
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
              "Which trigger to render. Auto switches from icon to field at md.",
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
    </Examples>
  )
}
