"use client"

import * as React from "react"
import {
  ActivityIcon,
  CreditCardIcon,
  GlobeIcon,
  KeyRoundIcon,
  MonitorIcon,
  MoonIcon,
  PlusIcon,
  RocketIcon,
  ScrollTextIcon,
  SearchIcon,
  SunIcon,
  UsersIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

const suggestions = [
  { label: "Create project", icon: PlusIcon, keys: ["⌘", "N"] },
  { label: "Deploy main to production", icon: RocketIcon, keys: ["⌘", "⇧", "D"] },
  { label: "Open runtime logs", icon: ScrollTextIcon, keys: ["G", "L"] },
]

const projects = [
  { label: "acme-storefront", meta: "Deployed 4m ago", tint: "bg-tint-violet" },
  { label: "acme-api", meta: "Deployed 1h ago", tint: "bg-tint-sky" },
  { label: "docs-site", meta: "Building", tint: "bg-tint-mint" },
]

const settings = [
  { label: "Domains", icon: GlobeIcon },
  { label: "Environment variables", icon: KeyRoundIcon },
  { label: "Usage and metrics", icon: ActivityIcon },
  { label: "Team members", icon: UsersIcon },
  { label: "Billing", icon: CreditCardIcon },
]

function ProjectMark({ label, tint }: { label: string; tint: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-5 shrink-0 place-items-center rounded-xs text-xs font-bold text-foreground ${tint}`}
    >
      {label.charAt(0).toUpperCase()}
    </span>
  )
}

/**
 * cmdk scrolls its first item into view when it mounts, which would make the
 * docs page jump to an inline example below the fold. Mount inline examples
 * once they are on screen instead.
 */
function WhenVisible({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -160px 0px" }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {visible ? children : null}
    </div>
  )
}

/** The Lumen command list, shared by the inline and dialog examples. */
function LumenCommands({ onRun }: { onRun: (label: string) => void }) {
  return (
    <>
      <CommandInput placeholder="Search projects, settings and actions" />
      <CommandList>
        <CommandEmpty>No results. Try a project name, or an action such as “deploy”.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {suggestions.map((item) => (
            <CommandItem key={item.label} value={item.label} onSelect={() => onRun(item.label)}>
              <item.icon />
              <span>{item.label}</span>
              <CommandShortcut>
                {item.keys.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem
              key={project.label}
              value={`Open ${project.label}`}
              keywords={["project", project.label]}
              onSelect={() => onRun(`Open ${project.label}`)}
            >
              <ProjectMark label={project.label} tint={project.tint} />
              <span className="truncate">{project.label}</span>
              <span className="ms-auto shrink-0 text-xs text-muted-foreground">{project.meta}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          {settings.map((item) => (
            <CommandItem
              key={item.label}
              value={item.label}
              keywords={["settings"]}
              onSelect={() => onRun(`Open ${item.label.toLowerCase()}`)}
            >
              <item.icon />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <CommandFooter>
        <span>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          Move
        </span>
        <span>
          <Kbd>↵</Kbd>
          Run
        </span>
        <span className="ms-auto">
          <Kbd>Esc</Kbd>
          Close
        </span>
      </CommandFooter>
    </>
  )
}

function LastRun({ label }: { label: string | null }) {
  return (
    <p className="text-sm text-muted-foreground" aria-live="polite">
      {label ? (
        <>
          Ran <span className="font-semibold text-foreground">{label}</span>
        </>
      ) : (
        "Pick a command with the mouse or the keyboard."
      )}
    </p>
  )
}

function InlinePalette() {
  const [last, setLast] = React.useState<string | null>(null)
  return (
    <div className="grid w-full max-w-144 justify-items-center gap-4">
      <Command loop className="border">
        <LumenCommands onRun={setLast} />
      </Command>
      <LastRun label={last} />
    </div>
  )
}

function DialogPalette() {
  const [open, setOpen] = React.useState(false)
  const [last, setLast] = React.useState<string | null>(null)

  // ⌘J here, so the example doesn’t clash with this site’s own ⌘K search.
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "j" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="grid justify-items-center gap-4">
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-72 justify-between ps-4 pe-2 text-muted-foreground"
      >
        <span className="flex items-center gap-2">
          <SearchIcon />
          Search Lumen
        </span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>J</Kbd>
        </KbdGroup>
      </Button>
      <LastRun label={last} />
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search Lumen"
        description="Search projects, settings and actions, then press Enter to run one."
      >
        <Command loop>
          <LumenCommands
            onRun={(label) => {
              setOpen(false)
              setLast(label)
            }}
          />
        </Command>
      </CommandDialog>
    </div>
  )
}

function ThemePicker() {
  const [theme, setTheme] = React.useState("system")
  const options = [
    { value: "light", label: "Light", icon: SunIcon },
    { value: "dark", label: "Dark", icon: MoonIcon },
    { value: "system", label: "Match my system", icon: MonitorIcon },
  ]
  return (
    <Command className="w-full max-w-96 border">
      <CommandInput placeholder="Change theme" />
      <CommandList>
        <CommandEmpty>No themes match.</CommandEmpty>
        <CommandGroup heading="Theme">
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.label}
              data-checked={theme === option.value}
              onSelect={() => setTheme(option.value)}
            >
              <option.icon />
              <span>{option.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Danger zone">
          <CommandItem value="Delete project" disabled>
            <span>Delete project</span>
            <CommandShortcut>Owners only</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

function EmptyState() {
  const [search, setSearch] = React.useState("kubernetes")
  return (
    <Command className="w-full max-w-112 border">
      <CommandInput value={search} onValueChange={setSearch} placeholder="Search projects" />
      <CommandList>
        <CommandEmpty>
          <span className="block text-sm font-semibold text-foreground">No results for “{search}”</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Try a project name, or clear the search to see everything.
          </span>
        </CommandEmpty>
        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem key={project.label} value={project.label}>
              <ProjectMark label={project.label} tint={project.tint} />
              <span>{project.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export default function CommandDocs() {
  return (
    <Examples>
      <Example
        title="Command palette"
        description="A large search field, grouped results with keyboard hints and a footer that explains the keys. The highlighted row fills with accent."
        surface="subtle"
        code={`<Command loop className="border">
  <CommandInput placeholder="Search projects, settings and actions" />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem onSelect={createProject}>
        <PlusIcon />
        <span>Create project</span>
        <CommandShortcut><Kbd>⌘</Kbd><Kbd>N</Kbd></CommandShortcut>
      </CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">…</CommandGroup>
  </CommandList>
  <CommandFooter>
    <span><Kbd>↵</Kbd> Run</span>
    <span className="ms-auto"><Kbd>Esc</Kbd> Close</span>
  </CommandFooter>
</Command>`}
      >
        <WhenVisible className="flex min-h-120 w-full justify-center">
          <InlinePalette />
        </WhenVisible>
      </Example>

      <Example
        title="In a dialog"
        description="CommandDialog opens the palette in the upper third of the screen. Press ⌘J or Ctrl J, or use the button. In your app, bind ⌘K."
        code={`const [open, setOpen] = React.useState(false)

React.useEffect(() => {
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      setOpen((open) => !open)
    }
  }
  window.addEventListener("keydown", onKeyDown)
  return () => window.removeEventListener("keydown", onKeyDown)
}, [])

<CommandDialog open={open} onOpenChange={setOpen} title="Search Lumen">
  <Command loop>
    <CommandInput placeholder="Search projects, settings and actions" />
    <CommandList>…</CommandList>
  </Command>
</CommandDialog>`}
      >
        <DialogPalette />
      </Example>

      <Example
        title="Checked and disabled items"
        description="Set data-checked on an item to show a check. Disabled items stay visible but can’t be run; say why on the right."
        code={`<CommandItem data-checked={theme === "dark"} onSelect={() => setTheme("dark")}>
  <MoonIcon />
  <span>Dark</span>
</CommandItem>
<CommandItem disabled>
  <span>Delete project</span>
  <CommandShortcut>Owners only</CommandShortcut>
</CommandItem>`}
      >
        <WhenVisible className="flex min-h-64 w-full justify-center">
          <ThemePicker />
        </WhenVisible>
      </Example>

      <Example
        title="Empty state"
        description="When nothing matches, say so and suggest what to try next."
        code={`<CommandEmpty>
  No results for “{search}”. Try a project name.
</CommandEmpty>`}
      >
        <EmptyState />
      </Example>

      <Guidelines
        do={[
          "Open the palette with ⌘K on macOS and Ctrl K elsewhere, and show that shortcut on the trigger.",
          "Group results and keep group headings to one or two words.",
          "Write items as actions or destinations: “Deploy main”, “Open billing”.",
          "Show a shortcut on items that have one, and key hints in the footer.",
        ]}
        dont={[
          "Don’t make the palette the only way to reach a page or action.",
          "Don’t show more than a handful of suggestions before the person types.",
          "Don’t use brand colour or a glow for the highlighted row. It fills with accent.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "Command loop", type: "boolean", default: "false", description: "Wrap arrow-key navigation from the last item to the first." },
          { prop: "Command shouldFilter", type: "boolean", default: "true", description: "Turn off to filter results yourself, for example from a server." },
          { prop: "CommandInput value / onValueChange", type: "string / (value) => void", description: "Control the search text." },
          { prop: "CommandItem value", type: "string", description: "Text used for matching and as the item’s identity. Defaults to its text content." },
          { prop: "CommandItem keywords", type: "string[]", description: "Extra words that match the item, such as synonyms." },
          { prop: "CommandItem onSelect", type: "(value) => void", description: "Runs on click or Enter." },
          { prop: "CommandItem data-checked", type: "boolean", description: "Shows a check at the end of the row." },
          { prop: "CommandGroup heading", type: "ReactNode", description: "Small muted heading above the group. Hidden when nothing in it matches." },
          { prop: "CommandDialog title / description", type: "string", description: "Screen-reader title and description for the dialog." },
          { prop: "CommandFooter", type: "component", description: "A hairline strip under the list for key hints." },
        ]}
      />
    </Examples>
  )
}
