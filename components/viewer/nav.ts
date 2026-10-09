/**
 * Navigation model for the viewer, derived from lib/registry.ts. The sidebar,
 * the mobile menu, the command palette, the index pages and the pagers all
 * read from here so they never disagree.
 */
import {
  componentGroups,
  components,
  foundations,
  moleculeGroups,
  molecules,
  templates,
  type RegistryEntry,
  type TemplateEntry,
} from "@/lib/registry"

export type SectionId = "foundations" | "components" | "molecules" | "templates"

export interface NavItem {
  title: string
  href: string
  description: string
  /** Group inside the section, if any. */
  group?: string
}

export interface NavGroup {
  /** Group name. Omitted for the section's own pages (overview). */
  title?: string
  items: NavItem[]
}

export interface NavSection {
  id: SectionId
  title: string
  href: string
  description: string
  groups: NavGroup[]
}

export const sectionHref: Record<SectionId, string> = {
  foundations: "/foundations",
  components: "/components",
  molecules: "/molecules",
  templates: "/templates",
}

export const sectionTitle: Record<SectionId, string> = {
  foundations: "Foundations",
  components: "Components",
  molecules: "Molecules",
  templates: "Templates",
}

export const sectionDescription: Record<SectionId, string> = {
  foundations: "Colour, type, space, shape and motion: the tokens everything else is made of.",
  components: "Accessible primitives on Base UI, restyled from the ground up with Blocks tokens.",
  molecules: "Sections and app patterns composed only from components and tokens.",
  templates: "Full pages for Lumen, a deployment platform, built from molecules.",
}

/** One sentence per group, shown on the index pages. */
export const groupDescriptions: Record<string, string> = {
  Actions: "Buttons and toggles that make something happen.",
  Forms: "Controls for entering, choosing and confirming values.",
  Overlays: "Layers that sit above the page: dialogs, menus, popovers.",
  Navigation: "Ways to move between views and pages.",
  "Data display": "Containers and patterns for showing content and data.",
  Feedback: "Status, progress and loading states.",
  Conversation: "Building blocks for chat and assistant interfaces.",
  Site: "Headers, footers and the pieces every marketing page shares.",
  "Marketing sections": "Full-width sections for landing and product pages.",
  "Commerce & content": "Pricing, changelogs, posts, people and contact.",
  App: "Product UI patterns for dashboards and tools.",
  Account: "Sign-in, onboarding, settings and billing.",
  Marketing: "Public pages: landing, pricing, changelog, blog and more.",
}

export const templateKinds: { kind: TemplateEntry["kind"]; title: string }[] = [
  { kind: "marketing", title: "Marketing" },
  { kind: "auth", title: "Account" },
  { kind: "app", title: "App" },
]

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function toItem(base: string, entry: RegistryEntry): NavItem {
  return {
    title: entry.title,
    href: `${base}/${entry.slug}`,
    description: entry.description,
    group: entry.group,
  }
}

function grouped(base: string, groups: readonly string[], entries: RegistryEntry[]): NavGroup[] {
  return groups
    .map((group) => ({
      title: group,
      items: entries.filter((e) => e.group === group).map((e) => toItem(base, e)),
    }))
    .filter((g) => g.items.length > 0)
}

export const navSections: NavSection[] = [
  {
    id: "foundations",
    title: sectionTitle.foundations,
    href: sectionHref.foundations,
    description: sectionDescription.foundations,
    groups: [
      {
        items: [
          { title: "Overview", href: sectionHref.foundations, description: sectionDescription.foundations },
          ...foundations.map((e) => toItem(sectionHref.foundations, e)),
        ],
      },
    ],
  },
  {
    id: "components",
    title: sectionTitle.components,
    href: sectionHref.components,
    description: sectionDescription.components,
    groups: [
      { items: [{ title: "Overview", href: sectionHref.components, description: sectionDescription.components }] },
      ...grouped(sectionHref.components, componentGroups, components),
    ],
  },
  {
    id: "molecules",
    title: sectionTitle.molecules,
    href: sectionHref.molecules,
    description: sectionDescription.molecules,
    groups: [
      { items: [{ title: "Overview", href: sectionHref.molecules, description: sectionDescription.molecules }] },
      ...grouped(sectionHref.molecules, moleculeGroups, molecules),
    ],
  },
  {
    id: "templates",
    title: sectionTitle.templates,
    href: sectionHref.templates,
    description: sectionDescription.templates,
    groups: [
      { items: [{ title: "Gallery", href: sectionHref.templates, description: sectionDescription.templates }] },
      ...templateKinds.map(({ kind, title }) => ({
        title,
        items: templates
          .filter((t) => t.kind === kind)
          .map((t) => ({ title: t.title, href: `${sectionHref.templates}/${t.slug}`, description: t.description, group: title })),
      })),
    ],
  },
]

/** Which section a pathname belongs to, if any. */
export function sectionForPath(pathname: string): SectionId | undefined {
  return (Object.keys(sectionHref) as SectionId[]).find(
    (id) => pathname === sectionHref[id] || pathname.startsWith(`${sectionHref[id]}/`)
  )
}

export function isActivePath(pathname: string, href: string) {
  return pathname === href
}

export interface PagerLink {
  title: string
  href: string
  group: string
}

/** Previous and next entries inside the same group. */
export function pagerFor<T extends { slug: string; title: string; group: string }>(
  entries: T[],
  slug: string,
  base: string,
  sameGroup: (a: T, b: T) => boolean = (a, b) => a.group === b.group
): { prev?: PagerLink; next?: PagerLink } {
  const current = entries.find((e) => e.slug === slug)
  if (!current) return {}
  const siblings = entries.filter((e) => sameGroup(e, current))
  const index = siblings.indexOf(current)
  const link = (e: T | undefined): PagerLink | undefined =>
    e ? { title: e.title, href: `${base}/${e.slug}`, group: e.group } : undefined
  return { prev: link(siblings[index - 1]), next: link(siblings[index + 1]) }
}
