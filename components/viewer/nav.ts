/**
 * Navigation model for the viewer, derived from lib/registry.ts. The sidebar, the mobile menu, the command palette, the index pages, the
 * 404 pages and the pagers all read from here so they never disagree.
 */
import {
  componentGroups,
  components,
  foundations,
  type RegistryEntry,
} from "@/lib/registry"

export type SectionId = "foundations" | "components"

interface NavItem {
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

interface NavSection {
  id: SectionId
  title: string
  href: string
  description: string
  groups: NavGroup[]
}

export const sectionHref: Record<SectionId, string> = {
  foundations: "/foundations",
  components: "/components",
}

const sectionTitle: Record<SectionId, string> = {
  foundations: "Foundations",
  components: "Components",
}

export const sectionDescription: Record<SectionId, string> = {
  foundations:
    "Colour, type, space, shape, motion and themes: the tokens everything else is made of.",
  components:
    "Accessible primitives on Base UI, restyled from the ground up with Blocks tokens.",
}

/** One sentence per component group, shown on the Components index. */
export const groupDescriptions: Record<string, string> = {
  Actions: "Buttons and toggles that make something happen.",
  Forms: "Controls for entering, choosing and confirming values.",
  Overlays: "Layers that sit above the page: dialogs, menus, popovers.",
  Navigation: "Ways to move between views and pages.",
  "Data display": "Containers and patterns for showing content and data.",
  Feedback: "Status, progress and loading states.",
  Conversation: "Building blocks for chat and assistant interfaces.",
}

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

function grouped(
  base: string,
  groups: readonly string[],
  entries: RegistryEntry[]
): NavGroup[] {
  return groups
    .map((group) => ({
      title: group,
      items: entries
        .filter((e) => e.group === group)
        .map((e) => toItem(base, e)),
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
          {
            title: "Overview",
            href: sectionHref.foundations,
            description: sectionDescription.foundations,
          },
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
      {
        items: [
          {
            title: "Overview",
            href: sectionHref.components,
            description: sectionDescription.components,
          },
        ],
      },
      ...grouped(sectionHref.components, componentGroups, components),
    ],
  },
]

/** Which section a pathname belongs to, if any. */
export function sectionForPath(pathname: string): SectionId | undefined {
  return (Object.keys(sectionHref) as SectionId[]).find(
    (id) =>
      pathname === sectionHref[id] || pathname.startsWith(`${sectionHref[id]}/`)
  )
}

const themesEntry = foundations.find((e) => e.slug === "themes")

/**
 * The top-level destinations: the two sections, then Themes. Themes is a
 * Foundations page, but it is what makes Blocks more than one look, so the
 * header, the 404 pages and the overview link to it on its own.
 */
interface TopLink {
  id: SectionId | "themes" | "showcase"
  title: string
  href: string
  description: string
}

export const topLinks: TopLink[] = [
  ...navSections.map(({ id, title, href, description }) => ({
    id,
    title,
    href,
    description,
  })),
  ...(themesEntry
    ? [
        {
          id: "themes" as const,
          title: themesEntry.title,
          href: `${sectionHref.foundations}/${themesEntry.slug}`,
          description: themesEntry.description,
        },
      ]
    : []),
  {
    id: "showcase" as const,
    title: "Showcase",
    href: "/showcase",
    description: "One Acme screen in every theme.",
  },
]

export interface PagerLink {
  title: string
  href: string
  group: string
  /** Replaces the default "Previous in <group>" / "Next in <group>" caption. */
  caption?: string
}

/**
 * Previous and next pages for a doc page. Walks the whole section in sidebar
 * order, across group boundaries, so readers never hit a dead end: the first
 * entry leads back to the section overview and the last one on to the next
 * section, when there is one.
 */
export function pagerFor(
  sectionId: SectionId,
  slug: string
): { prev?: PagerLink; next?: PagerLink } {
  const sectionIndex = navSections.findIndex((s) => s.id === sectionId)
  const section = navSections[sectionIndex]
  const href = `${section.href}/${slug}`

  const items = section.groups
    .flatMap((g) => g.items)
    .filter((i) => i.href !== section.href)
  const index = items.findIndex((i) => i.href === href)
  if (index < 0) return {}
  const toLink = (i: NavItem): PagerLink => ({
    title: i.title,
    href: i.href,
    group: i.group ?? section.title,
  })

  const prev: PagerLink =
    index > 0
      ? toLink(items[index - 1])
      : {
          title: `${section.title} overview`,
          href: section.href,
          group: section.title,
          caption: "Back to the start",
        }

  const following = navSections[sectionIndex + 1]
  const next: PagerLink | undefined =
    index < items.length - 1
      ? toLink(items[index + 1])
      : following
        ? {
            title: following.title,
            href: following.href,
            group: following.title,
            caption: "Next section",
          }
        : undefined

  return { prev, next }
}
