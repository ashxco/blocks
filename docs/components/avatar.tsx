import { UserIcon, UsersIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const team = [
  { initials: "PR", name: "Priya Raman", role: "Owner", email: "priya@lumen.app", online: true },
  { initials: "MO", name: "Mateo Ortiz", role: "Admin", email: "mateo@lumen.app", online: true },
  { initials: "AK", name: "Aiko Kato", role: "Developer", email: "aiko@lumen.app", online: false },
  { initials: "JB", name: "Jonas Berg", role: "Developer", email: "jonas@lumen.app", online: false },
]

const tints = [
  { tone: "violet", initials: "PR" },
  { tone: "mint", initials: "MO" },
  { tone: "sand", initials: "AK" },
  { tone: "sky", initials: "JB" },
  { tone: "rose", initials: "LT" },
  { tone: "muted", initials: "SN" },
] as const

export default function AvatarDocs() {
  return (
    <Examples>
      <Example
        title="Sizes"
        description="Four sizes, each a token: --avatar-size-sm, --avatar-size-md (the default), --avatar-size-lg and --avatar-size-xl."
        code={`<Avatar size="sm"><AvatarFallback>PR</AvatarFallback></Avatar>
<Avatar><AvatarFallback>PR</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>PR</AvatarFallback></Avatar>
<Avatar size="xl"><AvatarFallback>PR</AvatarFallback></Avatar>`}
      >
        <Avatar size="sm">
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
        <Avatar size="xl">
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
      </Example>

      <Example
        title="Fallback tints"
        description="Initials sit on a flat tint. The tint is picked from the initials, so the same person always gets the same colour. Set tone to choose one."
        code={`<Avatar>
  <AvatarImage src={user.avatarUrl} alt="" />
  <AvatarFallback>MO</AvatarFallback>
</Avatar>

<AvatarFallback tone="sky">MO</AvatarFallback>`}
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
  <AvatarFallback>PR</AvatarFallback>
  <AvatarBadge className="bg-success" aria-label="Online" />
</Avatar>`}
      >
        <Avatar>
          <AvatarFallback>PR</AvatarFallback>
          <AvatarBadge className="bg-success" aria-label="Online" />
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>MO</AvatarFallback>
          <AvatarBadge className="bg-warning" aria-label="Away" />
        </Avatar>
        <Avatar size="xl">
          <AvatarFallback>AK</AvatarFallback>
          <AvatarBadge className="bg-muted-foreground" aria-label="Offline" />
        </Avatar>
      </Example>

      <Example
        title="Stack"
        description="AvatarGroup overlaps avatars with a cut-out in the page colour. End with a count when there are more."
        code={`<AvatarGroup>
  <Avatar><AvatarFallback>PR</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>MO</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>AK</AvatarFallback></Avatar>
  <AvatarGroupCount>+4</AvatarGroupCount>
</AvatarGroup>`}
      >
        <AvatarGroup>
          <Avatar size="sm">
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>MO</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>MO</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JB</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
        <AvatarGroup>
          <Avatar size="lg">
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>MO</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>AK</AvatarFallback>
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
              <h3 className="text-title text-foreground">Lumen Core</h3>
              <p className="text-sm text-muted-foreground">4 members · 2 online</p>
            </div>
            <AvatarGroup>
              {team.map((m) => (
                <Avatar key={m.initials} size="sm">
                  <AvatarFallback>{m.initials}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
          <ul className="divide-y">
            {team.map((m) => (
              <li key={m.email} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar>
                  <AvatarFallback>{m.initials}</AvatarFallback>
                  {m.online ? <AvatarBadge className="bg-success" aria-label="Online" /> : null}
                </Avatar>
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{m.email}</p>
                </div>
                <Badge variant={m.role === "Owner" ? "default" : "secondary"}>{m.role}</Badge>
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
          "Don’t use brand violet for status dots. Use success, warning or muted.",
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
