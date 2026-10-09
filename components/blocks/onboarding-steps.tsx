"use client"

import * as React from "react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Building2Icon,
  CheckIcon,
  GitBranchIcon,
  UserPlusIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

import { OnboardingComplete } from "./onboarding-steps/complete"
import { RepositoryStep, TeamStep, WorkspaceStep, newInvite } from "./onboarding-steps/step-fields"
import {
  EMAIL_PATTERN,
  hasErrors,
  slugify,
  validateStep,
  type OnboardingRepository,
  type OnboardingValues,
  type StepErrors,
} from "./onboarding-steps/types"

export type {
  GitProvider,
  InviteRole,
  OnboardingInvite,
  OnboardingRepository,
  OnboardingValues,
} from "./onboarding-steps/types"

export interface OnboardingStepsProps {
  /** Step to open on: 0 workspace, 1 team, 2 repository. */
  defaultStep?: 0 | 1 | 2
  /** Prefill any answers, for example from an invite or a sign-up form. */
  defaultValues?: Partial<OnboardingValues>
  /** Host shown before the workspace slug. */
  domain?: string
  /** Repositories offered in the last step. */
  repositories?: OnboardingRepository[]
  /** Git account shown as connected in the last step. */
  account?: string
  /** Where “Open dashboard” leads from the completion state. */
  dashboardHref?: string
  /** Called with the answers when people finish. */
  onComplete?: (values: OnboardingValues) => void | Promise<void>
  className?: string
}

interface StepMeta {
  title: string
  /** Name in the compact step row on narrow containers. */
  short: string
  /** One line under the title in the step panel. */
  hint: string
  description: string
  icon: LucideIcon
}

const STEPS: StepMeta[] = [
  {
    title: "Name your workspace",
    short: "Workspace",
    hint: "A name and a URL for your team.",
    description: "Your workspace holds projects, domains and the people who ship them.",
    icon: Building2Icon,
  },
  {
    title: "Invite your team",
    short: "Team",
    hint: "Invite by email or share a link.",
    description: "Teammates can review previews, read logs and promote deployments to production.",
    icon: UserPlusIcon,
  },
  {
    title: "Connect a repository",
    short: "Repository",
    hint: "Choose the code Lumen deploys.",
    description: "Pick the code Lumen should deploy. Every push after this builds automatically.",
    icon: GitBranchIcon,
  },
]

