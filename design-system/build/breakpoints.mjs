/**
 * Breakpoint values. A token can change from a system breakpoint up (sm, md,
 * lg, xl, 2xl: the layout tokens' breakpoint group). Its $value is the base
 * (phones), and $extensions.blocks.breakpoints lists the overrides, mobile
 * first:
 *
 *   "control": {
 *     "$value": { "fontSize": "1rem", "lineHeight": "1.6", … },
 *     "$extensions": { "blocks": { "breakpoints": {
 *       "md": { "fontSize": "0.875rem", "lineHeight": "1.45" }
 *     } } }
 *   }
 *
 * A plain token takes a plain value per breakpoint ("md": "3.5rem", or a
 * reference such as "md": "{radius.lg}"; a number token, such as
 * grid.columns, takes a number: "md": 8). A typography token takes the
 * properties that change (fontSize, lineHeight, letterSpacing, and fontWeight
 * for roles that set a weight); the rest carry over from the base and any
 * smaller breakpoint. The base is written where the token always lives, and
 * the overrides inside `@media (width >= <breakpoint>)` blocks after it.
 * Semantic colours cannot have breakpoint values: a colour role never changes
 * with the viewport, and a theme cannot change a value that has breakpoint
 * values. tokens.ts lists each token's value per breakpoint (`breakpoints`)
 * and the CSS variables involved (`responsiveVars`), so device previews in
 * the viewer can apply them for the previewed width.
 */
import { blocksExt, isReference } from "./load.mjs"
import { fileKey } from "./naming.mjs"
import {
  all,
  cssValue,
  darkTokens,
  formatValue,
  px,
  referenced,
} from "./tokens.mjs"

function minWidth(t) {
  const min = String(t.$value)
  if (Number.isNaN(px(min)))
    throw new Error(`Breakpoint ${min.trim()} must be in rem or px`)
  return min
}

/** System breakpoints, smallest first: { name: "md", min: "48rem" }. */
export const breakpoints = all
  .filter((t) => t.meta.group === "breakpoint")
  .map((t) => ({ name: t.path.slice(1).join("-"), min: minWidth(t) }))
  .sort((a, b) => px(a.min) - px(b.min))
export const breakpointNames = breakpoints.map((b) => b.name)

/** The CSS variables a typography token writes, with the property each one carries. */
export function typeVars(t) {
  const { cssVar } = t.meta
  const vars = [
    ["fontSize", cssVar],
    ["lineHeight", `${cssVar}--line-height`],
    ["letterSpacing", `${cssVar}--letter-spacing`],
  ]
  if (t.meta.group === "roles" && Number(t.$value.fontWeight) >= 600)
    vars.push(["fontWeight", `${cssVar}--font-weight`])
  return vars
}

export const declaredBreakpoints = (t) => blocksExt(t)?.breakpoints

/**
 * A token's breakpoint values, validated: [{ name, min, css: [[var, value]], value }]
 * smallest first, where css holds the declarations that breakpoint overrides and
 * value is the token's full value from that breakpoint up.
 */
function breakpointValues(t) {
  const declared = declaredBreakpoints(t)
  if (!declared) return []
  const name = t.path.join(".")
  const where = `the breakpoint values of ${name}`
  if (t.meta.scope === "mode")
    throw new Error(`${name}: semantic colours cannot have breakpoint values`)
  for (const key of Object.keys(declared)) {
    if (!breakpointNames.includes(key))
      throw new Error(
        `${name}: unknown breakpoint "${key}". Use ${breakpointNames.join(", ")}.`
      )
  }
  let current = t.$value
  return breakpoints
    .filter((b) => declared[b.name] !== undefined)
    .map((b) => {
      const override = declared[b.name]
      if (t.meta.tier === "typography") {
        if (!override || typeof override !== "object")
          throw new Error(
            `${name}.${b.name}: give the typography properties that change`
          )
        const vars = new Map(typeVars(t))
        const css = []
        current = { ...current }
        for (const [prop, raw] of Object.entries(override)) {
          if (!vars.has(prop))
            throw new Error(
              `${name}.${b.name}: ${prop} cannot change at a breakpoint. Use ${[...vars.keys()].join(", ")}.`
            )
          const value = isReference(raw) ? referenced(raw, where).$value : raw
          current[prop] = value
          css.push([vars.get(prop), String(value)])
        }
        return { ...b, css, value: current }
      }
      if (override === null || typeof override === "object")
        throw new Error(`${name}.${b.name}: give a single value`)
      if (
        t.$type === "number" &&
        !isReference(override) &&
        (typeof override !== "number" || !Number.isFinite(override))
      ) {
        throw new Error(
          `${name}.${b.name}: a number token takes a number at each breakpoint`
        )
      }
      const target = isReference(override) ? referenced(override, where) : null
      current = target ? target.$value : override
      return {
        ...b,
        css: [
          [
            t.meta.cssVar,
            target
              ? `var(${target.meta.cssVar})`
              : formatValue(t.$type, override),
          ],
        ],
        value: current,
      }
    })
}

for (const t of darkTokens) {
  if (t.original?.$extensions?.blocks?.breakpoints && fileKey(t) === "dark") {
    throw new Error(
      `${t.path.join(".")}: semantic colours cannot have breakpoint values`
    )
  }
}

const responsive = all
  .map((t) => ({ t, steps: breakpointValues(t) }))
  .filter((r) => r.steps.length > 0)

/** Each token's breakpoint values, by path. */
export const breakpointsByToken = new Map(
  responsive.map(({ t, steps }) => [t.path.join("."), steps])
)

/** Every variable a breakpoint overrides, at its base value, and the overrides per breakpoint. */
export const responsiveVars = {
  base: Object.fromEntries(
    responsive.flatMap(({ t, steps }) => {
      const touched = new Set(steps.flatMap((s) => s.css.map(([v]) => v)))
      if (t.meta.tier === "typography")
        return typeVars(t)
          .filter(([, v]) => touched.has(v))
          .map(([prop, v]) => [v, String(t.$value[prop])])
      return [[t.meta.cssVar, cssValue(t)]]
    })
  ),
  breakpoints: breakpoints
    .map((b) => ({
      ...b,
      vars: Object.fromEntries(
        responsive.flatMap(
          ({ steps }) => steps.find((s) => s.name === b.name)?.css ?? []
        )
      ),
    }))
    .filter((b) => Object.keys(b.vars).length > 0),
}
