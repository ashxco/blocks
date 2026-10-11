import { readFileSync } from "node:fs"
import path from "node:path"

import { components, foundations, type RegistryEntry } from "@/lib/registry"
import { siteUrl } from "@/lib/site"

/**
 * /llms.txt: what Blocks is, how to install it, every page and item in the
 * registry, and the full design contract (DESIGN.md), for agents and tools.
 * Prerendered at build time; DESIGN.md is read from the repo then.
 */
export const dynamic = "force-static"

const claim = "One component library, five real products."

function pageLine(section: "components" | "foundations", entry: RegistryEntry) {
  const page = `${siteUrl}/${section}/${entry.slug}`
  const registry =
    section === "components" ? `, registry ${siteUrl}/r/${entry.slug}.json` : ""
  return `- ${entry.title}: ${entry.description} (${page}${registry})`
}

function contract() {
  return readFileSync(path.join(process.cwd(), "DESIGN.md"), "utf8").trim()
}

export function GET() {
  const body = [
    "# Blocks",
    "",
    claim,
    "",
    "## Install",
    "",
    "npx shadcn@latest init -d",
    `npx shadcn@latest add ${siteUrl}/r/blocks.json --overwrite`,
    `npx shadcn@latest add ${siteUrl}/r/button.json --overwrite`,
    `npx shadcn@latest add ${siteUrl}/r/<slug>.json`,
    "",
    "init writes shadcn's own lib/utils.ts and components/ui/button.tsx; --overwrite replaces them with the Blocks files. No other item needs a flag.",
    'Then make app/globals.css exactly: @import "tailwindcss"; @import "./styles/blocks.css";',
    "Fonts are CSS variables on <html> (next/font): --font-jakarta and --font-geist-mono for the default theme; the Get started page lists every theme's. Missing variables fall back to the system stack.",
    "",
    "Or from npm: npm install @ashxsf/blocks",
    'Then make app/globals.css exactly: @import "tailwindcss"; @import "@ashxsf/blocks/css"; @source "../node_modules/@ashxsf/blocks/dist"; (the @source path is relative to that file). Import { Button } from "@ashxsf/blocks", or one file at a time from "@ashxsf/blocks/ui/<slug>".',
    "",
    `Registry index: ${siteUrl}/r/registry.json`,
    `Get started: ${siteUrl}/foundations/get-started`,
    "",
    "## Components",
    "",
    ...components.map((entry) => pageLine("components", entry)),
    "",
    "## Foundations",
    "",
    ...foundations.map((entry) => pageLine("foundations", entry)),
    "",
    "## Contract",
    "",
    contract(),
    "",
  ].join("\n")

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
