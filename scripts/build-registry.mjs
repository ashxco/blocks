#!/usr/bin/env node
/**
 * Builds the shadcn-compatible registry into public/r/.
 *
 *   <origin>/r/registry.json   the index
 *   <origin>/r/blocks.json     the base item: CSS, utils, portal container,
 *                              themes, hooks, primitives and the generated
 *                              token data
 *   <origin>/r/<slug>.json     one item per components/ui/<slug>.tsx
 *
 * Install with the shadcn CLI:
 *
 *   npx shadcn@latest init -d
 *   npx shadcn@latest add <origin>/r/blocks.json --overwrite
 *   npx shadcn@latest add <origin>/r/button.json --overwrite
 *   npx shadcn@latest add <origin>/r/dropdown-menu.json
 *
 * init writes shadcn's own lib/utils.ts and components/ui/button.tsx, which
 * --overwrite replaces; every other item needs no flag. Every component item
 * depends on blocks.json, so adding a component alone pulls the base in too.
 * Node built-ins only; no network.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outDir = path.join(root, "public", "r")

/** The site origin: NEXT_PUBLIC_SITE_URL, else Vercel's production URL, else localhost. */
function siteOrigin() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "") ||
    "http://localhost:3000"
  return url.replace(/\/+$/, "")
}

const origin = siteOrigin()
const itemUrl = (name) => `${origin}/r/${name}.json`

const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"
const REGISTRY_SCHEMA = "https://ui.shadcn.com/schema/registry.json"
const ITEM_TYPES = new Set([
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:theme",
  "registry:page",
  "registry:file",
  "registry:style",
  "registry:base",
  "registry:font",
  "registry:item",
])

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))
const versions = { ...pkg.devDependencies, ...pkg.dependencies }

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8")
const exists = (rel) => fs.existsSync(path.join(root, rel))

/** Every .ts and .tsx file under a directory, as repo-relative paths, sorted. */
function walk(rel) {
  const abs = path.join(root, rel)
  return fs
    .readdirSync(abs, { withFileTypes: true })
    .flatMap((entry) => {
      const child = path.posix.join(rel, entry.name)
      if (entry.isDirectory()) return walk(child)
      return /\.tsx?$/.test(entry.name) ? [child] : []
    })
    .sort()
}

/* -------------------------------------------------------------------------- */
/* Imports                                                                     */
/* -------------------------------------------------------------------------- */

/** Modules the base item (blocks.json) provides under the @/ alias. */
const BASE_MODULES = [
  "@/lib/utils",
  "@/lib/portal-container",
  "@/lib/themes",
  "@/lib/theme-scope",
  "@/hooks/",
  "@/lib/primitives/",
  "@/design-system/generated/tokens",
]

/** Packages the consumer's framework already has. */
const PROVIDED_PACKAGES = new Set(["react", "react-dom", "next"])

/** Module specifiers a file imports (static and side-effect imports). */
function importsOf(source) {
  const specs = new Set()
  const re = /(?:\bfrom\s*|^\s*import\s+)["']([^"']+)["']/gm
  for (const match of source.matchAll(re)) specs.add(match[1])
  return [...specs]
}

