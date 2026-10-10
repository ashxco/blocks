import { UserIcon, UsersIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import { initialsTone } from "@/docs/sample/people"
import { Badge } from "@/components/ui/badge"

const team = [
  { initials: "MP", name: "Maya Patel", role: "Owner", email: "maya@acme.com", online: true },
  { initials: "HK", name: "Hana Kim", role: "Admin", email: "hana@acme.com", online: false },
  { initials: "PR", name: "Priya Raman", role: "Member", email: "priya@acme.com", online: true },
  { initials: "SA", name: "Sofia Alvarez", role: "Member", email: "sofia@acme.com", online: false },
  { initials: "JL", name: "Jordan Lee", role: "Member", email: "jordan@acme.com", online: false },
]

/* One teammate per tint, each in the tint every docs example gives them (docs/sample/people.ts), so nobody changes colour between examples. */
const tints = [
  { tone: "violet", initials: "MP" },
  { tone: "mint", initials: "JL" },
  { tone: "sand", initials: "HK" },
  { tone: "sky", initials: "PR" },
  { tone: "rose", initials: "SA" },
] as const

export default function AvatarDocs() {
  return (
    <Examples>
      <Example
        title="Sizes"
        description="Four sizes, each a token: --avatar-size-sm, --avatar-size-md (the default), --avatar-size-lg and --avatar-size-xl."
        code={`<Avatar size="sm"><AvatarFallback tone="violet">MP</AvatarFallback></Avatar>
<Avatar><AvatarFallback tone="violet">MP</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback tone="violet">MP</AvatarFallback></Avatar>
<Avatar size="xl"><AvatarFallback tone="violet">MP</AvatarFallback></Avatar>`}
      >
        <Avatar size="sm">
          <AvatarFallback tone="violet">MP</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback tone="violet">MP</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback tone="violet">MP</AvatarFallback>
        </Avatar>
        <Avatar size="xl">
          <AvatarFallback tone="violet">MP</AvatarFallback>
        </Avatar>
      </Example>

      <Example
        title="Fallback tints"
        description="Initials sit on a flat tint. Without a tone, the tint is picked from the initials, so the same initials always get the same colour. Set tone to give a person the same colour everywhere they appear, or muted for an icon."
        code={`<Avatar>
  <AvatarImage src={user.avatarUrl} alt="" />
  <AvatarFallback>JL</AvatarFallback>
</Avatar>

<AvatarFallback tone="violet">MP</AvatarFallback>

<AvatarFallback tone="muted"><UserIcon /></AvatarFallback>`}
      >
        {tints.map((t) => (
          <Avatar key={t.tone} size="lg">
            <AvatarFallback tone={t.tone}>{t.initials}</AvatarFallback>
          </Avatar>
        ))}
        <Avatar size="lg">
          <AvatarFallback tone="muted">
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback tone="muted">
            <UsersIcon />
          </AvatarFallback>
        </Avatar>
      </Example>

      <Example
        title="With status"
        description="AvatarBadge marks presence. Colour it with a status fill."
        code={`<Avatar size="lg">
  <AvatarFallback tone="violet">MP</AvatarFallback>
  <AvatarBadge className="bg-success" aria-label="Online" />
</Avatar>`}
      >
        <Avatar>
          <AvatarFallback tone="violet">MP</AvatarFallback>
          <AvatarBadge className="bg-success" aria-label="Online" />
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback tone="mint">JL</AvatarFallback>
          <AvatarBadge className="bg-warning" aria-label="Away" />
        </Avatar>
        <Avatar size="xl">
          <AvatarFallback tone="rose">SA</AvatarFallback>
          <AvatarBadge className="bg-muted-foreground" aria-label="Offline" />
        </Avatar>
      </Example>

      <Example
        title="Stack"
        description="AvatarGroup overlaps avatars with a cut-out in the page colour. End with a count when there are more."
        code={`<AvatarGroup>
  <Avatar><AvatarFallback tone="violet">MP</AvatarFallback></Avatar>
  <Avatar><AvatarFallback tone="mint">JL</AvatarFallback></Avatar>
  <Avatar><AvatarFallback tone="rose">SA</AvatarFallback></Avatar>
  <AvatarGroupCount>+4</AvatarGroupCount>
</AvatarGroup>`}
      >
        <AvatarGroup>
          <Avatar size="sm">
            <AvatarFallback tone="violet">MP</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback tone="mint">JL</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback tone="rose">SA</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback tone="violet">MP</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback tone="mint">JL</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback tone="rose">SA</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback tone="mint">SO</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
        <AvatarGroup>
          <Avatar size="lg">
            <AvatarFallback tone="violet">MP</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback tone="mint">JL</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback tone="rose">SA</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+12</AvatarGroupCount>
        </AvatarGroup>
      </Example>

      <Example
        title="Team members"
        description="Avatars anchor rows of people, beside a name and a secondary line."
        layout="stack"
      >
        <div className="overflow-hidden rounded-(--card-radius) border bg-card">
          <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
            <div className="grid gap-0.5">
              <h3 className="text-title text-foreground">Website relaunch</h3>
              <p className="text-sm text-muted-foreground">5 members · 2 online</p>
            </div>
            <AvatarGroup>
              {team.map((m) => (
                <Avatar key={m.initials} size="sm">
                  <AvatarFallback tone={initialsTone(m.initials)}>{m.initials}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
          <ul className="divide-y">
            {team.map((m) => (
              <li key={m.email} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar>
                  <AvatarFallback tone={initialsTone(m.initials)}>{m.initials}</AvatarFallback>
                  {m.online ? <AvatarBadge className="bg-success" aria-label="Online" /> : null}
                </Avatar>
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{m.email}</p>
                </div>
                <Badge variant={m.role === "Owner" ? "default" : m.role === "Admin" ? "outline" : "secondary"}>{m.role}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </Example>

      <Guidelines
        do={[
          "Always include a fallback with initials. Images fail and take time to load.",
          "Use alt=\"\" on the image when the name is written next to it.",
          "Keep the same size for every avatar in a list or stack.",
        ]}
        dont={[
          "Don’t use avatars as decoration. Each one stands for a real person or team.",
          "Don’t put more than five avatars in a stack. Show the rest as a count.",
          "Don’t use the accent for status dots. Use success, warning or muted.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "size", type: '"sm" | "default" | "lg" | "xl"', default: '"default"', description: "Avatar size from --avatar-size-*. Fallback text scales with it." },
          { prop: "AvatarImage src", type: "string", description: "Photo URL. The fallback shows until it loads, and if it fails." },
          { prop: "AvatarFallback tone", type: '"violet" | "mint" | "sand" | "sky" | "rose" | "muted"', default: "from initials", description: "Tint behind the initials." },
          { prop: "AvatarFallback delay", type: "number", description: "Milliseconds to wait before showing the fallback, to avoid a flash." },
          { prop: "AvatarBadge", type: "component", description: "Status dot on the lower edge. Ink by default; colour it with bg-success and similar." },
          { prop: "AvatarGroupCount", type: "component", description: "The count at the end of a stack." },
        ]}
      />
    </Examples>
  )
}
