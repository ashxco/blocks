"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronUpIcon, MailIcon, SearchIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"

import { InviteDialog, type AssignableRole } from "./members-list/invite-dialog"
import { personTone, type PersonTone } from "./members-list/people"
import { ASSIGNABLE_ROLES, ROLE_ITEMS, ROLE_LABELS, type MemberRole } from "./members-list/roles"

export {
  InviteDialog,
  InvitePanel,
  parseEmails,
  type InviteDialogProps,
  type InvitePanelProps,
  type AssignableRole,
} from "./members-list/invite-dialog"
export type { MemberRole } from "./members-list/roles"
export { PEOPLE, personTone, type PersonTone } from "./members-list/people"

export interface Member {
  id: string
  /** Full name. Pending invites usually have none. */
  name?: string
  email: string
  role: MemberRole
  status?: "active" | "invited"
  /** Short note, e.g. "Active 2 hours ago", "Invited 2 days ago" or, for a guest, "Customer portal · Active today". */
  meta?: string
  /** Marks the signed-in person. They can’t remove themselves here. */
  you?: boolean
  /** Avatar fill. Defaults to the person's tint from the shared people list, or one picked from the initials. */
  tone?: PersonTone
}

export interface MembersListProps {
  members?: Member[]
  /** Seats paid for on the plan. Members and pending member invites take one; guests don’t. */
  seats?: number
  planName?: string
  workspaceName?: string
  title?: React.ReactNode
  /** Defaults to the head count and seat usage, e.g. "18 members and 6 guests. 18 of 18 seats used on Pro." */
  description?: React.ReactNode
  /** Rows shown before “Show all”. A search always shows every match. */
  visibleCount?: number
  /** Heading level of the title. */
  as?: "h2" | "h3"
  /** Called after a role change. The list updates optimistically. */
  onRoleChange?: (member: Member, role: AssignableRole) => void
  /** Called after removal or revocation is confirmed. */
  onRemove?: (member: Member) => void
  /** Called with new invites before they appear as pending rows. Throw to keep the dialog open. */
  onInvite?: (emails: string[], role: AssignableRole) => void | Promise<void>
  /**
   * Replaces the invite button in the card header. Pass null to leave the
   * header without one, for pages that invite from their own page header.
   */
  inviteAction?: React.ReactNode
  className?: string
}

/**
 * Acme Inc. as the Team template shows it: 18 members on the 18 seats of the
 * Pro plan, then 6 guests, who are free and see only the projects they are
 * invited to.
 */
export const ACME_MEMBERS: Member[] = [
  { id: "maya", name: "Maya Patel", email: "maya@acme.com", role: "owner", meta: "Active now", you: true },
  { id: "hana", name: "Hana Kim", email: "hana@acme.com", role: "admin", meta: "Active 20\u00a0minutes ago" },
  { id: "daniel", name: "Daniel Brooks", email: "daniel@acme.com", role: "admin", meta: "Active 1\u00a0hour ago" },
  { id: "lucas", name: "Lucas Moreau", email: "lucas@acme.com", role: "admin", meta: "Active 3\u00a0hours ago" },
  { id: "jordan", name: "Jordan Lee", email: "jordan@acme.com", role: "member", meta: "Active now" },
  { id: "sofia", name: "Sofia Alvarez", email: "sofia@acme.com", role: "member", meta: "Active 5\u00a0minutes ago" },
  { id: "priya", name: "Priya Raman", email: "priya@acme.com", role: "member", meta: "Active 12\u00a0minutes ago" },
  { id: "sam", name: "Sam Okafor", email: "sam@acme.com", role: "member", meta: "Active 2\u00a0hours ago" },
  { id: "noah", name: "Noah Fischer", email: "noah@acme.com", role: "member", meta: "Active 4\u00a0hours ago" },
  { id: "aisha", name: "Aisha Bello", email: "aisha@acme.com", role: "member", meta: "Active 6\u00a0hours ago" },
  { id: "kenji", name: "Kenji Watanabe", email: "kenji@acme.com", role: "member", meta: "Active 9\u00a0hours ago" },
  { id: "chloe", name: "Chloe Martin", email: "chloe@acme.com", role: "member", meta: "Active today" },
  { id: "rui", name: "Rui Costa", email: "rui@acme.com", role: "member", meta: "Active today" },
  { id: "ava", name: "Ava Thompson", email: "ava@acme.com", role: "member", meta: "Active yesterday" },
  { id: "leila", name: "Leila Haddad", email: "leila@acme.com", role: "member", meta: "Active yesterday" },
  { id: "arjun", name: "Arjun Mehta", email: "arjun@acme.com", role: "member", meta: "Active yesterday" },
  { id: "ben", name: "Ben Carter", email: "ben@acme.com", role: "member", meta: "Active 2\u00a0days ago" },
  { id: "tom", name: "Tom Walsh", email: "tom@acme.com", role: "member", meta: "Active last week" },
  { id: "elena", name: "Elena Ruiz", email: "elena@northwind.com", role: "guest", meta: "Customer portal · Joined 3\u00a0hours ago" },
  { id: "nora", name: "Nora Lindqvist", email: "nora@brightline.com", role: "guest", meta: "Brand refresh · Active today" },
  { id: "marcus", name: "Marcus Webb", email: "marcus@globex.com", role: "guest", meta: "Customer portal · Active yesterday" },
  { id: "felix", name: "Felix Wagner", email: "felix@harborandco.com", role: "guest", meta: "Mobile app 2.0 · Active 2\u00a0days ago" },
  { id: "omar", name: "Omar Farouk", email: "omar@fieldstone.com", role: "guest", meta: "Website relaunch · Active 3\u00a0days ago" },
  { id: "grace", name: "Grace Liu", email: "grace@copperleaf.com", role: "guest", meta: "Brand refresh · Active last week" },
]

