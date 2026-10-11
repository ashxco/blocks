import { cn } from "@/lib/utils"

import { ByTheme, ThemeText } from "./by-theme"
import {
  modes,
  perTheme,
  refIn,
  roleName,
  semanticGroups,
  sentenceCase,
  themeValues,
  tokens,
  type DesignToken,
  type Mode,
  type ThemeId,
} from "./data"
import { CodeList, Meta, SubHeading } from "./layout"

/*
 * The Colour page's semantic roles: each fill shown with the text role made
 * for it, in light and dark, in the theme the page is on.
 */

/*
 * Display order for groups whose source order reads poorly: the panel-* run
 * (surfaces, line and text, then the status accents), with terminal, its own
 * surface, last. Roles not listed follow in source order.
 */
const displayOrder: Record<string, string[]> = {
  panel: [
    "--panel",
    "--panel-raised",
    "--panel-border",
    "--panel-muted",
    "--panel-brand",
    "--panel-success",
    "--panel-warning",
    "--panel-destructive",
    "--terminal",
  ],
}

function ordered(list: DesignToken[]) {
  const order = displayOrder[list[0]?.group ?? ""]
  if (!order) return list
  const rank = (t: DesignToken) => {
    const i = order.indexOf(t.cssVar)
    return i === -1 ? order.length : i
  }
  return [...list].sort((a, b) => rank(a) - rank(b))
}

/** The utility hint from the token build, or the bare variable for a role without one. */
function utilityOf(t: DesignToken) {
  return t.utility ?? `var(${t.cssVar})`
}

type Base = "background" | "panel"

function swatchBase(t: DesignToken): Base {
  return t.group === "panel" &&
    roleName(t) !== "panel" &&
    roleName(t) !== "terminal"
    ? "panel"
    : "background"
}

/* ------------------------------------------------------------------------ */
/* Roles: each fill is shown with the text role made for it                  */
/* ------------------------------------------------------------------------ */

interface Role {
  token: DesignToken
  /** The `-foreground` role that sits on this fill, folded into its tile. */
  on?: DesignToken
  kind: "fill" | "text" | "line"
}

/** "--card-foreground" -> "--card", "--foreground" -> "--background". */
function parentOf(t: DesignToken) {
  if (t.cssVar === "--foreground") return "--background"
  return t.cssVar.endsWith("-foreground")
    ? t.cssVar.replace(/-foreground$/, "")
    : undefined
}

/*
 * How a role is drawn, from the first utility the build suggests: border and
 * outline roles as a line, text roles as "Aa" on their canvas, the rest as a
 * fill. Status colours that are also fills (text-info · bg-info) stay fills;
 * accents on panels (text-panel-brand · bg-panel-brand) are mostly text, so
 * they show as text on the panel.
 */
function kindOf(t: DesignToken, on?: DesignToken): Role["kind"] {
  if (on) return "fill"
  const utility = utilityOf(t)
  if (/^(border|outline)-/.test(utility)) return "line"
  if (
    utility.startsWith("text-") &&
    (!utility.includes(" bg-") || t.group === "panel")
  )
    return "text"
  return "fill"
}

function rolesOf(list: DesignToken[]): Role[] {
  const inGroup = new Set(list.map((t) => t.cssVar))
  const folded = new Set(
    list.filter((t) => inGroup.has(parentOf(t) ?? "")).map((t) => t.cssVar)
  )
  return ordered(list)
    .filter((t) => !folded.has(t.cssVar))
    .map((t) => {
      const on = list.find(
        (f) => folded.has(f.cssVar) && parentOf(f) === t.cssVar
      )
      return { token: t, on, kind: kindOf(t, on) }
    })
}

function roleUtilities(role: Role) {
  const fill = utilityOf(role.token)
  return role.on ? `${fill} · ${utilityOf(role.on)}` : fill
}

/** The fill's description, plus the text role's when it says more than "Text on …". */
function roleDescription(role: Role) {
  const extra =
    role.on?.description && !/^Text (on|in)\b/.test(role.on.description)
      ? role.on.description
      : ""
  return [role.token.description, extra].filter(Boolean).join(" ") || undefined
}

