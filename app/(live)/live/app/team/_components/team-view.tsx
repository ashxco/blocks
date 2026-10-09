"use client"

import * as React from "react"
import { CheckIcon, LinkIcon } from "lucide-react"

import { InviteDialog, MembersList, type AssignableRole } from "@/components/blocks/members-list"
import { PageHeader } from "@/components/blocks/page-header"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

import { PendingInvitations } from "./pending-invitations"
import { RoleGuide } from "./role-guide"
import { SeatPanel } from "./seat-panel"
import {
  INVITATIONS,
  INVITE_LINK,
  MEMBERS,
  PLAN,
  SEATS,
  WORKSPACE,
  type Invitation,
} from "./team-data"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * The team page. Members and pending invitations are separate lists, so the
 * page header owns the one "Invite members" action and new invites land in
 * the pending list. MembersList's own invite button is hidden here for that
 * reason; it would add invited rows to the members list instead.
 */
export function TeamView() {
  const [members, setMembers] = React.useState(MEMBERS)
  const [invitations, setInvitations] = React.useState(INVITATIONS)
  const [linkCopied, setLinkCopied] = React.useState(false)

  const liveInvites = invitations.filter((i) => i.daysLeft > 0).length
  const knownEmails = [...members.map((m) => m.email), ...invitations.map((i) => i.email)]

  React.useEffect(() => {
    if (!linkCopied) return
    const timer = setTimeout(() => setLinkCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [linkCopied])

  async function copyInviteLink() {
    try {
      await navigator.clipboard.writeText(INVITE_LINK)
      setLinkCopied(true)
      toast.add({
        title: "Invite link copied",
        description: "Anyone with an @acme.dev email can use it to join as a viewer.",
      })
    } catch {
      toast.add({
        type: "error",
        title: "Couldn’t copy the link",
        description: `Your browser blocked the clipboard. The link is ${INVITE_LINK}`,
      })
    }
  }

  async function invite(emails: string[], role: AssignableRole) {
    await wait(700)
    const sent: Invitation[] = emails.map((email) => ({
      id: `inv-${email}`,
      email,
      role,
      invitedBy: "Maya Chen",
      sent: "just now",
      daysLeft: 7,
    }))
    setInvitations((list) => [...sent, ...list])
  }

  function resend(invitation: Invitation) {
    setInvitations((list) =>
      list.map((i) => (i.id === invitation.id ? { ...i, sent: "just now", daysLeft: 7, invitedBy: "Maya Chen" } : i))
    )
    toast.add({
      title: "Invite sent again",
      description: `We emailed a fresh link to ${invitation.email}. It works for 7 days.`,
    })
  }

  function revoke(invitation: Invitation) {
    const index = invitations.findIndex((i) => i.id === invitation.id)
    setInvitations((list) => list.filter((i) => i.id !== invitation.id))
    toast.add({
      title: "Invite revoked",
      description: `The link sent to ${invitation.email} no longer works.`,
      actionProps: {
        children: "Undo",
        onClick: () =>
          setInvitations((list) => {
            if (list.some((i) => i.id === invitation.id)) return list
            const next = [...list]
            next.splice(Math.min(index, next.length), 0, invitation)
            return next
          }),
      },
    })
  }

  return (
    <div className="@container/team grid gap-10">
      <PageHeader
        title="Team"
        description={`People with access to ${WORKSPACE} and the role each one has. A role applies to every project, deployment and log.`}
        actions={
          <>
            <Button variant="outline" onClick={copyInviteLink}>
              {linkCopied ? <CheckIcon data-icon="inline-start" /> : <LinkIcon data-icon="inline-start" />}
              {linkCopied ? "Link copied" : "Copy invite link"}
            </Button>
            <InviteDialog workspaceName={WORKSPACE} existingEmails={knownEmails} onInvite={invite} />
          </>
        }
      />

      <div className="grid items-start gap-6 @min-[62rem]/team:grid-cols-[minmax(0,1fr)_20rem] @min-[62rem]/team:gap-8">
        <div className="grid min-w-0 gap-6">
          <MembersList
            members={MEMBERS}
            seats={SEATS}
            planName={PLAN}
            workspaceName={WORKSPACE}
            description={`${members.length} people can open ${WORKSPACE} and its projects. Owners and admins can change roles.`}
            onRemove={(member) => setMembers((list) => list.filter((m) => m.id !== member.id))}
            onRoleChange={(member, role) =>
              setMembers((list) => list.map((m) => (m.id === member.id ? { ...m, role } : m)))
            }
            className="**:data-[slot=card-action]:hidden **:data-[slot=card-header]:grid-cols-1!"
          />
          <PendingInvitations invitations={invitations} onResend={resend} onRevoke={revoke} />
        </div>

        <aside
          aria-label="Seats and roles"
          className="grid gap-6 @min-[62rem]/team:sticky @min-[62rem]/team:top-[calc(var(--header-height)+--spacing(8))]"
        >
          <SeatPanel members={members.length} invites={liveInvites} seats={SEATS} planName={PLAN} />
          <RoleGuide />
        </aside>
      </div>
    </div>
  )
}
