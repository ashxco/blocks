/** Token sources: where they live, how they are read and resolved, and how outputs are written. */
import StyleDictionary from "style-dictionary"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
)
export const tokensDir = "design-system/tokens"
export const themesDir = "design-system/themes"
export const files = {
  primitives: `${tokensDir}/primitives.tokens.json`,
  light: `${tokensDir}/semantic.light.tokens.json`,
  dark: `${tokensDir}/semantic.dark.tokens.json`,
  typography: `${tokensDir}/typography.tokens.json`,
  layout: `${tokensDir}/layout.tokens.json`,
  components: `${tokensDir}/components.tokens.json`,
}
export const DEFAULT_THEME = "blocks"
export const MODES = ["light", "dark"]

const sdOptions = {
  usesDtcg: true,
  log: { verbosity: "silent", warnings: "disabled" },
  platforms: { blocks: { transforms: ["name/kebab"] } },
}

/** Resolves token files, or an in-memory token tree, into Style Dictionary's flat token list. */
async function resolve(input) {
  const sd = new StyleDictionary({ ...sdOptions, ...input })
  const { allTokens } = await sd.getPlatformTokens("blocks")
  return allTokens
}

export const load = (sources) =>
  resolve({ source: sources.map((f) => path.join(root, f)) })

/** Resolves an in-memory token tree (the default sources merged with a theme), by path. */
export async function loadTree(tokens) {
  return new Map((await resolve({ tokens })).map((t) => [t.path.join("."), t]))
}

export const readJson = async (file) =>
  JSON.parse(await readFile(path.join(root, file), "utf8"))
export const isObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v)
export const isReference = (v) => typeof v === "string" && /^\{[^}]+\}$/.test(v)
/** The token path a reference names: "{radius.lg}" → "radius.lg". */
export const refName = (v) => v.slice(1, -1)

/** A token's $extensions.blocks, as written in its source. */
export const blocksExt = (t) =>
  t.original?.$extensions?.blocks ?? t.$extensions?.blocks

/** Deep merge for token trees: objects merge (including typography $values), everything else is replaced. */
export function merge(target, ...sources) {
  for (const source of sources) {
    for (const [key, value] of Object.entries(source ?? {})) {
      target[key] =
        isObject(value) && isObject(target[key])
          ? merge({ ...target[key] }, value)
          : structuredClone(value)
    }
  }
  return target
}

/** Every token in a DTCG tree: [path, token]. */
export function* tokenEntries(tree, prefix = []) {
  for (const [key, value] of Object.entries(tree)) {
    if (key.startsWith("$") || !isObject(value)) continue
    if ("$value" in value) yield [[...prefix, key], value]
    else yield* tokenEntries(value, [...prefix, key])
  }
}

/**
 * Writes only when the content changed. Every write makes the dev server
 * rebuild and fully reload each open tab (tokens.ts is imported outside React),
 * so `npm run check` with unchanged tokens must leave the files alone.
 */
export async function writeIfChanged(file, content) {
  const target = path.join(root, file)
  await mkdir(path.dirname(target), { recursive: true })
  const current = await readFile(target, "utf8").catch(() => null)
  if (current === content) return false
  await writeFile(target, content)
  return true
}
