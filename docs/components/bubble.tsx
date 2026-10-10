"use client"

import * as React from "react"
import { CircleAlertIcon, HeartIcon, RotateCcwIcon, ThumbsUpIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Message, MessageContent, MessageFooter } from "@/components/ui/message"

const variants = [
  { variant: "default", text: "Ink, for the person using the app." },
  { variant: "secondary", text: "Secondary, for other people in a thread." },
  { variant: "muted", text: "Muted, for system notes and drafts." },
  { variant: "outline", text: "Outline, for suggestions and quoted text." },
  { variant: "tinted", text: "Tinted, for the one reply you want to highlight." },
  { variant: "destructive", text: "Destructive, for messages that failed to send." },
  { variant: "ghost", text: "Ghost, for the assistant: plain text on the canvas." },
] as const

const suggestions = ["Show the overdue tasks", "Move the due date to Nov 21", "Draft an update for Hana"]

function SuggestedReplies() {
  const [picked, setPicked] = React.useState<string | null>(null)
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <Bubble variant="ghost">
        <BubbleContent>Customer portal is off track: 22 of 64 tasks are done and it is due Oct 23. What would you like to do?</BubbleContent>
      </Bubble>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested replies">
        {suggestions.map((s) => (
          <Bubble key={s} variant="outline">
            <BubbleContent
              render={<button type="button" />}
              aria-pressed={picked === s}
              onClick={() => setPicked(s)}
              className="rounded-(--button-radius) px-4 py-1.5 aria-pressed:border-foreground!"
            >
              {s}
            </BubbleContent>
          </Bubble>
        ))}
      </div>
      {picked ? (
        <Bubble align="end">
          <BubbleContent>{picked}</BubbleContent>
        </Bubble>
      ) : null}
    </div>
  )
}

