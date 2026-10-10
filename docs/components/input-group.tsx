"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  LinkIcon,
  ListFilterIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines, tokenPx } from "@/docs/kit"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"

function SearchWithClear() {
  const [query, setQuery] = React.useState("")
  return (
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        id="ig-search"
        placeholder="Search tasks"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <InputGroupAddon align="inline-end">
        {query ? (
          <InputGroupButton size="icon-xs" aria-label="Clear search" onClick={() => setQuery("")}>
            <XIcon />
          </InputGroupButton>
        ) : (
          <Kbd>⌘K</Kbd>
        )}
      </InputGroupAddon>
    </InputGroup>
  )
}

function InviteLink() {
  const [copied, setCopied] = React.useState(false)
  const url = "app.acme.com/acme/join/7hq2xl"

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard access can be blocked; the button still confirms the action.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Field>
      <FieldLabel htmlFor="ig-invite">Invite link</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <LinkIcon aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput id="ig-invite" readOnly value={url} className="font-mono" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label={copied ? "Copied" : "Copy invite link"} onClick={copy}>
            {copied ? <CheckIcon /> : <CopyIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>
        Anyone with this link can join Acme Inc. as a member for the next 14 days.
      </FieldDescription>
    </Field>
  )
}

function PasswordField() {
  const [visible, setVisible] = React.useState(false)
  return (
    <Field>
      <FieldLabel htmlFor="ig-password">New password</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="ig-password"
          type={visible ? "text" : "password"}
          defaultValue="orchard-lamp-7Qx2"
          autoComplete="new-password"
          className="font-mono"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

function StatusUpdate() {
  const max = 200
  const [update, setUpdate] = React.useState("Hero copy is approved. Next up is the pricing page review on Thursday.")
  const [posted, setPosted] = React.useState(false)
  return (
    <Field>
      <FieldLabel htmlFor="ig-update">Status update</FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          id="ig-update"
          value={update}
          maxLength={max}
          onChange={(e) => {
            setUpdate(e.target.value)
            setPosted(false)
          }}
          placeholder="Share progress, blockers or decisions."
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-caption tabular">
            {update.length}/{max}
          </InputGroupText>
          <InputGroupButton variant="default" size="sm" className="ml-auto" onClick={() => setPosted(true)}>
            {posted ? (
              <>
                <CheckIcon data-icon="inline-start" />
                Posted
              </>
            ) : (
              "Post update"
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

const groupSizes = [
  { size: "sm", label: "Small", height: `${tokenPx("--control-height-sm")}px`, button: "icon-xs" },
  { size: "default", label: "Medium", height: `${tokenPx("--control-height-md")}px`, button: "icon-sm" },
  { size: "lg", label: "Large", height: `${tokenPx("--control-height-lg")}px`, button: "icon-sm" },
] as const

export default function InputGroupDocs() {
  return (
    <Examples>
      <Example
        title="Icons and keys"
        layout="stack"
        description="An icon names the field at a glance; a key hint shows the shortcut and gives way to a clear button once there is a query. Clicking an addon focuses the input."
        code={`const [query, setQuery] = React.useState("")

<Field>
  <FieldLabel htmlFor="search">Search</FieldLabel>
  <InputGroup>
    <InputGroupAddon>
      <SearchIcon aria-hidden="true" />
    </InputGroupAddon>
    <InputGroupInput
      id="search"
      placeholder="Search tasks"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
    <InputGroupAddon align="inline-end">
      {query ? (
        <InputGroupButton size="icon-xs" aria-label="Clear search" onClick={() => setQuery("")}>
          <XIcon />
        </InputGroupButton>
      ) : (
        <Kbd>⌘K</Kbd>
      )}
    </InputGroupAddon>
  </InputGroup>
</Field>`}
      >
        <Field className="max-w-sm">
          <FieldLabel htmlFor="ig-search">Search</FieldLabel>
          <SearchWithClear />
        </Field>
      </Example>

      <Example
        title="Text"
        layout="stack"
        description="Fixed text before or after the value, such as a domain, address or unit, so people type only the part that changes. A prefix runs straight into the value and a suffix follows it, so the whole line reads as one URL, address or amount."
        code={`<Field>
  <FieldLabel htmlFor="workspace-url">Workspace URL</FieldLabel>
  <InputGroup>
    <InputGroupAddon>
      <InputGroupText>app.acme.com/</InputGroupText>
    </InputGroupAddon>
    <InputGroupInput id="workspace-url" defaultValue="acme" placeholder="your-team" spellCheck={false} />
  </InputGroup>
</Field>

<Field>
  <FieldLabel htmlFor="task-email">Email tasks to</FieldLabel>
  <InputGroup>
    <InputGroupInput id="task-email" defaultValue="website-relaunch" spellCheck={false} />
    <InputGroupAddon align="inline-end">
      <InputGroupText>@tasks.acme.com</InputGroupText>
    </InputGroupAddon>
  </InputGroup>
</Field>

<Field>
  <FieldLabel htmlFor="estimate">Default estimate</FieldLabel>
  <InputGroup className="max-w-40">
    <InputGroupInput id="estimate" type="number" defaultValue={4} min={1} max={40} className="tabular" />
    <InputGroupAddon align="inline-end">
      <InputGroupText>hours</InputGroupText>
    </InputGroupAddon>
  </InputGroup>
</Field>`}
      >
        <div className="grid w-full max-w-sm gap-6">
          <Field>
            <FieldLabel htmlFor="ig-workspace-url">Workspace URL</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>app.acme.com/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput id="ig-workspace-url" defaultValue="acme" placeholder="your-team" spellCheck={false} />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="ig-task-email">Email tasks to</FieldLabel>
            <InputGroup>
              <InputGroupInput id="ig-task-email" defaultValue="website-relaunch" spellCheck={false} />
              <InputGroupAddon align="inline-end">
                <InputGroupText>@tasks.acme.com</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="ig-estimate">Default estimate</FieldLabel>
            <InputGroup className="max-w-40">
              <InputGroupInput id="ig-estimate" type="number" defaultValue={4} min={1} max={40} className="tabular" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>hours</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
      </Example>

      <Example
        title="Buttons"
        layout="stack"
        description="Small ghost buttons for actions on the value: copy, reveal, clear. Icon buttons need an aria-label."
        code={`<Field>
  <FieldLabel htmlFor="invite">Invite link</FieldLabel>
  <InputGroup>
    <InputGroupAddon>
      <LinkIcon aria-hidden="true" />
    </InputGroupAddon>
    <InputGroupInput id="invite" readOnly value={url} className="font-mono" />
    <InputGroupAddon align="inline-end">
      <InputGroupButton size="icon-xs" aria-label={copied ? "Copied" : "Copy invite link"} onClick={copy}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
  <FieldDescription>Anyone with this link can join Acme Inc. as a member for the next 14 days.</FieldDescription>
</Field>

<Field>
  <FieldLabel htmlFor="new-password">New password</FieldLabel>
  <InputGroup>
    <InputGroupInput
      id="new-password"
      type={visible ? "text" : "password"}
      autoComplete="new-password"
      className="font-mono"
    />
    <InputGroupAddon align="inline-end">
      <InputGroupButton
        size="icon-xs"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</Field>`}
      >
        <div className="grid w-full max-w-sm gap-6">
          <InviteLink />
          <PasswordField />
        </div>
      </Example>

      <Example
        title="Textarea with a footer"
        layout="stack"
        description="A block-end addon turns the group into a small composer: a counter on the left, the action on the right."
        code={`<Field>
  <FieldLabel htmlFor="update">Status update</FieldLabel>
  <InputGroup>
    <InputGroupTextarea
      id="update"
      value={update}
      onChange={(e) => setUpdate(e.target.value)}
      maxLength={200}
      placeholder="Share progress, blockers or decisions."
    />
    <InputGroupAddon align="block-end">
      <InputGroupText className="text-caption tabular">{update.length}/200</InputGroupText>
      <InputGroupButton variant="default" size="sm" className="ml-auto">
        Post update
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</Field>`}
      >
        <div className="w-full max-w-sm">
          <StatusUpdate />
        </div>
      </Example>

      <Example
        title="Sizes"
        layout="stack"
        description="The group takes the control heights. Use icon-xs buttons in small groups and icon-sm in medium and large ones."
        code={`<InputGroup size="sm">
  <InputGroupAddon><SearchIcon /></InputGroupAddon>
  <InputGroupInput placeholder="Search tasks" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-xs" aria-label="Filter by priority"><ListFilterIcon /></InputGroupButton>
  </InputGroupAddon>
</InputGroup>

<InputGroup>
  <InputGroupAddon><SearchIcon /></InputGroupAddon>
  <InputGroupInput placeholder="Search tasks" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-sm" aria-label="Filter by priority"><ListFilterIcon /></InputGroupButton>
  </InputGroupAddon>
</InputGroup>

<InputGroup size="lg">
  <InputGroupAddon><SearchIcon /></InputGroupAddon>
  <InputGroupInput placeholder="Search tasks" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-sm" aria-label="Filter by priority"><ListFilterIcon /></InputGroupButton>
  </InputGroupAddon>
</InputGroup>`}
      >
        <div className="grid w-full max-w-sm gap-6">
          {groupSizes.map(({ size, label, height, button }) => (
            <Field key={size}>
              <FieldLabel htmlFor={`ig-size-${size}`}>
                {label} <span className="font-normal text-muted-foreground">{height}</span>
              </FieldLabel>
              <InputGroup size={size}>
                <InputGroupAddon>
                  <SearchIcon aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput id={`ig-size-${size}`} placeholder="Search tasks" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton size={button} aria-label="Filter by priority">
                    <ListFilterIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          ))}
        </div>
      </Example>

      <Example
        title="States"
        layout="stack"
        description="Invalid and disabled states come from the control inside, so set aria-invalid or disabled on InputGroupInput."
        code={`<Field data-invalid>
  <FieldLabel htmlFor="workspace">Workspace URL</FieldLabel>
  <InputGroup>
    <InputGroupAddon><InputGroupText>app.acme.com/</InputGroupText></InputGroupAddon>
    <InputGroupInput id="workspace" defaultValue="Acme" aria-invalid aria-describedby="workspace-error" />
  </InputGroup>
  <FieldError id="workspace-error">Use lowercase letters, numbers and hyphens, like acme.</FieldError>
</Field>

<Field data-disabled>
  <FieldLabel htmlFor="workspace-locked">Workspace URL</FieldLabel>
  <InputGroup>
    <InputGroupAddon><InputGroupText>app.acme.com/</InputGroupText></InputGroupAddon>
    <InputGroupInput id="workspace-locked" defaultValue="acme" disabled />
  </InputGroup>
  <FieldDescription>Only owners can change the workspace URL.</FieldDescription>
</Field>`}
      >
        <div className="grid w-full max-w-2xl gap-6 @xl:grid-cols-2">
          <Field data-invalid>
            <FieldLabel htmlFor="ig-invalid">Workspace URL</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>app.acme.com/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="ig-invalid"
                defaultValue="Acme"
                aria-invalid
                aria-describedby="ig-invalid-error"
              />
            </InputGroup>
            <FieldError id="ig-invalid-error">Use lowercase letters, numbers and hyphens, like acme.</FieldError>
          </Field>
          <Field data-disabled="true">
            <FieldLabel htmlFor="ig-disabled">Workspace URL</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>app.acme.com/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput id="ig-disabled" defaultValue="acme" disabled />
            </InputGroup>
            <FieldDescription>Only owners can change the workspace URL.</FieldDescription>
          </Field>
        </div>
      </Example>

      <Guidelines
        do={[
          "Use addons for text that never changes, like a domain, address or unit.",
          "Keep addon buttons small and ghost, and label icon-only ones.",
          "Put the action that sends the value outside the group unless it belongs to the value, like copy.",
        ]}
        dont={[
          "Don’t put more than one button on each side.",
          "Don’t use an addon icon as the only label. Keep the visible FieldLabel.",
          "Don’t restyle the group’s surface, border or height. Type styles on the value, such as font-mono for IDs, are fine.",
        ]}
      />

      <ApiTable
        title="InputGroup"
        rows={[
          { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Height from the --control-height-* tokens. Groups with a textarea or block addon grow to fit." },
          { prop: "className", type: "string", description: "Width and layout. The surface, border and focus state are set by the group." },
        ]}
      />

      <ApiTable
        title="Parts"
        rows={[
          { prop: "InputGroupAddon align", type: '"inline-start" | "inline-end" | "block-start" | "block-end"', default: '"inline-start"', description: "Where the addon sits. Block addons stack above or below the control." },
          { prop: "InputGroupButton size", type: '"xs" | "sm" | "icon-xs" | "icon-sm"', default: '"xs"', description: "Button size from the --button-height-* tokens." },
          { prop: "InputGroupButton variant", type: "Button variant", default: '"ghost"', description: "Any button variant. Use default for a primary action in a block addon." },
          { prop: "InputGroupInput", type: "<input>", description: "The control. Takes every input prop, including aria-invalid and disabled." },
          { prop: "InputGroupTextarea", type: "<textarea>", description: "A textarea control that grows with its content." },
          { prop: "InputGroupText", type: "<span>", description: "Muted text inside an addon, such as a prefix, suffix or counter, at the same size as the value. When it is the only thing in an inline addon, a prefix runs straight into the value and a suffix follows it." },
        ]}
      />
    </Examples>
  )
}