/** The npm package a specifier belongs to: "@base-ui/react/menu" → "@base-ui/react". */
function packageName(spec) {
  const parts = spec.split("/")
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

/** Pinned "name@range" from package.json, or an error naming the file. */
function pinned(spec, file) {
  const name = packageName(spec)
  const range = versions[name]
  if (!range) {
    throw new Error(
      `${file} imports "${spec}" but "${name}" is not in package.json`
    )
  }
  return `${name}@${range}`
}

/**
 * The dependencies of a set of files: npm packages pinned from package.json,
 * component items from @/components/ui/*, and whether the base item is
 * needed. Relative imports and the framework's own packages are skipped.
 */
function resolveImports(files, { isBase = false } = {}) {
  const dependencies = new Set()
  const registryDependencies = new Set()
  for (const file of files) {
    for (const spec of importsOf(read(file))) {
      if (spec.startsWith(".")) continue
      if (spec.startsWith("@/components/ui/")) {
        const slug = spec.slice("@/components/ui/".length)
        if (!exists(`components/ui/${slug}.tsx`))
          throw new Error(`${file} imports unknown component "${spec}"`)
        registryDependencies.add(itemUrl(slug))
        continue
      }
      if (spec.startsWith("@/")) {
        if (!BASE_MODULES.some((m) => spec === m || spec.startsWith(m)))
          throw new Error(
            `${file} imports "${spec}", which blocks.json does not provide`
          )
        if (!isBase) registryDependencies.add(itemUrl("blocks"))
        continue
      }
      if (PROVIDED_PACKAGES.has(packageName(spec))) continue
      dependencies.add(pinned(spec, file))
    }
  }
  return {
    dependencies: [...dependencies].sort(),
    registryDependencies: [...registryDependencies].sort((a, b) =>
      // blocks.json first, then the components alphabetically.
      a === itemUrl("blocks")
        ? -1
        : b === itemUrl("blocks")
          ? 1
          : a < b
            ? -1
            : 1
    ),
  }
}

/* -------------------------------------------------------------------------- */
/* Titles and descriptions from lib/registry.ts                                */
/* -------------------------------------------------------------------------- */

function readRegistryEntries() {
  const source = read("lib/registry.ts")
  const start = source.indexOf("export const components")
  if (start === -1)
    throw new Error("lib/registry.ts: components array not found")
  const entries = new Map()
  // Each entry is an object literal; the fields may sit on one line or many.
  const field = (object, name) =>
    object.match(new RegExp(`\\b${name}:\\s*"((?:[^"\\\\]|\\\\.)*)"`))?.[1]
  for (const [, object] of source.slice(start).matchAll(/\{([^{}]*)\}/g)) {
    const slug = field(object, "slug")
    if (!slug) continue
    const title = field(object, "title")
    const description = field(object, "description")
    entries.set(slug, {
      title: title ? JSON.parse(`"${title}"`) : undefined,
      description: description ? JSON.parse(`"${description}"`) : undefined,
    })
  }
  return entries
}

/* -------------------------------------------------------------------------- */
/* Items                                                                       */
/* -------------------------------------------------------------------------- */

const file = (rel, type, target) => ({
  path: rel,
  type,
  ...(target ? { target } : {}),
  content: read(rel),
})

/**
 * The base item. Targets stay relative (no "~/"), so the shadcn CLI puts them
 * under src/ in a project that keeps its source there, next to the @/ alias.
 */
function baseItem() {
  const libFiles = [
    "lib/utils.ts",
    "lib/portal-container.tsx",
    "lib/themes.ts",
    "lib/theme-scope.tsx",
    ...walk("lib/primitives"),
  ]
  const hookFiles = walk("hooks")
  const generated = "design-system/generated/tokens.ts"
  const cssFiles = [
    "app/styles/tokens.css",
    "app/styles/variants.css",
    "app/styles/animate.css",
    "app/styles/blocks.css",
  ]
  const { dependencies } = resolveImports(
    [...libFiles, ...hookFiles, generated],
    { isBase: true }
  )
  return {
    $schema: ITEM_SCHEMA,
    name: "blocks",
    // A lib item, not a style: the CLI installs a style only after a
    // confirmation prompt that --yes has to answer, and nothing here needs
    // style semantics (no cssVars, no components.json changes).
    type: "registry:lib",
    title: "Blocks",
    description:
      "The Blocks base: design tokens, five themes, the dark and state variants, animations, the cn() helper, overlay portal scoping, hooks and primitives. Install this once, then add components.",
    dependencies,
    registryDependencies: [],
    files: [
      ...libFiles.map((rel) => file(rel, "registry:lib")),
      ...hookFiles.map((rel) => file(rel, "registry:hook")),
      file(generated, "registry:file", generated),
      ...cssFiles.map((rel) => file(rel, "registry:file", rel)),
    ],
    docs: [
      'Blocks is installed. In app/globals.css, keep @import "tailwindcss" and add @import "./styles/blocks.css" right after it (remove any other base styles).',
      "Then load the fonts the themes read, as CSS variables on <html>: --font-jakarta and --font-geist-mono (Blocks), --font-inter-tight (Ocean), --font-manrope and --font-bricolage (Forest), --font-dm-sans and --font-fraunces (Ember), --font-geist (Mono). Each falls back to the system stack.",
    ].join("\n"),
  }
}

function componentItem(slug, entries) {
  const rel = `components/ui/${slug}.tsx`
  const { dependencies, registryDependencies } = resolveImports([rel])
  // Every component needs the base (CSS and utils), whatever it imports.
  if (!registryDependencies.includes(itemUrl("blocks")))
    registryDependencies.unshift(itemUrl("blocks"))
  const entry = entries.get(slug)
  return {
    $schema: ITEM_SCHEMA,
    name: slug,
    type: "registry:ui",
    title: entry?.title ?? slug,
    ...(entry?.description ? { description: entry.description } : {}),
    dependencies,
    registryDependencies,
    files: [file(rel, "registry:ui")],
  }
}

/** The required fields of the registry-item schema. */
function validate(item) {
  const fail = (why) => {
    throw new Error(`${item.name ?? "?"}: ${why}`)
  }
  if (typeof item.name !== "string" || !item.name) fail("name is required")
  if (!ITEM_TYPES.has(item.type)) fail(`unknown type ${item.type}`)
  for (const f of item.files ?? []) {
    if (!f.path || !ITEM_TYPES.has(f.type)) fail(`bad file ${f.path}`)
    if ((f.type === "registry:file" || f.type === "registry:page") && !f.target)
      fail(`${f.path} needs a target`)
    if (typeof f.content !== "string" || !f.content)
      fail(`${f.path} has no content`)
  }
  for (const dep of item.registryDependencies ?? [])
    if (!dep.startsWith(`${origin}/r/`)) fail(`bad registry dependency ${dep}`)
}

/* -------------------------------------------------------------------------- */
/* Build                                                                       */
/* -------------------------------------------------------------------------- */

const entries = readRegistryEntries()
const slugs = fs
  .readdirSync(path.join(root, "components/ui"))
  .filter((name) => name.endsWith(".tsx"))
  .map((name) => name.slice(0, -".tsx".length))
  .sort()

const items = [baseItem(), ...slugs.map((slug) => componentItem(slug, entries))]
items.forEach(validate)

fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })

const write = (name, data) =>
  fs.writeFileSync(
    path.join(outDir, `${name}.json`),
    JSON.stringify(data, null, 2) + "\n"
  )

for (const item of items) write(item.name, item)

write("registry", {
  $schema: REGISTRY_SCHEMA,
  name: "blocks",
  homepage: origin,
  items: items.map(({ name, type, title, description, files }) => ({
    name,
    type,
    title,
    ...(description ? { description } : {}),
    files: files.map(({ path: p, type: t, target }) => ({
      path: p,
      type: t,
      ...(target ? { target } : {}),
    })),
  })),
})

const missing = slugs.filter((slug) => !entries.has(slug))
if (missing.length)
  console.warn(`registry: no lib/registry.ts entry for ${missing.join(", ")}`)

console.log(
  `Blocks registry: ${slugs.length} components + blocks.json + registry.json → public/r (${origin}/r/)`
)
