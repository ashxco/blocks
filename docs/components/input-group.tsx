"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon, LinkIcon, SearchIcon, XIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
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
        aria-label="Search deployments"
        placeholder="Search deployments"
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

function DeployHook() {
  const [copied, setCopied] = React.useState(false)
  const url = "https://api.lumen.app/v1/hooks/dh_3kR9xW2mPq"

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
      <FieldLabel htmlFor="ig-hook">Deploy hook</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <LinkIcon aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput id="ig-hook" readOnly value={url} className="font-mono" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label={copied ? "Copied" : "Copy deploy hook URL"} onClick={copy}>
            {copied ? <CheckIcon /> : <CopyIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Send a POST request to this URL to redeploy main.</FieldDescription>
    </Field>
  )
}

function PasswordField() {
  const [visible, setVisible] = React.useState(false)
  return (
    <Field>
      <FieldLabel htmlFor="ig-password">Database password</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="ig-password"
          type={visible ? "text" : "password"}
          defaultValue="lumen-db-7Qx2"
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

function DeploymentNote() {
  const max = 200
  const [note, setNote] = React.useState("Moves image resizing to the edge and drops the old /thumbs route.")
  const [saved, setSaved] = React.useState(false)
  return (
    <Field>
      <FieldLabel htmlFor="ig-note">Release note</FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          id="ig-note"
          value={note}
          maxLength={max}
          onChange={(e) => {
            setNote(e.target.value)
            setSaved(false)
          }}
          placeholder="Describe what changed in this deployment"
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-xs tabular">
            {note.length}/{max}
          </InputGroupText>
          <InputGroupButton variant="default" size="sm" className="ml-auto" onClick={() => setSaved(true)}>
            {saved ? (
              <>
                <CheckIcon data-icon="inline-start" />
                Saved
              </>
            ) : (
              "Save note"
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function InputGroupDocs() {
  return (
    <Examples>
      <Example
        title="Icons and keys"
        layout="stack"
        description="An icon names the field at a glance; a key hint shows the shortcut and gives way to a clear button once there is a query. Clicking an addon focuses the input."
        code={`<InputGroup>
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
  <InputGroupInput placeholder="Search deployments" />
  <InputGroupAddon align="inline-end">
    <Kbd>⌘K</Kbd>
  </InputGroupAddon>
</InputGroup>`}
      >
        <div className="w-full max-w-96">
          <SearchWithClear />
        </div>
      </Example>

      <Example
        title="Text"
        layout="stack"
        description="Fixed text before or after the value, such as a protocol, domain or unit, so people type only the part that changes."
        code={`<InputGroup>
  <InputGroupAddon>
    <InputGroupText>https://</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput placeholder="acme-web" />
  <InputGroupAddon align="inline-end">
    <InputGroupText>.lumen.app</InputGroupText>
  </InputGroupAddon>
</InputGroup>`}
      >
        <div className="grid w-full max-w-96 gap-6">
          <Field>
            <FieldLabel htmlFor="ig-subdomain">Preview domain</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput id="ig-subdomain" placeholder="acme-web" spellCheck={false} />
              <InputGroupAddon align="inline-end">
                <InputGroupText>.lumen.app</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="ig-timeout">Function timeout</FieldLabel>
            <InputGroup>
              <InputGroupInput id="ig-timeout" type="number" defaultValue={30} min={1} max={300} className="tabular" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>seconds</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
      </Example>

      <Example
        title="Buttons"
        layout="stack"
        description="Small ghost buttons for actions on the value: copy, reveal, clear. Icon buttons need an aria-label."
        code={`<InputGroup>
  <InputGroupInput readOnly value={url} />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-xs" aria-label="Copy deploy hook URL" onClick={copy}>
      <CopyIcon />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>`}
      >
        <div className="grid w-full max-w-112 gap-6">
          <DeployHook />
          <PasswordField />
        </div>
      </Example>

      <Example
        title="Textarea with a footer"
        layout="stack"
        description="A block-end addon turns the group into a small composer: a counter on the left, the action on the right."
        code={`<InputGroup>
  <InputGroupTextarea placeholder="Describe what changed" />
  <InputGroupAddon align="block-end">
    <InputGroupText>64/200</InputGroupText>
    <InputGroupButton variant="default" size="sm" className="ml-auto">
      Save note
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>`}
      >
        <div className="w-full max-w-112">
          <DeploymentNote />
        </div>
      </Example>

      <Example
        title="Sizes"
        layout="stack"
        description="The group takes the control heights. Use icon-xs buttons in small groups."
        code={`<InputGroup size="sm">…</InputGroup>
<InputGroup>…</InputGroup>
<InputGroup size="lg">…</InputGroup>`}
      >
        <div className="grid w-full max-w-96 gap-4">
          {(["sm", "default", "lg"] as const).map((size) => (
            <InputGroup key={size} size={size}>
              <InputGroupAddon>
                <SearchIcon aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput aria-label={`Search logs, ${size}`} placeholder="Search logs" />
            </InputGroup>
          ))}
        </div>
      </Example>

      <Example
        title="States"
        layout="stack"
        description="Invalid and disabled states come from the control inside, so set aria-invalid or disabled on InputGroupInput."
      >
        <div className="grid w-full max-w-96 gap-6">
          <Field data-invalid>
            <FieldLabel htmlFor="ig-invalid">Workspace URL</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>lumen.app/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="ig-invalid"
                defaultValue="halcyon labs"
                aria-invalid
                aria-describedby="ig-invalid-error"
              />
            </InputGroup>
            <FieldError id="ig-invalid-error">Replace the space with a hyphen, like halcyon-labs.</FieldError>
          </Field>
          <Field data-disabled="true">
            <FieldLabel htmlFor="ig-disabled">Workspace URL</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>lumen.app/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput id="ig-disabled" defaultValue="halcyon-labs" disabled />
            </InputGroup>
            <FieldDescription>Only owners can change the workspace URL.</FieldDescription>
          </Field>
        </div>
      </Example>

      <Guidelines
        do={[
          "Use addons for text that never changes, like a protocol, domain or unit.",
          "Keep addon buttons small and ghost, and label icon-only ones.",
          "Put the action that sends the value outside the group unless it belongs to the value, like copy.",
        ]}
        dont={[
          "Don’t put more than one button on each side.",
          "Don’t use an addon icon as the only label. Keep the visible FieldLabel.",
          "Don’t style the inner input. Set size, invalid and disabled on the group and control.",
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
          { prop: "InputGroupText", type: "<span>", description: "Muted text inside an addon, such as a prefix, suffix or counter." },
        ]}
      />
    </Examples>
  )
}
