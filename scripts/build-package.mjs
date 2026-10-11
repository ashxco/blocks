/**
 * Builds the npm package @ashxsf/blocks into dist-pkg/.
 * Usage: npm run package
 *
 * The registry (npm run registry) stays the primary install path; the package
 * is the alternative for teams that prefer a dependency over owned source.
 *
 * 1. Copies the shipped sources (components/ui, the lib helpers, the
 *    primitives, the hooks and the generated token list) into dist-pkg/src and
 *    rewrites every "@/…" import to a relative path. The CSS goes to
 *    dist-pkg/dist/styles as it is.
 * 2. Writes a barrel (dist-pkg/src/index.ts) and compiles everything with
 *    tsc -p tsconfig.package.json into dist-pkg/dist (ESM + .d.ts).
 * 3. Reads the bare imports of the shipped sources to list the package's
 *    dependencies, pinned to the ranges in the root package.json, and writes
 *    dist-pkg/package.json, README.md and LICENSE.
 *
 * Publish with: cd dist-pkg && npm publish --access public
 */
import { spawnSync } from "node:child_process"
import {
  cp,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const out = path.join(root, "dist-pkg")
const srcDir = path.join(out, "src")
const distDir = path.join(out, "dist")

const PACKAGE_NAME = "@ashxsf/blocks"
const REPOSITORY = "https://github.com/ashxco/blocks"
const HOMEPAGE = "https://blocks-iota.vercel.app"
const REGISTRY_URL = `${HOMEPAGE}/r/blocks.json`
const PEER_DEPENDENCIES = { react: "^19.0.0", "react-dom": "^19.0.0" }
/** Never a dependency of the package: the sources must not import these. */
const FORBIDDEN = new Set(["next", "next-themes"])

/** What ships, relative to the repo root; the same paths inside dist-pkg/src. */
const trees = [
  { dir: "components/ui", filter: (name) => name.endsWith(".tsx") },
  { dir: "lib/primitives" },
  { dir: "hooks" },
]
const files = [
  "lib/utils.ts",
  "lib/portal-container.tsx",
  "lib/themes.ts",
  "lib/theme-scope.tsx",
  "design-system/generated/tokens.ts",
]

/**
 * Barrel overrides. The barrel re-exports every components/ui module with
 * `export *`. When tsc reports an ambiguous re-export (TS2308: two modules
 * export one name), list the later module here with the names it should
 * contribute, and the barrel writes an explicit export list for it. Consumers
 * still get every export from the module's own subpath (./ui/<name>).
 */
const explicitBarrel = new Map()

/** Import and export specifiers: from "x", import("x") and import "x". */
const specifierRe =
  /(\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)(["'])([^"'\n]+)\2/g

const sourceExts = new Set([".ts", ".tsx"])

async function exists(file) {
  try {
    await stat(file)
    return true
  } catch {
    return false
  }
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

function posix(p) {
  return p.split(path.sep).join("/")
}

/* 1. Copy ---------------------------------------------------------------- */

await rm(out, { recursive: true, force: true })
await mkdir(srcDir, { recursive: true })

for (const { dir, filter } of trees) {
  await cp(path.join(root, dir), path.join(srcDir, dir), {
    recursive: true,
    filter: async (source) => {
      if ((await stat(source)).isDirectory()) return true
      const ok = sourceExts.has(path.extname(source))
      return filter ? ok && filter(path.basename(source)) : ok
    },
  })
}
for (const file of files) {
  await mkdir(path.dirname(path.join(srcDir, file)), { recursive: true })
  await cp(path.join(root, file), path.join(srcDir, file))
}
await cp(path.join(root, "app/styles"), path.join(distDir, "styles"), {
  recursive: true,
  filter: async (source) =>
    (await stat(source)).isDirectory() || source.endsWith(".css"),
})

/* 2. Rewrite "@/…" imports to relative paths ------------------------------ */

const copied = []
for await (const file of walk(srcDir)) {
  if (sourceExts.has(path.extname(file))) copied.push(file)
}
copied.sort()

/** The module a "@/x" alias points at inside dist-pkg/src, or null. */
async function resolveAlias(target) {
  const base = path.join(srcDir, target)
  for (const candidate of [
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ]) {
    if (await exists(candidate)) return candidate
  }
  return null
}

const bareSpecifiers = new Set()
for (const file of copied) {
  const original = await readFile(file, "utf8")
  const unresolved = []
  const fromDir = posix(path.dirname(file))
  const rewritten = original.replace(
    specifierRe,
    (match, lead, quote, specifier) => {
      if (!specifier.startsWith("@/")) {
        if (!specifier.startsWith(".") && !specifier.startsWith("node:"))
          bareSpecifiers.add(specifier)
        return match
      }
      const target = specifier.slice(2)
      let relative = path.posix.relative(
        fromDir,
        posix(path.join(srcDir, target))
      )
      if (!relative.startsWith(".")) relative = `./${relative}`
      return `${lead}${quote}${relative}${quote}`
    }
  )
  for (const [, , , specifier] of original.matchAll(specifierRe)) {
    if (specifier.startsWith("@/") && !(await resolveAlias(specifier.slice(2))))
      unresolved.push(specifier)
  }
  if (unresolved.length) {
    throw new Error(
      `${path.relative(root, file)} imports ${unresolved.join(", ")}, which the package does not ship. Add it to the copied files in scripts/build-package.mjs.`
    )
  }
  if (rewritten !== original) await writeFile(file, rewritten)
}

/* 3. Barrel --------------------------------------------------------------- */

const uiModules = (await readdir(path.join(srcDir, "components/ui")))
  .filter((name) => name.endsWith(".tsx"))
  .map((name) => name.slice(0, -".tsx".length))
  .sort()

const barrel = [
  "// GENERATED by scripts/build-package.mjs. Do not edit.",
  "",
  ...uiModules.map((name) => {
    const names = explicitBarrel.get(`components/ui/${name}`)
    return names
      ? `export { ${names.join(", ")} } from "./components/ui/${name}"`
      : `export * from "./components/ui/${name}"`
  }),
  "",
  'export { cn } from "./lib/utils"',
  'export * from "./lib/theme-scope"',
  'export * from "./lib/themes"',
  "export {",
  "  PortalContainerProvider,",
  "  PortalScope,",
  "  ScopedPortal,",
  "  type PortalContainer,",
  '} from "./lib/portal-container"',
  "",
]
await writeFile(path.join(srcDir, "index.ts"), barrel.join("\n"))

/* 4. Compile -------------------------------------------------------------- */

const tsc = spawnSync(
  process.execPath,
  [
    path.join(root, "node_modules/typescript/bin/tsc"),
    "-p",
    path.join(root, "tsconfig.package.json"),
  ],
  { cwd: root, stdio: "inherit" }
)
if (tsc.status !== 0) {
  throw new Error(
    `tsc failed (exit ${tsc.status}). Fix the errors above; for TS2308 see explicitBarrel in scripts/build-package.mjs.`
  )
}

// tsc keeps directive prologues; make sure every "use client" survived.
const directiveRe = /^\s*(["'])use client\1/
const lostDirectives = []
for (const file of copied) {
  const source = await readFile(file, "utf8")
  if (!directiveRe.test(source)) continue
  const emitted = path
    .join(distDir, path.relative(srcDir, file))
    .replace(/\.tsx?$/, ".js")
  if (!directiveRe.test(await readFile(emitted, "utf8")))
    lostDirectives.push(path.relative(out, emitted))
}
if (lostDirectives.length) {
  throw new Error(
    `"use client" missing from the emitted files: ${lostDirectives.join(", ")}`
  )
}

/* 5. package.json, README, LICENSE ---------------------------------------- */

const rootPackage = JSON.parse(
  await readFile(path.join(root, "package.json"), "utf8")
)
const ranges = { ...rootPackage.devDependencies, ...rootPackage.dependencies }

/** "@scope/name/sub" -> "@scope/name", "name/sub" -> "name". */
function packageName(specifier) {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

const dependencies = {}
const missing = []
for (const specifier of bareSpecifiers) {
  const name = packageName(specifier)
  if (name in PEER_DEPENDENCIES) continue
  if (FORBIDDEN.has(name)) {
    throw new Error(
      `The shipped sources import ${specifier}; ${name} must never be a dependency of ${PACKAGE_NAME}.`
    )
  }
  if (!ranges[name]) {
    missing.push(name)
    continue
  }
  dependencies[name] = ranges[name]
}
if (missing.length) {
  throw new Error(
    `No version in package.json for: ${missing.join(", ")}. Add them to the root dependencies.`
  )
}
const sortedDependencies = Object.fromEntries(
  Object.entries(dependencies).sort(([a], [b]) => a.localeCompare(b))
)

function entry(file) {
  return { types: `./dist/${file}.d.ts`, default: `./dist/${file}.js` }
}

const packageJson = {
  name: PACKAGE_NAME,
  version: rootPackage.version,
  description:
    "Blocks design system: React components on Base UI and Tailwind CSS v4, with five themes from one set of design tokens.",
  license: "MIT",
  type: "module",
  sideEffects: ["**/*.css"],
  repository: { type: "git", url: `git+${REPOSITORY}.git` },
  homepage: HOMEPAGE,
  publishConfig: { access: "public" },
  files: ["dist", "README.md", "LICENSE"],
  main: "./dist/index.js",
  module: "./dist/index.js",
  types: "./dist/index.d.ts",
  exports: {
    ".": entry("index"),
    "./css": {
      style: "./dist/styles/blocks.css",
      default: "./dist/styles/blocks.css",
    },
    "./styles/*": "./dist/styles/*",
    "./ui/*": {
      types: "./dist/components/ui/*.d.ts",
      default: "./dist/components/ui/*.js",
    },
    "./utils": entry("lib/utils"),
    "./themes": entry("lib/themes"),
    "./theme-scope": entry("lib/theme-scope"),
    "./portal": entry("lib/portal-container"),
    "./tokens": entry("design-system/generated/tokens"),
    "./package.json": "./package.json",
  },
  peerDependencies: PEER_DEPENDENCIES,
  dependencies: sortedDependencies,
}
await writeFile(
  path.join(out, "package.json"),
  `${JSON.stringify(packageJson, null, 2)}\n`
)

const readme = `# Blocks

React components on Base UI and Tailwind CSS v4, with five themes from one set of design tokens and an API that follows shadcn/ui.

## Install

\`\`\`bash
npm install ${PACKAGE_NAME}
\`\`\`

React 19 and Tailwind CSS v4 are expected in your app.

## CSS

In your global stylesheet (\`app/globals.css\` in a Next.js app):

\`\`\`css
@import "tailwindcss";
@import "${PACKAGE_NAME}/css";
@source "../node_modules/${PACKAGE_NAME}/dist";
\`\`\`

The \`@source\` path is relative to the CSS file; it makes Tailwind scan the package's class names.

## Use

\`\`\`tsx
import { Button } from "${PACKAGE_NAME}"
// or one component at a time
import { Button } from "${PACKAGE_NAME}/ui/button"
\`\`\`

Also available: \`${PACKAGE_NAME}/utils\` (\`cn\`), \`${PACKAGE_NAME}/themes\` (\`themes\`, \`themeScript\`, \`withLook\`, …), \`${PACKAGE_NAME}/theme-scope\` (\`ThemeScope\`), \`${PACKAGE_NAME}/portal\` (\`PortalScope\`, \`ScopedPortal\`), \`${PACKAGE_NAME}/tokens\` (the generated token list) and \`${PACKAGE_NAME}/styles/*\` (the four CSS files).

## Themes and fonts

Fonts and themes work exactly as with the registry: define the \`--font-*\` CSS variables that \`tokens.css\` reads (in the default theme, \`--font-jakarta\` and \`--font-geist-mono\`), for example with \`next/font\` on \`<html>\`. Put \`data-theme="<id>"\` (\`blocks\`, \`ocean\`, \`forest\`, \`ember\` or \`mono\`) and \`.dark\` on any subtree to switch its theme and appearance; see ${HOMEPAGE}/foundations/get-started.

Prefer owning the source? Use the registry:

\`\`\`bash
npx shadcn@latest add ${REGISTRY_URL} --overwrite
\`\`\`

## License

MIT
`
await writeFile(path.join(out, "README.md"), readme)
await cp(path.join(root, "LICENSE"), path.join(out, "LICENSE"))

/* 6. Summary -------------------------------------------------------------- */

let count = 0
let bytes = 0
for await (const file of walk(out)) {
  if (file.startsWith(srcDir + path.sep)) continue
  count++
  bytes += (await stat(file)).size
}
console.log(
  `Built ${PACKAGE_NAME}@${packageJson.version} into dist-pkg: ${count} files, ${(bytes / 1024).toFixed(0)} kB (dist, package.json, README.md, LICENSE), ${Object.keys(sortedDependencies).length} dependencies.`
)
