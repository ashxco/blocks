"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { InviteDialog, InvitePanel, MembersList } from "@/components/blocks/members-list"

export default function MembersListDocs() {
  return (
    <Examples>
      <Example
        title="Team members"
        description="Change a role from the select, remove someone after a confirmation, or invite people by email. Filter by name, email, role or project. Members take a seat; guests are free and see only the projects they’re invited to. Long lists show the first eight people and a Show all button."
        layout="full"
        code={`<MembersList workspaceName="Acme Inc." seats={18} planName="Pro" />`}
      >
        <div className="p-(--card-padding) @prose:p-10">
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
  planName="Free"
  workspaceName="Maya’s projects"
  inviteAction={null}
  members={[
    { id: "1", name: "Maya Patel", email: "maya@acme.com", role: "owner", you: true, meta: "Active now" },
    { id: "2", name: "Sofia Alvarez", email: "sofia@acme.com", role: "member", meta: "Active today" },
    { id: "3", email: "kai@acme.com", role: "member", status: "invited", meta: "Invited yesterday" },
  ]}
/>`}
      >
        <div className="p-(--card-padding) @prose:p-10">
          <MembersList
            seats={3}
            planName="Free"
            workspaceName="Maya’s projects"
            inviteAction={null}
            members={[
              { id: "1", name: "Maya Patel", email: "maya@acme.com", role: "owner", you: true, meta: "Active now" },
              { id: "2", name: "Sofia Alvarez", email: "sofia@acme.com", role: "member", meta: "Active today" },
              { id: "3", email: "kai@acme.com", role: "member", status: "invited", meta: "Invited yesterday" },
            ]}
          />
        </div>
      </Example>

      <Example
        title="Invite dialog"
        description="Use it on its own wherever people can be invited. Paste several addresses at once; it rejects malformed addresses and people already in the workspace with a clear message. Shown open below, with InvitePanel; try maya@acme.com to see the check."
        layout="full"
        surface="subtle"
        code={`// The trigger and dialog
<InviteDialog workspaceName="Acme Inc." existingEmails={emails} onInvite={(emails, role) => …} />

// The dialog's content on its own surface, for an empty team page or onboarding
<InvitePanel workspaceName="Acme Inc." existingEmails={emails} />`}
      >
        <div className="grid justify-items-center gap-6 px-4 py-10 @prose:px-10">
          <InviteDialog existingEmails={["maya@acme.com"]} />
          <InvitePanel existingEmails={["maya@acme.com"]} />
        </div>
      </Example>

      <Guidelines
        do={[
          "Show the seats used next to the title so admins know before they invite. Guests don’t take one.",
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
          { prop: "members", type: "Member[]", default: "Acme Inc.: 18 members and 6 guests", description: "id, name, email, role (owner, admin, member or guest), status (active or invited), meta, you and an optional avatar tone. Known people keep their tint from the shared people list on every page." },
          { prop: "seats", type: "number", default: "18", description: "Seats paid for on the plan. Members and pending member invites take one; guests don’t." },
          { prop: "planName", type: "string", default: '"Pro"', description: "Plan named in the seat count." },
          { prop: "workspaceName", type: "string", default: '"Acme Inc."', description: "Used in the invite and removal copy." },
          { prop: "title", type: "ReactNode", default: '"Members"', description: "Card title." },
          { prop: "description", type: "ReactNode", default: "Head count and seats", description: "Replaces the head count and seat use under the title." },
          { prop: "visibleCount", type: "number", default: "8", description: "Rows shown before the Show all button. A search always shows every match." },
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
          { prop: "defaultRole", type: '"admin" | "member" | "guest"', default: '"member"', description: "Role selected when the dialog opens." },
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
