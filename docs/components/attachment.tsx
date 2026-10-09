"use client"

import * as React from "react"
import {
  ArrowUpIcon,
  CircleAlertIcon,
  DownloadIcon,
  FileCodeIcon,
  FileTextIcon,
  ImageIcon,
  PaperclipIcon,
  RotateCcwIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type Draft = { id: string; name: string; meta: string; kind: "text" | "code" | "image" }

const initialDrafts: Draft[] = [
  { id: "a1", name: "build-log-dpl_7d1q.txt", meta: "Text · 18 KB", kind: "text" },
  { id: "a2", name: "lumen.json", meta: "JSON · 1 KB", kind: "code" },
  { id: "a3", name: "preview-error.png", meta: "PNG · 412 KB", kind: "image" },
]

function DraftIcon({ kind }: { kind: Draft["kind"] }) {
  if (kind === "code") return <FileCodeIcon />
  if (kind === "image") return <ImageIcon />
  return <FileTextIcon />
}

function Composer() {
  const [drafts, setDrafts] = React.useState(initialDrafts)
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-2 rounded-(--card-radius) border border-border bg-background p-2 transition-colors duration-(--duration-fast) ease-standard focus-within:border-ring has-[textarea:focus-visible]:focus-ring">
      {drafts.length > 0 ? (
        <AttachmentGroup aria-label="Attached files">
          {drafts.map((d) => (
            <Attachment key={d.id} size="sm">
              <AttachmentMedia>
                <DraftIcon kind={d.kind} />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{d.name}</AttachmentTitle>
                <AttachmentDescription>{d.meta}</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction
                  aria-label={`Remove ${d.name}`}
                  onClick={() => setDrafts((current) => current.filter((x) => x.id !== d.id))}
                >
                  <XIcon />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          ))}
        </AttachmentGroup>
      ) : null}
      <label htmlFor="ask-lumen" className="sr-only">
        Ask Lumen
      </label>
      <textarea
        id="ask-lumen"
        rows={2}
        placeholder="Ask about a deploy, a domain or your usage"
        className="w-full resize-none bg-transparent px-2 py-1.5 text-base/6 text-foreground outline-none placeholder:text-muted-foreground sm:text-sm/6"
      />
      <div className="flex items-center justify-between gap-2">
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Attach files"
          onClick={() => setDrafts(initialDrafts)}
        >
          <PaperclipIcon />
        </Button>
        <Button size="icon-sm" aria-label="Send">
          <ArrowUpIcon />
        </Button>
      </div>
    </div>
  )
}

