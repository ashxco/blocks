"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { TeamGrid, defaultTeam } from "@/components/blocks/team-grid"

export default function TeamGridDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Portrait tiles in flat tints with initials, then name and role. Two columns on phones, three from 42rem and four from 52rem."
        code={`<TeamGrid />`}
      >
        <TeamGrid />
      </Example>

      <Example
        title="With a hiring tile"
        layout="full"
        surface="subtle"
        description="Close the grid with a tile that links to open roles."
        code={`<TeamGrid
  members={members.slice(0, 7)}
  hiring={{
    title: "Join us",
    description: "4 open roles in engineering and design",
    href: "/live/contact",
  }}
/>`}
      >
        <TeamGrid
          members={defaultTeam.slice(0, 7)}
          hiring={{ title: "Join us", description: "4 open roles in engineering and design", href: "/live/contact" }}
        />
      </Example>

      <Example
        title="Grid only"
        layout="full"
        description="Pass title={null} and contained={false} to place the grid inside your own layout, such as a two-column about page."
        code={`<TeamGrid title={null} contained={false} members={members.slice(0, 4)} />`}
      >
        <div className="p-6 sm:p-10">
          <TeamGrid
            title={null}
            contained={false}
            members={[
              { name: "Maya Okafor", role: "Co-founder, CEO", tint: "panel" },
              { name: "Daniel Reyes", role: "Co-founder, CTO", tint: "violet" },
              { name: "Hana Sato", role: "Product design", tint: "sand" },
              { name: "Leo Martins", role: "Developer relations", tint: "mint" },
            ]}
          />
        </div>
      </Example>

      <Guidelines
        do={[
          "Write roles people outside the company understand.",
          "Keep everyone at the same tile size, founders included.",
          "Let the tints rotate so neighbours differ.",
        ]}
        dont={[
          "Don’t mix photos and initials tiles in one grid.",
          "Don’t add social icons to every tile; link to profiles from a single place.",
          "Don’t number or rank people.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "members", type: "TeamMember[]", default: "Eight Lumen people", description: "Name, role, optional initials and tint." },
          { prop: "title", type: "ReactNode | null", default: '"Small team. Big leverage."', description: "Section heading. Pass null to render the grid alone." },
          { prop: "description", type: "ReactNode", description: "Supporting line beside the heading." },
          { prop: "hiring", type: "{ title; description?; href } | null", default: "null", description: "Closing tile that links to open roles." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section padding." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />

      <ApiTable
        title="TeamMember"
        rows={[
          { prop: "name", type: "string", description: "Full name." },
          { prop: "role", type: "string", description: "Role or team." },
          { prop: "initials", type: "string", description: "Defaults to the first letters of the first and last name." },
          { prop: "tint", type: '"violet" | "mint" | "sand" | "sky" | "rose" | "panel"', description: "Portrait fill. Defaults to a rotation." },
        ]}
      />
    </Examples>
  )
}