function initials(member: Member) {
  const source = member.name?.trim() || member.email
  const parts = source.split(/\s+/).filter(Boolean)
  return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : source.slice(0, 2).toUpperCase()
}

const displayName = (member: Member) => member.name ?? member.email
const withArticle = (label: string) => (/^[AEIOU]/.test(label) ? `an ${label}` : `a ${label}`)

const plural = (count: number, one: string, other: string) => `${count} ${count === 1 ? one : other}`

export function MembersList({
  members: initialMembers = ACME_MEMBERS,
  seats = 18,
  planName = "Pro",
  workspaceName = "Acme Inc.",
  title = "Members",
  description,
  visibleCount = 8,
  as: Heading = "h2",
  onRoleChange,
  onRemove,
  onInvite,
  inviteAction,
  className,
}: MembersListProps) {
  const [members, setMembers] = React.useState(initialMembers)
  const [query, setQuery] = React.useState("")
  const [target, setTarget] = React.useState<Member | null>(null)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)

  const q = query.trim().toLowerCase()
  const visible = q
    ? members.filter((m) =>
        [m.name, m.email, ROLE_LABELS[m.role], m.meta].some((v) => v?.toLowerCase().includes(q))
      )
    : members
  const capped = !q && visible.length > visibleCount
  const shown = capped && !expanded ? visible.slice(0, visibleCount) : visible

  const active = members.filter((m) => m.status !== "invited")
  const memberCount = active.filter((m) => m.role !== "guest").length
  const guestCount = active.length - memberCount
  // Members and pending member invites take a seat; guests don’t.
  const seatsUsed = members.filter((m) => m.role !== "guest").length
  const summary = `${plural(memberCount, "member", "members")}${
    guestCount ? ` and ${plural(guestCount, "guest", "guests")}` : ""
  }. ${seatsUsed} of ${seats} seats used on ${planName}.`

  function changeRole(member: Member, role: AssignableRole) {
    setMembers((list) => list.map((m) => (m.id === member.id ? { ...m, role } : m)))
    onRoleChange?.(member, role)
    toast.add({ title: `${displayName(member)} is now ${withArticle(ROLE_LABELS[role])}.` })
  }

  async function invite(emails: string[], role: AssignableRole) {
    await onInvite?.(emails, role)
    setMembers((list) => [
      ...list,
      ...emails.map((email) => ({
        id: `invite-${email}`,
        email,
        role,
        status: "invited" as const,
        meta: "Invited just now",
      })),
    ])
  }

  function resend(member: Member) {
    setMembers((list) => list.map((m) => (m.id === member.id ? { ...m, meta: "Invited just now" } : m)))
    toast.add({ title: "Invite sent again", description: `We emailed a fresh link to ${member.email}.` })
  }

  function askRemove(member: Member) {
    setTarget(member)
    setConfirmOpen(true)
  }

  function confirmRemove() {
    if (!target) return
    setMembers((list) => list.filter((m) => m.id !== target.id))
    setConfirmOpen(false)
    onRemove?.(target)
    toast.add({
      title: target.status === "invited" ? "Invite revoked" : `${displayName(target)} was removed`,
    })
  }

  const invited = target?.status === "invited"
  const guest = target?.role === "guest"

  return (
    <Card data-slot="members-list" className={cn("@container", className)}>
      {/* In a narrow card the invite action wraps under the title and description, as in PageHeader.
          Important, to beat the header's has-[card-action] columns. */}
      <CardHeader className="border-b @max-[24rem]:grid-cols-1!">
        <CardTitle>
          <Heading>{title}</Heading>
        </CardTitle>
        <CardDescription>
          {description ?? summary}
        </CardDescription>
        {inviteAction === null ? null : (
          <CardAction className="@max-[24rem]:col-start-1 @max-[24rem]:row-span-1 @max-[24rem]:row-start-auto @max-[24rem]:mt-2 @max-[24rem]:justify-self-start">
            {inviteAction ?? (
              <InviteDialog
                workspaceName={workspaceName}
                existingEmails={members.map((m) => m.email)}
                onInvite={invite}
                triggerSize="sm"
              />
            )}
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        <InputGroup className="@prose:max-w-80">
          <InputGroupAddon>
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter members"
            aria-label="Filter members"
          />
        </InputGroup>

        {visible.length ? (
          <>
            <ul className="mt-2 divide-y">
              {shown.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  onRoleChange={changeRole}
                  onResend={resend}
                  onRemove={askRemove}
                />
              ))}
            </ul>
            {capped ? (
              <div className="border-t pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-expanded={expanded}
                  className="-ml-(--button-padding-x-sm)"
                  onClick={() => setExpanded((open) => !open)}
                >
                  {expanded ? "Show fewer" : `Show all ${visible.length} people`}
                  {expanded ? <ChevronUpIcon data-icon="inline-end" /> : <ChevronDownIcon data-icon="inline-end" />}
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground" role="status">
            No members match “{query.trim()}”.
          </p>
        )}
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {invited
                ? `Revoke the invite for ${target?.email}?`
                : `Remove ${target ? displayName(target) : "this member"} from ${workspaceName}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {invited
                ? "The link in their email stops working right away. You can invite them again later."
                : guest
                  ? `They lose access to the projects they were invited to in ${workspaceName} right away. Their comments stay.`
                  : `They lose access to every project, task and doc in ${workspaceName} right away. Their open tasks stay, unassigned, and their seat opens up.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmRemove}>
              {invited ? "Revoke invite" : "Remove member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

function MemberRow({
  member,
  onRoleChange,
  onResend,
  onRemove,
}: {
  member: Member
  onRoleChange: (member: Member, role: AssignableRole) => void
  onResend: (member: Member) => void
  onRemove: (member: Member) => void
}) {
  const invited = member.status === "invited"
  const owner = member.role === "owner"
  const name = displayName(member)

  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 py-4 @prose:grid-cols-[auto_minmax(0,1fr)_auto] @prose:gap-x-4">
      <Avatar>
        {invited ? (
          <AvatarFallback tone="muted" className="text-muted-foreground">
            <MailIcon className="size-4" aria-hidden="true" />
          </AvatarFallback>
        ) : (
          <AvatarFallback tone={member.tone ?? personTone(member.name)}>{initials(member)}</AvatarFallback>
        )}
      </Avatar>
      <div className="grid min-w-0 gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-label text-foreground">{name}</span>
          {member.you ? <Badge variant="secondary">You</Badge> : null}
          {invited ? <Badge variant="outline">Invited</Badge> : null}
        </div>
        {/* In narrow rows the email and the activity stack, so neither is cut short. */}
        <p className="grid text-caption text-muted-foreground @prose:flex @prose:gap-1">
          {member.name ? <span className="min-w-0 truncate">{member.email}</span> : null}
          {member.name && member.meta ? (
            <span aria-hidden="true" className="hidden @prose:inline">
              ·
            </span>
          ) : null}
          {member.meta ? <span className="min-w-0 truncate">{member.meta}</span> : null}
        </p>
      </div>

      <div className="col-start-2 flex flex-wrap items-center gap-2 @prose:col-start-auto @prose:justify-end">
        {owner ? (
          <span className="inline-flex h-(--control-height-sm) items-center text-sm text-muted-foreground @prose:w-32 @prose:px-3">
            Owner
          </span>
        ) : (
          <Select
            items={ROLE_ITEMS}
            value={member.role as AssignableRole}
            onValueChange={(value) => value && value !== member.role && onRoleChange(member, value)}
          >
            <SelectTrigger size="sm" className="w-32" aria-label={`Role for ${name}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSIGNABLE_ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {invited ? (
          <Button variant="outline" size="sm" onClick={() => onResend(member)}>
            Resend
          </Button>
        ) : null}
        {owner || member.you ? (
          <span className="hidden size-(--button-height-sm) @prose:block" aria-hidden="true" />
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={invited ? `Revoke invite for ${member.email}` : `Remove ${name}`}
            onClick={() => onRemove(member)}
            className="text-muted-foreground hover:text-destructive"
          >
            <XIcon />
          </Button>
        )}
      </div>
    </li>
  )
}
