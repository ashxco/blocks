"use client"

import * as React from "react"
import { MailIcon, SearchIcon, XIcon } from "lucide-react"

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
import { ASSIGNABLE_ROLES, ROLE_ITEMS, ROLE_LABELS, type MemberRole } from "./members-list/roles"

export { InviteDialog, parseEmails, type InviteDialogProps, type AssignableRole } from "./members-list/invite-dialog"
export type { MemberRole } from "./members-list/roles"

export interface Member {
  id: string
  /** Full name. Pending invites usually have none. */
  name?: string
  email: string
  role: MemberRole
  status?: "active" | "invited"
  /** Short activity note, e.g. "Active 2 hours ago" or "Invited 2 days ago". */
  meta?: string
  /** Marks the signed-in person. They can’t remove themselves here. */
  you?: boolean
}

export interface MembersListProps {
  members?: Member[]
  /** Seats included in the plan. */
  seats?: number
  planName?: string
  workspaceName?: string
  title?: React.ReactNode
  /** Defaults to seat usage, e.g. "6 of 10 seats used on Pro." */
  description?: React.ReactNode
  /** Heading level of the title. */
  as?: "h2" | "h3"
  /** Called after a role change. The list updates optimistically. */
  onRoleChange?: (member: Member, role: AssignableRole) => void
  /** Called after removal or revocation is confirmed. */
  onRemove?: (member: Member) => void
  /** Called with new invites before they appear as pending rows. Throw to keep the dialog open. */
  onInvite?: (emails: string[], role: AssignableRole) => void | Promise<void>
  className?: string
}

const defaultMembers: Member[] = [
  { id: "m1", name: "Maya Chen", email: "maya@halcyon.dev", role: "owner", meta: "Active now", you: true },
  { id: "m2", name: "Jonas Weber", email: "jonas@halcyon.dev", role: "admin", meta: "Active 2 hours ago" },
  { id: "m3", name: "Priya Raman", email: "priya@halcyon.dev", role: "developer", meta: "Active yesterday" },
  { id: "m4", name: "Leo Martins", email: "leo@halcyon.dev", role: "developer", meta: "Active 3 days ago" },
  { id: "m5", name: "Amara Okafor", email: "amara@halcyon.dev", role: "viewer", meta: "Active last week" },
  { id: "m6", email: "sam@halcyon.dev", role: "developer", status: "invited", meta: "Invited 2 days ago" },
]

function initials(member: Member) {
  const source = member.name?.trim() || member.email
  const parts = source.split(/\s+/).filter(Boolean)
  return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : source.slice(0, 2).toUpperCase()
}

const displayName = (member: Member) => member.name ?? member.email
const withArticle = (label: string) => (/^[AEIOU]/.test(label) ? `an ${label}` : `a ${label}`)

export function MembersList({
  members: initialMembers = defaultMembers,
  seats = 10,
  planName = "Pro",
  workspaceName = "Halcyon Labs",
  title = "Members",
  description,
  as: Heading = "h2",
  onRoleChange,
  onRemove,
  onInvite,
  className,
}: MembersListProps) {
  const [members, setMembers] = React.useState(initialMembers)
  const [query, setQuery] = React.useState("")
  const [target, setTarget] = React.useState<Member | null>(null)
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const q = query.trim().toLowerCase()
  const visible = q
    ? members.filter((m) =>
        [m.name, m.email, ROLE_LABELS[m.role]].some((v) => v?.toLowerCase().includes(q))
      )
    : members

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

  return (
    <Card data-slot="members-list" className={cn("@container", className)}>
      <CardHeader className="border-b">
        <CardTitle>
          <Heading>{title}</Heading>
        </CardTitle>
        <CardDescription>
          {description ?? `${members.length} of ${seats} seats used on ${planName}.`}
        </CardDescription>
        <CardAction>
          <InviteDialog
            workspaceName={workspaceName}
            existingEmails={members.map((m) => m.email)}
            onInvite={invite}
            triggerSize="sm"
          />
        </CardAction>
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
            placeholder="Filter by name, email or role"
            aria-label="Filter members"
          />
        </InputGroup>

        {visible.length ? (
          <ul className="mt-2 divide-y">
            {visible.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                onRoleChange={changeRole}
                onResend={resend}
                onRemove={askRemove}
              />
            ))}
          </ul>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground" role="status">
            No members match “{query.trim()}”.
          </p>
        )}
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-(--dialog-width)">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {invited
                ? `Revoke the invite for ${target?.email}?`
                : `Remove ${target ? displayName(target) : "this member"} from ${workspaceName}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {invited
                ? "The link in their email stops working right away. You can invite them again later."
                : `They lose access to every project, deployment and log in ${workspaceName} right away. Deployments they made stay online.`}
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
          <AvatarFallback>{initials(member)}</AvatarFallback>
        )}
      </Avatar>
      <div className="grid min-w-0 gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-label text-foreground">{name}</span>
          {member.you ? <Badge variant="secondary">You</Badge> : null}
          {invited ? <Badge variant="outline">Invited</Badge> : null}
        </div>
        <p className="truncate text-caption text-muted-foreground">
          {member.name ? member.email : null}
          {member.name && member.meta ? <span aria-hidden="true"> · </span> : null}
          {member.meta}
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
          <Button variant="ghost" size="sm" onClick={() => onResend(member)}>
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
