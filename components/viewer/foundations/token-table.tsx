import * as React from "react"

import { CopyButton } from "@/components/viewer/copy-button"
import { themeScopeProps } from "@/lib/themes"
import { cn } from "@/lib/utils"

import { ByTheme } from "./by-theme"
import {
  isColor,
  themeById,
  type DesignToken,
  type Mode,
  type ThemeId,
} from "./data"
import { CodeList, ScopedChip } from "./layout"
import {
  rowsByTheme,
  tierLabels,
  valueKey,
  type Block,
  type Row,
  type ThemeView,
} from "./token-rows"

/* ------------------------------------------------------------------------ */
/* Pieces                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * Primitives paint the raw colour; semantic chips resolve the value inside
 * their mode. Both resolve in `theme` when one is chosen, else the page's.
 */
function ColorChip({
  token,
  mode,
  theme,
}: {
  token: DesignToken
  mode?: Mode
  theme?: ThemeId
}) {
  if (token.tier === "semantic" && mode) {
    return (
      <ScopedChip
        cssVar={token.cssVar}
        mode={mode}
        theme={theme}
        base={token.group === "panel" ? "panel" : "background"}
      />
    )
  }
  return (
    <span
      aria-hidden
      {...themeScopeProps(
        theme,
        undefined,
        "block size-5 shrink-0 overflow-hidden rounded-xs border border-border-strong"
      )}
    >
      <span
        className="block size-full"
        style={{ backgroundColor: `var(${token.cssVar})` }}
      />
    </span>
  )
}

/**
 * The value, with the primitive behind it on top for semantic colours. A token
 * that changes with the viewport lists its base value (phones) and the value
 * from each breakpoint up.
 */
function Value({
  row,
  mode,
  theme,
}: {
  row: Row
  mode?: Mode
  theme?: ThemeId
}) {
  const t = row.token
  const value = mode === "dark" ? row.dark : row.light
  const alias = mode === "dark" ? row.darkAlias : row.lightAlias
  if (row.breakpoints.length > 0 && !mode) {
    return (
      <dl className="grid min-w-0 gap-y-0.5 font-mono text-xs @narrow:grid-cols-[auto_minmax(0,1fr)] @narrow:items-baseline @narrow:gap-x-3 @narrow:gap-y-1">
        <dt className="text-muted-foreground">Base</dt>
        <dd className="min-w-0 text-foreground">{value}</dd>
        {row.breakpoints.map((b) => (
          <React.Fragment key={b.name}>
            <dt className="text-muted-foreground">
              From {b.name} · {b.min}
            </dt>
            <dd className="min-w-0 text-foreground">{b.value}</dd>
          </React.Fragment>
        ))}
      </dl>
    )
  }
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      {isColor(t) ? <ColorChip token={t} mode={mode} theme={theme} /> : null}
      <span className="grid min-w-0">
        {alias ? (
          <span className="font-mono text-xs text-foreground">{alias}</span>
        ) : null}
        <span
          className={cn(
            "min-w-0 font-mono text-xs",
            alias ? "text-muted-foreground" : "text-foreground",
            isColor(t) && "whitespace-nowrap"
          )}
        >
          {value}
        </span>
      </span>
    </span>
  )
}

/**
 * A row's value in one mode. For the current theme every theme's version is
 * printed and CSS shows the page's (by-theme.tsx), so the table is right on
 * the first frame; a chosen theme prints only its own.
 */
function ValueCell({
  index,
  mode,
  view,
}: {
  index: number
  mode?: Mode
  view: ThemeView
}) {
  if (view !== "current")
    return <Value row={rowsByTheme[view][index]} mode={mode} theme={view} />
  return (
    <ByTheme as="div" by={(theme) => valueKey(rowsByTheme[theme][index], mode)}>
      {(theme) => <Value row={rowsByTheme[theme][index]} mode={mode} />}
    </ByTheme>
  )
}

/**
 * "Set by Ocean" under a token the shown theme's file sets itself. Tokens
 * that only follow from one (a role on the theme's neutral scale) get no note.
 */
function SetByNote({ index, view }: { index: number; view: ThemeView }) {
  const note = (theme: ThemeId) =>
    rowsByTheme[theme][index].setByTheme
      ? `Set by ${themeById(theme).name}`
      : ""
  const text = (theme: ThemeId) =>
    note(theme) ? (
      <span className="text-caption text-muted-foreground">{note(theme)}</span>
    ) : null
  if (view !== "current") return text(view)
  return <ByTheme by={note}>{text}</ByTheme>
}

/**
 * The token table: one block per tier and group under a subheader, a row per
 * token with its variable, utility and value in light and dark. Values are
 * for the theme the page is on ("current"), or for the chosen theme.
 */
