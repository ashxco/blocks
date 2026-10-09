import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

import { molecules, type RegistryEntry } from "@/lib/registry"

/*
 * Server only (it reads the file system).
 *
 * Which molecules a template is built from, read from the template's own
 * source: its page, the layouts above it and every local module those import.
 * Reading the imports keeps the list true as templates change, with nothing
 * to keep in sync by hand.
 */

// Read at render time from the project's own sources. The ignore comment
// keeps Turbopack from tracing the whole project into the server output.
const root = path.join(/* turbopackIgnore: true */ process.cwd())
const liveRoot = path.join(root, "app", "(live)")
const localImport = /(?:from|import)\s+["']((?:\.{1,2}\/|@\/app\/)[^"']+)["']/g
const extensions = ["", ".tsx", ".ts", "/index.tsx", "/index.ts"]

function isGroup(name: string) {
  return name.startsWith("(") && name.endsWith(")")
}

function dirs(dir: string) {
  try {
    return readdirSync(dir).filter((name) => statSync(path.join(dir, name)).isDirectory())
  } catch {
    return []
  }
}

/**
 * Finds the folder that serves a route, looking through route groups, and
 * the layout files on the way down to it.
 */
function resolveRoute(href: string): { dir: string; layouts: string[] } | null {
  const segments = href.split("/").filter(Boolean)

  function walk(dir: string, rest: string[], layouts: string[]): { dir: string; layouts: string[] } | null {
    const here = path.join(dir, "layout.tsx")
    const withHere = existsSync(here) ? [...layouts, here] : layouts
    if (rest.length === 0) {
      if (existsSync(path.join(dir, "page.tsx"))) return { dir, layouts: withHere }
      for (const group of dirs(dir).filter(isGroup)) {
        const found = walk(path.join(dir, group), rest, withHere)
        if (found) return found
      }
      return null
    }
    const [head, ...tail] = rest
    if (dirs(dir).includes(head)) {
      const found = walk(path.join(dir, head), tail, withHere)
      if (found) return found
    }
    for (const group of dirs(dir).filter(isGroup)) {
      const found = walk(path.join(dir, group), rest, withHere)
      if (found) return found
    }
    return null
  }

  return walk(liveRoot, segments, [])
}

function resolveImport(from: string, spec: string) {
  const base = spec.startsWith("@/") ? path.join(root, spec.slice(2)) : path.resolve(path.dirname(from), spec)
  for (const ext of extensions) {
    const file = base + ext
    if (existsSync(file) && statSync(file).isFile()) return file
  }
  return null
}

/*
 * Render order. Each file's imports are placed where the file first renders
 * them (<Name …>), and local modules are expanded in place, so the list reads
 * like the page: a layout's header, the page's sections top to bottom, then
 * the layout's footer. A layout's {children} marks where the next layout
 * down, and finally the page, goes.
 */
const importStatement = /import\s+(?!type\s)([\w$*\s{},]*?)\s+from\s+["']([^"']+)["']/g
const blockSpec = /^@\/components\/blocks\/([a-z0-9-]+)(?:\/.*)?$/

/** The value names an import statement binds: default, named (with "as") and namespace. */
function importedNames(clause: string) {
  const names: string[] = []
  const named = clause.match(/\{([\s\S]*)\}/)
  if (named) {
    for (const part of named[1].split(",")) {
      // Type-only names are never rendered.
      if (/^\s*type\s/.test(part)) continue
      const name = part.split(/\s+as\s+/).pop()?.trim()
      if (name) names.push(name)
    }
  }
  const rest = clause.replace(/\{[\s\S]*\}/, "").split(",")
  for (const part of rest) {
    const name = part.replace(/^\s*\*\s+as\s+/, "").trim()
    if (/^[A-Za-z_$][\w$]*$/.test(name)) names.push(name)
  }
  return names
}

/** Where a file first renders a name as JSX (<Name …>), after its imports. */
function firstTag(source: string, name: string, after: number) {
  const escaped = name.replace(/\$/g, "\\$")
  const tag = new RegExp(`<${escaped}(?=[\\s/>.])`).exec(source.slice(after))
  return tag ? after + tag.index : Infinity
}

