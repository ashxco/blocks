"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, GaugeIcon, Link2Icon, SlidersHorizontalIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"

function SharePopover() {
  const [copied, setCopied] = React.useState(false)

  return (
    <Popover onOpenChange={(open) => !open && setCopied(false)}>
      <PopoverTrigger render={<Button variant="outline" />}>
        <Link2Icon data-icon="inline-start" />
        Share preview
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Share preview</PopoverTitle>
          <PopoverDescription>Anyone with the link can view this deployment.</PopoverDescription>
        </PopoverHeader>
        <div className="flex gap-2">
          <Input readOnly aria-label="Preview URL" defaultValue="feat-billing.lumen.app" className="min-w-0 flex-1" />
          <Button
            variant="secondary"
            size="icon"
            aria-label={copied ? "Copied" : "Copy URL"}
            onClick={() => setCopied(true)}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function SpendLimitPopover() {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button />}>
        <GaugeIcon data-icon="inline-start" />
        Set spend limit
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <form
          className="contents"
          onSubmit={(event) => {
            event.preventDefault()
            setOpen(false)
          }}
        >
          <PopoverHeader>
            <PopoverTitle>Monthly spend limit</PopoverTitle>
            <PopoverDescription>We pause new deployments when the team reaches it.</PopoverDescription>
          </PopoverHeader>
          <Field>
            <FieldLabel htmlFor="popover-limit">Limit in USD</FieldLabel>
            <Input id="popover-limit" type="number" inputMode="numeric" defaultValue={200} min={0} />
            <FieldDescription>You spent $142 this month.</FieldDescription>
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save limit
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}

export default function PopoverDocs() {
  return (
    <Examples>
      <Example
        title="Basic"
        description="Rich content anchored to a trigger. It closes on Escape, an outside click or when focus moves away."
        code={`<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>Share preview</PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Share preview</PopoverTitle>
      <PopoverDescription>Anyone with the link can view this deployment.</PopoverDescription>
    </PopoverHeader>
    <Input readOnly defaultValue="feat-billing.lumen.app" />
  </PopoverContent>
</Popover>`}
      >
        <SharePopover />
      </Example>

      <Example
        title="Placement"
        description="Choose a side and an alignment. The popover flips when there isn’t room and grows from the trigger."
        code={`<PopoverContent side="top" align="start">…</PopoverContent>`}
      >
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Popover key={side}>
            <PopoverTrigger render={<Button variant="outline" className="capitalize" />}>{side}</PopoverTrigger>
            <PopoverContent side={side} className="w-60">
              <PopoverHeader>
                <PopoverTitle>Region: Frankfurt</PopoverTitle>
                <PopoverDescription>fra1 serves 41% of traffic for lumen-web this week.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        ))}
      </Example>

      <Example
        title="Small form"
        description="A popover suits one or two fields that edit something in place. Close it when the save succeeds."
        code={`const [open, setOpen] = React.useState(false)

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger render={<Button />}>Set spend limit</PopoverTrigger>
  <PopoverContent align="start">
    <form onSubmit={save} className="contents">…</form>
  </PopoverContent>
</Popover>`}
      >
        <SpendLimitPopover />
      </Example>

      <Example
        title="Settings"
        description="Group a few related toggles behind one button to keep a toolbar quiet."
      >
        <Popover>
          <PopoverTrigger render={<Button variant="outline" size="icon" aria-label="Log view options" />}>
            <SlidersHorizontalIcon />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 gap-0 p-0">
            <PopoverHeader className="border-b px-4 py-3">
              <PopoverTitle>Log view</PopoverTitle>
            </PopoverHeader>
            <div className="grid gap-4 p-4">
              {[
                { label: "Show timestamps", on: true },
                { label: "Wrap long lines", on: false },
                { label: "Follow new lines", on: true },
              ].map((option) => (
                <label key={option.label} className="flex items-center justify-between gap-4 text-sm font-medium text-foreground">
                  {option.label}
                  <Switch defaultChecked={option.on} />
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </Example>

      <Guidelines
        do={[
          "Use a popover for content tied to one control: sharing, a quick setting, a short form.",
          "Give it a title when it holds more than a single sentence.",
          "Keep it narrow. The default width is 18rem; go wider only for a form row.",
        ]}
        dont={[
          "Don’t use a popover for a list of actions. Use a dropdown menu, which has keyboard navigation built in.",
          "Don’t use it for a label on an icon. Use a tooltip.",
          "Don’t put a long form in it. Use a dialog or sheet.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "side", type: '"top" | "right" | "bottom" | "left" | "inline-start" | "inline-end"', default: '"bottom"', description: "On PopoverContent. Preferred side of the trigger." },
          { prop: "align", type: '"start" | "center" | "end"', default: '"center"', description: "On PopoverContent. Alignment along that side." },
          { prop: "sideOffset", type: "number", default: "8", description: "On PopoverContent. Gap from the trigger, in pixels." },
          { prop: "open", type: "boolean", description: "On Popover. Controlled open state. Pair with onOpenChange." },
          { prop: "modal", type: 'boolean | "trap-focus"', default: "false", description: "On Popover. Locks scroll and traps focus while open." },
          { prop: "openOnHover", type: "boolean", default: "false", description: "On PopoverTrigger. Also open on hover, after delay." },
          { prop: "render", type: "ReactElement", description: "On PopoverTrigger. Render as a Button: render={<Button variant=\"outline\" />}." },
        ]}
      />
    </Examples>
  )
}
