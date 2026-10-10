import { BookOpenIcon, CalendarIcon, ChartColumnIcon, CheckIcon, SparklesIcon, UserPlusIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Message, MessageAvatar, MessageContent, MessageHeader, MessageGroup } from "@/components/ui/message"
import { Spinner } from "@/components/ui/spinner"

export default function MarkerDocs() {
  return (
    <Examples>
      <Example
        title="Status"
        layout="stack"
        description="A single quiet line for what is happening: work in progress, a result, a source that was used. Keep it to three in a row."
        code={`<Marker>
  <MarkerIcon><Spinner /></MarkerIcon>
  <MarkerContent>Reading the tasks in Website relaunch</MarkerContent>
</Marker>`}
      >
        <div className="mx-auto grid w-full max-w-xl gap-3">
          <Marker>
            <MarkerIcon>
              <Spinner className="size-3.5" />
            </MarkerIcon>
            <MarkerContent>Reading the tasks in Website relaunch</MarkerContent>
          </Marker>
          <Marker>
            <MarkerIcon>
              <span className="size-1.5 rounded-full bg-success" />
            </MarkerIcon>
            <MarkerContent>
              Created <strong>18 tasks</strong> in Website relaunch
            </MarkerContent>
          </Marker>
          <Marker>
            <MarkerIcon>
              <BookOpenIcon />
            </MarkerIcon>
            <MarkerContent>
              Based on <a href="#homepage-brief">Homepage brief</a> in Docs
            </MarkerContent>
          </Marker>
        </div>
      </Example>

      <Example
        title="Separator"
        layout="stack"
        description={`variant="separator" centres the text between two hairlines, for dates and hand-offs.`}
        code={`<Marker variant="separator">
  <MarkerContent>Today</MarkerContent>
</Marker>`}
      >
        <div className="mx-auto grid w-full max-w-xl gap-6">
          <Marker variant="separator">
            <MarkerContent>Today</MarkerContent>
          </Marker>
          <Marker variant="separator">
            <MarkerIcon>
              <UserPlusIcon />
            </MarkerIcon>
            <MarkerContent>
              <strong>Sofia Alvarez</strong> joined the conversation
            </MarkerContent>
          </Marker>
        </div>
      </Example>

      <Example
        title="Border"
        layout="stack"
        description={`variant="border" adds a hairline underneath, to close a section such as earlier history.`}
        code={`<Marker variant="border">
  <MarkerContent>Conversation resolved by Priya Raman</MarkerContent>
</Marker>`}
      >
        <div className="mx-auto w-full max-w-xl">
          <Marker variant="border">
            <MarkerIcon>
              <CheckIcon />
            </MarkerIcon>
            <MarkerContent>Conversation resolved by Priya Raman on Oct 6</MarkerContent>
          </Marker>
        </div>
      </Example>

      <Example
        title="In a conversation"
        layout="stack"
        description="Markers sit between messages to show what the assistant did before it answered, without competing with the answer."
      >
        <div className="mx-auto w-full max-w-2xl">
          <MessageGroup>
            <Marker variant="separator">
              <MarkerContent>Today, 14:02</MarkerContent>
            </Marker>
            <Message align="end">
              <MessageContent>
                <Bubble>
                  <BubbleContent>Why is Mobile app 2.0 at risk?</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
            <div className="grid gap-2 pl-10">
              <Marker>
                <MarkerIcon>
                  <CalendarIcon />
                </MarkerIcon>
                <MarkerContent>Checked due dates for 118 tasks in Mobile app 2.0</MarkerContent>
              </Marker>
              <Marker>
                <MarkerIcon>
                  <ChartColumnIcon />
                </MarkerIcon>
                <MarkerContent>Read the workload report for the last 4 weeks</MarkerContent>
              </Marker>
            </div>
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
                    Six tasks are overdue, and five of them wait on Jordan Lee, who has 17 open tasks this week. Move
                    two of the sign-in fixes to another engineer and the project is back on track for Nov 20.
                  </BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          </MessageGroup>
        </div>
      </Example>

      <Guidelines
        do={[
          "Write markers as plain status in the present or past tense: “Checked due dates for 72 tasks”.",
          "Use a spinner while work is in progress and swap it for a check when it finishes.",
          "Use the separator variant for dates and for people joining or leaving.",
        ]}
        dont={[
          "Don’t use markers for errors people must act on; use an alert or a destructive bubble.",
          "Don’t colour marker text; a small status dot is enough.",
          "Don’t stack more than three markers in a row; summarise them.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "variant", type: '"default" | "separator" | "border"', default: '"default"', description: "Marker: a plain line, centred between hairlines, or with a hairline underneath." },
          { prop: "render", type: "ReactElement", description: "Marker: render as another element, such as an li in a list of steps." },
          { prop: "MarkerIcon children", type: "ReactNode", description: "An icon, a Spinner or a status dot. Hidden from screen readers." },
          { prop: "MarkerContent children", type: "ReactNode", description: "The text. <strong> and links are styled for you." },
        ]}
      />
    </Examples>
  )
}
