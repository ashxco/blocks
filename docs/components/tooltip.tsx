"use client"

import * as React from "react"
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArchiveIcon,
  CalendarIcon,
  ExternalLinkIcon,
  LinkIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { pinnedTo, type Stage } from "@/docs/stage"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/**
 * Placement demo: a compact pad of arrow buttons. Each trigger sits on the
 * side its tooltip points to, so none overlap, and the pad fits a phone.
 */
const placements = [
  {
    side: "top",
    label: "Top",
    icon: ArrowUpIcon,
    cell: "col-start-2 row-start-1",
  },
  {
    side: "left",
    label: "Left",
    icon: ArrowLeftIcon,
    cell: "col-start-1 row-start-2 justify-self-end",
  },
  {
    side: "right",
    label: "Right",
    icon: ArrowRightIcon,
    cell: "col-start-3 row-start-2 justify-self-start",
  },
  {
    side: "bottom",
    label: "Bottom",
    icon: ArrowDownIcon,
    cell: "col-start-2 row-start-3",
  },
] as const

const actions = [
  { label: "Assign", icon: UserPlusIcon },
  { label: "Set due date", icon: CalendarIcon },
  { label: "Copy link", icon: LinkIcon },
  { label: "Open in a new tab", icon: ExternalLinkIcon },
]

/**
 * The examples show a tooltip already open, portalled into the example so it
 * follows the example's theme, and isolate keeps its z-index inside the
 * example so it scrolls under the site header. Each stage is its own tooltip
 * group: only one tooltip in a group shows at a time, so hovering another
 * trigger hands over to it.
 */
