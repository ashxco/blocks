"use client"

import * as React from "react"
import { ArrowUpIcon, FileSearchIcon, SunIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Message, MessageAvatar, MessageContent, MessageHeader } from "@/components/ui/message"
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
  { id: "t1", role: "user", text: "How do preview deployments work?" },
  { id: "t2", role: "assistant", text: "Every push to a branch other than main builds a preview. Each preview gets its own URL, which Lumen posts as a comment on the pull request and keeps until the branch is deleted." },
  { id: "t3", role: "user", text: "Can previews use their own database?" },
  { id: "t4", role: "marker", text: "Read Postgres branching in the docs" },
  { id: "t5", role: "assistant", text: "Yes. Turn on Postgres branching in Settings, then Databases. Each preview gets a copy of production, with personal data masked, and the copy is deleted when the branch merges." },
  { id: "t6", role: "user", text: "Do branch databases count towards my storage?" },
  { id: "t7", role: "assistant", text: "Only the data that differs from production counts. A branch that reads but never writes costs almost nothing. You can see storage per branch on the Usage page." },
  { id: "t8", role: "user", text: "And how long does a preview build usually take?" },
  { id: "t9", role: "assistant", text: "Your last ten preview builds for lumen-web took 52 seconds on average. Builds reuse the cache from main, so the first build on a new branch is about as fast as the rest." },
]

const answers = [
  "Lumen keeps every deployment, so you can promote any earlier one to production from the Deployments page. Rolling back takes a few seconds and does not rebuild.",
  "Open the project, then Settings, then Domains, and add the domain. Lumen shows the DNS record to create and issues the certificate as soon as the record resolves.",
  "Build logs are kept for 30 days on the Pro plan and 90 days on Enterprise. You can export them to your own storage from Settings, then Log drains.",
]

