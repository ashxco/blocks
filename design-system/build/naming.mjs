/** What each token is called in CSS, where it lives, and which utility it is meant for. */
import { blocksExt, files } from "./load.mjs"

const TYPE_SCALE = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
]

/** Which source file a token comes from: a key of `files`. */
export const fileKey = (t) =>
  Object.entries(files).find(([, f]) =>
    t.filePath.endsWith(f.split("/").pop())
  )?.[0]

const join = (parts) => parts.filter((x) => x !== "DEFAULT").join("-")

/** Where a token lives and what it is called in CSS: { tier, group, cssVar, scope, utility }. */
export function describe(t) {
  const p = t.path
  switch (fileKey(t)) {
    case "primitives":
      // color.* are the fixed scales; theme.accent and theme.neutral the alias scales themes re-point.
      if (p[0] === "color" || p[0] === "theme")
        return {
          tier: "primitive",
          group: p[1],
          cssVar: `--bk-${join(p.slice(1))}`,
          scope: "root",
        }
      if (p[1] === "family")
        return {
          tier: "primitive",
          group: "font-family",
          cssVar: `--font-${p[2]}`,
          scope: "theme",
          utility: `font-${p[2]}`,
        }
      if (p[1] === "weight") {
        const name = p[2] === "regular" ? "normal" : p[2]
        return {
          tier: "primitive",
          group: "font-weight",
          cssVar: `--font-weight-${name}`,
          scope: "theme",
          utility: `font-${name}`,
        }
      }
      break
    case "light":
    case "dark": {
      const name = join(p.slice(1))
      return {
        tier: "semantic",
        group: semanticGroup(p[1]),
        cssVar: `--${name}`,
        scope: "mode",
        utility: semanticUtility(name),
      }
    }
    case "typography":
      return {
        tier: "typography",
        group: TYPE_SCALE.includes(p[1]) ? "scale" : "roles",
        cssVar: `--text-${p[1]}`,
        scope: "theme",
        utility: `text-${p[1]}`,
      }
    case "layout":
      return describeLayout(p)
    case "components": {
      const name = join(p.slice(1))
      const prop = p.slice(2).join("-")
      // A token can name the utility its components write, e.g. "max-w" for
      // dialog and sheet widths, which are caps so they shrink on phones.
      // utilityClass names the whole utility instead, for tokens a custom
      // utility or an arbitrary property reads (link-underline).
      const { utility: hint, utilityClass } = blocksExt(t) ?? {}
      const prefix =
        hint ??
        (/radius/.test(prop)
          ? "rounded"
          : /padding-x/.test(prop)
            ? "px"
            : /padding/.test(prop)
              ? "p"
              : /min-width/.test(prop)
                ? "min-w"
                : /max-width/.test(prop)
                  ? "max-w"
                  : /width/.test(prop)
                    ? "w"
                    : /size/.test(prop)
                      ? "size"
                      : "h")
      return {
        tier: "component",
        group: p[1],
        cssVar: `--${name}`,
        scope: "root",
        utility: utilityClass ?? `${prefix}-(--${name})`,
      }
    }
  }
  throw new Error(`No naming rule for token ${p.join(".")} in ${t.filePath}`)
}

function describeLayout(p) {
  const [head, ...rest] = p
  const name = join(rest)
  const layout = (group, cssVar, scope, utility) => ({
    tier: "layout",
    group,
    cssVar,
    scope,
    utility,
  })
  switch (head) {
    case "spacing":
      return layout("spacing", "--spacing", "theme", "p-4 = 4 × spacing")
    case "space": {
      // Each named space has one intended axis.
      const axis =
        { gutter: "px", section: "py", "section-sm": "py", stack: "gap" }[
          name
        ] ?? "p"
      return layout("spacing", `--spacing-${name}`, "theme", `${axis}-${name}`)
    }
    case "grid":
      // The system grid: columns and gutter change at md and lg, and the grid-system utility (globals.css) reads both.
      return layout(
        "grid",
        `--grid-${name}`,
        "root",
        {
          columns: "grid-system · var(--grid-columns)",
          gutter: "grid-system · gap-(--grid-gutter)",
        }[name]
      )
    case "radius":
      return layout("radius", `--radius-${name}`, "theme", `rounded-${name}`)
    case "container":
      // max-w-prose is Tailwind's fixed 65ch, so the prose width is read through its variable.
      return layout(
        "container",
        `--container-${name}`,
        "theme",
        name === "prose"
          ? "max-w-(--container-prose) · @prose:"
          : `max-w-${name} · @${name}:`
      )
    case "breakpoint":
      return layout("breakpoint", `--breakpoint-${name}`, "theme", `${name}:`)
    case "motion": {
      const motion = join(rest.slice(1))
      if (rest[0] === "ease")
        return layout("easing", `--ease-${motion}`, "theme", `ease-${motion}`)
      return layout(
        "duration",
        `--duration-${motion}`,
        "root",
        `duration-(--duration-${motion})`
      )
    }
    case "blur":
      return layout("blur", `--blur-${name}`, "theme", `backdrop-blur-${name}`)
    case "border":
      return layout(
        "border-width",
        `--border-width-${name}`,
        "root",
        name === "hairline"
          ? "border"
          : `border-(length:--border-width-${name})`
      )
    case "focus":
      return layout(
        "focus",
        `--focus-${name}`,
        "root",
        "focus-visible:focus-ring"
      )
    case "z":
      return layout("z-index", `--z-${name}`, "root", `z-(--z-${name})`)
  }
  return { tier: "layout", group: head, cssVar: `--${join(p)}`, scope: "root" }
}

/** The utilities a semantic colour is meant for, e.g. text-copy or border-input. */
function semanticUtility(name) {
  if (name === "copy" || name.endsWith("foreground") || name === "panel-muted")
    return `text-${name}`
  if (
    [
      "border",
      "border-strong",
      "input",
      "popover-border",
      "panel-border",
      "sidebar-border",
    ].includes(name)
  )
    return `border-${name}`
  if (name === "ring" || name === "sidebar-ring")
    return `outline-${name} · focus-visible:focus-ring`
  if (name.startsWith("chart-"))
    return `fill-${name} · stroke-${name} · var(--${name})`
  if (/^(panel-)?(brand|destructive|success|warning|info)$/.test(name))
    return `text-${name} · bg-${name}`
  return `bg-${name}`
}

function semanticGroup(head) {
  if (
    [
      "background",
      "foreground",
      "copy",
      "muted-foreground",
      "subtle",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
    ].includes(head)
  )
    return "surface & text"
  if (
    [
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "muted",
      "accent",
      "accent-foreground",
    ].includes(head)
  )
    return "interactive"
  if (head.startsWith("brand")) return "brand"
  if (/^(destructive|success|warning|info)/.test(head)) return "status"
  if (
    [
      "border",
      "border-strong",
      "input",
      "popover-border",
      "ring",
      "overlay",
    ].includes(head)
  )
    return "lines & focus"
  if (head.startsWith("panel") || head.startsWith("terminal")) return "panel"
  return head
}