function roleRefs(role: Role, mode: Mode, theme: ThemeId) {
  return role.on
    ? `${refIn(role.token, mode, theme)} · ${refIn(role.on, mode, theme)}`
    : refIn(role.token, mode, theme)
}

/**
 * One mode's half of a role swatch, resolved inside a mode scope in the
 * page's theme: a fill with "Aa" in its text role, a text colour on its
 * canvas, or a line drawn as an outline.
 */
function SwatchHalf({
  role,
  mode,
  size,
}: {
  role: Role
  mode: Mode
  size: "sm" | "md"
}) {
  const t = role.token
  const base = swatchBase(t)
  const text = size === "md" ? "text-h4" : "text-title"
  return (
    <div
      className={cn(
        mode,
        "relative grid place-items-center",
        base === "panel" ? "bg-panel" : "bg-background"
      )}
    >
      {t.cssVar === "--overlay" ? <OverlayScene /> : null}
      {role.kind === "fill" && t.cssVar !== "--overlay" ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `var(${t.cssVar})`,
            color: role.on ? `var(${role.on.cssVar})` : undefined,
          }}
        >
          {role.on ? (
            <span className={cn("grid size-full place-items-center", text)}>
              Aa
            </span>
          ) : null}
        </div>
      ) : null}
      {role.kind === "text" ? (
        <span className={text} style={{ color: `var(${t.cssVar})` }}>
          Aa
        </span>
      ) : null}
      {role.kind === "line" ? (
        <span
          // A control-shaped outline, wider than tall, so it reads as a line at every swatch width.
          className={cn(
            "absolute top-1/2 -translate-y-1/2 border-(length:--border-width-strong)",
            size === "sm"
              ? "inset-x-2 h-3.5 rounded-xs"
              : "inset-x-2 h-4 rounded-xs @prose:inset-x-3 @prose:h-8 @prose:rounded-md"
          )}
          style={{ borderColor: `var(${t.cssVar})` }}
        />
      ) : null}
    </div>
  )
}

/*
 * The backdrop only shows against something to dim: a few lines of page
 * content, with the backdrop over the right two thirds so the dimmed part
 * sits next to the clear one. On a black canvas a plain fill shows nothing.
 */
function OverlayScene() {
  return (
    <>
      <span className="absolute inset-x-2 top-1/2 grid -translate-y-1/2 gap-1.5 @prose:inset-x-3">
        <span className="h-1.5 w-full rounded-full bg-foreground" />
        <span className="h-1.5 w-3/4 rounded-full bg-muted-foreground" />
        <span className="h-1.5 w-1/2 rounded-full bg-muted-foreground" />
      </span>
      <span
        className="absolute inset-y-0 right-0 left-1/3"
        style={{ backgroundColor: "var(--overlay)" }}
      />
    </>
  )
}

/** Light on the left, dark on the right. */
function RoleSwatch({
  role,
  size = "md",
  className,
}: {
  role: Role
  size?: "sm" | "md"
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative grid grid-cols-2 overflow-hidden rounded-lg border",
        className
      )}
    >
      <SwatchHalf role={role} mode="light" size={size} />
      <SwatchHalf role={role} mode="dark" size={size} />
      {/*
       * The hairline between the halves keeps them apart when both modes
       * share a value. It sits outside both mode scopes so it takes the
       * page's border colour, like the frame around it.
       */}
      <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
    </div>
  )
}

/**
 * One mode's primitives for a role, in the theme the page is on. Wraps
 * between the fill and its text role, never inside one, and the separator
 * stays at the end of the line it follows rather than starting the next.
 */
function RefLine({ role, mode }: { role: Role; mode: Mode }) {
  return (
    <dd className="flex flex-wrap gap-x-1.5 font-mono text-xs text-foreground">
      <ByTheme by={(theme) => roleRefs(role, mode, theme)}>
        {(theme) => {
          const refs = roleRefs(role, mode, theme).split(" · ")
          return refs.map((ref, i) => (
            <span key={i} className="whitespace-nowrap">
              {ref}
              {i < refs.length - 1 ? " ·" : ""}
            </span>
          ))
        }}
      </ByTheme>
    </dd>
  )
}

/*
 * From @prose, tiles sit several to a row: the text column fills the row's
 * height and the Light and Dark lines sit at its foot, so they line up across
 * tiles whose descriptions differ in length.
 */