export function TokenTable({
  blocks,
  view,
}: {
  blocks: Block[]
  view: ThemeView
}) {
  const th =
    "h-(--table-row-height-sm) px-5 text-left align-middle text-caption font-semibold text-muted-foreground"
  const td =
    "@narrow:h-(--table-row-height-sm) @narrow:px-5 @narrow:py-2.5 @narrow:align-middle"
  const label =
    "w-10 shrink-0 text-caption text-muted-foreground @narrow:hidden"
  return (
    <div className="overflow-hidden rounded-(--card-radius) border">
      <table className="block w-full border-collapse @narrow:table @narrow:table-fixed">
        <caption className="sr-only">Design tokens</caption>
        <thead className="hidden bg-subtle @narrow:table-header-group">
          <tr>
            <th scope="col" className={cn(th, "w-[32%]")}>
              Token
            </th>
            <th scope="col" className={cn(th, "w-[24%]")}>
              Utility
            </th>
            <th scope="col" className={th}>
              Light
            </th>
            <th scope="col" className={th}>
              Dark
            </th>
          </tr>
        </thead>
        {blocks.map((block) => {
          const variablesOnly = block.rows.every((r) => !r.utility)
          const themed = block.rows.some((r) => r.dark !== undefined)
          return (
            <tbody key={block.key} className="block @narrow:table-row-group">
              <tr className="block border-t bg-subtle @narrow:table-row">
                <th
                  scope="colgroup"
                  colSpan={4}
                  className="block px-4 text-left font-normal @narrow:table-cell @narrow:px-5 @narrow:align-middle"
                >
                  <span className="flex min-h-(--table-row-height-sm) flex-wrap items-center gap-x-2 py-2">
                    <span className="text-label text-foreground">
                      {tierLabels[block.tier]}
                    </span>
                    <span className="text-label font-normal text-muted-foreground">
                      / {block.group}
                    </span>
                    <span className="basis-full text-caption text-muted-foreground tabular @narrow:ml-auto @narrow:basis-auto">
                      {[
                        `${block.rows.length} ${block.rows.length === 1 ? "token" : "tokens"}`,
                        variablesOnly ? "CSS variables only" : null,
                        themed ? null : "same in light and dark",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                </th>
              </tr>
              {block.rows.map((row) => {
                const t = row.token
                const index = row.index
                const hasDark = row.dark !== undefined
                return (
                  <tr
                    key={`${t.tier}:${t.name}`}
                    className="grid gap-1 border-t px-4 py-2.5 @narrow:table-row @narrow:p-0"
                  >
                    <td className={td}>
                      <div className="grid gap-0.5">
                        <div className="flex min-w-0 items-center gap-1">
                          <code
                            className="min-w-0 truncate font-mono text-label text-foreground"
                            title={t.name}
                          >
                            {t.cssVar}
                          </code>
                          {/* Negative margin keeps the 28px button from making the line taller. */}
                          <span className="-my-1 shrink-0">
                            <CopyButton
                              text={t.cssVar}
                              label={`Copy ${t.cssVar}`}
                              size="icon-xs"
                              className="text-muted-foreground hover:text-foreground"
                            />
                          </span>
                        </div>
                        {t.tier === "semantic" && t.description ? (
                          <p className="text-caption text-copy">
                            {t.description}
                          </p>
                        ) : null}
                        {t.themed ? (
                          <SetByNote index={index} view={view} />
                        ) : null}
                      </div>
                    </td>
                    <td
                      className={cn(
                        td,
                        "min-w-0",
                        !row.utility && "hidden @narrow:table-cell"
                      )}
                    >
                      {row.utility ? (
                        <CodeList
                          value={row.utility}
                          className="text-xs text-muted-foreground"
                        />
                      ) : null}
                    </td>
                    {hasDark ? (
                      <>
                        <td
                          className={cn(
                            td,
                            "flex min-w-0 items-center @narrow:table-cell"
                          )}
                        >
                          <span className={label}>Light</span>
                          <ValueCell index={index} mode="light" view={view} />
                        </td>
                        <td
                          className={cn(
                            td,
                            "flex min-w-0 items-center @narrow:table-cell"
                          )}
                        >
                          <span className={label}>Dark</span>
                          <ValueCell index={index} mode="dark" view={view} />
                        </td>
                      </>
                    ) : (
                      <td colSpan={2} className={cn(td, "min-w-0")}>
                        <span className="flex min-w-0 items-center gap-3">
                          {/* Wide rows drop it: the block header already says "same in light and dark". */}
                          <span className="shrink-0 text-caption text-muted-foreground @narrow:hidden">
                            Light and dark
                          </span>
                          <ValueCell index={index} view={view} />
                        </span>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          )
        })}
      </table>
    </div>
  )
}
