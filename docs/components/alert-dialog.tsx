"use client"

import * as React from "react"
import { KeyRoundIcon, LogOutIcon, RocketIcon, Trash2Icon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

function PromoteDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button />}>
        <RocketIcon data-icon="inline-start" />
        Promote to production
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Promote this deployment?</AlertDialogTitle>
          <AlertDialogDescription>
            Deployment 8f2c1a9 replaces the current production deployment on lumen.app. You can roll back at any
            time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => setOpen(false)}>Promote</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DeleteBranchDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="outline" />}>Delete preview branch</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive-subtle text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete the preview branch?</AlertDialogTitle>
          <AlertDialogDescription>
            The preview at <strong>feat-billing.lumen.app</strong> stops working and its 12 deployments are removed.
            The Git branch is not touched.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => setOpen(false)}>
            Delete branch
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SignOutDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="ghost" />}>
        <LogOutIcon data-icon="inline-start" />
        Sign out everywhere
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <LogOutIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Sign out of all devices?</AlertDialogTitle>
          <AlertDialogDescription>You’ll need to sign in again on 4 devices, including this one.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => setOpen(false)}>Sign out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function RotateKeyDialog() {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  function rotate() {
    setPending(true)
    window.setTimeout(() => {
      setPending(false)
      setOpen(false)
    }, 1400)
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        <KeyRoundIcon data-icon="inline-start" />
        Rotate API key
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rotate the production API key?</AlertDialogTitle>
          <AlertDialogDescription>
            The current key stops working in 10 minutes. Update <strong>LUMEN_API_KEY</strong> in your CI before then.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={rotate} disabled={pending}>
            {pending ? <Spinner data-icon="inline-start" /> : null}
            {pending ? "Rotating key" : "Rotate key"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function TypeToConfirmDialog() {
  const project = "lumen-web"
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const matches = value.trim() === project

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setValue("")
      }}
    >
      <AlertDialogTrigger render={<Button variant="destructive" />}>Delete project</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive-subtle text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete {project}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the project, its 214 deployments and every preview URL. Domains go back to your account.
            You can’t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Field>
          <FieldLabel htmlFor="alert-confirm">
            Type <span className="font-mono text-foreground">{project}</span> to confirm
          </FieldLabel>
          <Input
            id="alert-confirm"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Field>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={!matches} onClick={() => setOpen(false)}>
            Delete project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function AlertDialogDocs() {
  return (
    <Examples>
      <Example
        title="Confirm an action"
        description="Ask one clear question. The description says what will change; the action repeats the verb from the title. AlertDialogAction does not close the dialog on its own, so close it when the work is done."
        code={`const [open, setOpen] = React.useState(false)

<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogTrigger render={<Button />}>Promote to production</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Promote this deployment?</AlertDialogTitle>
      <AlertDialogDescription>
        Deployment 8f2c1a9 replaces the current production deployment on lumen.app.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => promote().then(() => setOpen(false))}>
        Promote
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
      >
        <PromoteDialog />
      </Example>

      <Example
        title="Destructive"
        description="Add a tinted media tile and use the destructive button for actions that delete data or can’t be undone."
        code={`<AlertDialogContent>
  <AlertDialogHeader>
    <AlertDialogMedia className="bg-destructive-subtle text-destructive">
      <Trash2Icon />
    </AlertDialogMedia>
    <AlertDialogTitle>Delete the preview branch?</AlertDialogTitle>
    <AlertDialogDescription>…</AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction variant="destructive">Delete branch</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>`}
      >
        <DeleteBranchDialog />
      </Example>

      <Example
        title="Small"
        description="size=“sm” centres a short question and gives both answers equal width. Good for sign-out and leave prompts."
        code={`<AlertDialogContent size="sm">…</AlertDialogContent>`}
      >
        <SignOutDialog />
      </Example>

      <Example
        title="Pending state"
        description="Keep the dialog open while the request runs. Disable both buttons and say what is happening in the action label."
        code={`<AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
  …
  <AlertDialogFooter>
    <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
    <AlertDialogAction onClick={rotate} disabled={pending}>
      {pending ? <Spinner data-icon="inline-start" /> : null}
      {pending ? "Rotating key" : "Rotate key"}
    </AlertDialogAction>
  </AlertDialogFooter>
</AlertDialog>`}
      >
        <RotateKeyDialog />
      </Example>

      <Example
        title="Type to confirm"
        description="For the most destructive actions, ask people to type the name of what they are deleting. The action stays disabled until it matches."
      >
        <TypeToConfirmDialog />
      </Example>

      <Guidelines
        do={[
          "Use an alert dialog only when the action is destructive, expensive or hard to undo.",
          "Write the title as a question that names the thing: “Delete lumen-web?”.",
          "Say exactly what will be lost or changed, with numbers when you have them.",
          "Label the action with the verb from the title, never “OK” or “Yes”.",
        ]}
        dont={[
          "Don’t use an alert dialog for routine confirmations. Make the action undoable and show a toast.",
          "Don’t add a close button or let a click on the overlay dismiss it. People answer it.",
          "Don’t put a form with several fields in it. Use a dialog.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "open", type: "boolean", description: "Controlled open state. Pair with onOpenChange." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "Called when the dialog opens or closes. Ignore it while a request is pending." },
          { prop: "size", type: '"default" | "sm"', default: '"default"', description: "On AlertDialogContent. sm centres the content and puts both buttons side by side." },
          { prop: "variant", type: "Button variant", default: '"default"', description: "On AlertDialogAction, a Button that does not close the dialog by itself. Use \"destructive\" for actions that delete data." },
          { prop: "variant (cancel)", type: "Button variant", default: '"outline"', description: "On AlertDialogCancel, which always closes the dialog." },
          { prop: "className", type: "string", description: "On AlertDialogMedia. Tint the tile, e.g. bg-destructive-subtle text-destructive." },
          { prop: "render", type: "ReactElement", description: "On AlertDialogTrigger. Render as a Button: render={<Button variant=\"outline\" />}." },
        ]}
      />
    </Examples>
  )
}
