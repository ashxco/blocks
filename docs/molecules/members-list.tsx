"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { InviteDialog, InvitePanel, MembersList } from "@/components/blocks/members-list"

export default function MembersListDocs() {
  return (
    <Examples>
      <Example
        title="Team members"
        description="Change a role from the select, remove someone after a confirmation, or invite people by email. Filter by name, email or role."
        layout="full"
        code={`<MembersList workspaceName="Acme Inc." seats={10} planName="Pro" />`}
      >
        <div className="p-(--card-padding) sm:p-10">
          <MembersList />
        </div>
      </Example>

      <Example
        title="Small team, invite elsewhere"
        description="Pass your own members. Pending invites show a badge, a Resend action and a revoke button. When the page header already has the invite button, pass inviteAction={null} so the card doesn’t repeat it."
        layout="full"
        surface="subtle"
        code={`<MembersList
  seats={3}
  planName="Starter"
  inviteAction={null}
  members={[
    { id: "1", name: "Tomás Reyes", email: "tomas@fieldnotes.app", role: "owner", you: true, meta: "Active now" },
    { id: "2", name: "Hana Sato", email: "hana@fieldnotes.app", role: "developer", meta: "Active today" },
    { id: "3", email: "ola@fieldnotes.app", role: "viewer", status: "invited", meta: "Invited yesterday" },
  ]}
/>`}
      >
        <div className="p-(--card-padding) sm:p-10">
          <MembersList
            seats={3}
            planName="Starter"
            workspaceName="Fieldnotes"
            inviteAction={null}
            members={[
              { id: "1", name: "Tomás Reyes", email: "tomas@fieldnotes.app", role: "owner", you: true, meta: "Active now" },
              { id: "2", name: "Hana Sato", email: "hana@fieldnotes.app", role: "developer", meta: "Active today" },
              { id: "3", email: "ola@fieldnotes.app", role: "viewer", status: "invited", meta: "Invited yesterday" },
            ]}
          />
        </div>
      </Example>

      <Example
        title="Invite dialog"
        description="Use it on its own wherever people can be invited. Paste several addresses at once; it rejects malformed addresses and people already in the workspace with a clear message. Shown open below, with InvitePanel; try maya@acme.dev to see the check."
        layout="full"
        surface="subtle"
        code={`// The trigger and dialog
<InviteDialog workspaceName="Acme Inc." existingEmails={emails} onInvite={(emails, role) => …} />

// The dialog's content on its own surface, for an empty team page or onboarding
<InvitePanel workspaceName="Acme Inc." existingEmails={emails} />`}
      >
        <div className="grid justify-items-center gap-6 px-4 py-10 sm:px-10">
          <InviteDialog existingEmails={["maya@acme.dev"]} />
          <InvitePanel existingEmails={["maya@acme.dev"]} />
        </div>
      </Example>

      <Guidelines
        do={[
          "Show the seats used next to the title so admins know before they invite.",
          "Ask for confirmation before removing someone, and say what they lose.",
          "Keep pending invites in the list with a way to resend or revoke them.",
        ]}
        dont={[
          "Don’t let people change the owner’s role or remove themselves from here. Ownership is transferred in settings.",
          "Don’t hide the email address. Names repeat, addresses don’t.",
          "Don’t use badges for roles. The select already shows the role.",
        ]}
      />

      <ApiTable
        title="MembersList"
        rows={[
          { prop: "members", type: "Member[]", default: "Six Acme Inc. members", description: "id, name, email, role, status (active or invited), meta, you and an optional avatar tone. Known people keep their tint from the shared people list on every page." },
          { prop: "seats", type: "number", default: "10", description: "Seats in the plan, for the seat count under the title." },
          { prop: "planName", type: "string", default: '"Pro"', description: "Plan named in the seat count." },
          { prop: "workspaceName", type: "string", default: '"Acme Inc."', description: "Used in the invite and removal copy." },
          { prop: "title", type: "ReactNode", default: '"Members"', description: "Card title." },
          { prop: "description", type: "ReactNode", default: "Seat count", description: "Replaces the seat count under the title." },
          { prop: "as", type: '"h2" | "h3"', default: '"h2"', description: "Heading level of the title." },
          { prop: "onRoleChange", type: "(member, role) => void", description: "Called after a role change. The list updates right away." },
          { prop: "onRemove", type: "(member) => void", description: "Called after a removal or revoked invite is confirmed." },
          { prop: "onInvite", type: "(emails, role) => void | Promise<void>", description: "Called before new invites appear as pending rows. Throw to keep the dialog open." },
          { prop: "inviteAction", type: "ReactNode", default: "InviteDialog", description: "Replaces the invite button in the card header. null leaves the header without one." },
          { prop: "className", type: "string", description: "Classes for the card." },
        ]}
      />

      <ApiTable
        title="InviteDialog"
        rows={[
          { prop: "workspaceName", type: "string", default: '"Acme Inc."', description: "Named in the dialog title and the success toast." },
          { prop: "defaultRole", type: '"admin" | "developer" | "viewer"', default: '"developer"', description: "Role selected when the dialog opens." },
          { prop: "existingEmails", type: "string[]", default: "[]", description: "Addresses already in the workspace. They are rejected." },
          { prop: "onInvite", type: "(emails, role) => void | Promise<void>", description: "Called with valid, de-duplicated addresses. Throw to show an error." },
          { prop: "triggerLabel", type: "string", default: '"Invite members"', description: "Trigger button label." },
          { prop: "triggerVariant", type: '"default" | "outline" | "secondary"', default: '"default"', description: "Trigger button style." },
          { prop: "triggerSize", type: '"default" | "sm"', default: '"default"', description: "Trigger button size." },
        ]}
      />

      <ApiTable
        title="InvitePanel"
        rows={[
          { prop: "workspaceName, defaultRole, existingEmails, onInvite", type: "As InviteDialog", description: "The dialog’s form on its own bordered surface, without a trigger. It clears itself after sending." },
          { prop: "className", type: "string", description: "Classes for the panel. It is as wide as a dialog." },
        ]}
      />
    </Examples>
  )
}