/** Where a file first uses a name at all, after its imports. */
function firstUse(source: string, name: string, after: number) {
  const tag = firstTag(source, name, after)
  if (tag < Infinity) return tag
  const use = new RegExp(`\\b${name.replace(/\$/g, "\\$")}\\b`).exec(source.slice(after))
  return use ? after + use.index : Infinity
}

type Part = { at: number; slug?: string; file?: string; children?: true }

/** The molecule slugs a file renders, in order, with `inner` placed at its {children}. */
function renderOrder(file: string, inner: string[], seen: Set<string>): string[] {
  if (seen.has(file)) return []
  seen.add(file)
  let source: string
  try {
    source = readFileSync(file, "utf8")
  } catch {
    return inner
  }
  const imports = [...source.matchAll(importStatement)]
  const body = imports.length ? imports[imports.length - 1].index! + imports[imports.length - 1][0].length : 0

  const parts: Part[] = []
  for (const [, clause, spec] of imports) {
    const block = spec.match(blockSpec)
    const local = block ? null : /^(?:\.{1,2}\/|@\/app\/)/.test(spec) ? resolveImport(file, spec) : null
    if (!block && !(local && local.startsWith(liveRoot) && !local.endsWith(`${path.sep}page.tsx`))) continue
    const names = importedNames(clause)
    if (block) {
      // A molecule takes its place where it is rendered; helpers and data
      // imported from it do not place it.
      const at = Math.min(...names.map((name) => firstTag(source, name, body)))
      if (at < Infinity) parts.push({ at, slug: block[1] })
    } else {
      // A local module may render molecules wherever it is first used.
      parts.push({ at: Math.min(...names.map((name) => firstUse(source, name, body))), file: local! })
    }
  }
  // {children} as rendered, not the ({ children }: Props) that receives it.
  const children = /\{\s*(?:props\.)?children\s*\}(?!\s*[:=,)])/.exec(source.slice(body))
  parts.push({ at: children ? body + children.index : Infinity, children: true })

  return parts
    .sort((a, b) => a.at - b.at)
    .flatMap((part) => (part.children ? inner : part.slug ? [part.slug] : renderOrder(part.file!, [], seen)))
}

const cache = new Map<string, RegistryEntry[]>()

/**
 * The molecules a template uses, in the order the page renders them (the
 * layout's header first, its footer last). Empty if its source cannot be read.
 */
export function moleculesForTemplate(href: string): RegistryEntry[] {
  const cached = cache.get(href)
  if (cached && process.env.NODE_ENV === "production") return cached

  const route = resolveRoute(href)
  if (!route) return []

  const found = new Set<string>()
  const seen = new Set<string>()
  const queue = [path.join(route.dir, "page.tsx"), ...route.layouts]

  while (queue.length) {
    const file = queue.pop()!
    if (seen.has(file)) continue
    seen.add(file)
    let source: string
    try {
      source = readFileSync(file, "utf8")
    } catch {
      continue
    }
    // A molecule counts when the template renders something imported from
    // it: the molecule itself or one of its visible parts. Data, constants,
    // helpers and types borrowed from a molecule do not make the page built
    // from it.
    const imports = [...source.matchAll(importStatement)]
    const body = imports.length ? imports[imports.length - 1].index! + imports[imports.length - 1][0].length : 0
    for (const [, clause, spec] of imports) {
      const block = spec.match(blockSpec)
      if (block && importedNames(clause).some((name) => firstTag(source, name, body) < Infinity)) found.add(block[1])
    }
    for (const match of source.matchAll(localImport)) {
      const next = resolveImport(file, match[1])
      // Follow the template's own modules only, never into other routes' pages.
      if (next && next.startsWith(liveRoot) && !next.endsWith(`${path.sep}page.tsx`)) queue.push(next)
    }
  }

  // Page first, then each layout around it, innermost to outermost.
  let order = renderOrder(path.join(route.dir, "page.tsx"), [], new Set())
  for (const layout of [...route.layouts].reverse()) order = renderOrder(layout, order, new Set())
  const rank = new Map<string, number>()
  order.forEach((slug, index) => {
    if (!rank.has(slug)) rank.set(slug, index)
  })

  // Anything the render order could not place goes last, in registry order.
  const result = molecules
    .filter((m) => found.has(m.slug))
    .map((m, index) => ({ m, key: rank.get(m.slug) ?? order.length + index }))
    .sort((a, b) => a.key - b.key)
    .map(({ m }) => m)
  cache.set(href, result)
  return result
}