function RoleTile({
  role,
  compact = false,
}: {
  role: Role
  compact?: boolean
}) {
  return (
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)] content-start items-start gap-4 @prose:grid-cols-1 @prose:grid-rows-[auto_minmax(0,1fr)] @prose:items-stretch">
      <RoleSwatch role={role} className={compact ? "h-14" : "h-16"} />
      <div className="flex min-w-0 flex-col gap-1.5">
        <h4 className="text-title text-foreground">{roleName(role.token)}</h4>
        <CodeList
          value={roleUtilities(role)}
          className="text-muted-foreground"
        />
        {!compact && roleDescription(role) ? (
          <p className="text-caption text-copy">{roleDescription(role)}</p>
        ) : null}
        {/* One line per mode, label first: the same at every width, and it fits four-across tiles. */}
        <div className="mt-auto pt-1">
          <dl className="grid gap-1 border-t pt-2.5">
            {modes.map(({ value: mode, label }) => (
              <div
                key={mode}
                className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-baseline gap-2"
              >
                <dt className="text-caption text-muted-foreground">{label}</dt>
                <RefLine role={role} mode={mode} />
              </div>
            ))}
          </dl>
        </div>
      </div>
    </li>
  )
}

/* ------------------------------------------------------------------------ */
/* Sidebar: a compact table, since it mirrors the page roles                  */
/* ------------------------------------------------------------------------ */

const pageRoles = tokens.filter(
  (t) => t.tier === "semantic" && t.group !== "sidebar"
)

function sameValues(a: DesignToken, b: DesignToken, theme: ThemeId) {
  const x = themeValues(a, theme)
  const y = themeValues(b, theme)
  return x.light === y.light && x.dark === y.dark
}

/**
 * The page role a sidebar role copies in both modes of a theme, if any. A
 * role with the same name wins ("sidebar-accent" mirrors accent, not
 * secondary, which happens to share its values).
 */
function mirrorOf(role: Role, theme: ThemeId) {
  const twin = (t: DesignToken) => {
    const matches = pageRoles.filter((p) => sameValues(p, t, theme))
    const name = roleName(t).replace(/^sidebar-?/, "") || "background"
    return matches.find((p) => roleName(p) === name) ?? matches[0]
  }
  const fill = twin(role.token)
  if (!fill) return undefined
  return !role.on || twin(role.on) ? roleName(fill) : undefined
}

