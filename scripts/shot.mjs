/**
 * Screenshot a page with headless Chrome, in real time over the DevTools
 * protocol.
 *
 *   node scripts/shot.mjs <url> <out.png> [width=1440] [height=2400] [mode=light|dark] [wait=15000] [theme]
 *
 * width × height is the viewport that gets captured. mode adds &mode=dark or
 * &mode=light, which forces that mode without saving it; any other value
 * leaves the URL alone.
 *
 * theme is a theme preset id (blocks, ocean, forest, ember, mono). It adds
 * ?theme=<id>, which forces that theme without saving it. SHOT_THEME sets it
 * too, and a ?theme=<id> already in the URL works the same way:
 *
 *   node scripts/shot.mjs http://localhost:3210/live out.png 1440 2400 dark 15000 ocean
 *   SHOT_THEME=mono node scripts/shot.mjs http://localhost:3210/live out.png 1440 2400 light
 *
 * wait is the most time, in milliseconds, to wait for the page to settle
 * before capturing. The script captures as soon as the page has loaded,
 * React has hydrated, the network has been idle for a moment and animations
 * have had time to finish, so a fast page takes about two seconds. Raise it
 * when the machine is busy. SHOT_WAIT sets the default:
 *
 *   SHOT_WAIT=30000 node scripts/shot.mjs http://localhost:3210/live out.png
 *
 * Widths under 600px are emulated as a phone (mobile viewport, exact width),
 * so viewport media queries, matchMedia and container queries all see that
 * width. Every run uses its own temporary Chrome profile and closes Chrome
 * when it is done, so parallel runs never share or leave behind a browser.
 */
import { spawn } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"

const [url, out, w = "1440", h = "2400", mode = "light", waitArg, themeArg] = process.argv.slice(2)
if (!url || !out) {
  console.error("Usage: node scripts/shot.mjs <url> <out.png> [width] [height] [light|dark] [wait ms] [theme]")
  process.exit(1)
}
const theme = themeArg || process.env.SHOT_THEME || undefined
if (theme !== undefined && !/^[a-z][a-z0-9-]*$/.test(theme)) {
  console.error(`theme must be a theme id such as ocean, not "${theme}"`)
  process.exit(1)
}

const width = Number(w)
const height = Number(h)
const wait = Number(waitArg ?? process.env.SHOT_WAIT ?? 15000)
if (![width, height, wait].every((n) => Number.isFinite(n) && n > 0)) {
  console.error("width, height and wait must be positive numbers")
  process.exit(1)
}

/** How long the network must be quiet, and how long animations get after that. */
const IDLE_MS = 500
const SETTLE_MS = 1200

const chromePath = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const target = new URL(url)
if (mode === "dark" || mode === "light") {
  target.searchParams.set("mode", mode)
  // An old-style ?theme=dark|light in the URL would only repeat the mode.
  if (["dark", "light"].includes(target.searchParams.get("theme"))) target.searchParams.delete("theme")
}
if (theme) target.searchParams.set("theme", theme)
const outPath = path.resolve(out)
mkdirSync(path.dirname(outPath), { recursive: true })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const profile = mkdtempSync(path.join(os.tmpdir(), "blocks-shot-"))
const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--mute-audio",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    `--window-size=${Math.max(width, 600)},${height}`,
    "about:blank",
  ],
  { stdio: "ignore" }
)

let finished = false
function cleanup() {
  if (!chrome.killed && chrome.exitCode === null) chrome.kill("SIGKILL")
  try {
    rmSync(profile, { recursive: true, force: true, maxRetries: 3 })
  } catch {}
}
function fail(message) {
  if (finished) return
  finished = true
  console.error(`shot.mjs: ${message} (${target})`)
  cleanup()
  process.exit(2)
}
// A hard stop, so a stuck Chrome can never hang the caller.
const hardStop = setTimeout(() => fail(`timed out after ${wait + 20000}ms`), wait + 20000)
chrome.on("exit", (code) => {
  if (!finished) fail(`Chrome exited early with code ${code}`)
})
process.on("SIGINT", () => fail("interrupted"))
process.on("SIGTERM", () => fail("terminated"))

/* ---------------------------------------------------------------- DevTools */