const defaultRepositories: OnboardingRepository[] = [
  { id: "halcyon/web", name: "halcyon/web", framework: "Next.js", updated: "2 hours ago" },
  { id: "halcyon/api", name: "halcyon/api", framework: "Node.js", updated: "yesterday", private: true },
  { id: "halcyon/docs", name: "halcyon/docs", framework: "Astro", updated: "3 days ago" },
  { id: "halcyon/dashboard", name: "halcyon/dashboard", framework: "Vite", updated: "last week", private: true },
  { id: "halcyon/marketing", name: "halcyon/marketing", framework: "Remix", updated: "2 weeks ago" },
]

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function OnboardingSteps({
  defaultStep = 0,
  defaultValues,
  domain = "lumen.app",
  repositories = defaultRepositories,
  account = "maya-chen",
  dashboardHref = "/live/app",
  onComplete,
  className,
}: OnboardingStepsProps) {
  const idPrefix = React.useId()
  const [step, setStep] = React.useState<number>(defaultStep)
  const [furthest, setFurthest] = React.useState<number>(defaultStep)
  const [done, setDone] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [attempted, setAttempted] = React.useState<Record<number, boolean>>({})
  const [invitesSent, setInvitesSent] = React.useState(0)
  const [slugEdited, setSlugEdited] = React.useState(Boolean(defaultValues?.workspaceSlug))
  const [values, setValues] = React.useState<OnboardingValues>(() => {
    const name = defaultValues?.workspaceName ?? ""
    return {
      workspaceName: name,
      workspaceSlug: defaultValues?.workspaceSlug ?? slugify(name),
      invites: defaultValues?.invites?.length
        ? defaultValues.invites
        : [
            { id: "invite-first", email: "", role: "developer" },
            { id: "invite-second", email: "", role: "developer" },
          ],
      provider: defaultValues?.provider ?? "github",
      repositoryId: defaultValues?.repositoryId ?? null,
    }
  })

  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const stepChanged = React.useRef(false)
  React.useEffect(() => {
    if (!stepChanged.current) return
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  const errors: StepErrors = attempted[step] ? validateStep(step, values, domain) : {}
  const current = STEPS[step]
  const validInvites = values.invites.filter((i) => EMAIL_PATTERN.test(i.email.trim())).length
  const progress = done ? 100 : ((step + 1) / STEPS.length) * 100

  function goTo(next: number) {
    stepChanged.current = true
    setStep(next)
    setFurthest((f) => Math.max(f, next))
  }

  function focusFirstError(errs: StepErrors) {
    let target: HTMLElement | null = null
    if (errs.workspaceName) target = document.getElementById(`${idPrefix}-name`)
    else if (errs.workspaceSlug) target = document.getElementById(`${idPrefix}-slug`)
    else if (errs.invites) {
      const first = values.invites.find((i) => errs.invites?.[i.id])
      if (first) target = document.getElementById(`${idPrefix}-invite-${first.id}`)
    } else if (errs.repositoryId)
      target = document.getElementById(`${idPrefix}-repos`)?.querySelector<HTMLElement>('[role="radio"]') ?? null
    target?.focus()
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const errs = validateStep(step, values, domain)
    if (hasErrors(errs)) {
      setAttempted((a) => ({ ...a, [step]: true }))
      focusFirstError(errs)
      return
    }
    if (step === 1) {
      setInvitesSent(validInvites)
      if (validInvites)
        toast.add({
          title: validInvites === 1 ? "Invite sent" : `${validInvites} invites sent`,
          description: "Teammates get an email with a link to join.",
        })
    }
    if (step < STEPS.length - 1) {
      goTo(step + 1)
      return
    }
    setPending(true)
    try {
      await (onComplete ? onComplete(values) : wait(700))
      setDone(true)
    } finally {
      setPending(false)
    }
  }

  function skipInvites() {
    setInvitesSent(0)
    setAttempted((a) => ({ ...a, 1: false }))
    goTo(2)
  }

  const submitLabel =
    step === 0
      ? "Continue"
      : step === 1
        ? validInvites
          ? `Send ${validInvites} ${validInvites === 1 ? "invite" : "invites"}`
          : "Continue"
        : "Finish setup"

  return (
    <div data-slot="onboarding-steps" className={cn("@container", className)}>
      {done ? (
        <OnboardingComplete
          values={values}
          invitesSent={invitesSent}
          repository={repositories.find((r) => r.id === values.repositoryId)}
          domain={domain}
          dashboardHref={dashboardHref}
          onEdit={() => {
            setDone(false)
            goTo(0)
          }}
        />
      ) : (
        <div className="grid gap-8 @narrow:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] @narrow:gap-12 @page:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] @page:gap-20">
          {/* Step list: a dark panel on wide containers */}
          <aside className="hidden flex-col rounded-(--panel-radius) bg-panel p-8 text-panel-muted @narrow:flex">
            <p className="text-title text-panel-foreground">Set up Lumen</p>
            <p className="mt-2 text-sm">Three short steps. You can change any of this later in settings.</p>
            <ol className="mt-10 grid gap-1">
              {STEPS.map((s, i) => {
                const complete = i !== step && i < furthest
                const active = i === step
                const Icon = complete ? CheckIcon : s.icon
                return (
                  <li key={s.title}>
                    <button
                      type="button"
                      disabled={i > furthest || active}
                      aria-current={active ? "step" : undefined}
                      onClick={() => goTo(i)}
                      className={cn(
                        "relative flex w-full items-start gap-4 rounded-(--control-radius) border border-transparent p-4 text-left outline-none",
                        "transition-colors duration-(--duration-fast) focus-visible:focus-ring",
                        active
                          ? "border-panel-border bg-panel-raised before:absolute before:inset-y-4 before:left-0 before:w-0.5 before:rounded-full before:bg-brand"
                          : "enabled:hover:bg-panel-raised"
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-full border",
                          complete && "border-transparent bg-panel-foreground text-panel",
                          active && "border-panel-foreground/50 text-panel-foreground",
                          !complete && !active && "border-panel-border text-panel-muted"
                        )}
                      >
                        <Icon className="size-4" strokeWidth={complete ? 2.5 : 2} aria-hidden="true" />
                      </span>
                      <span className="grid gap-1">
                        <span className={`text-label ${active || complete ? "text-panel-foreground" : "text-panel-muted"}`}>
                          {s.title}
                        </span>
                        <span className="text-caption text-panel-muted">{s.hint}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
            <div className="mt-auto grid gap-1 border-t border-panel-border pt-6">
              <p className="text-caption">Your workspace</p>
              <p className="truncate font-mono text-sm text-panel-foreground">
                {domain}/{values.workspaceSlug || "your-team"}
              </p>
            </div>
          </aside>

          {/* Current step */}
          <div className="min-w-0 @narrow:py-2">
            <Progress
              value={progress}
              aria-label="Setup progress"
              getAriaValueText={() => `${current.title}, step ${step + 1} of ${STEPS.length}`}
            />
            <ol className="mt-4 flex flex-wrap gap-x-5 gap-y-1 @narrow:hidden">
              {STEPS.map((s, i) => (
                <li
                  key={s.short}
                  aria-current={i === step ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 text-sm",
                    i === step ? "font-semibold text-foreground" : i < step ? "text-copy" : "text-muted-foreground"
                  )}
                >
                  {i < step ? <CheckIcon className="size-3.5 text-success" strokeWidth={2.5} aria-hidden="true" /> : null}
                  {s.short}
                </li>
              ))}
            </ol>

            <form noValidate onSubmit={handleSubmit} className="mt-10 @narrow:mt-12">
              <div
                key={step}
                className="animate-in duration-(--duration-base) ease-out fade-in-0 slide-in-from-bottom-1"
              >
                <header className="grid gap-3">
                  <h2 ref={headingRef} tabIndex={-1} className="text-h2 text-foreground outline-none">
                    {current.title}
                  </h2>
                  <p className="max-w-prose text-lead text-copy">{current.description}</p>
                </header>
                <div className="mt-8">
                  {step === 0 ? (
                    <WorkspaceStep
                      idPrefix={idPrefix}
                      values={values}
                      errors={errors}
                      domain={domain}
                      onNameChange={(name) =>
                        setValues((v) => ({
                          ...v,
                          workspaceName: name,
                          workspaceSlug: slugEdited ? v.workspaceSlug : slugify(name),
                        }))
                      }
                      onSlugChange={(slug) => {
                        setSlugEdited(true)
                        setValues((v) => ({ ...v, workspaceSlug: slug.toLowerCase().replace(/\s+/g, "-") }))
                      }}
                    />
                  ) : step === 1 ? (
                    <TeamStep
                      idPrefix={idPrefix}
                      values={values}
                      errors={errors}
                      domain={domain}
                      onInvitesChange={(invites) =>
                        setValues((v) => ({ ...v, invites: invites.length ? invites : [newInvite()] }))
                      }
                    />
                  ) : (
                    <RepositoryStep
                      idPrefix={idPrefix}
                      values={values}
                      errors={errors}
                      domain={domain}
                      repositories={repositories}
                      account={account}
                      onProviderChange={(provider) => setValues((v) => ({ ...v, provider }))}
                      onRepositoryChange={(repositoryId) => setValues((v) => ({ ...v, repositoryId }))}
                    />
                  )}
                </div>
              </div>

              <footer className="mt-10 flex flex-wrap items-center gap-3 border-t pt-6">
                {step > 0 ? (
                  <Button type="button" variant="ghost" className="-ml-4" onClick={() => goTo(step - 1)} disabled={pending}>
                    <ArrowLeftIcon data-icon="inline-start" />
                    Back
                  </Button>
                ) : null}
                <div className="ml-auto flex flex-wrap items-center gap-3">
                  {step === 1 ? (
                    <Button type="button" variant="link" className="text-copy hover:text-foreground" onClick={skipInvites}>
                      Skip for now
                    </Button>
                  ) : null}
                  <Button type="submit" disabled={pending}>
                    {pending ? <Spinner data-icon="inline-start" /> : null}
                    {pending ? "Setting up" : submitLabel}
                    {pending || step === STEPS.length - 1 ? null : <ArrowRightIcon data-icon="inline-end" />}
                  </Button>
                </div>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
