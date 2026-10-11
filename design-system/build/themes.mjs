/**
 * Themes. A theme file holds only what it changes from the default theme:
 *
 *   theme.accent.* / theme.neutral.*   the alias scales semantic colours read
 *   radius.*                           the radius scale
 *   component.*                        component tokens, e.g. component.button.radius
 *   font.family.*                      font stacks (with $extensions.blocks.name
 *                                      and .genre, see FONT_GENRES): sans, mono,
 *                                      and heading, the face of the display and
 *                                      heading roles (it follows sans unless the
 *                                      theme sets it)
 *   type.<role>                        letterSpacing only: { "$value": { "letterSpacing": "-0.03em" } },
 *                                      to tune a role's tracking for the theme's font
 *   light.color.* / dark.color.*       individual semantic colours in one mode
 *
 * plus its name, order and modes in $extensions.blocks.theme. The blocks theme
 * file holds only that metadata.
 */
import { readdir } from "node:fs/promises"
import path from "node:path"
import {
  DEFAULT_THEME,
  MODES,
  blocksExt,
  files,
  isObject,
  isReference,
  loadTree,
  merge,
  readJson,
  refName,
  root,
  themesDir,
  tokenEntries,
} from "./load.mjs"
import { declaredBreakpoints } from "./breakpoints.mjs"
import { byPath, resolvedValue } from "./tokens.mjs"

/** Top-level keys a theme file may set. */
const THEME_KEYS = [
  "theme",
  "radius",
  "component",
  "font",
  "type",
  "light",
  "dark",
]
const SHARED_KEYS = ["theme", "radius", "component", "font", "type"]

/**
 * The kind of face a font family is ($extensions.blocks.genre), so the theme
 * uniqueness gate (scripts/check-themes.mjs) can tell two different faces of
 * one kind (two geometric sans) from two kinds of face (a geometric sans and
 * a serif). Every font family that names a face gives one.
 */
const FONT_GENRES = [
  "geometric",
  "neo-grotesque",
  "grotesque",
  "humanist",
  "serif",
  "mono",
]

/** Throws unless a font family token names its face and its genre. */
function checkFontFace(where, name, token) {
  const blocks = token.$extensions?.blocks
  if (!blocks?.name)
    throw new Error(
      `${where}: ${name} needs the font's name in $extensions.blocks.name`
    )
  if (!FONT_GENRES.includes(blocks.genre)) {
    throw new Error(
      `${where}: ${name} needs the font's genre in $extensions.blocks.genre: ${FONT_GENRES.join(", ")}`
    )
  }
}

const pathsOf = (tree) => [...tokenEntries(tree)].map(([p]) => p.join("."))