function Turns({ turns }: { turns: Turn[] }) {
  return turns.map((turn) => (
    <MessageScrollerItem key={turn.id} messageId={turn.id}>
      {turn.role === "marker" ? (
        <Marker className="pl-10">
          <MarkerIcon>
            <FileSearchIcon />
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
          <MessageAvatar className="bg-primary text-primary-foreground" aria-hidden="true">
            <SunIcon />
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>
              <strong>Lumen</strong>
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

function AskLumen() {
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
      setTurns((current) => [...current, { id: `a${id}`, role: "assistant", text: reply }])
      setThinking(false)
    }, 1200)
  }

  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <div className="mx-auto flex h-[34rem] w-full max-w-2xl flex-col overflow-hidden rounded-(--card-radius) border border-border bg-background">
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
              <SunIcon aria-hidden="true" className="size-3.5" />
            </span>
            <p className="text-title text-foreground">Ask Lumen</p>
          </div>
          <p className="text-caption text-muted-foreground">lumen-web</p>
        </div>

        <MessageScroller className="flex-1">
          <MessageScrollerViewport aria-label="Conversation with Lumen">
            <MessageScrollerContent className="px-5 py-6">
              <Turns turns={turns} />
              {thinking ? (
                <MessageScrollerItem messageId="thinking">
                  <Marker className="pl-10">
                    <MarkerIcon>
                      <Spinner className="size-3.5" />
                    </MarkerIcon>
                    <MarkerContent>Reading your project settings</MarkerContent>
                  </Marker>
                </MessageScrollerItem>
              ) : null}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>

        <form onSubmit={send} className="shrink-0 border-t border-border p-3">
          <div className="flex items-center gap-2 rounded-full border border-input bg-muted py-1.5 pr-1.5 pl-4 transition-colors duration-(--duration-fast) ease-standard focus-within:border-ring focus-within:bg-background has-[input:focus-visible]:focus-ring">
            <label htmlFor="ask-lumen-scroller" className="sr-only">
              Ask Lumen
            </label>
            <input
              id="ask-lumen-scroller"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about your deploys"
              autoComplete="off"
              className="h-8 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-sm"
            />
            <Button type="submit" size="icon-sm" aria-label="Send" disabled={!draft.trim() || thinking}>
              <ArrowUpIcon />
            </Button>
          </div>
        </form>
      </div>
    </MessageScrollerProvider>
  )
}

/** A bordered, fixed-height frame for the smaller examples. */
function ScrollerFrame({ className, children }: { className: string; children: React.ReactNode }) {
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
 * pill shows. The pill sits in the footer row rather than over the thread, so
 * it never covers a message: it can live anywhere inside the provider, and
 * bottom-4 centres it in the h-16 row.
 */
function JumpToLatest() {
  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <ScrollerFrame className="h-96">
        <MessageScroller className="flex-1">
          <MessageScrollerViewport aria-label="Earlier conversation with Lumen">
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
  { id: "e1", role: "user", text: "Which regions does lumen-web run in?" },
  { id: "e2", role: "assistant", text: "Frankfurt, Virginia and Singapore. Requests go to the closest one." },
  { id: "e3", role: "user", text: "Can I pin the database to Frankfurt?" },
  { id: "e4", role: "assistant", text: "Yes. Choose the region when you create the database. It stays there; only the functions move." },
]

/**
 * Older messages load above what people are reading. The viewport keeps
 * their place (preserveScrollOnPrepend), so nothing jumps when history arrives.
 */
function LoadEarlier() {
  const [turns, setTurns] = React.useState<Turn[]>(history.slice(-3))
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
          <MessageScrollerViewport aria-label="Conversation with Lumen, with earlier messages" preserveScrollOnPrepend>
            <MessageScrollerContent className="px-5 py-6">
              {state !== "done" ? (
                <MessageScrollerItem messageId="earlier" className="flex justify-center">
                  {state === "loading" ? (
                    <Marker>
                      <MarkerIcon>
                        <Spinner className="size-3.5" />
                      </MarkerIcon>
                      <MarkerContent>Loading earlier messages</MarkerContent>
                    </Marker>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={loadEarlier}>
                      Show {earlier.length} earlier messages
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
        title="Ask Lumen"
        layout="stack"
        description="Send a question. The conversation follows new messages to the bottom; scroll up and it stays put, and a pill button appears to jump back to the latest message."
        code={`<MessageScrollerProvider autoScroll defaultScrollPosition="end">
  <MessageScroller className="h-[34rem]">
    <MessageScrollerViewport aria-label="Conversation with Lumen">
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
        <AskLumen />
      </Example>

      <Example
        title="Jump to latest"
        layout="stack"
        description="This thread opens at its first message, so the newest one is out of view. MessageScrollerButton fades in; choose it to jump to the latest message, and it fades out again. Inside MessageScroller it floats over the bottom of the thread. Here it sits in the footer row instead, so it never covers a message."
        code={`<MessageScrollerProvider defaultScrollPosition="start">
  <MessageScroller className="h-80">
    <MessageScrollerViewport aria-label="Conversation with Lumen">…</MessageScrollerViewport>
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
          "Label the viewport, such as “Conversation with Lumen”.",
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
          { prop: "autoScroll", type: "boolean", default: "false", description: "Follow new content while the viewport is at the end." },
          { prop: "defaultScrollPosition", type: '"start" | "end" | "last-anchor"', default: '"end"', description: "Where the viewport starts." },
          { prop: "scrollEdgeThreshold", type: "number", description: "Distance in pixels from an edge that still counts as at the edge." },
          { prop: "scrollMargin", type: "number", description: "Space kept above a message when scrolling to it." },
        ]}
      />

      <ApiTable
        title="Parts"
        rows={[
          { prop: "messageId", type: "string", description: "MessageScrollerItem: stable id, used by scrollToMessage and visibility tracking." },
          { prop: "scrollAnchor", type: "boolean", default: "false", description: "MessageScrollerItem: scroll this item to the top when it arrives, for question-and-answer layouts." },
          { prop: "preserveScrollOnPrepend", type: "boolean", default: "true", description: "MessageScrollerViewport: keep the reading position when older messages load above." },
          { prop: "direction", type: '"start" | "end"', default: '"end"', description: "MessageScrollerButton: which end to jump to. It fades in only when that end is out of view." },
          { prop: "variant / size", type: "Button props", default: '"outline" / "icon-sm"', description: "MessageScrollerButton renders a pill icon Button." },
          { prop: "useMessageScroller()", type: "hook", description: "scrollToEnd, scrollToStart and scrollToMessage(id)." },
        ]}
      />
    </Examples>
  )
}
