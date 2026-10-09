"use client"

import * as React from "react"
import {
  ArrowRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  LifeBuoyIcon,
  MapPinIcon,
  MessagesSquareIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface ContactMethod {
  icon: LucideIcon
  label: string
  value: string
  /** Makes the value a link, e.g. "mailto:sales@lumen.dev". */
  href?: string
}

export interface ContactFormValues {
  name: string
  email: string
  company: string
  teamSize: string
  topic: string
  message: string
}

export interface ContactPanelProps {
  /** Heading on the dark panel. */
  title?: React.ReactNode
  description?: React.ReactNode
  methods?: ContactMethod[]
  /** Line at the foot of the panel, e.g. support hours. Pass null to hide it. */
  hours?: React.ReactNode
  /** Choices for "What can we help with?". The first is selected by default. */
  topics?: string[]
  teamSizes?: string[]
  submitLabel?: string
  /** Shown beside the button after a successful send. */
  successMessage?: React.ReactNode
  /** Called with the form values. Throw to show the error message. Without it, the form simulates a send. */
  onSubmit?: (values: ContactFormValues) => void | Promise<void>
  /** Renders its own page container and section spacing. Set to false inside your own layout. */
  contained?: boolean
  className?: string
}

export const defaultContactMethods: ContactMethod[] = [
  { icon: MessagesSquareIcon, label: "Sales", value: "sales@lumen.dev", href: "mailto:sales@lumen.dev" },
  { icon: LifeBuoyIcon, label: "Support", value: "support@lumen.dev", href: "mailto:support@lumen.dev" },
  { icon: UsersIcon, label: "Community", value: "Forum and office hours at community.lumen.dev" },
  { icon: MapPinIcon, label: "Office", value: "Torstraße 109, 10119 Berlin" },
]

const defaultTopics = ["Sales", "Support", "Partnership", "Press"]
const defaultTeamSizes = ["Just me", "2–10", "11–50", "51–200", "201 or more"]

type Status = "idle" | "sending" | "sent" | "error"

/**
 * One card split in two: a dark panel with other ways to get in touch, and
 * a contact form with pill topics and an inline confirmation. Stacks in
 * narrow slots.
 */
export function ContactPanel({
  title = "Other ways to reach us",
  description = "A real person reads every message. Pick whichever channel suits you.",
  methods = defaultContactMethods,
  hours = "Support replies Mon–Fri, 9:00–18:00 CET",
  topics = defaultTopics,
  teamSizes = defaultTeamSizes,
  submitLabel = "Send message",
  successMessage = "Message sent. We reply within one business day.",
  onSubmit,
  contained = true,
  className,
}: ContactPanelProps) {
  const id = React.useId()
  const [topic, setTopic] = React.useState(topics[0] ?? "")
  const [status, setStatus] = React.useState<Status>("idle")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const values: ContactFormValues = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      teamSize: String(data.get("teamSize") ?? ""),
      topic,
      message: String(data.get("message") ?? ""),
    }

    setStatus("sending")
    try {
      if (onSubmit) await onSubmit(values)
      else await new Promise((resolve) => setTimeout(resolve, 900))
      form.reset()
      setTopic(topics[0] ?? "")
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  const sending = status === "sending"

  return (
    <section data-slot="contact-panel" className={cn(contained && "container-page py-section", className)}>
      <div className="@container">
        <div className="grid overflow-hidden rounded-(--panel-radius) border @narrow:grid-cols-12">
          {/* Dark panel */}
          <aside className="flex flex-col gap-10 bg-panel p-8 text-panel-foreground @narrow:col-span-5 @narrow:p-12">
            <div className="grid gap-3">
              <h2 className="text-h3 text-panel-foreground">{title}</h2>
              {description ? <p className="text-body text-panel-muted">{description}</p> : null}
            </div>

            <ul className="grid gap-6">
              {methods.map((method) => {
                const Icon = method.icon
                return (
                  <li key={method.label} className="flex items-start gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-md border border-panel-border bg-panel-raised">
                      <Icon className="size-4.5" aria-hidden="true" />
                    </span>
                    <div className="grid min-w-0 gap-0.5">
                      <p className="text-title text-panel-foreground">{method.label}</p>
                      {method.href ? (
                        <a
                          href={method.href}
                          className="w-fit rounded-xs text-body break-words text-panel-muted underline-offset-4 outline-none hover:text-panel-foreground hover:underline focus-visible:focus-ring"
                        >
                          {method.value}
                        </a>
                      ) : (
                        <p className="text-body text-panel-muted">{method.value}</p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>

            {hours ? (
              <p className="mt-auto flex items-center gap-2.5 border-t border-panel-border pt-6 text-caption text-panel-muted">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-panel-success" />
                {hours}
              </p>
            ) : null}
          </aside>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            onChange={() => {
              if (status === "sent" || status === "error") setStatus("idle")
            }}
            className="@container/form bg-card p-8 @narrow:col-span-7 @narrow:p-12"
          >
            <FieldGroup className="gap-6">
              <div className="grid gap-6 @min-[30rem]/form:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
                  <Input id={`${id}-name`} name="name" autoComplete="name" placeholder="Jane Smith" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${id}-email`}>Work email</FieldLabel>
                  <Input
                    id={`${id}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@company.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${id}-company`}>Company</FieldLabel>
                  <Input id={`${id}-company`} name="company" autoComplete="organization" placeholder="Acme Inc." />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${id}-size`}>Team size</FieldLabel>
                  <NativeSelect id={`${id}-size`} name="teamSize" defaultValue={teamSizes[1]} className="w-full">
                    {teamSizes.map((size) => (
                      <NativeSelectOption key={size} value={size}>
                        {size}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
              </div>

              {topics.length > 0 ? (
                <FieldSet className="gap-3">
                  <FieldLegend variant="label" className="mb-0">
                    <span className="text-label text-foreground">What can we help with?</span>
                  </FieldLegend>
                  <RadioGroup
                    name="topic"
                    value={topic}
                    onValueChange={(value) => setTopic(String(value))}
                    className="flex flex-wrap gap-2"
                  >
                    {topics.map((t) => (
                      <label
                        key={t}
                        className="inline-flex h-(--button-height-sm) cursor-pointer items-center gap-2.5 rounded-(--button-radius) border border-input bg-background pr-4 pl-3 text-label text-foreground transition-colors duration-(--duration-fast) ease-standard select-none hover:border-foreground/40 has-data-checked:border-primary has-data-checked:bg-primary has-data-checked:text-primary-foreground"
                      >
                        <RadioGroupItem value={t} />
                        {t}
                      </label>
                    ))}
                  </RadioGroup>
                </FieldSet>
              ) : null}

              <Field>
                <FieldLabel htmlFor={`${id}-message`}>Message</FieldLabel>
                <Textarea
                  id={`${id}-message`}
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell us what you are building and how we can help."
                  className="min-h-32 resize-y"
                />
              </Field>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button type="submit" size="lg" disabled={sending}>
                  {sending ? <Spinner data-icon="inline-start" /> : null}
                  {sending ? "Sending" : submitLabel}
                  {sending ? null : <ArrowRightIcon data-icon="inline-end" />}
                </Button>
                <p role="status" aria-live="polite" className="text-label">
                  {status === "sent" ? (
                    <span className="flex items-center gap-2 text-success">
                      <CircleCheckIcon className="size-4 shrink-0" aria-hidden="true" />
                      {successMessage}
                    </span>
                  ) : status === "error" ? (
                    <span className="flex items-center gap-2 text-destructive">
                      <CircleAlertIcon className="size-4 shrink-0" aria-hidden="true" />
                      We couldn’t send your message. Check your connection and try again.
                    </span>
                  ) : null}
                </p>
              </div>

              <p className="text-caption text-muted-foreground">
                We only use these details to reply to you. No newsletters unless you ask for them.
              </p>
            </FieldGroup>
          </form>
        </div>
      </div>
    </section>
  )
}