export default function BubbleDocs() {
  return (
    <Examples>
      <Example
        title="Variants"
        layout="stack"
        description="Ink for you, secondary for other people, ghost for the assistant. Keep tinted for rare emphasis; the accent is not a voice."
        code={`<Bubble><BubbleContent>…</BubbleContent></Bubble>
<Bubble variant="secondary">…</Bubble>
<Bubble variant="muted">…</Bubble>
<Bubble variant="outline">…</Bubble>
<Bubble variant="tinted">…</Bubble>
<Bubble variant="destructive">…</Bubble>
<Bubble variant="ghost">…</Bubble>`}
      >
        <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
          {variants.map((v) => (
            <Bubble key={v.variant} variant={v.variant}>
              <BubbleContent>{v.text}</BubbleContent>
            </Bubble>
          ))}
        </div>
      </Example>

      <Example
        title="Runs"
        layout="stack"
        description="BubbleGroup stacks consecutive bubbles 4px apart. In a Message, the top corner nearest the speaker is tighter, so a run reads as one voice."
        code={`<Message align="end">
  <MessageContent>
    <BubbleGroup>
      <Bubble><BubbleContent>…</BubbleContent></Bubble>
      <Bubble><BubbleContent>…</BubbleContent></Bubble>
    </BubbleGroup>
  </MessageContent>
</Message>`}
      >
        <div className="mx-auto grid w-full max-w-xl gap-6">
          <Message>
            <MessageContent>
              <BubbleGroup>
                <Bubble variant="secondary">
                  <BubbleContent>The homepage copy is approved.</BubbleContent>
                </Bubble>
                <Bubble variant="secondary">
                  <BubbleContent>Hana signed off on the headline and the pricing section at 09:41.</BubbleContent>
                </Bubble>
              </BubbleGroup>
            </MessageContent>
          </Message>
          <Message align="end">
            <MessageContent>
              <BubbleGroup>
                <Bubble>
                  <BubbleContent>Great, thanks.</BubbleContent>
                </Bubble>
                <Bubble>
                  <BubbleContent>Moving the hero copy task to Done now.</BubbleContent>
                </Bubble>
              </BubbleGroup>
            </MessageContent>
          </Message>
        </div>
      </Example>

      <Example
        title="Suggested replies"
        layout="stack"
        description="Render BubbleContent as a button to make it clickable. Outline bubbles shaped like buttons work well for suggestions under an assistant reply."
        code={`<Bubble variant="outline">
  <BubbleContent render={<button type="button" />} onClick={send} className="rounded-(--button-radius)">
    Show the overdue tasks
  </BubbleContent>
</Bubble>`}
      >
        <SuggestedReplies />
      </Example>

      <Example
        title="Reactions"
        layout="stack"
        description="BubbleReactions sits on the bubble’s edge, cut out from it with a ring in the canvas colour. Reactions are for people’s responses; put delivery status such as Seen in the MessageFooter."
        code={`<Bubble variant="secondary" className="mb-4">
  <BubbleContent>…</BubbleContent>
  <BubbleReactions>
    <ThumbsUpIcon /> 3
  </BubbleReactions>
</Bubble>`}
      >
        <div className="mx-auto flex w-full max-w-xl flex-col gap-8 pb-2">
          <Bubble variant="secondary">
            <BubbleContent>Onboarding redesign is done. All 46 tasks closed, two days early.</BubbleContent>
            <BubbleReactions>
              <ThumbsUpIcon aria-hidden="true" />
              <span>3</span>
              <span className="sr-only">people reacted with thumbs up</span>
            </BubbleReactions>
          </Bubble>
          <Message align="end">
            <MessageContent>
              <Bubble align="end">
                <BubbleContent>Nice work. Let’s share what went well at Monday’s planning.</BubbleContent>
                <BubbleReactions align="start">
                  <HeartIcon aria-hidden="true" />
                  <span>2</span>
                  <span className="sr-only">people reacted with a heart</span>
                </BubbleReactions>
              </Bubble>
              {/* Delivery status is not a reaction: it goes in the footer. */}
              <MessageFooter className="pt-1">Seen by Jordan</MessageFooter>
            </MessageContent>
          </Message>
        </div>
      </Example>

      <Example
        title="Failed to send"
        layout="stack"
        description="Say what went wrong in the footer and offer a retry right there."
      >
        <div className="mx-auto w-full max-w-xl">
          <Message align="end">
            <MessageContent>
              <Bubble variant="destructive">
                <BubbleContent>Can you move the Brand refresh review to Thursday?</BubbleContent>
              </Bubble>
              <MessageFooter className="gap-2 text-destructive">
                <CircleAlertIcon aria-hidden="true" className="size-3.5" />
                Not sent. Check your connection.
                <Button size="xs" variant="ghost">
                  <RotateCcwIcon data-icon="inline-start" />
                  Retry
                </Button>
              </MessageFooter>
            </MessageContent>
          </Message>
        </div>
      </Example>

      <Guidelines
        do={[
          "Use the ink bubble for the person using the app and ghost for the assistant.",
          "Keep bubbles short; split long replies into paragraphs inside one bubble.",
          "Render interactive bubbles as buttons or links so they get focus and keyboard support.",
        ]}
        dont={[
          "Don’t draw speech tails, shadows or gradients on bubbles.",
          "Don’t use emoji as decoration; use icons with a text label for reactions.",
          "Don’t mix more than two filled variants in one conversation.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "variant", type: '"default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"', default: '"default"', description: "Bubble: fill and text colour of the content." },
          { prop: "Bubble align", type: '"start" | "end"', default: '"start"', description: "Side to sit on outside a Message. Inside a Message, the Message’s align wins." },
          { prop: "render", type: "ReactElement", description: "BubbleContent: render as a button or link to make the bubble interactive." },
          { prop: "side", type: '"top" | "bottom"', default: '"bottom"', description: "BubbleReactions: which edge the reactions sit on." },
          { prop: "BubbleReactions align", type: '"start" | "end"', default: '"end"', description: "Which corner the reactions sit at." },
        ]}
      />
    </Examples>
  )
}
