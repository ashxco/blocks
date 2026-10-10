"use client"

import * as React from "react"
import { CheckIcon, SparklesIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Message, MessageAvatar, MessageContent, MessageHeader, MessageGroup } from "@/components/ui/message"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

const templates = [
  { value: "roadmap", label: "Product roadmap", hint: "Features by quarter, on a timeline" },
  { value: "marketing", label: "Marketing calendar", hint: "Campaigns, launches and content by date" },
  { value: "clients", label: "Client projects", hint: "A board per client, with shared tasks and files" },
  { value: "sprints", label: "Sprint planning", hint: "Two-week sprints with a backlog and a board" },
]

const integrations = [
  { value: "slack", label: "Slack" },
  { value: "drive", label: "Google Drive" },
  { value: "github", label: "GitHub" },
  { value: "figma", label: "Figma" },
]

/*
 * Root.items lists the questions up front, so the server renders the first
 * question, the progress bar and the buttons instead of an empty form.
 */
const onboardingItems = [
  { name: "template", required: true, choices: templates.map(({ value }) => ({ value })) },
  { name: "integrations", choices: integrations.map(({ value }) => ({ value })) },
  { name: "workspace", required: true },
]

const where = ["Design reviews", "Engineering tasks", "Testing"]
const when = ["Since the last sprint", "Since the project started"]
const chatItems = [
  { name: "where", required: true, choices: where.map((value) => ({ value })) },
  { name: "when", required: true, choices: when.map((value) => ({ value })) },
]

