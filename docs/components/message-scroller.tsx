"use client"

import * as React from "react"
import { ArrowUpIcon, ChartColumnIcon, SparklesIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type Turn =
  | { id: string; role: "user" | "assistant"; text: string }
  | { id: string; role: "marker"; text: string }

const history: Turn[] = [
  {
    id: "t1",
    role: "user",
    text: "What’s left before Website relaunch goes live on Nov 14?",
  },
  {
    id: "t2",
    role: "assistant",
    text: "Fourteen of 52 tasks are still open. One is blocked: “Fix the pricing table on mobile” is waiting on the final plan names from Hana Kim.",
  },
  {
    id: "t3",
    role: "user",
    text: "Who has the most on their plate this week?",
  },
  { id: "t4", role: "marker", text: "Read the workload report" },
  {
    id: "t5",
    role: "assistant",
    text: "Jordan Lee, with 18 open tasks across Website relaunch and Mobile app 2.0. Sofia Alvarez has 9, so she could take the pricing table fix.",
  },
  { id: "t6", role: "user", text: "Move it to Sofia and keep the due date." },
  {
    id: "t7",
    role: "assistant",
    text: "Done. “Fix the pricing table on mobile” is now assigned to Sofia Alvarez and still due Oct 15. I left a comment on the task so Jordan knows.",
  },
  {
    id: "t8",
    role: "user",
    text: "Can you draft the agenda for Monday’s planning meeting?",
  },
  {
    id: "t9",
    role: "assistant",
    text: "It’s in Docs as “Weekly planning, Oct 12”: blocked tasks first, then the launch checklist, then next week’s priorities. It should take about 30 minutes.",
  },
]

const answers = [
  "I added a recurring task, “Review the launch checklist”, every Monday at 10:00 until Nov 14, and assigned it to Maya Patel.",
  "On-time delivery for Website relaunch is 94% this month, up from 88% in September. Most late tasks were waiting on a review.",
  "I created a rule: when a task in Website relaunch moves to Done, Acme notifies its owner. Each run counts towards your 10,000 runs a month.",
]

function Turns({ turns }: { turns: Turn[] }) {
  return turns.map((turn) => (
    <MessageScrollerItem key={turn.id} messageId={turn.id}>
      {turn.role === "marker" ? (
        <Marker className="pl-10">
          <MarkerIcon>
            <ChartColumnIcon />
          </MarkerIcon>
          <MarkerContent>{turn.text}</MarkerContent>
        </Marker>
      ) : turn.role === "user" ? (
        <Message align="end">
          <MessageContent>
            <Bubble>
              <BubbleContent>{turn.text}</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      ) : (
        <Message>
          <MessageAvatar
            className="bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <SparklesIcon />
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>
              <strong>Acme</strong>
            </MessageHeader>
            <Bubble variant="ghost">
              <BubbleContent>{turn.text}</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      )}
    </MessageScrollerItem>
  ))
}

function AskAcme() {
  const [turns, setTurns] = React.useState<Turn[]>(history)
  const [draft, setDraft] = React.useState("")
  const [thinking, setThinking] = React.useState(false)
  const answered = React.useRef(0)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || thinking) return
    const id = `u${Date.now()}`
    setTurns((current) => [...current, { id, role: "user", text }])
    setDraft("")
    setThinking(true)
    timer.current = setTimeout(() => {
      const reply = answers[answered.current % answers.length]
      answered.current += 1
      setTurns((current) => [
        ...current,
        { id: `a${id}`, role: "assistant", text: reply },
      ])
      setThinking(false)
    }, 1200)
  }

  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <div className="mx-auto flex h-[34rem] w-full max-w-2xl flex-col overflow-hidden rounded-(--card-radius) border border-border bg-background">
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
              <SparklesIcon aria-hidden="true" className="size-3.5" />
            </span>
            <p className="text-title text-foreground">Ask Acme</p>
          </div>
          <p className="text-caption text-muted-foreground">Website relaunch</p>
        </div>

        <MessageScroller className="flex-1">
          <MessageScrollerViewport aria-label="Conversation with Acme">
            <MessageScrollerContent className="px-5 py-6">
              <Turns turns={turns} />
              {thinking ? (
                <MessageScrollerItem messageId="thinking">
                  <Marker className="pl-10">
                    <MarkerIcon>
                      <Spinner className="size-3.5" />
                    </MarkerIcon>
                    <MarkerContent>Reading the project plan</MarkerContent>
                  </Marker>
                </MessageScrollerItem>
              ) : null}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>

        <form onSubmit={send} className="shrink-0 border-t border-border p-3">
          <div className="flex items-center gap-2 rounded-(--button-radius) border border-input bg-muted py-1.5 pr-1.5 pl-4 transition-colors duration-(--duration-fast) ease-standard focus-within:bg-background has-focus-visible:focus-ring-inset has-[input:focus-visible]:focus-ring">
            <label htmlFor="ask-acme-scroller" className="sr-only">
              Ask Acme
            </label>
            <input
              id="ask-acme-scroller"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about your projects"
              autoComplete="off"
              className="h-8 min-w-0 flex-1 bg-transparent text-control text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              size="icon-sm"
              aria-label="Send"
              disabled={!draft.trim() || thinking}
            >
              <ArrowUpIcon />
            </Button>
          </div>
        </form>
      </div>
    </MessageScrollerProvider>
  )
}