async function devtoolsPort() {
  const file = path.join(profile, "DevToolsActivePort")
  for (let i = 0; i < 150; i++) {
    if (existsSync(file)) {
      const [port] = readFileSync(file, "utf8").split("\n")
      if (port) return Number(port)
    }
    await sleep(100)
  }
  throw new Error("Chrome did not open a DevTools port")
}

async function pageSocketUrl(port) {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      const page = list.find((t) => t.type === "page")
      if (page) return page.webSocketDebuggerUrl
    } catch {}
    await sleep(100)
  }
  throw new Error("Chrome has no page target")
}

function connect(socketUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(socketUrl)
    let nextId = 0
    const pending = new Map()
    const listeners = new Set()
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data)
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id)
        pending.delete(msg.id)
        if (msg.error) reject(new Error(`${msg.error.message} (${msg.error.code})`))
        else resolve(msg.result)
      } else if (msg.method) {
        for (const listener of listeners) listener(msg.method, msg.params)
      }
    })
    ws.addEventListener("error", () => reject(new Error("DevTools socket error")))
    ws.addEventListener("open", () =>
      resolve({
        send(method, params = {}) {
          return new Promise((resolve, reject) => {
            const id = ++nextId
            pending.set(id, { resolve, reject })
            ws.send(JSON.stringify({ id, method, params }))
          })
        },
        on(listener) {
          listeners.add(listener)
        },
        close() {
          ws.close()
        },
      })
    )
  })
}

/* -------------------------------------------------------------------- Run */

try {
  const cdp = await connect(await pageSocketUrl(await devtoolsPort()))

  let loaded = false
  const inflight = new Set()
  let lastNetwork = Date.now()
  cdp.on((method, params) => {
    if (method === "Page.loadEventFired") loaded = true
    else if (method === "Network.requestWillBeSent") {
      inflight.add(params.requestId)
      lastNetwork = Date.now()
    } else if (method === "Network.loadingFinished" || method === "Network.loadingFailed") {
      inflight.delete(params.requestId)
      lastNetwork = Date.now()
    }
  })

  await cdp.send("Page.enable")
  await cdp.send("Network.enable")
  await cdp.send("Runtime.enable")
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
  })

  const started = Date.now()
  const remaining = () => wait - (Date.now() - started)
  const evaluate = async (expression) =>
    (await cdp.send("Runtime.evaluate", { expression, returnByValue: true })).result?.value

  await cdp.send("Page.navigate", { url: target.toString() })

  // 1. The load event.
  while (!loaded && remaining() > 0) await sleep(50)

  // 2. React has hydrated: the App Router mounts its route announcer on the
  //    client only. Pages that are not Next.js pages skip this step.
  while (remaining() > 0) {
    const state = await evaluate(
      `document.querySelector("next-route-announcer") ? "hydrated" : (self.__next_f ? "pending" : "static")`
    ).catch(() => "pending")
    if (state !== "pending") break
    await sleep(100)
  }

  // 3. The network is quiet (lazy chunks, fonts, preview iframes).
  while (remaining() > 0 && (inflight.size > 0 || Date.now() - lastNetwork < IDLE_MS)) await sleep(50)

  // 4. Entry animations and theme transitions finish, then two frames paint.
  await sleep(Math.max(0, Math.min(SETTLE_MS, remaining())))
  await evaluate(
    "new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(true))))"
  ).catch(() => {})

  const shot = await cdp.send("Page.captureScreenshot", { format: "png" })
  writeFileSync(outPath, Buffer.from(shot.data, "base64"))
  if (remaining() <= 0) console.warn(`shot.mjs: the page was still busy after ${wait}ms; captured anyway`)

  finished = true
  clearTimeout(hardStop)
  const look = [target.searchParams.get("theme"), target.searchParams.get("mode")].filter(Boolean).join(", ")
  console.log(`Saved ${out} (${width}×${height}${look ? `, ${look}` : ""})`)
  // Chrome often exits before it answers Browser.close, which would leave
  // this promise unsettled forever, so the close only gets a moment.
  const exited = new Promise((resolve) => chrome.once("exit", resolve))
  await Promise.race([cdp.send("Browser.close").catch(() => {}), exited, sleep(1000)])
  cdp.close()
  await Promise.race([exited, sleep(2000)])
  cleanup()
  process.exit(0)
} catch (error) {
  fail(error instanceof Error ? error.message : String(error))
}
