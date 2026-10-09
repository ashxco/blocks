import { createCn } from "cn/config"

/**
 * Class merging that knows the Blocks type roles.
 *
 * The stock `cn` treats unknown `text-*` utilities as colours, so
 * `cn("text-h1 text-copy")` drops `text-h1`. Registering the roles as font
 * sizes keeps both.
 */
export const typeRoles = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "title",
  "lead",
  "body",
  "label",
  "caption",
  "code",
] as const

export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: [...typeRoles] }] } },
})
