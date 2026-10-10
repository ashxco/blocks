import { CheckCheckIcon, CopyIcon, RotateCcwIcon, SparklesIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"

function AssistantAvatar() {
  return (
    <MessageAvatar className="bg-primary text-primary-foreground" aria-hidden="true">
      <SparklesIcon />
    </MessageAvatar>
  )
}

function AnswerActions() {
  return (
    <>
      <Button size="icon-xs" variant="ghost" aria-label="Copy answer">
        <CopyIcon />
      </Button>
      <Button size="icon-xs" variant="ghost" aria-label="Helpful">
        <ThumbsUpIcon />
      </Button>
      <Button size="icon-xs" variant="ghost" aria-label="Not helpful">
        <ThumbsDownIcon />
      </Button>
      <Button size="icon-xs" variant="ghost" aria-label="Try again">
        <RotateCcwIcon />
      </Button>
    </>
  )
}

export default function MessageDocs() {
  return (
    <Examples>
      <Example
        title="Ask Acme"
        layout="stack"
        description="A conversation with the assistant built into Acme. The person asking speaks in ink bubbles on the right; the assistant answers in plain text on the canvas, with actions underneath."
        code={`<MessageGroup>
  <Message align="end">
    <MessageContent>
      <Bubble>
        <BubbleContent>Can you plan Website relaunch so we launch on Nov 14?</BubbleContent>
      </Bubble>
    </MessageContent>
  </Message>

  <Message>
    <MessageAvatar><SparklesIcon /></MessageAvatar>
    <MessageContent>
      <MessageHeader><strong>Acme</strong></MessageHeader>
      <Bubble variant="ghost">
        <BubbleContent>Yes. Working back from Nov 14, the work splits into four phases…</BubbleContent>
      </Bubble>
      <MessageFooter>{/* copy, rate, retry */}</MessageFooter>
    </MessageContent>
  </Message>
</MessageGroup>`}
      >
        <div className="mx-auto w-full max-w-2xl">
          <MessageGroup>
            <Message align="end">
              <MessageContent>
                <Bubble>
                  <BubbleContent>Can you plan Website relaunch so we launch on Nov 14?</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>

            <Message>
              <AssistantAvatar />
              <MessageContent>
                <MessageHeader>
                  <strong>Acme</strong>
                </MessageHeader>
                <Bubble variant="ghost">
                  <BubbleContent>
                    <p>
                      Yes. Working back from Nov 14, the work splits into four phases: copy and design until Oct 16,
                      pages until Oct 30, review until Nov 9, then launch prep.
                    </p>
                    <p>
                      The tightest week is Oct 12. Jordan Lee has 17 open tasks then, so I suggest giving “Fix the
                      pricing table on mobile” to Sofia Alvarez. Should I create the tasks and assign them?
                    </p>
                  </BubbleContent>
                </Bubble>
                <MessageFooter className="-ml-1.5">
                  <AnswerActions />
                </MessageFooter>
              </MessageContent>
            </Message>

            <Message align="end">
              <MessageContent>
                <Bubble>
                  <BubbleContent>Yes, create them. Keep Priya on the launch announcement.</BubbleContent>
                </Bubble>
                <MessageFooter>
                  <CheckCheckIcon aria-hidden="true" className="size-3.5" />
                  Read 14:08
                </MessageFooter>
              </MessageContent>
            </Message>

            <Message>
              <AssistantAvatar />
              <MessageContent>
                <MessageHeader>
                  <strong>Acme</strong>
                </MessageHeader>
                <Bubble variant="ghost">
                  <BubbleContent>
                    Done. I created 18 tasks across the four phases and assigned the launch announcement to Priya
                    Raman. They are on the project timeline now.
                  </BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          </MessageGroup>
        </div>
      </Example>

      <Example
        title="Team thread"
        layout="stack"
        description="Between people, every message gets an avatar and a header with the name and time. Other people’s bubbles use the secondary fill."
        code={`<Message>
  <MessageAvatar>
    <Avatar size="sm"><AvatarFallback tone="mint">JL</AvatarFallback></Avatar>
  </MessageAvatar>
  <MessageContent>
    <MessageHeader><strong>Jordan Lee</strong> 14:12</MessageHeader>
    <Bubble variant="secondary">…</Bubble>
  </MessageContent>
</Message>`}
      >
        <div className="mx-auto w-full max-w-2xl">
          <MessageGroup>
            <Message>
              <MessageAvatar>
                <Avatar size="sm">
                  <AvatarFallback tone="mint">JL</AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>
                  <strong>Jordan Lee</strong>
                  <span>14:12</span>
                </MessageHeader>
                <BubbleGroup>
                  <Bubble variant="secondary">
                    <BubbleContent>The pricing page is ready for review.</BubbleContent>
                  </Bubble>
                  <Bubble variant="secondary">
                    <BubbleContent>Can someone check the plan table on a phone before I mark it done?</BubbleContent>
                  </Bubble>
                </BubbleGroup>
              </MessageContent>
            </Message>

            <Message align="end">
              <MessageAvatar>
                <Avatar size="sm">
                  <AvatarFallback tone="violet">MP</AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>
                  <strong>Maya Patel</strong>
                  <span>14:13</span>
                </MessageHeader>
                <Bubble>
                  <BubbleContent>Checked it on two phones. All four plans line up, so mark it done.</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          </MessageGroup>
        </div>
      </Example>

      <Example
        title="Alignment"
        layout="stack"
        description={`align="start" is the default. align="end" mirrors the avatar, header, bubbles and footer for the person using the app.`}
        code={`<Message align="start">…</Message>
<Message align="end">…</Message>`}
      >
        <div className="mx-auto grid w-full max-w-2xl gap-6">
          <Message>
            <MessageAvatar>
              <Avatar size="sm">
                <AvatarFallback tone="rose">SA</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <MessageHeader>
                <strong>Sofia Alvarez</strong>
              </MessageHeader>
              <Bubble variant="secondary">
                <BubbleContent>Starts on the left.</BubbleContent>
              </Bubble>
              <MessageFooter>Delivered</MessageFooter>
            </MessageContent>
          </Message>
          <Message align="end">
            <MessageAvatar>
              <Avatar size="sm">
                <AvatarFallback tone="violet">MP</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <MessageHeader>
                <strong>You</strong>
              </MessageHeader>
              <Bubble>
                <BubbleContent>Ends on the right.</BubbleContent>
              </Bubble>
              <MessageFooter>Read</MessageFooter>
            </MessageContent>
          </Message>
        </div>
      </Example>

      <Guidelines
        do={[
          "Put the person using the app on the right in ink, and everyone else on the left.",
          "Keep the assistant on the canvas with the ghost bubble, so long answers read like text.",
          "Group consecutive messages from one sender under a single avatar and header.",
          "Use the footer for status (Sent, Read) and quiet actions (copy, retry).",
        ]}
        dont={[
          "Don’t give the assistant a coloured or accent bubble to make it stand out.",
          "Don’t repeat the name and time on every bubble in a run.",
          "Don’t put primary buttons in the footer; reply actions belong in the composer.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "align", type: '"start" | "end"', default: '"start"', description: "Message: which side the message sits on. end mirrors the layout." },
          { prop: "MessageAvatar children", type: "ReactNode", description: "An Avatar, or an icon on a round fill." },
          { prop: "MessageHeader children", type: "ReactNode", description: "Wrap the name in <strong> to set it in semibold ink; the rest stays muted." },
          { prop: "className", type: "string", description: "Every part. MessageGroup spaces messages 24px apart." },
        ]}
      />
    </Examples>
  )
}
