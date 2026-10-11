/**
 * Render the social card (app/(og)/og/page.tsx) into app/opengraph-image.png,
 * 1200 × 630, with the same headless Chrome capture as scripts/shot.mjs.
 *
 *   node scripts/og.mjs
 *
 * It starts `next dev` on a free port, captures /og once it answers, and
 * stops the server. When a dev server is already running from this
 * directory, Next refuses a second one and names it, so the script uses
 * that one and leaves it running. OG_URL=http://localhost:3000 reuses a
 * server explicitly; OG_PORT picks the port for the one it starts.
 */
import { spawn } from "node:child_process"
import net from "node:net"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const out = path.join(root, "app", "opengraph-image.png")
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.on("error", reject)
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

/** Polls until the page answers 200 (the first request also compiles it). */
async function ready(url, ms) {
  const started = Date.now()
  while (Date.now() - started < ms) {
    try {
      const response = await fetch(url)
      if (response.ok) return true
    } catch {}
    await sleep(500)
  }
  return false
}

function run(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      ...options,
    })
    child.on("exit", (code) => resolve(code ?? 1))
    child.on("error", () => resolve(1))
  })
}

let base = process.env.OG_URL?.replace(/\/+$/, "")
let server
let log = ""

async function stop() {
  if (!server || server.exitCode !== null) return
  const exited = new Promise((resolve) => server.once("exit", resolve))
  try {
    process.kill(-server.pid, "SIGTERM")
  } catch {}
  await Promise.race([exited, sleep(5000)])
  if (server.exitCode === null) {
    try {
      process.kill(-server.pid, "SIGKILL")
    } catch {}
  }
}

async function fail(message) {
  console.error(`og.mjs: ${message}`)
  if (log) console.error(log.split("\n").slice(-30).join("\n"))
  await stop()
  process.exit(2)
}

if (!base) {
  const port = Number(process.env.OG_PORT) || (await freePort())
  server = spawn(
    path.join(root, "node_modules", ".bin", "next"),
    ["dev", "-p", String(port)],
    {
      cwd: root,
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    }
  )
  server.stdout.on("data", (chunk) => (log += chunk))
  server.stderr.on("data", (chunk) => (log += chunk))
  server.on("exit", (code) => {
    if (code === null || code === 0) return
    // Next refuses to start beside a dev server from this directory and
    // prints its address: capture from that one instead.
    const notice = log.indexOf("already running")
    const running =
      notice >= 0
        ? /Local:\s+(http:\/\/localhost:\d+)/.exec(log.slice(notice))?.[1]
        : undefined
    if (running) {
      console.log(`og.mjs: reusing the dev server at ${running}`)
      base = running
      server = undefined
      return
    }
    fail(`next dev exited with code ${code}`)
  })
  base = `http://localhost:${port}`
  console.log(`og.mjs: started next dev at ${base}`)
}
process.on("SIGINT", () => fail("interrupted"))
process.on("SIGTERM", () => fail("terminated"))

// The base can change while waiting, when Next hands over to a running server.
const url = () => `${base}/og`
const started = Date.now()
let up = false
while (!up && Date.now() - started < 180000) {
  up = await ready(url(), 2000)
}
if (!up) await fail(`${url()} did not answer in time`)

const shot = () =>
  run(process.execPath, [
    path.join(root, "scripts", "shot.mjs"),
    url(),
    out,
    "1200",
    "630",
    "light",
    "30000",
    "blocks",
  ])

// A first capture can land while the dev server is still settling, so it gets one retry.
let code = await shot()
if (code !== 0) {
  console.warn("og.mjs: the capture failed, retrying once")
  await sleep(3000)
  code = await shot()
}
await stop()
if (code !== 0) {
  console.error("og.mjs: could not capture the social card")
  process.exit(code)
}
console.log(`og.mjs: wrote ${path.relative(root, out)}`)
process.exit(0)
