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
  /**
   * Heading inside the card. Pass null when the page already titles the zone,
   * for example in the left column of a settings layout; the header is left out.
   */
  title?: React.ReactNode
  description?: React.ReactNode
  /** Actions, most disruptive last. Defaults to archive, remove guests and delete. */
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
      id: "archive",
      title: "Archive project",
      description: `Hide ${projectName} from the sidebar and stop its automations. Tasks, docs and comments are kept, and you can restore it at any time.`,
      actionLabel: "Archive",
      confirmTitle: `Archive ${projectName}?`,
      confirmDescription:
        "Its automations stop running and it leaves everyone’s sidebar. Anyone with access can still find it in the archive and restore it.",
      confirmLabel: "Archive project",
      tone: "default",
      successMessage: `${projectName} was archived.`,
    },
    {
      id: "remove-guests",
      title: "Remove all guests",
      description: `Take away access from every guest on ${projectName}. Members keep their access.`,
      actionLabel: "Remove guests",
      confirmTitle: `Remove every guest from ${projectName}?`,
      confirmDescription:
        "They lose access right away and stop getting notifications. Their comments stay. You can invite them again later.",
      tone: "destructive",
      successMessage: `Guests removed from ${projectName}.`,
    },
    {
      id: "delete",
      title: "Delete project",
      description: `Permanently delete ${projectName} with its tasks, docs, files and automations.`,
      actionLabel: "Delete project",
      confirmTitle: `Delete ${projectName}?`,
      confirmDescription:
        "This removes the project and everything in it for every member and guest. You can’t undo this.",
      requireTyping: true,
      tone: "destructive",
      successMessage: `${projectName} was deleted.`,
    },
  ]
}

export function DangerZone({
  projectName = "Website relaunch",
  title = "Danger zone",
  description = "These actions affect everyone on the project. Some of them can’t be undone.",
  actions,
  onConfirm,
  as: Heading = "h2",
  className,
}: DangerZoneProps) {
  const id = React.useId()
  const items = actions ?? defaultDangerActions(projectName)
  const hasHeader = title !== null

  return (
    <section
      data-slot="danger-zone"
      aria-labelledby={hasHeader ? `${id}-title` : undefined}
      className={cn(
        "@container overflow-hidden rounded-(--card-radius) border border-destructive/35 bg-card",
        className
      )}
    >
      {hasHeader ? (
        <header className="flex items-start gap-3 border-b border-destructive/20 px-(--card-padding) py-5">
          <TriangleAlertIcon className="mt-1 size-5 shrink-0 text-destructive" aria-hidden="true" />
          <div className="grid gap-1">
            <Heading id={`${id}-title`} className="text-h4 text-foreground">
              {title}
            </Heading>
            {description ? <p className="text-sm text-copy">{description}</p> : null}
          </div>
        </header>
      ) : null}
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
      <AlertDialogContent>
        <form onSubmit={handleSubmit} className="contents">
          <AlertDialogHeader>
            <AlertDialogMedia variant={destructive ? "destructive" : "default"}>
              <TriangleAlertIcon aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle>{action.confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{action.confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>

          {action.requireTyping ? (
            <Field>
              <FieldLabel htmlFor={`${id}-confirm`} className="block leading-normal">
                Type <span className="font-semibold text-foreground">{projectName}</span> to confirm.
              </FieldLabel>
              <Input
                id={`${id}-confirm`}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder={projectName}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
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