function SidebarRoles({ roles }: { roles: Role[] }) {
  const th =
    "h-(--table-row-height-sm) px-4 text-left text-caption font-semibold text-muted-foreground"
  const td =
    "align-middle @narrow:h-(--table-row-height) @narrow:px-4 @narrow:py-3"
  return (
    <div className="overflow-hidden rounded-(--card-radius) border">
      <table className="block w-full border-collapse @narrow:table">
        <caption className="sr-only">
          Sidebar colour roles in light and dark
        </caption>
        <thead className="hidden bg-subtle @narrow:table-header-group">
          <tr>
            <th scope="col" className={cn(th, "w-24")}>
              <span className="sr-only">Sample</span>
            </th>
            <th scope="col" className={th}>
              Role
            </th>
            <th scope="col" className={th}>
              Light
            </th>
            <th scope="col" className={th}>
              Dark
            </th>
            <th scope="col" className={th}>
              Mirrors
            </th>
          </tr>
        </thead>
        <tbody className="block @narrow:table-row-group">
          {roles.map((role) => {
            const mirror = perTheme((theme) => mirrorOf(role, theme) ?? "")
            const mirrorText = perTheme((theme) => mirror[theme] || "Own value")
            return (
              <tr
                key={role.token.cssVar}
                className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-t p-4 first:border-t-0 @narrow:table-row @narrow:p-0 @narrow:first:border-t"
              >
                <td className={cn(td, "row-span-2")}>
                  <RoleSwatch
                    role={role}
                    size="sm"
                    className="h-10 w-20 rounded-md"
                  />
                </td>
                <td className={td}>
                  <div className="grid gap-0.5">
                    <span className="text-label text-foreground">
                      {roleName(role.token)}
                    </span>
                    <CodeList
                      value={roleUtilities(role)}
                      className="text-xs text-muted-foreground"
                    />
                  </div>
                </td>
                {/* Small screens: the same labelled Light and Dark lines as the role tiles. */}
                <td className={cn(td, "col-start-2 @narrow:hidden")}>
                  <dl className="grid gap-1 border-t pt-2.5">
                    {modes.map(({ value: mode, label }) => (
                      <div
                        key={mode}
                        className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-2"
                      >
                        <dt className="text-caption text-muted-foreground">
                          {label}
                        </dt>
                        <RefLine role={role} mode={mode} />
                      </div>
                    ))}
                    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-2">
                      <dt className="text-caption text-muted-foreground">
                        Mirrors
                      </dt>
                      <dd className="font-mono text-xs text-foreground">
                        <ThemeText value={mirrorText} />
                      </dd>
                    </div>
                  </dl>
                </td>
                {modes.map(({ value: mode }) => (
                  <td
                    key={mode}
                    className={cn(td, "hidden @narrow:table-cell")}
                  >
                    <Meta className="text-foreground">
                      <ThemeText
                        value={perTheme((theme) => roleRefs(role, mode, theme))}
                      />
                    </Meta>
                  </td>
                ))}
                <td className={cn(td, "hidden @narrow:table-cell")}>
                  <ByTheme by={(theme) => mirror[theme]}>
                    {(theme) =>
                      mirror[theme] ? (
                        <code className="font-mono text-xs text-foreground">
                          {mirror[theme]}
                        </code>
                      ) : (
                        <Meta>Own value</Meta>
                      )
                    }
                  </ByTheme>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Semantic roles                                                            */
/* ------------------------------------------------------------------------ */

const groupBlurb: Record<string, string> = {
  "surface & text":
    "The canvas, its text colours and the surfaces that sit on it.",
  interactive: "Fills for actions, controls and hovered or selected rows.",
  brand:
    "The theme's accent, used sparingly: links, focus, active indicators and one highlighted word. Mono's accent is ink.",
  status:
    "Each status has a strong colour for text and fills, and a quiet fill for banners and badges.",
  "lines & focus":
    "Hairlines, control and overlay edges, the focus outline and the backdrop behind dialogs.",
  panel:
    "Dark emphasis surfaces. They stay dark in both modes and sit above the canvas in dark mode. Accents on them use the panel roles: panel-brand for the theme's accent, and panel-success, panel-warning and panel-destructive for status.",
  tint: "Flat decorative fills for covers, avatars and placeholders. The names are fixed; a theme may retune the colours, as Mono does with greys.",
  chart:
    "Data series in order. Marks take the fill and stroke utilities; chart config reads the variable.",
  sidebar:
    "The app sidebar copies the page roles, so an app shell can be themed on its own.",
}

const compactGroups = new Set(["tint", "chart"])

/*
 * Columns follow the number of roles, so rows come out full: four or eight
 * roles run four across (status pairs each strong colour with its subtle
 * fill), two run side by side, the rest three across.
 */
function gridFor(count: number, compact: boolean) {
  if (compact) return "@prose:grid-cols-3 @narrow:grid-cols-5"
  if (count % 4 === 0) return "@prose:grid-cols-2 @narrow:grid-cols-4"
  if (count === 2) return "@prose:grid-cols-2"
  return "@prose:grid-cols-2 @narrow:grid-cols-3"
}

export function SemanticRoles() {
  return (
    <div className="grid gap-16">
      {semanticGroups().map((group) => {
        const roles = rolesOf(group.tokens)
        const compact = compactGroups.has(group.name)
        return (
          <div key={group.name} className="grid gap-6">
            <div className="grid gap-1">
              <SubHeading>{sentenceCase(group.name)}</SubHeading>
              {groupBlurb[group.name] ? (
                <p className="max-w-prose text-caption text-copy">
                  {groupBlurb[group.name]}
                </p>
              ) : null}
            </div>
            {group.name === "sidebar" ? (
              <SidebarRoles roles={roles} />
            ) : (
              <ul
                className={cn(
                  "grid gap-x-6 gap-y-6 @prose:gap-y-10",
                  gridFor(roles.length, compact)
                )}
              >
                {roles.map((role) => (
                  <RoleTile
                    key={role.token.cssVar}
                    role={role}
                    compact={compact}
                  />
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
