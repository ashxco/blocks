import { BookOpenIcon, CheckIcon, FileSearchIcon, GlobeIcon, SunIcon, UserPlusIcon } from "lucide-react"

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
        description="A single quiet line for what is happening: work in progress, a step that finished, a source that was used."
        code={`<Marker>
  <MarkerIcon><Spinner /></MarkerIcon>
  <MarkerContent>Reading the build log for dpl_7d1q</MarkerContent>
</Marker>`}
      >
        <div className="mx-auto grid w-full max-w-xl gap-3">
          <Marker>
            <MarkerIcon>
              <Spinner className="size-3.5" />
            </MarkerIcon>
            <MarkerContent>Reading the build log for dpl_7d1q</MarkerContent>
          </Marker>
          <Marker>
            <MarkerIcon>
              <CheckIcon />
            </MarkerIcon>
            <MarkerContent>Checked DNS for lumen.app</MarkerContent>
          </Marker>
          <Marker>
            <MarkerIcon>
              <span className="size-1.5 rounded-full bg-success" />
            </MarkerIcon>
            <MarkerContent>
              Deployment <strong>dpl_8f2k</strong> is ready
            </MarkerContent>
          </Marker>
          <Marker>
            <MarkerIcon>
              <BookOpenIcon />
            </MarkerIcon>
            <MarkerContent>
              Based on <a href="#preview-deployments">Preview deployments</a> in the docs
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
              <strong>Mateo Ortiz</strong> joined the conversation
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
            <MarkerContent>Conversation resolved by Priya Raman on October 6</MarkerContent>
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
                  <BubbleContent>Why does www.lumen.app show a certificate warning?</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
            <div className="grid gap-2 pl-10">
              <Marker>
                <MarkerIcon>
                  <GlobeIcon />
                </MarkerIcon>
                <MarkerContent>Checked DNS records for www.lumen.app</MarkerContent>
              </Marker>
              <Marker>
                <MarkerIcon>
                  <FileSearchIcon />
                </MarkerIcon>
                <MarkerContent>Read certificate events from the last 24 hours</MarkerContent>
              </Marker>
            </div>
            <Message>
              <MessageAvatar className="bg-primary text-primary-foreground" aria-hidden="true">
                <SunIcon />
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>
                  <strong>Lumen</strong>
                </MessageHeader>
                <Bubble variant="ghost">
                  <BubbleContent>
                    The CNAME for www still points to your old host, so Lumen can’t issue a certificate for it. Change
                    the record to cname.lumen.app. The certificate is issued within a few minutes of the change.
                  </BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          </MessageGroup>
        </div>
      </Example>

      <Guidelines
        do={[
          "Write markers as plain status in the present or past tense: “Checked DNS for lumen.app”.",
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
          { prop: "children", type: "ReactNode", description: "MarkerIcon: an icon, a Spinner or a status dot. Hidden from screen readers." },
          { prop: "children", type: "ReactNode", description: "MarkerContent: the text. <strong> and links are styled for you." },
        ]}
      />
    </Examples>
  )
}