function Onboarding() {
  const [summary, setSummary] = React.useState<string[] | null>(null)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const template = templates.find((t) => t.value === data.get("template"))?.label ?? "Not set"
    const picked = data
      .getAll("integrations")
      .map((v) => integrations.find((i) => i.value === v)?.label ?? String(v))
    setSummary([
      `Workspace: ${String(data.get("workspace") ?? "")}`,
      `First project: ${template}`,
      `Connected: ${picked.length ? picked.join(", ") : "Nothing yet"}`,
    ])
  }

  if (summary) {
    return (
      <div className="mx-auto grid w-full max-w-lg gap-5">
        <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
          <CheckIcon aria-hidden="true" className="size-5" strokeWidth={2.5} />
        </span>
        <div className="grid gap-2">
          <p className="text-h4 text-foreground">Your workspace is ready</p>
          <ul className="grid gap-1 text-sm text-copy">
            {summary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <Button variant="outline" onClick={() => setSummary(null)}>
            Start Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Questionnaire
      items={onboardingItems}
      shortcuts="letters"
      onSubmit={submit}
      className="mx-auto max-w-lg"
      aria-label="Set up your workspace"
    >
      <QuestionnaireProgress />

      <QuestionnaireItem name="template" required>
        <QuestionnaireTitle>What will your team plan first?</QuestionnaireTitle>
        <QuestionnaireDescription>We’ll start your first project from it.</QuestionnaireDescription>
        <QuestionnaireChoices>
          {templates.map((t) => (
            <QuestionnaireChoice key={t.value} value={t.value}>
              {t.label}
              <QuestionnaireChoiceDescription>{t.hint}</QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="integrations" multiple>
        <QuestionnaireTitle>Which tools should Acme connect to?</QuestionnaireTitle>
        <QuestionnaireDescription>Pick any that apply, or skip and add them later.</QuestionnaireDescription>
        <QuestionnaireChoices>
          {integrations.map((i) => (
            <QuestionnaireChoice key={i.value} value={i.value}>
              {i.label}
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
      </QuestionnaireItem>

      <QuestionnaireItem name="workspace" required>
        <QuestionnaireTitle>What should we call your workspace?</QuestionnaireTitle>
        <QuestionnaireDescription>It appears in your workspace URL, such as app.acme.com/northwind.</QuestionnaireDescription>
        <QuestionnaireInput placeholder="Northwind" autoComplete="organization" />
        <QuestionnaireError>Enter a workspace name to finish.</QuestionnaireError>
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Create workspace</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

function InChat() {
  const [answer, setAnswer] = React.useState<string | null>(null)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const where = String(data.get("where") ?? "")
    const when = String(data.get("when") ?? "")
    setAnswer(`${where}, ${when.toLowerCase()}`)
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <MessageGroup>
        <Message align="end">
          <MessageContent>
            <Bubble>
              <BubbleContent>Mobile app 2.0 keeps slipping.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message>
          <MessageAvatar className="bg-primary text-primary-foreground" aria-hidden="true">
            <SparklesIcon />
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>
              <strong>Acme</strong>
            </MessageHeader>
            <Bubble variant="ghost">
              <BubbleContent>Two quick questions so I can look in the right place.</BubbleContent>
            </Bubble>
            {answer ? null : (
              <div className="w-full rounded-(--card-radius) border border-border p-5">
                <Questionnaire
                  items={chatItems}
                  shortcuts="numbers"
                  onSubmit={submit}
                  aria-label="Find out what is slipping"
                  className="gap-5"
                >
                  <QuestionnaireProgress />
                  <QuestionnaireItem name="where" required>
                    <QuestionnaireTitle size="sm">Which work slips most?</QuestionnaireTitle>
                    <QuestionnaireChoices>
                      {where.map((value) => (
                        <QuestionnaireChoice key={value} value={value}>
                          {value}
                        </QuestionnaireChoice>
                      ))}
                    </QuestionnaireChoices>
                    <QuestionnaireError />
                  </QuestionnaireItem>
                  <QuestionnaireItem name="when" required>
                    <QuestionnaireTitle size="sm">When did it start?</QuestionnaireTitle>
                    <QuestionnaireChoices>
                      {when.map((value) => (
                        <QuestionnaireChoice key={value} value={value}>
                          {value}
                        </QuestionnaireChoice>
                      ))}
                    </QuestionnaireChoices>
                    <QuestionnaireError />
                  </QuestionnaireItem>
                  <QuestionnaireActions>
                    <QuestionnairePrevious size="sm" />
                    <QuestionnaireNext size="sm" />
                    <QuestionnaireSubmit size="sm">Send answers</QuestionnaireSubmit>
                  </QuestionnaireActions>
                </Questionnaire>
              </div>
            )}
          </MessageContent>
        </Message>
        {answer ? (
          <>
            <Message align="end">
              <MessageContent>
                <Bubble>
                  <BubbleContent>{answer}</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
            <Message>
              <MessageAvatar className="bg-primary text-primary-foreground" aria-hidden="true">
                <SparklesIcon />
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>
                  <strong>Acme</strong>
                </MessageHeader>
                <Bubble variant="ghost">
                  <BubbleContent>
                    Thanks. Since Sep 28, tasks in Mobile app 2.0 have taken 5.1 days on average, up from 3.2. Most
                    of them wait for a review from Jordan Lee. I can show the slow tasks or suggest a second reviewer.
                  </BubbleContent>
                </Bubble>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    Show Slow Tasks
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setAnswer(null)}>
                    Answer Again
                  </Button>
                </div>
              </MessageContent>
            </Message>
          </>
        ) : null}
      </MessageGroup>
    </div>
  )
}

export default function QuestionnaireDocs() {
  return (
    <Examples>
      <Example
        title="Set up a workspace"
        layout="stack"
        minHeight="min-h-112"
        description="One question at a time. Press a letter to pick a choice, Enter to continue and the arrow keys to move. Required questions explain what is missing; optional ones can be skipped."
        code={`<Questionnaire shortcuts="letters" onSubmit={submit}>
  <QuestionnaireProgress />
  <QuestionnaireItem name="template" required>
    <QuestionnaireTitle>What will your team plan first?</QuestionnaireTitle>
    <QuestionnaireDescription>We’ll start your first project from it.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="roadmap">
        Product roadmap
        <QuestionnaireChoiceDescription>Features by quarter, on a timeline</QuestionnaireChoiceDescription>
      </QuestionnaireChoice>
      …
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>

  <QuestionnaireItem name="integrations" multiple>…</QuestionnaireItem>

  <QuestionnaireItem name="workspace" required>
    <QuestionnaireTitle>What should we call your workspace?</QuestionnaireTitle>
    <QuestionnaireInput placeholder="Northwind" />
    <QuestionnaireError>Enter a workspace name to finish.</QuestionnaireError>
  </QuestionnaireItem>

  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireSkip />
    <QuestionnaireNext />
    <QuestionnaireSubmit>Create workspace</QuestionnaireSubmit>
  </QuestionnaireActions>
</Questionnaire>`}
      >
        <Onboarding />
      </Example>

      <Example
        title="In a conversation"
        layout="stack"
        minHeight="min-h-112"
        description="A short questionnaire inside an assistant reply. Use the title role and small buttons so it sits quietly in the thread; the answers come back as the person’s own message."
        code={`<Message>
  <MessageAvatar><SparklesIcon /></MessageAvatar>
  <MessageContent>
    <Bubble variant="ghost"><BubbleContent>Two quick questions…</BubbleContent></Bubble>
    <div className="rounded-(--card-radius) border p-5">
      <Questionnaire shortcuts="numbers" onSubmit={submit}>
        <QuestionnaireProgress />
        <QuestionnaireItem name="where" required>
          <QuestionnaireTitle size="sm">Which work slips most?</QuestionnaireTitle>
          …
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious size="sm" />
          <QuestionnaireNext size="sm" />
          <QuestionnaireSubmit size="sm">Send answers</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  </MessageContent>
</Message>`}
      >
        <InChat />
      </Example>

      <Example
        title="Choice states"
        minHeight="min-h-80"
        description="Rows darken on hover and take an ink edge and a filled indicator when picked. Disabled choices fade; an invalid question edges its choices in the destructive colour and explains what is missing."
        code={`<QuestionnaireChoice value="board" defaultChecked>Board</QuestionnaireChoice>
<QuestionnaireChoice value="timeline" disabled>Timeline</QuestionnaireChoice>

<QuestionnaireItem name="alerts" multiple required invalid>
  …
  <QuestionnaireError>Pick at least one place to send task alerts.</QuestionnaireError>
</QuestionnaireItem>`}
      >
        <div className="grid w-full gap-8 md:grid-cols-2">
          <Questionnaire
            items={[{ name: "default-view", choices: [{ value: "board" }, { value: "list" }, { value: "timeline", disabled: true }] }]}
            aria-label="Default view"
          >
            <QuestionnaireItem name="default-view">
              <QuestionnaireTitle size="sm">Default view</QuestionnaireTitle>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="board" defaultChecked>
                  Board
                  <QuestionnaireChoiceDescription>Columns by status, for day-to-day work</QuestionnaireChoiceDescription>
                </QuestionnaireChoice>
                <QuestionnaireChoice value="list">
                  List
                  <QuestionnaireChoiceDescription>Every task in one table</QuestionnaireChoiceDescription>
                </QuestionnaireChoice>
                <QuestionnaireChoice value="timeline" disabled>
                  Timeline
                  <QuestionnaireChoiceDescription>Add start dates to tasks to use it</QuestionnaireChoiceDescription>
                </QuestionnaireChoice>
              </QuestionnaireChoices>
            </QuestionnaireItem>
          </Questionnaire>
          <Questionnaire
            items={[{ name: "alerts", required: true, choices: [{ value: "email" }, { value: "slack" }, { value: "mobile" }] }]}
            aria-label="Task alerts"
          >
            <QuestionnaireItem name="alerts" multiple required invalid>
              <QuestionnaireTitle size="sm">Send task alerts to</QuestionnaireTitle>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="email">Email</QuestionnaireChoice>
                <QuestionnaireChoice value="slack">Slack</QuestionnaireChoice>
                <QuestionnaireChoice value="mobile">The Acme mobile app</QuestionnaireChoice>
              </QuestionnaireChoices>
              <QuestionnaireError>Pick at least one place to send task alerts.</QuestionnaireError>
            </QuestionnaireItem>
          </Questionnaire>
        </div>
      </Example>

      <Guidelines
        do={[
          "Ask one clear question per step, and keep the whole flow under five steps.",
          "Write choices people can scan: a short label, with a one-line description only when it helps.",
          "Mark questions required only when you can’t continue without the answer, and say what is missing.",
          "End with a submit button that says what happens, such as “Create workspace”.",
        ]}
        dont={[
          "Don’t print “Step 2 of 4” above the question; the progress bar already shows it.",
          "Don’t use a questionnaire for a form people fill in once and review; use fields on one page.",
          "Don’t colour choices; picked choices get an ink edge and a filled indicator.",
        ]}
      />

      <ApiTable
        title="Questionnaire"
        rows={[
          { prop: "shortcuts", type: '"letters" | "numbers"', description: "Let people pick choices with A, B, C… or 1, 2, 3…, shown as keycaps." },
          { prop: "onSubmit", type: "(event: FormEvent) => void", description: "Runs when every required question has an answer. Read the answers with FormData." },
          { prop: "defaultItem / item", type: "string", description: "The question shown first, or the controlled current question." },
          { prop: "onItemChange", type: "(item: string) => void", description: "Called when the current question changes." },
          { prop: "items", type: "QuestionnaireItemDefinition[]", description: "The questions and their choice values. Pass it so the server renders the first question, the progress bar and the buttons, and so shortcuts stay stable when choices render conditionally." },
        ]}
      />

      <ApiTable
        title="Parts"
        rows={[
          { prop: "name", type: "string", description: "QuestionnaireItem: the field name in the submitted form data." },
          { prop: "required", type: "boolean", default: "false", description: "QuestionnaireItem: hides Skip and blocks Continue until answered." },
          { prop: "multiple", type: "boolean", default: "false", description: "QuestionnaireItem: checkboxes instead of radios." },
          { prop: "value", type: "string", description: "QuestionnaireChoice: the submitted value." },
          { prop: "invalid", type: "boolean", default: "false", description: "QuestionnaireItem: show the error and edge the choices in the destructive colour, for server-side validation." },
          { prop: "size", type: '"default" | "sm"', default: '"default"', description: "QuestionnaireTitle: h4 by default; sm uses the title role, for questionnaires inside a conversation." },
          { prop: "variant", type: '"bar" | "text"', default: '"bar"', description: "QuestionnaireProgress: hairline segments, or a text count for dense layouts. Never set the count above the title." },
          { prop: "size / variant", type: "Button props", default: '"default"', description: "QuestionnairePrevious, Skip, Next and Submit are styled as Buttons. Back and Skip are ghost, Continue and Submit are ink." },
        ]}
      />
    </Examples>
  )
}
