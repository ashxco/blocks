/**
 * Screenshot a page with headless Chrome.
 *
 *   node scripts/shot.mjs <url> <out.png> [width=1440] [height=2400] [theme=light|dark]
 *
 * Widths under 600px render the page in an iframe of that exact width,
 * because headless Chrome will not lay out windows narrower than ~500px.
 */
import { execFileSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"

const [url, out, w = "1440", h = "2400", theme = "light"] = process.argv.slice(2)
if (!url || !out) {
  console.error("Usage: node scripts/shot.mjs <url> <out.png> [width] [height] [light|dark]")
  process.exit(1)
}
const width = Number(w)
const height = Number(h)
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const target = new URL(url)
if (theme === "dark" || theme === "light") target.searchParams.set("theme", theme)

mkdirSync(path.dirname(path.resolve(out)), { recursive: true })
let page = target.toString()
let windowWidth = width
if (width < 600) {
  const wrapper = path.join(os.tmpdir(), `blocks-shot-${process.pid}.html`)
  writeFileSync(
    wrapper,
    `<!doctype html><body style="margin:0;background:#888"><iframe src="${target}" style="width:${width}px;height:${height}px;border:0;display:block"></iframe></body>`
  )
  page = `file://${wrapper}`
  windowWidth = 620
}

execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    `--window-size=${windowWidth},${height}`,
    "--virtual-time-budget=6000",
    `--screenshot=${path.resolve(out)}`,
    page,
  ],
  { stdio: "ignore" }
)
console.log(`Saved ${out} (${width}×${height}, ${theme})`)
