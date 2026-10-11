/**
 * A fingerprint of every token source, so the checks can tell when
 * themes.json is older than the sources (scripts/lib/themes-data.mjs).
 */
import { createHash } from "node:crypto"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")

export async function sourcesHash() {
  const hash = createHash("sha256")
  for (const dir of ["design-system/tokens", "design-system/themes"]) {
    for (const file of (await readdir(path.join(root, dir)))
      .filter((f) => f.endsWith(".json"))
      .sort()) {
      hash
        .update(`${dir}/${file}\n`)
        .update(await readFile(path.join(root, dir, file)))
    }
  }
  return hash.digest("hex")
}