/** A bordered, fixed-height frame for the smaller examples. */
function ScrollerFrame({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-(--card-radius) border border-border bg-background",
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Opens at the top of the thread, so the newest message is out of view and the
 * jump button shows. The button sits in the footer row rather than over the thread, so
 * it never covers a message: it can live anywhere inside the provider, and
 * bottom-4 centres it in the h-16 row.
 */
function JumpToLatest() {
  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <ScrollerFrame className="h-96">
        <MessageScroller className="flex-1">
          <MessageScrollerViewport aria-label="Earlier conversation with Acme">
            <MessageScrollerContent className="px-5 py-6">
              <Turns turns={history} />
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
        <div className="relative flex h-16 shrink-0 items-center border-t border-border px-5">
          <p className="text-caption text-muted-foreground">
            {history.filter((turn) => turn.role !== "marker").length} messages
          </p>
          <MessageScrollerButton />
        </div>
      </ScrollerFrame>
    </MessageScrollerProvider>
  )
}

const earlier: Turn[] = [
  { id: "e1", role: "user", text: "When is Website relaunch due?" },
  {
    id: "e2",
    role: "assistant",
    text: "Nov 14. Priya Raman leads it, and 38 of 52 tasks are done.",
  },
  {
    id: "e3",
    role: "user",
    text: "Can you move the launch review to the week before?",
  },
  {
    id: "e4",
    role: "assistant",
    text: "Yes. “Book the launch review” is now due Nov 6, and Maya Patel gets a reminder two days before.",
  },
]

/**
 * Older messages load above what people are reading. The viewport keeps
 * their place (preserveScrollOnPrepend), so nothing jumps when history arrives.
 */
function LoadEarlier() {
  const [turns, setTurns] = React.useState<Turn[]>(history.slice(-2))
  const [state, setState] = React.useState<"more" | "loading" | "done">("more")
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  function loadEarlier() {
    setState("loading")
    timer.current = setTimeout(() => {
      setTurns((current) => [...earlier, ...current])
      setState("done")
    }, 1200)
  }

  return (
    <MessageScrollerProvider defaultScrollPosition="end">
      <ScrollerFrame className="h-96">
        <MessageScroller className="flex-1">
          <MessageScrollerViewport
            aria-label="Conversation with Acme, with earlier messages"
            preserveScrollOnPrepend
          >
            <MessageScrollerContent className="px-5 py-6">
              {state !== "done" ? (
                <MessageScrollerItem
                  messageId="earlier"
                  // mb-auto keeps the control at the top and lets a short thread sit at the bottom, as chats do.
                  className="mb-auto flex justify-center"
                >
                  {state === "loading" ? (
                    <Marker>
                      <MarkerIcon>
                        <Spinner className="size-3.5" />
                      </MarkerIcon>
                      <MarkerContent>Loading earlier messages</MarkerContent>
                    </Marker>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={loadEarlier}>
                      Show {earlier.length} Earlier Messages
                    </Button>
                  )}
                </MessageScrollerItem>
              ) : null}
              <Turns turns={turns} />
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </ScrollerFrame>
    </MessageScrollerProvider>
  )
}

export default function MessageScrollerDocs() {
  return (
    <Examples>
      <Example
        title="Ask Acme"
        layout="stack"
        description="Send a question. The conversation follows new messages to the bottom; scroll up and it stays put, and a button appears to jump back to the latest message."
        code={`<MessageScrollerProvider autoScroll defaultScrollPosition="end">
  <MessageScroller className="h-[34rem]">
    <MessageScrollerViewport aria-label="Conversation with Acme">
      <MessageScrollerContent className="px-5 py-6">
        {turns.map((turn) => (
          <MessageScrollerItem key={turn.id} messageId={turn.id}>
            <Message align={turn.role === "user" ? "end" : "start"}>…</Message>
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>`}
      >
        <AskAcme />
      </Example>

      <Example
        title="Jump to latest"
        layout="stack"
        description="This thread opens at its first message, so the newest one is out of view. MessageScrollerButton fades in; choose it to jump to the latest message, and it fades out again. Inside MessageScroller it floats over the bottom of the thread. Here it sits in the footer row instead, so it never covers a message."
        code={`<MessageScrollerProvider defaultScrollPosition="start">
  <MessageScroller className="h-80">
    <MessageScrollerViewport aria-label="Conversation with Acme">…</MessageScrollerViewport>
  </MessageScroller>
  <div className="relative flex h-16 items-center border-t px-5">
    <p className="text-caption text-muted-foreground">8 messages</p>
    <MessageScrollerButton />
  </div>
</MessageScrollerProvider>`}
      >
        <JumpToLatest />
      </Example>

      <Example
        title="Loading earlier messages"
        layout="stack"
        description="Load history above what people are reading. While it loads, a marker with a spinner holds the top; when it arrives, preserveScrollOnPrepend keeps the reading position, so the visible messages don’t move."
        code={`<MessageScrollerViewport preserveScrollOnPrepend>
  <MessageScrollerContent>
    {loading ? (
      <MessageScrollerItem messageId="earlier">
        <Marker>
          <MarkerIcon><Spinner /></MarkerIcon>
          <MarkerContent>Loading earlier messages</MarkerContent>
        </Marker>
      </MessageScrollerItem>
    ) : null}
    {turns.map((turn) => (
      <MessageScrollerItem key={turn.id} messageId={turn.id}>…</MessageScrollerItem>
    ))}
  </MessageScrollerContent>
</MessageScrollerViewport>`}
      >
        <LoadEarlier />
      </Example>

      <Guidelines
        do={[
          "Give the scroller a fixed height, or let it fill a flex column with flex-1.",
          "Set autoScroll so streaming replies stay in view while the person is at the bottom.",
          "Pass a stable messageId to every item so the scroller can keep its place when history loads above.",
          "Label the viewport, such as “Conversation with Acme”.",
        ]}
        dont={[
          "Don’t pull people back to the bottom while they are reading older messages.",
          "Don’t fade the top or bottom edge with a gradient; a hairline header and composer frame the view.",
          "Don’t put the composer inside the scroller; keep it fixed below.",
        ]}
      />

      <ApiTable
        title="MessageScrollerProvider"
        rows={[
          {
            prop: "autoScroll",
            type: "boolean",
            default: "false",
            description: "Follow new content while the viewport is at the end.",
          },
          {
            prop: "defaultScrollPosition",
            type: '"start" | "end" | "last-anchor"',
            default: '"end"',
            description: "Where the viewport starts.",
          },
          {
            prop: "scrollEdgeThreshold",
            type: "number",
            description:
              "Distance in pixels from an edge that still counts as at the edge.",
          },
          {
            prop: "scrollMargin",
            type: "number",
            description: "Space kept above a message when scrolling to it.",
          },
        ]}
      />

      <ApiTable
        title="Parts"
        rows={[
          {
            prop: "messageId",
            type: "string",
            description:
              "MessageScrollerItem: stable id, used by scrollToMessage and visibility tracking.",
          },
          {
            prop: "scrollAnchor",
            type: "boolean",
            default: "false",
            description:
              "MessageScrollerItem: scroll this item to the top when it arrives, for question-and-answer layouts.",
          },
          {
            prop: "preserveScrollOnPrepend",
            type: "boolean",
            default: "true",
            description:
              "MessageScrollerViewport: keep the reading position when older messages load above.",
          },
          {
            prop: "direction",
            type: '"start" | "end"',
            default: '"end"',
            description:
              "MessageScrollerButton: which end to jump to. It fades in only when that end is out of view.",
          },
          {
            prop: "variant / size",
            type: "Button props",
            default: '"outline" / "icon-sm"',
            description: "MessageScrollerButton renders an icon Button.",
          },
          {
            prop: "useMessageScroller()",
            type: "hook",
            description: "scrollToEnd, scrollToStart and scrollToMessage(id).",
          },
        ]}
      />
    </Examples>
  )
}
