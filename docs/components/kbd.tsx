import { ArrowDownIcon, ArrowUpIcon, CommandIcon, CornerDownLeftIcon, SearchIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

const shortcuts = [
  { action: "Open the command menu", keys: [["⌘", "K"]] },
  { action: "Go to deployments", keys: [["G"], ["D"]], sequence: true },
  { action: "Go to logs", keys: [["G"], ["L"]], sequence: true },
  { action: "Redeploy the selected deployment", keys: [["⌘", "⇧", "R"]] },
  { action: "Copy the preview URL", keys: [["⌘", "⇧", "C"]] },
  { action: "Show all shortcuts", keys: [["?"]] },
]

export default function KbdDocs() {
  return (
    <Examples>
      <Example
        title="Keys"
        description="One Kbd per key. Use symbols for modifier keys on macOS."
        code={`<Kbd>⌘</Kbd>
<Kbd>⇧</Kbd>
<Kbd>Esc</Kbd>
<Kbd>Enter</Kbd>`}
      >
        {/* Modifiers, named keys and arrows wrap as groups, so no key is left alone on a line. */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <span className="flex gap-1.5">
            <Kbd>⌘</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>⌥</Kbd>
          </span>
          <span className="flex gap-1.5">
            <Kbd>Esc</Kbd>
            <Kbd>Enter</Kbd>
            <Kbd>
              <CornerDownLeftIcon aria-label="Return" />
            </Kbd>
          </span>
          <span className="flex gap-1.5">
            <Kbd>
              <ArrowUpIcon aria-label="Up arrow" />
            </Kbd>
            <Kbd>
              <ArrowDownIcon aria-label="Down arrow" />
            </Kbd>
          </span>
        </div>
      </Example>

      <Example
        title="Combinations"
        description="Group keys pressed together. For sequences, put “then” between the keys."
        code={`<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>

<KbdGroup>
  <Kbd>G</Kbd>
  then
  <Kbd>D</Kbd>
</KbdGroup>`}
      >
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>G</Kbd>
          then
          <Kbd>D</Kbd>
        </KbdGroup>
      </Example>

      <Example
        title="In text"
        description="Kbd sits on the text baseline, so it works inside a sentence."
        layout="stack"
      >
        <p className="max-w-prose text-body text-copy">
          Press{" "}
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>{" "}
          to search projects, deployments and domains. Press <Kbd>Esc</Kbd> to close
          the menu.
        </p>
      </Example>

      <Example
        title="In a button"
        description="Inside a button the keycap drops its fill and takes the button’s text colour."
        code={`<Button variant="outline">
  <SearchIcon data-icon="inline-start" />
  Search
  <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
</Button>`}
      >
        <Button variant="outline">
          <SearchIcon data-icon="inline-start" />
          Search
          <KbdGroup className="ml-2">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
        <Button>
          Deploy
          <Kbd className="ml-1">
            <CommandIcon aria-label="Command" />
            <CornerDownLeftIcon aria-label="Return" />
          </Kbd>
        </Button>
      </Example>

      <Example
        title="Shortcuts sheet"
        description="A list of shortcuts in hairline rows, as in a help dialog."
        layout="stack"
      >
        <div className="grid gap-4">
          <h3 className="text-h4 text-foreground">Keyboard shortcuts</h3>
          <dl className="divide-y overflow-hidden rounded-(--card-radius) border bg-card">
            {shortcuts.map((s) => (
              <div key={s.action} className="flex items-center justify-between gap-6 px-5 py-3.5">
                <dt className="text-sm text-copy">{s.action}</dt>
                <dd>
                  <KbdGroup>
                    {s.keys.map((combo, i) => (
                      <span key={combo.join("+")} className="inline-flex items-center gap-1">
                        {i > 0 && s.sequence ? <span className="px-0.5">then</span> : null}
                        {combo.map((key) => (
                          <Kbd key={key}>{key}</Kbd>
                        ))}
                      </span>
                    ))}
                  </KbdGroup>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Example>

      <Guidelines
        do={[
          "Show the shortcut for the platform the person is on: ⌘ on macOS, Ctrl elsewhere.",
          "Use one Kbd per key and a KbdGroup for keys pressed together.",
          "Show shortcuts next to the action they trigger, in menus and tooltips.",
        ]}
        dont={[
          "Don’t write the plus sign between keys pressed together. The group spacing shows it.",
          "Don’t use Kbd for code or values. Use a code element.",
          "Don’t rely on a shortcut as the only way to do something.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "Kbd", type: "<kbd> props", description: "One key. Text, a symbol or a 12px icon." },
          { prop: "KbdGroup", type: "<kbd> props", description: "Keys pressed together or in sequence, 4px apart." },
          { prop: "className", type: "string", description: "Extra classes, for spacing inside buttons or menus." },
        ]}
      />
    </Examples>
  )
}