function TooltipStage({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const [container, setContainer] = React.useState<Stage>(null)
  return (
    <TooltipProvider>
      <StageContext.Provider value={container}>
        <div
          ref={setContainer}
          className={cn(
            "relative isolate flex flex-wrap items-center justify-center gap-4",
            className
          )}
        >
          {children}
        </div>
      </StageContext.Provider>
    </TooltipProvider>
  )
}

/** The stage element, once it exists. */
const StageContext = React.createContext<Stage>(null)

/**
 * A tooltip that is open on load. Hovering its trigger and leaving closes it
 * as usual. It only opens once the stage exists, so it is placed inside the
 * stage from its first frame instead of against <body>.
 */
function ShownTooltip(props: React.ComponentProps<typeof Tooltip>) {
  const container = React.useContext(StageContext)
  const [open, setOpen] = React.useState(true)
  return (
    <Tooltip
      open={open && container !== null}
      onOpenChange={setOpen}
      {...props}
    />
  )
}

/** An open tooltip in a group of its own, so several can show at once. */
function StandaloneTooltip(props: React.ComponentProps<typeof Tooltip>) {
  return (
    <TooltipProvider>
      <ShownTooltip {...props} />
    </TooltipProvider>
  )
}

/** Tooltip content that portals into the stage and keeps its side there. */
function StageTooltipContent(
  props: React.ComponentProps<typeof TooltipContent>
) {
  const container = React.useContext(StageContext)
  return (
    <TooltipContent container={container} {...pinnedTo(container)} {...props} />
  )
}

export default function TooltipDocs() {
  return (
    <Examples>
      <Example
        title="Icon buttons"
        description="Name every icon-only control. The tooltip shows on hover and on keyboard focus, and the aria-label carries the same words for screen readers."
        code={`<Tooltip>
  <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Assign" />}>
    <UserPlusIcon />
  </TooltipTrigger>
  <TooltipContent>Assign</TooltipContent>
</Tooltip>`}
      >
        <TooltipStage className="gap-1 pt-8">
          {actions.map(({ label, icon: Icon }, index) => {
            const Root = index === 0 ? ShownTooltip : Tooltip
            return (
              <Root key={label}>
                <TooltipTrigger
                  render={
                    <Button variant="ghost" size="icon" aria-label={label} />
                  }
                >
                  <Icon />
                </TooltipTrigger>
                <StageTooltipContent>{label}</StageTooltipContent>
              </Root>
            )
          })}
        </TooltipStage>
      </Example>

      <Example
        title="With a shortcut"
        description="Add a Kbd after the label to teach the shortcut. It takes the tooltip’s colours automatically."
        code={`<TooltipContent>
  Search
  <Kbd>⌘K</Kbd>
</TooltipContent>`}
      >
        <TooltipStage className="pt-8">
          <>
            <ShownTooltip>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="icon" aria-label="Search" />
                }
              >
                <SearchIcon />
              </TooltipTrigger>
              <StageTooltipContent>
                Search
                <Kbd>⌘K</Kbd>
              </StageTooltipContent>
            </ShownTooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="icon" aria-label="New task" />
                }
              >
                <PlusIcon />
              </TooltipTrigger>
              <StageTooltipContent>
                New task
                <Kbd>C</Kbd>
              </StageTooltipContent>
            </Tooltip>
          </>
        </TooltipStage>
      </Example>

      <Example
        title="Placement"
        description="Top is the default. Pick another side when the tooltip would cover what people are looking at, such as the next row of a table."
        code={`<TooltipContent side="right">Copy link</TooltipContent>`}
      >
        <TooltipStage className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 py-10">
          {placements.map(({ side, label, icon: Icon, cell }) => (
            <StandaloneTooltip key={side}>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={label}
                    className={cell}
                  />
                }
              >
                <Icon />
              </TooltipTrigger>
              <StageTooltipContent side={side}>{label}</StageTooltipContent>
            </StandaloneTooltip>
          ))}
        </TooltipStage>
      </Example>

      <Example
        title="Explain a disabled action"
        description="A disabled button can’t receive focus or pointer events, so wrap it in a focusable span and put the tooltip on the span."
        code={`<Tooltip>
  <TooltipTrigger render={<span tabIndex={0} />}>
    <Button disabled>Archive Project</Button>
  </TooltipTrigger>
  <TooltipContent>Only owners can archive</TooltipContent>
</Tooltip>`}
      >
        <TooltipStage className="pt-8">
          <ShownTooltip>
            <TooltipTrigger
              render={
                <span
                  tabIndex={0}
                  className="inline-flex rounded-(--button-radius) outline-none focus-visible:focus-ring"
                />
              }
            >
              <Button disabled>
                <ArchiveIcon data-icon="inline-start" />
                Archive Project
              </Button>
            </TooltipTrigger>
            <StageTooltipContent>Only owners can archive</StageTooltipContent>
          </ShownTooltip>
        </TooltipStage>
      </Example>

      <Example
        title="On a toolbar"
        description="Tooltips in a group open instantly once the first one is showing, so people can scan a toolbar quickly. Move the pointer along the bar: Assign hands over to the next action without a delay."
        code={`<TooltipProvider>
  <div role="toolbar" aria-label="Task actions" className="flex items-center gap-1 rounded-(--button-radius) border p-1">
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Assign" />}>
        <UserPlusIcon />
      </TooltipTrigger>
      <TooltipContent side="bottom">Assign</TooltipContent>
    </Tooltip>
    …
  </div>
</TooltipProvider>`}
      >
        <TooltipStage className="pb-10">
          <div
            role="toolbar"
            aria-label="Task actions"
            className="flex items-center gap-1 rounded-(--button-radius) border bg-background p-1"
          >
            {actions.slice(0, 3).map(({ label, icon: Icon }, index) => {
              // The first action shows its tooltip on load; hover along the bar and it hands over.
              const Root = index === 0 ? ShownTooltip : Tooltip
              return (
                <Root key={label}>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={label}
                      />
                    }
                  >
                    <Icon />
                  </TooltipTrigger>
                  <StageTooltipContent side="bottom">
                    {label}
                  </StageTooltipContent>
                </Root>
              )
            })}
            <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete task"
                    className="text-destructive hover:text-destructive"
                  />
                }
              >
                <Trash2Icon />
              </TooltipTrigger>
              <StageTooltipContent side="bottom">
                Delete task
              </StageTooltipContent>
            </Tooltip>
          </div>
        </TooltipStage>
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
          {
            prop: "side",
            type: '"top" | "right" | "bottom" | "left"',
            default: '"top"',
            description: "On TooltipContent. Preferred side of the trigger.",
          },
          {
            prop: "align",
            type: '"start" | "center" | "end"',
            default: '"center"',
            description: "On TooltipContent. Alignment along that side.",
          },
          {
            prop: "sideOffset",
            type: "number",
            default: "6",
            description: "On TooltipContent. Gap from the trigger, in pixels.",
          },
          {
            prop: "delay",
            type: "number",
            description:
              "On TooltipTrigger or TooltipProvider. Milliseconds before the tooltip opens. The app provider sets 0.",
          },
          {
            prop: "closeDelay",
            type: "number",
            default: "0",
            description: "On TooltipTrigger. Milliseconds before it closes.",
          },
          {
            prop: "disabled",
            type: "boolean",
            default: "false",
            description:
              "On Tooltip. Stops the tooltip from opening, e.g. when a sidebar is expanded.",
          },
          {
            prop: "render",
            type: "ReactElement",
            description:
              'On TooltipTrigger. Render as a Button: render={<Button size="icon" />}.',
          },
        ]}
      />
    </Examples>
  )
}
