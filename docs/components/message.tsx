import { CheckCheckIcon, CopyIcon, RotateCcwIcon, SunIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"

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

function LumenAvatar() {
  return (
    <MessageAvatar className="bg-primary text-primary-foreground" aria-hidden="true">
      <SunIcon />
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
        title="Ask Lumen"
        layout="stack"
        description="A support conversation. The person asking speaks in ink bubbles on the right; Lumen answers in plain text on the canvas, with actions underneath."
        code={`<MessageGroup>
  <Message align="end">
    <MessageContent>
      <Bubble>
        <BubbleContent>My preview deploy for feat/preview-comments failed. What happened?</BubbleContent>
      </Bubble>
    </MessageContent>
  </Message>

  <Message>
    <MessageAvatar><SunIcon /></MessageAvatar>
    <MessageContent>
      <MessageHeader><strong>Lumen</strong></MessageHeader>
      <Bubble variant="ghost">
        <BubbleContent>The build stopped at the install step…</BubbleContent>
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
                  <BubbleContent>My preview deploy for feat/preview-comments failed. What happened?</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>

            <Message>
              <LumenAvatar />
              <MessageContent>
                <MessageHeader>
                  <strong>Lumen</strong>
                </MessageHeader>
                <Bubble variant="ghost">
                  <BubbleContent>
                    <p>
                      The build stopped at the install step. Your branch adds <code>@lumen/comments</code> to
                      package.json but the lockfile was not updated, so pnpm refused to install.
                    </p>
                    <p>
                      Run <code>pnpm install</code> on the branch, commit <code>pnpm-lock.yaml</code> and push. Lumen
                      starts a new preview build as soon as the commit arrives.
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
                  <BubbleContent>Pushed. Will the preview keep the database from the last build?</BubbleContent>
                </Bubble>
                <MessageFooter>
                  <CheckCheckIcon aria-hidden="true" className="size-3.5" />
                  Read 14:08
                </MessageFooter>
              </MessageContent>
            </Message>

            <Message>
              <LumenAvatar />
              <MessageContent>
                <MessageHeader>
                  <strong>Lumen</strong>
                </MessageHeader>
                <Bubble variant="ghost">
                  <BubbleContent>
                    Yes. Each branch keeps its preview database until the branch is merged or deleted, so new builds
                    reuse the same data.
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
    <Avatar size="sm"><AvatarFallback>MO</AvatarFallback></Avatar>
  </MessageAvatar>
  <MessageContent>
    <MessageHeader><strong>Mateo Ortiz</strong> 14:12</MessageHeader>
    <Bubble variant="secondary">…</Bubble>
  </MessageContent>
</Message>`}
      >
        <div className="mx-auto w-full max-w-2xl">
          <MessageGroup>
            <Message>
              <MessageAvatar>
                <Avatar size="sm">
                  <AvatarFallback>MO</AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>
                  <strong>Mateo Ortiz</strong>
                  <span>14:12</span>
                </MessageHeader>
                <BubbleGroup>
                  <Bubble variant="secondary">
                    <BubbleContent>Production is on a41c9e2 now.</BubbleContent>
                  </Bubble>
                  <Bubble variant="secondary">
                    <BubbleContent>Can someone check the redirect on the apex domain before I announce it?</BubbleContent>
                  </Bubble>
                </BubbleGroup>
              </MessageContent>
            </Message>

            <Message align="end">
              <MessageAvatar>
                <Avatar size="sm">
                  <AvatarFallback>PR</AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>
                  <strong>Priya Raman</strong>
                  <span>14:13</span>
                </MessageHeader>
                <Bubble>
                  <BubbleContent>Checked. lumen.app redirects to www with a single 308.</BubbleContent>
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
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <MessageHeader>
                <strong>Aiko Kato</strong>
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
                <AvatarFallback>PR</AvatarFallback>
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
          "Don’t give the assistant a coloured or violet bubble to make it stand out.",
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
