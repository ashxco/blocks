"use client"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Comparison } from "@/components/blocks/comparison"

export default function ComparisonDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        layout="full"
        description="Your product with an ink border and success checks beside the alternative on a tinted card with muted crosses. Stacks in narrow slots."
        code={`<Comparison />`}
      >
        <Comparison />
      </Example>

      <Example
        title="Against doing it yourself"
        layout="full"
        description="Compare with the alternative people actually consider. Keep the same number of rows on both sides so they line up."
        code={`<Comparison
  title="Less YAML, same control."
  description="Everything a Kubernetes cluster gives you for a web app, without running the cluster."
  them={{
    name: "Running your own cluster",
    items: ["Write and maintain manifests", "Patch nodes and the control plane", "Wire up ingress, TLS and DNS", "Pay for idle capacity"],
  }}
  us={{
    name: "Lumen",
    items: ["Detects your stack from the repo", "Managed, patched runtime", "Domains and TLS in one click", "Scale to zero on previews"],
  }}
/>`}
      >
        <Comparison
          title="Less YAML, same control."
          description="Everything a Kubernetes cluster gives you for a web app, without running the cluster."
          them={{
            name: "Running your own cluster",
            items: [
              "Write and maintain manifests",
              "Patch nodes and the control plane",
              "Wire up ingress, TLS and DNS",
              "Pay for idle capacity",
            ],
          }}
          us={{
            name: "Lumen",
            items: [
              "Detects your stack from the repo",
              "Managed, patched runtime",
              "Domains and TLS in one click",
              "Scale to zero on previews",
            ],
          }}
        />
      </Example>

      <Guidelines
        do={[
          "Write both columns as plain facts a customer can verify.",
          "Match rows one to one, in the same order.",
          "Name the alternative generically (“Typical hosted platform”), not a competitor.",
        ]}
        dont={[
          "Don’t mix checks and crosses on the same side.",
          "Don’t add more than six rows; link to a full comparison instead.",
          "Don’t colour the alternative red; muted is enough.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "title", type: "ReactNode | null", default: '"Why teams switch to Lumen."', description: "Centred section heading. Pass null to render the cards alone." },
          { prop: "description", type: "ReactNode", description: "Supporting text under the heading." },
          { prop: "us", type: "{ name: ReactNode; items: string[] }", default: "Lumen, five rows", description: "Your side: 2px ink border and success checks." },
          { prop: "them", type: "{ name: ReactNode; items: string[] }", default: '"Typical hosted platform", five rows', description: "The alternative: tinted card and muted crosses." },
          { prop: "contained", type: "boolean", default: "true", description: "Render the page container and section spacing." },
          { prop: "className", type: "string", description: "Classes for the section." },
        ]}
      />
    </Examples>
  )
}
