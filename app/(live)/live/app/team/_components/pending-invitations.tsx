"use client"

import * as React from "react"
import { MailIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { ROLE_LABELS } from "@/components/blocks/members-list/roles"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

import type { Invitation } from "./team-data"

export interface PendingInvitationsProps {
  invitations: Invitation[]
  onResend: (invitation: Invitation) => void
  onRevoke: (invitation: Invitation) => void
  className?: string
}

/** Invites that haven’t been accepted yet, with their expiry and quick actions. */
export function PendingInvitations({ invitations, onResend, onRevoke, className }: PendingInvitationsProps) {
  return (
    <Card className={cn("@container", className)}>
      <CardHeader className="border-b">
        <CardTitle>
          <h2>Pending invitations</h2>
        </CardTitle>
        <CardDescription>Invites expire after 7 days. Sending one again restarts the clock.</CardDescription>
      </CardHeader>

      <CardContent>
        {invitations.length ? (
          <ul className="-my-4 divide-y">
            {invitations.map((invitation) => (
              <InvitationRow
                key={invitation.id}
                invitation={invitation}
                onResend={onResend}
                onRevoke={onRevoke}
              />
            ))}
          </ul>
        ) : (
          <Empty variant="plain" className="py-6 sm:py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MailIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No pending invitations</EmptyTitle>
              <EmptyDescription>
                Everyone you invited has joined. New invites show up here until they’re accepted.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

function InvitationRow({
  invitation,
  onResend,
  onRevoke,
}: {
  invitation: Invitation
  onResend: (invitation: Invitation) => void
  onRevoke: (invitation: Invitation) => void
}) {
  const expired = invitation.daysLeft <= 0

  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 py-4 @prose:grid-cols-[auto_minmax(0,1fr)_auto] @prose:gap-x-4">
      <Avatar>
        <AvatarFallback tone="muted">
          <MailIcon aria-hidden="true" />
        </AvatarFallback>
      </Avatar>

      <div className="grid min-w-0 gap-0.5">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="truncate text-label text-foreground">{invitation.email}</span>
          <ExpiryBadge daysLeft={invitation.daysLeft} />
        </div>
        <p className="text-caption text-muted-foreground @prose:truncate">
          {ROLE_LABELS[invitation.role]}
          <span aria-hidden="true"> · </span>
          Invited by {invitation.invitedBy} {invitation.sent}
        </p>
      </div>

      <div className="col-start-2 flex items-center gap-2 @prose:col-start-auto @prose:justify-end">
        <Button variant={expired ? "outline" : "ghost"} size="sm" onClick={() => onResend(invitation)}>
          {expired ? "Send again" : "Resend"}
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Revoke the invite for ${invitation.email}`}
          onClick={() => onRevoke(invitation)}
          className="text-muted-foreground hover:text-destructive"
        >
          <XIcon />
        </Button>
      </div>
    </li>
  )
}

function ExpiryBadge({ daysLeft }: { daysLeft: number }) {
  if (daysLeft <= 0) return <Badge variant="destructive">Expired</Badge>
  if (daysLeft === 1) return <Badge variant="warning">Expires tomorrow</Badge>
  return <Badge variant="outline">Expires in {daysLeft} days</Badge>
}
