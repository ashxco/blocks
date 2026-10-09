import {
  CircleCheckIcon,
  CircleXIcon,
  GaugeIcon,
  InfoIcon,
  TerminalIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  <AlertTitle>Build minutes are running low</AlertTitle>
  <AlertDescription>
    You have used 5,420 of 6,000 minutes this month. Builds pause when you reach the limit.
  </AlertDescription>
</Alert>`}
      >
        <Alert>
          <TerminalIcon />
          <AlertTitle>Node.js 18 reaches end of life on 30 April</AlertTitle>
          <AlertDescription>
            New builds will use Node.js 22. Set the engines field in package.json to keep a
            specific version.
          </AlertDescription>
        </Alert>
        <Alert variant="info">
          <InfoIcon />
          <AlertTitle>Preview deployments are now private by default</AlertTitle>
          <AlertDescription>
            Only members of your team can open preview URLs. You can share a link that expires
            from the deployment page.
          </AlertDescription>
        </Alert>
        <Alert variant="success">
          <CircleCheckIcon />
          <AlertTitle>lumen.app is verified</AlertTitle>
          <AlertDescription>
            DNS records are in place and a certificate has been issued. Traffic is served over
            HTTPS.
          </AlertDescription>
        </Alert>
        <Alert variant="warning">
          <TriangleAlertIcon />
          <AlertTitle>Build minutes are running low</AlertTitle>
          <AlertDescription>
            You have used 5,420 of 6,000 minutes this month. Builds pause when you reach the
            limit.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <CircleXIcon />
          <AlertTitle>The last deployment failed</AlertTitle>
          <AlertDescription>
            The build exited with code 1 during npm run build. Check the logs, fix the error and
            push again.
          </AlertDescription>
        </Alert>
      </Example>

      <Example
        title="With an action"
        description="Put one action on the right when the fix is a single step. On phones it drops below the text."
        layout="stack"
        code={`<Alert variant="warning">
  <GaugeIcon />
  <AlertTitle>You are close to your bandwidth limit</AlertTitle>
  <AlertDescription>92% of 1 TB used. Upgrade to keep sites fast after the limit.</AlertDescription>
  <AlertAction>
    <Button size="sm" variant="outline">Upgrade plan</Button>
  </AlertAction>
</Alert>`}
      >
        <Alert variant="warning">
          <GaugeIcon />
          <AlertTitle>You are close to your bandwidth limit</AlertTitle>
          <AlertDescription>
            92% of 1 TB used this month. Upgrade to keep sites fast after the limit.
          </AlertDescription>
          <AlertAction>
            <Button size="sm" variant="outline">
              Upgrade plan
            </Button>
          </AlertAction>
        </Alert>
        <Alert variant="destructive">
          <CircleXIcon />
          <AlertTitle>Payment for October failed</AlertTitle>
          <AlertDescription>
            Your card ending in 4242 was declined. Update it before 12 November to keep your
            projects online.
          </AlertDescription>
          <AlertAction>
            <Button size="sm">Update card</Button>
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
          <AlertTitle>Scheduled maintenance on Sunday, 02:00 to 03:00 UTC.</AlertTitle>
        </Alert>
        <Alert variant="warning">
          <TriangleAlertIcon />
          <AlertTitle>Preview deployments are paused while billing is past due.</AlertTitle>
        </Alert>
      </Example>

      <Example
        title="In a settings page"
        description="Alerts sit at the top of the area they describe, not in a corner of the page."
        layout="stack"
      >
        <section className="grid gap-6 rounded-(--card-radius) border bg-card p-(--card-padding)">
          <div className="grid gap-1">
            <h3 className="text-h4 text-foreground">Database</h3>
            <p className="text-sm text-muted-foreground">
              Postgres 16 · lumen-prod-db · Frankfurt, fra1
            </p>
          </div>
          <Alert variant="warning">
            <TriangleAlertIcon />
            <AlertTitle>Storage is 87% full</AlertTitle>
            <AlertDescription>
              At the current rate the database fills up in about 9 days. Increase storage or
              remove old rows. <a href="#retention">Set a retention policy</a>
            </AlertDescription>
            <AlertAction>
              <Button size="sm" variant="outline">
                Increase storage
              </Button>
            </AlertAction>
          </Alert>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-1">
              <dt className="text-caption text-muted-foreground">Storage</dt>
              <dd className="text-title text-foreground tabular-nums">43.5 of 50 GB</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-caption text-muted-foreground">Connections</dt>
              <dd className="text-title text-foreground tabular-nums">38 of 100</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-caption text-muted-foreground">Last backup</dt>
              <dd className="text-title text-foreground">Today, 04:00</dd>
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
          { prop: "variant", type: '"default" | "info" | "success" | "warning" | "destructive"', default: '"default"', description: "Tinted fill, border and icon colour." },
          { prop: "AlertTitle", type: "component", description: "Bold one-line summary." },
          { prop: "AlertDescription", type: "component", description: "Details and the fix. Links inside are underlined." },
          { prop: "AlertAction", type: "component", description: "One action. On the right and centred vertically from the sm breakpoint; below the text on phones." },
          { prop: "role", type: "string", default: '"alert"', description: "Announced right away. Set role=\"status\" for messages that are not urgent." },
        ]}
      />
    </Examples>
  )
}
