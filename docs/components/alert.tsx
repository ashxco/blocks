import {
  BellIcon,
  CircleCheckIcon,
  CircleXIcon,
  FolderKanbanIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function AlertDocs() {
  return (
    <Examples>
      <Example
        title="Variants"
        description="Tinted fills with a matching icon. The title states what happened, the description says what to do."
        layout="stack"
        code={`<Alert variant="warning">
  <TriangleAlertIcon />
  <AlertTitle>Automation runs are running low</AlertTitle>
  <AlertDescription>
    You have used 7,240 of 10,000 runs this cycle. Automations pause when you reach the limit.
  </AlertDescription>
</Alert>`}
      >
        <Alert>
          <BellIcon />
          <AlertTitle>Weekly digests now arrive on Monday mornings</AlertTitle>
          <AlertDescription>
            Each member gets one email at 9:00 in their own time zone. Change
            the day in notification settings.
          </AlertDescription>
        </Alert>
        <Alert variant="info">
          <InfoIcon />
          <AlertTitle>
            Timeline view is now available in every project
          </AlertTitle>
          <AlertDescription>
            Choose Timeline in the view switcher to plan work by date. Your list
            and board views stay as they are.
          </AlertDescription>
        </Alert>
        <Alert variant="success">
          <CircleCheckIcon />
          <AlertTitle>Slack is connected</AlertTitle>
          <AlertDescription>
            Updates from Website relaunch now post to #website-relaunch. Change
            the channel in Integrations.
          </AlertDescription>
        </Alert>
        <Alert variant="warning">
          <TriangleAlertIcon />
          <AlertTitle>Automation runs are running low</AlertTitle>
          <AlertDescription>
            You have used 7,240 of 10,000 runs this cycle. Automations pause
            when you reach the limit.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <CircleXIcon />
          <AlertTitle>The import didn’t finish</AlertTitle>
          <AlertDescription>
            The file has no Title column, so Acme couldn’t create any tasks. Add
            a column named Title and upload the file again.
          </AlertDescription>
        </Alert>
      </Example>

      <Example
        title="With an action"
        description="Put one action on the right when the fix is a single step. On phones it drops below the text."
        layout="stack"
        code={`<Alert variant="warning">
  <FolderKanbanIcon />
  <AlertTitle>Mobile app 2.0 is at risk</AlertTitle>
  <AlertDescription>61 of 118 tasks are done and the project is due Nov 20.</AlertDescription>
  <AlertAction>
    <Button size="sm" variant="outline">Review Plan</Button>
  </AlertAction>
</Alert>`}
      >
        <Alert variant="warning">
          <FolderKanbanIcon />
          <AlertTitle>Mobile app 2.0 is at risk</AlertTitle>
          <AlertDescription>
            61 of 118 tasks are done and the project is due Nov 20. Review the
            plan with Jordan Lee.
          </AlertDescription>
          <AlertAction>
            <Button size="sm" variant="outline">
              Review Plan
            </Button>
          </AlertAction>
        </Alert>
        <Alert variant="destructive">
          <CircleXIcon />
          <AlertTitle>Google Drive is disconnected</AlertTitle>
          <AlertDescription>
            Acme can no longer reach the Website relaunch folder, so new files
            don’t attach to tasks. Reconnect Google Drive to pick up where it
            left off.
          </AlertDescription>
          <AlertAction>
            <Button size="sm">Reconnect</Button>
          </AlertAction>
        </Alert>
      </Example>

      <Example
        title="Title only"
        description="For short messages, leave out the description."
        layout="stack"
        code={`<Alert variant="info">
  <InfoIcon />
  <AlertTitle>Scheduled maintenance on Sunday, 02:00 to 03:00 UTC.</AlertTitle>
</Alert>`}
      >
        <Alert variant="info">
          <InfoIcon />
          <AlertTitle>
            Scheduled maintenance on Sunday, 02:00 to 03:00 UTC.
          </AlertTitle>
        </Alert>
        <Alert variant="warning">
          <TriangleAlertIcon />
          <AlertTitle>
            Automations are paused while billing is past due.
          </AlertTitle>
        </Alert>
      </Example>

      <Example
        title="In a settings page"
        description="Alerts sit at the top of the area they describe, not in a corner of the page."
        layout="stack"
      >
        <section className="grid gap-6 rounded-(--card-radius) border bg-card p-(--card-padding)">
          <div className="grid gap-1">
            <h3 className="text-h4 text-foreground">Automations</h3>
            <p className="text-sm text-muted-foreground">
              Pro plan · 10,000 runs a month
            </p>
          </div>
          <Alert variant="warning">
            <TriangleAlertIcon />
            <AlertTitle>
              You may run out of automation runs this cycle
            </AlertTitle>
            <AlertDescription>
              At the current rate the workspace reaches 10,000 runs before the
              cycle resets on Nov 1. Upgrade, or turn off rules you no longer
              need. <a href="#runs-by-rule">See runs by rule</a>
            </AlertDescription>
            <AlertAction>
              <Button size="sm" variant="outline">
                Upgrade Plan
              </Button>
            </AlertAction>
          </Alert>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-1">
              <dt className="text-caption text-muted-foreground">Runs used</dt>
              <dd className="text-title text-foreground tabular-nums">
                7,240 of 10,000
              </dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-caption text-muted-foreground">
                Active rules
              </dt>
              <dd className="text-title text-foreground tabular-nums">14</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-caption text-muted-foreground">Resets</dt>
              <dd className="text-title text-foreground">Nov 1</dd>
            </div>
          </dl>
        </section>
      </Example>

      <Guidelines
        do={[
          "Lead with what happened in the title, then say how to fix it.",
          "Match the variant to the outcome: destructive only for failures that need action.",
          "Keep the icon. It carries the status for people who can’t see the colour.",
          "Offer at most one action, as a small button.",
        ]}
        dont={[
          "Don’t use an alert for confirmation after an action. Use a toast.",
          "Don’t stack several alerts. Combine them or show the most urgent one.",
          "Don’t use alerts for marketing or tips that are not about the current task.",
        ]}
      />

      <ApiTable
        rows={[
          {
            prop: "variant",
            type: '"default" | "info" | "success" | "warning" | "destructive"',
            default: '"default"',
            description: "Tinted fill, border and icon colour.",
          },
          {
            prop: "AlertTitle",
            type: "component",
            description: "Bold one-line summary.",
          },
          {
            prop: "AlertDescription",
            type: "component",
            description: "Details and the fix. Links inside are underlined.",
          },
          {
            prop: "AlertAction",
            type: "component",
            description:
              "One action. On the right and centred vertically from the sm breakpoint; below the text on phones.",
          },
          {
            prop: "role",
            type: "string",
            default: '"alert"',
            description:
              'Announced right away. Set role="status" for messages that are not urgent.',
          },
        ]}
      />
    </Examples>
  )
}
