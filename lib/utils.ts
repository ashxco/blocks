import { createCn } from "cn/config"

import { typeRoles } from "@/design-system/generated/tokens"

/**
 * Class merging that knows the Blocks type roles.
 *
 * The stock merger treats unknown text-* utilities as colours, so
 * "text-label text-foreground" would lose text-label. Registering the roles
 * (generated from the typography tokens) as font sizes keeps both, and still
 * lets one role override another.
 */
export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: [...typeRoles] }] } },
})