/** Reads and validates a theme file: its metadata, shared overrides and per-mode semantic overrides. */
function parseTheme(id, json) {
  const where = `${themesDir}/${id}.tokens.json`
  if (!/^[a-z][a-z0-9-]*$/.test(id))
    throw new Error(
      `${where}: theme ids are lowercase letters, digits and dashes`
    )
  const info = json.$extensions?.blocks?.theme
  if (!info?.name)
    throw new Error(
      `${where}: give the theme a name in $extensions.blocks.theme.name`
    )
  const modes = info.modes ?? MODES
  if (
    !Array.isArray(modes) ||
    modes.length === 0 ||
    modes.some((m) => !MODES.includes(m))
  )
    throw new Error(`${where}: modes must list "light" and/or "dark"`)
  for (const key of Object.keys(json)) {
    if (!key.startsWith("$") && !THEME_KEYS.includes(key))
      throw new Error(
        `${where}: "${key}" cannot be themed. A theme can set ${THEME_KEYS.join(", ")}.`
      )
  }

  const shared = Object.fromEntries(
    Object.entries(json).filter(([k]) => SHARED_KEYS.includes(k))
  )
  for (const [p, token] of tokenEntries(shared)) {
    const name = p.join(".")
    const base = byPath.get(name)
    const allowed =
      (p[0] === "theme" && ["accent", "neutral"].includes(p[1])) ||
      (p[0] === "font" && p[1] === "family") ||
      ["radius", "component", "type"].includes(p[0])
    if (!allowed)
      throw new Error(
        `${where}: ${name} cannot be themed. Themes change the accent and neutral scales, radii, component tokens, font families, type tracking and semantic colours.`
      )
    if (!base)
      throw new Error(
        `${where}: ${name} is not a token. Themes only change existing tokens.`
      )
    if (p[0] === "font") checkFontFace(where, name, token)
    if (p[0] === "type") {
      if (
        !isObject(token.$value) ||
        Object.keys(token.$value).some((k) => k !== "letterSpacing")
      )
        throw new Error(`${where}: ${name} can only change letterSpacing`)
      if (
        Object.values(declaredBreakpoints(base) ?? {}).some(
          (o) => o && "letterSpacing" in o
        )
      )
        throw new Error(
          `${where}: ${name}'s letterSpacing has breakpoint values, so a theme cannot change it`
        )
    } else if (declaredBreakpoints(base)) {
      throw new Error(
        `${where}: ${name} has breakpoint values, so a theme cannot change it`
      )
    }
  }

  const perMode = {}
  for (const mode of MODES) {
    perMode[mode] = json[mode] ?? {}
    for (const key of Object.keys(perMode[mode])) {
      if (key !== "color")
        throw new Error(
          `${where}: ${mode}.${key}: a theme's ${mode} values are semantic colours, under ${mode}.color`
        )
    }
    for (const name of pathsOf(perMode[mode])) {
      if (byPath.get(name)?.meta.tier !== "semantic")
        throw new Error(`${where}: ${mode}.${name} is not a semantic colour`)
    }
  }

  return {
    id,
    name: info.name,
    order: info.order ?? 99,
    description: json.$description ?? "",
    modes,
    shared,
    perMode,
    overrides: {
      shared: pathsOf(shared),
      light: pathsOf(perMode.light),
      dark: pathsOf(perMode.dark),
    },
  }
}

const themeFiles = (await readdir(path.join(root, themesDir)))
  .filter((f) => f.endsWith(".tokens.json"))
  .sort()

/** Every theme, in picker order. */
export const themes = []
for (const file of themeFiles)
  themes.push(
    parseTheme(
      file.replace(/\.tokens\.json$/, ""),
      await readJson(`${themesDir}/${file}`)
    )
  )
themes.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))

const defaultTheme = themes.find((t) => t.id === DEFAULT_THEME)
if (!defaultTheme)
  throw new Error(
    `${themesDir}/${DEFAULT_THEME}.tokens.json is missing: it names the default theme`
  )
if (Object.values(defaultTheme.overrides).some((names) => names.length > 0)) {
  throw new Error(
    `${themesDir}/${DEFAULT_THEME}.tokens.json overrides tokens. The default theme is design-system/tokens; its theme file only holds metadata.`
  )
}

const semanticJson = {
  light: await readJson(files.light),
  dark: await readJson(files.dark),
}
const sharedJson = merge(
  {},
  ...(await Promise.all(
    [files.primitives, files.typography, files.layout, files.components].map(
      readJson
    )
  ))
)

/** Every token resolved per theme and mode: resolved[id][mode] = Map(path → token). */
export const resolved = {}
for (const theme of themes) {
  resolved[theme.id] = {}
  for (const mode of MODES) {
    resolved[theme.id][mode] = await loadTree(
      merge(
        {},
        sharedJson,
        semanticJson[mode],
        theme.shared,
        theme.perMode[mode]
      )
    )
  }
}

/** A token's resolved value under a theme, with its alpha applied. */
export const themeValue = (theme, name, mode = "light") =>
  resolvedValue(resolved[theme.id][mode].get(name))

/**
 * A font family token's face in a theme: its name and genre
 * ($extensions.blocks). A token that references another family (heading →
 * sans, or Mono's heading → mono) takes that family's face unless it names
 * its own.
 */
export function fontFace(theme, name) {
  const t = resolved[theme.id].light.get(name)
  const own = blocksExt(t)
  if (own?.name) {
    if (!FONT_GENRES.includes(own.genre))
      throw new Error(
        `${name}: give ${own.name} its genre in $extensions.blocks.genre: ${FONT_GENRES.join(", ")}`
      )
    return { name: own.name, genre: own.genre }
  }
  if (isReference(t.original?.$value))
    return fontFace(theme, refName(t.original.$value))
  throw new Error(
    `${name}: give the font family its name and genre in $extensions.blocks`
  )
}