export default function AttachmentDocs() {
  return (
    <Examples>
      <Example
        title="In a composer"
        layout="stack"
        description="Files waiting to be sent sit above the message box as a scrolling row of small cards, each with a way to remove it."
        code={`<AttachmentGroup>
  <Attachment size="sm">
    <AttachmentMedia><FileTextIcon /></AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>build-log-dpl_7d1q.txt</AttachmentTitle>
      <AttachmentDescription>Text · 18 KB</AttachmentDescription>
    </AttachmentContent>
    <AttachmentActions>
      <AttachmentAction aria-label="Remove build-log-dpl_7d1q.txt"><XIcon /></AttachmentAction>
    </AttachmentActions>
  </Attachment>
</AttachmentGroup>`}
      >
        <Composer />
      </Example>

      <Example
        title="States"
        layout="stack"
        description="Idle is a dashed drop target. Uploading and Processing pulse the title. Error says what went wrong in the description. Done is the resting card."
        code={`<Attachment state="idle">…</Attachment>
<Attachment state="uploading">…</Attachment>
<Attachment state="processing">…</Attachment>
<Attachment state="error">…</Attachment>
<Attachment state="done">…</Attachment>`}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Attachment state="idle" className="w-full">
            <AttachmentMedia>
              <UploadIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>Add a file</AttachmentTitle>
              <AttachmentDescription>Drop it here or browse, up to 25 MB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Attachment state="uploading" className="w-full">
            <AttachmentMedia>
              <Spinner />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>database-dump.sql</AttachmentTitle>
              <AttachmentDescription>Uploading · 64% of 18.2 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Cancel upload">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="processing" className="w-full">
            <AttachmentMedia>
              <Spinner />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>preview-error.png</AttachmentTitle>
              <AttachmentDescription>Scanning for secrets</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Attachment state="error" className="w-full">
            <AttachmentMedia>
              <CircleAlertIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>full-backup.tar.gz</AttachmentTitle>
              <AttachmentDescription>Too large. Files must be under 25 MB.</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Try again">
                <RotateCcwIcon />
              </AttachmentAction>
              <AttachmentAction aria-label="Remove full-backup.tar.gz">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="done" className="w-full">
            <AttachmentMedia>
              <FileCodeIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>lumen.json</AttachmentTitle>
              <AttachmentDescription>JSON · 1 KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove lumen.json">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </div>
      </Example>

      <Example
        title="Sizes"
        description="Default for messages, sm for composers, xs for dense lists and inline references."
        code={`<Attachment>…</Attachment>
<Attachment size="sm">…</Attachment>
<Attachment size="xs">…</Attachment>`}
      >
        {(["default", "sm", "xs"] as const).map((size) => (
          <Attachment key={size} size={size}>
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>runbook.md</AttachmentTitle>
              {size !== "xs" ? <AttachmentDescription>Markdown · 6 KB</AttachmentDescription> : null}
            </AttachmentContent>
          </Attachment>
        ))}
      </Example>

      <Example
        title="Thumbnails"
        description={`orientation="vertical" puts the media on top, for images. Image media dims while it uploads.`}
        code={`<Attachment orientation="vertical">
  <AttachmentMedia variant="image">
    <img src={url} alt="" />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>dashboard.png</AttachmentTitle>
  </AttachmentContent>
</Attachment>`}
      >
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image" className="bg-tint-violet">
            <ImageIcon className="text-foreground/60" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>dashboard.png</AttachmentTitle>
            <AttachmentDescription>1.2 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction variant="outline" aria-label="Remove dashboard.png">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="vertical" state="uploading">
          <AttachmentMedia variant="image" className="bg-tint-sky">
            <ImageIcon className="text-foreground/60" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>logs-view.png</AttachmentTitle>
            <AttachmentDescription>Uploading · 38%</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment orientation="vertical" state="idle">
          <AttachmentMedia>
            <UploadIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Add image</AttachmentTitle>
          </AttachmentContent>
        </Attachment>
      </Example>

      <Example
        title="Open on click"
        description="Add AttachmentTrigger to make the whole card a button or link. Actions stay clickable above it."
        code={`<Attachment>
  <AttachmentTrigger aria-label="Open incident-report.pdf" onClick={open} />
  …
  <AttachmentActions>
    <AttachmentAction aria-label="Download"><DownloadIcon /></AttachmentAction>
  </AttachmentActions>
</Attachment>`}
      >
        <Attachment>
          <AttachmentTrigger aria-label="Open incident-report-oct-6.pdf" />
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>incident-report-oct-6.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 3 pages</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Download incident-report-oct-6.pdf">
              <DownloadIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </Example>

      <Guidelines
        do={[
          "Show the file name, type and size so people can tell files apart.",
          "Say why an upload failed and how to fix it, such as the size limit.",
          "Give every remove, retry and download button an aria-label that names the file.",
        ]}
        dont={[
          "Don’t hide the remove button behind hover; people on touch screens need it.",
          "Don’t use status colours for file types; keep icons neutral.",
          "Don’t drop files into the text as bare links; the card gives state and actions a place.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "state", type: '"idle" | "uploading" | "processing" | "error" | "done"', default: '"done"', description: "Attachment: drives the border, media and title treatment. Busy states set aria-busy." },
          { prop: "size", type: '"default" | "sm" | "xs"', default: '"default"', description: "Attachment: padding, media size and type size." },
          { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Attachment: vertical puts the media on top, for thumbnails." },
          { prop: "variant", type: '"icon" | "image"', default: '"icon"', description: "AttachmentMedia: image crops an img to the square and dims it while busy." },
          { prop: "render", type: "ReactElement", description: "AttachmentTrigger: render as a link to open the file in a new page." },
          { prop: "variant / size", type: "Button props", default: '"ghost" / "icon-xs"', description: "AttachmentAction is a Button." },
        ]}
      />
    </Examples>
  )
}
