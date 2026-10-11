/**
 * Design-system lint. Fails when code bypasses Blocks tokens or rules.
 * Usage: npm run lint:ds [-- <path> ...]
 */
import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const defaultTargets = ["app", "components", "docs", "lib", "hooks"]
const ignore = [
  /node_modules/,
  /\.next/,
  /app\/styles\/tokens\.css$/,
  /design-system\/generated/,
]
const exts = new Set([".ts", ".tsx", ".css", ".mjs"])

const palette =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose"
const rules = [
  {
    id: "raw-color",
    re: /\b(?:oklch|rgba?|hsla?)\(/,
    message:
      "Raw colour function. Use a semantic token utility (bg-*, text-*, border-*).",
  },
  {
    id: "raw-hex",
    re: /(?:\[#[0-9a-fA-F]{3,8}\]|["'\s:(]#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?\b)/,
    message: "Hex colour. Use a semantic token.",
  },
  {
    id: "gradient",
    re: /\bbg-(?:linear|radial|conic|gradient)-|(?:linear|radial|conic)-gradient\(|\bvia-[a-z]/,
    message: "Gradients are not part of Blocks.",
  },
  {
    id: "shadow",
    re: /\b(?:drop-)?shadow-(?!none\b)[a-z0-9[(]|box-shadow:(?!\s*none)/,
    message:
      "Shadows are not part of Blocks. Separate with borders or surfaces.",
  },
  {
    id: "default-palette",
    re: new RegExp(
      `\\b(?:text|bg|border|ring|fill|stroke|outline|decoration|divide|placeholder|caret|accent|from|to)-(?:${palette})-\\d{2,3}\\b`
    ),
    message: "Tailwind default palette. Use semantic tokens.",
  },
  {
    id: "light-weight",
    re: /\bfont-(?:thin|extralight|light)\b/,
    message: "Light weights are not used. Headings are bold, body is regular.",
  },
  { id: "italic", re: /\bitalic\b/, message: "Italic is not used in Blocks." },
  {
    id: "as-child",
    re: /\basChild\b/,
    message: "Base UI uses the render prop, not asChild.",
  },
]

async function* walk(target) {
  const full = path.join(root, target)
  let s
  try {
    s = await stat(full)
  } catch {
    return
  }
  // Files named on the command line get the same filter as a directory walk,
  // so a list of changed files can include token sources (*.tokens.json).
  if (s.isFile()) {
    if (exts.has(path.extname(full)) && !ignore.some((r) => r.test(full)))
      yield full
    return
  }
  for (const entry of await readdir(full, { withFileTypes: true })) {
    const p = path.join(full, entry.name)
    if (ignore.some((r) => r.test(p))) continue
    if (entry.isDirectory()) yield* walk(path.relative(root, p))
    else if (exts.has(path.extname(entry.name))) yield p
  }
}

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : defaultTargets
const problems = []
for (const t of targets) {
  for await (const file of walk(t)) {
    const lines = (await readFile(file, "utf8")).split("\n")
    lines.forEach((line, i) => {
      if (line.includes("lint-ds-ignore")) return
      for (const rule of rules) {
        if (rule.re.test(line))
          problems.push(
            `${path.relative(root, file)}:${i + 1}  ${rule.id}  ${rule.message}`
          )
      }
    })
  }
}

if (problems.length) {
  console.log(problems.join("\n"))
  console.log(`\n${problems.length} design-system problem(s).`)
  process.exit(1)
}
console.log("Design-system lint passed.")
