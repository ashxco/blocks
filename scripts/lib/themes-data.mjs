/** Reads design-system/generated/themes.json for the checks, and stops when it is missing or stale. */
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { sourcesHash } from "../../design-system/build/sources-hash.mjs"

export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
)
const source = path.join(root, "design-system/generated/themes.json")

/**
 * The generated themes data. Exits with 2 when the file is missing or older
 * than the token sources: a stale themes.json would check yesterday's tokens,
 * so the build stores a fingerprint of the sources it read.
 */
export async function readThemesData(name) {
  const data = JSON.parse(
    await readFile(source, "utf8").catch(() => {
      console.error(
        `${name}: ${path.relative(root, source)} is missing. Run npm run tokens first.`
      )
      process.exit(2)
    })
  )
  if (data.sources !== (await sourcesHash())) {
    console.error(
      `${name}: the token sources changed after the last token build. Run npm run tokens first.`
    )
    process.exit(2)
  }
  return data
}

/** Pads a table cell. */
export const pad = (s, n) => String(s).padEnd(n)
