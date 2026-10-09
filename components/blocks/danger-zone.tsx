"use client"

import * as React from "react"
import { TriangleAlertIcon } from "lucide-react"

import { cn } from "@/lib/utils"
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
import { toast } from "@/components/ui/toast"

export interface DangerAction {
  /** Stable key. */
  id: string
  /** Row title, e.g. "Delete project". */
  title: string
  /** What happens, in one or two sentences. */
  description: string
  /** Label of the button that opens the confirmation. */
  actionLabel: string
  /** Confirmation dialog title. */
  confirmTitle: string
  /** Confirmation dialog body: consequences, plainly. */
  confirmDescription: string
  /** Label of the confirming button. Defaults to actionLabel. */
  confirmLabel?: string
  /** Require typing the resource name before the action unlocks. */
  requireTyping?: boolean
  /** "destructive" for deletion, "default" for reversible but disruptive actions. */
  tone?: "destructive" | "default"
  /** Toast shown after the action completes. */
  successMessage?: string
}

export interface DangerZoneProps {
  /** Name people type to confirm. Also used in the default copy. */
  projectName?: string
  title?: React.ReactNode
  description?: React.ReactNode
  /** Actions, most disruptive last. Defaults to pause, purge previews and delete. */
  actions?: DangerAction[]
  /** Called after an action is confirmed. Without it, the zone simulates a short request. */
  onConfirm?: (actionId: string) => void | Promise<void>
  /** Heading level of the title. */
  as?: "h2" | "h3"
  className?: string
}

export function defaultDangerActions(projectName: string): DangerAction[] {
  return [
    {
      id: "pause",
      title: "Pause deployments",
      description: `Stop building new commits for ${projectName}. The current production deployment keeps serving traffic.`,
      actionLabel: "Pause",
      confirmTitle: `Pause deployments for ${projectName}?`,
      confirmDescription:
        "New pushes and pull requests won’t build until you resume. Production stays online at its current version.",
      confirmLabel: "Pause deployments",
      tone: "default",
      successMessage: `Deployments paused for ${projectName}.`,
    },
    {
      id: "purge-previews",
      title: "Delete preview deployments",
      description: "Remove every preview deployment and its URL. Production and branch history are not affected.",
      actionLabel: "Delete previews",
      confirmTitle: "Delete all preview deployments?",
      confirmDescription:
        "Preview links shared in pull requests will stop working. New pushes create fresh previews as usual.",
      tone: "destructive",
      successMessage: "Preview deployments deleted.",
    },
    {
      id: "delete",
      title: "Delete project",
      description: `Permanently delete ${projectName} with its deployments, domains, environment variables and logs.`,
      actionLabel: "Delete project",
      confirmTitle: `Delete ${projectName}?`,
      confirmDescription:
        "This removes the project and everything in it, and releases its domains. You can’t undo this.",
      requireTyping: true,
      tone: "destructive",
      successMessage: `${projectName} was deleted.`,
    },
  ]
}

export function DangerZone({
  projectName = "halcyon-web",
  title = "Danger zone",
  description = "These actions affect production. Some of them can’t be undone.",
  actions,
  onConfirm,
  as: Heading = "h2",
  className,
}: DangerZoneProps) {
  const id = React.useId()
  const items = actions ?? defaultDangerActions(projectName)

  return (
    <section
      data-slot="danger-zone"
      aria-labelledby={`${id}-title`}
      className={cn(
        "@container overflow-hidden rounded-(--card-radius) border border-destructive/30 bg-card",
        className
      )}
    >
      <header className="flex items-start gap-3 border-b border-destructive/20 bg-destructive-subtle/60 px-(--card-padding) py-5">
        <TriangleAlertIcon className="mt-1 size-5 shrink-0 text-destructive" aria-hidden="true" />
        <div className="grid gap-1">
          <Heading id={`${id}-title`} className="text-h4 text-foreground">
            {title}
          </Heading>
          {description ? <p className="text-sm text-copy">{description}</p> : null}
        </div>
      </header>
      <ul className="divide-y divide-destructive/15">
        {items.map((action) => (
          <li
            key={action.id}
            className="flex flex-col gap-4 px-(--card-padding) py-6 @prose:flex-row @prose:items-center @prose:justify-between @prose:gap-10"
          >
            <div className="grid max-w-prose gap-1">
              <h3 className="text-title text-foreground">{action.title}</h3>
              <p className="text-sm text-copy">{action.description}</p>
            </div>
            <DangerConfirm action={action} projectName={projectName} onConfirm={onConfirm} />
          </li>
        ))}
      </ul>
    </section>
  )
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function DangerConfirm({
  action,
  projectName,
  onConfirm,
}: {
  action: DangerAction
  projectName: string
  onConfirm?: (actionId: string) => void | Promise<void>
}) {
  const id = React.useId()
  const [open, setOpen] = React.useState(false)
  const [typed, setTyped] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const destructive = action.tone !== "default"
  const unlocked = !action.requireTyping || typed.trim() === projectName

  function handleOpenChange(next: boolean) {
    if (pending) return
    setOpen(next)
    if (!next) setTyped("")
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!unlocked || pending) return
    setPending(true)
    try {
      await (onConfirm ? onConfirm(action.id) : wait(800))
      setOpen(false)
      setTyped("")
      if (action.successMessage) toast.add({ title: action.successMessage })
    } catch {
      toast.add({ type: "error", title: "That didn’t work", description: "Nothing was changed. Try again in a moment." })
    } finally {
      setPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={
          <Button
            variant={action.requireTyping ? "destructive" : "outline"}
            className={cn(
              "shrink-0 self-start @prose:self-center",
              destructive && !action.requireTyping && "text-destructive hover:border-destructive"
            )}
          />
        }
      >
        {action.actionLabel}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-(--dialog-width)">
        <form onSubmit={handleSubmit} className="contents">
          <AlertDialogHeader>
            <AlertDialogMedia className={destructive ? "bg-destructive-subtle text-destructive" : undefined}>
              <TriangleAlertIcon aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle>{action.confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{action.confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>

          {action.requireTyping ? (
            <Field>
              <FieldLabel htmlFor={`${id}-confirm`} className="block leading-normal">
                Type <span className="font-mono font-semibold text-foreground">{projectName}</span> to confirm.
              </FieldLabel>
              <Input
                id={`${id}-confirm`}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder={projectName}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                className="font-mono"
              />
            </Field>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              variant={destructive ? "destructive" : "default"}
              disabled={!unlocked || pending}
            >
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {action.confirmLabel ?? action.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
