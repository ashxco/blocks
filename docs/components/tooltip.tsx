"use client"

import {
  CopyIcon,
  ExternalLinkIcon,
  PauseIcon,
  RocketIcon,
  RotateCcwIcon,
  ScrollTextIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const actions = [
  { label: "Redeploy", icon: RotateCcwIcon },
  { label: "Copy deployment URL", icon: CopyIcon },
  { label: "Open build logs", icon: ScrollTextIcon },
  { label: "Visit deployment", icon: ExternalLinkIcon },
]

export default function TooltipDocs() {
  return (
    <Examples>
      <Example
        title="Icon buttons"
        description="Name every icon-only control. The tooltip shows on hover and on keyboard focus, and the aria-label carries the same words for screen readers."
        code={`<Tooltip>
  <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Redeploy" />}>
    <RotateCcwIcon />
  </TooltipTrigger>
  <TooltipContent>Redeploy</TooltipContent>
</Tooltip>`}
      >
        {actions.map(({ label, icon: Icon }) => (
          <Tooltip key={label}>
            <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label={label} />}>
              <Icon />
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </Example>

      <Example
        title="With a shortcut"
        description="Add a Kbd after the label to teach the shortcut. It takes the tooltip’s colours automatically."
        code={`<TooltipContent>
  Search
  <Kbd>⌘K</Kbd>
</TooltipContent>`}
      >
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Search" />}>
            <SearchIcon />
          </TooltipTrigger>
          <TooltipContent>
            Search
            <Kbd>⌘K</Kbd>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Pause deployments" />}>
            <PauseIcon />
          </TooltipTrigger>
          <TooltipContent>
            Pause deployments
            <Kbd>⇧P</Kbd>
          </TooltipContent>
        </Tooltip>
      </Example>

      <Example
        title="Placement"
        description="Top is the default. Pick another side when the tooltip would cover what people are looking at, such as the next row of a table."
        code={`<TooltipContent side="right">Copy URL</TooltipContent>`}
      >
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" className="capitalize" />}>{side}</TooltipTrigger>
            <TooltipContent side={side}>Shown on the {side}</TooltipContent>
          </Tooltip>
        ))}
      </Example>

      <Example
        title="Explain a disabled action"
        description="A disabled button can’t receive focus or pointer events, so wrap it in a focusable span and put the tooltip on the span."
        code={`<Tooltip>
  <TooltipTrigger render={<span tabIndex={0} />}>
    <Button disabled>Promote to production</Button>
  </TooltipTrigger>
  <TooltipContent>Only owners can promote deployments</TooltipContent>
</Tooltip>`}
      >
        <Tooltip>
          <TooltipTrigger render={<span tabIndex={0} className="inline-flex rounded-(--button-radius) outline-none focus-visible:focus-ring" />}>
            <Button disabled>
              <RocketIcon data-icon="inline-start" />
              Promote to production
            </Button>
          </TooltipTrigger>
          <TooltipContent>Only owners can promote deployments</TooltipContent>
        </Tooltip>
      </Example>

      <Example
        title="On a toolbar"
        description="Tooltips in a group open instantly once the first one is showing, so people can scan a toolbar quickly."
      >
        <div className="flex items-center gap-1 rounded-full border bg-background p-1">
          {actions.slice(0, 3).map(({ label, icon: Icon }) => (
            <Tooltip key={label}>
              <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label={label} />}>
                <Icon />
              </TooltipTrigger>
              <TooltipContent side="bottom">{label}</TooltipContent>
            </Tooltip>
          ))}
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete deployment"
                  className="text-destructive hover:text-destructive"
                />
              }
            >
              <Trash2Icon />
            </TooltipTrigger>
            <TooltipContent side="bottom">Delete deployment</TooltipContent>
          </Tooltip>
        </div>
      </Example>

      <Guidelines
        do={[
          "Use a tooltip to name an icon-only button, in a few words.",
          "Repeat the tooltip text in the control’s aria-label.",
          "Show the keyboard shortcut when there is one.",
        ]}
        dont={[
          "Don’t put links, buttons or anything people need to click in a tooltip. Use a popover.",
          "Don’t use a tooltip for information people need to finish a task. Show it on the page.",
          "Don’t add tooltips to controls that already have a visible label.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "On TooltipContent. Preferred side of the trigger." },
          { prop: "align", type: '"start" | "center" | "end"', default: '"center"', description: "On TooltipContent. Alignment along that side." },
          { prop: "sideOffset", type: "number", default: "6", description: "On TooltipContent. Gap from the trigger, in pixels." },
          { prop: "delay", type: "number", description: "On TooltipTrigger or TooltipProvider. Milliseconds before the tooltip opens. The app provider sets 0." },
          { prop: "closeDelay", type: "number", default: "0", description: "On TooltipTrigger. Milliseconds before it closes." },
          { prop: "disabled", type: "boolean", default: "false", description: "On Tooltip. Stops the tooltip from opening, e.g. when a sidebar is expanded." },
          { prop: "render", type: "ReactElement", description: "On TooltipTrigger. Render as a Button: render={<Button size=\"icon\" />}." },
        ]}
      />
    </Examples>
  )
}
