import * as React from "react"
import {
  CalendarDaysIcon,
  ChartColumnIcon,
  FileTextIcon,
  KanbanIcon,
  KeyRoundIcon,
  ListTodoIcon,
  PlugIcon,
  RepeatIcon,
  ScrollTextIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"

interface Capability {
  title: string
  description: string
  icon: LucideIcon
}

const capabilities: Capability[] = [
  { title: "Four project views", description: "List, board, timeline and calendar views of the same work.", icon: KanbanIcon },
  { title: "Tasks and subtasks", description: "Owners, due dates, priorities from Urgent to Low, and comments.", icon: ListTodoIcon },
  { title: "Docs", description: "Specs and meeting notes next to the tasks they describe.", icon: FileTextIcon },
  { title: "Automations", description: "Rules for handoffs, reminders and status changes, with a run history.", icon: ZapIcon },
  { title: "Recurring tasks", description: "Daily, weekly or monthly work that schedules itself.", icon: RepeatIcon },
  { title: "Calendar", description: "Due dates and milestones on one calendar for every project.", icon: CalendarDaysIcon },
  { title: "Reports", description: "Workload, on-time delivery and cycle time, shared as dashboards.", icon: ChartColumnIcon },
  { title: "Integrations", description: "Slack, Google Drive, GitHub, Figma, Zoom and HubSpot, from Pro.", icon: PlugIcon },
  { title: "Guests", description: "Clients and contractors see only the projects you share, from Pro.", icon: UserPlusIcon },
  { title: "Roles and permissions", description: "Owner, Admin, Member and Guest, with advanced permissions on Business.", icon: ShieldCheckIcon },
  { title: "SSO and two-factor", description: "Two-factor authentication on every plan, SSO with SAML on Business.", icon: KeyRoundIcon },
  { title: "Audit log", description: "Every change to members, permissions and settings, on Business.", icon: ScrollTextIcon },
]

/**
 * Every capability on one hairline grid, on a tinted band. Twelve cells fill
 * two, three and four columns evenly; on phones they become a compact list.
 */
export function CapabilityGrid() {
  return (
    <section id="capabilities" className="scroll-mt-(--header-height) border-y bg-subtle">
      <div className="container-page py-section">
        <SectionHeading
          title={
            <>
              Twelve capabilities.
              <br />
              One workspace.
            </>
          }
          description="Every plan includes the core of Acme. Automation runs, storage, guests and admin controls grow as you move up."
          className="mb-12 md:mb-16"
        />
        <ul className="grid gap-px overflow-hidden rounded-(--card-radius) border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {capabilities.map(({ title, description, icon: Icon }) => (
            // On phones the icon sits beside the text, so twelve rows stay short.
            <li key={title} className="flex gap-4 bg-background p-5 sm:flex-col sm:gap-0 sm:p-6 lg:p-7">
              <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-foreground sm:mt-0 sm:mb-7" strokeWidth={1.75} />
              <div className="grid gap-1 sm:gap-2">
                <h3 className="text-title text-foreground">{title}</h3>
                <p className="text-sm text-copy">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
