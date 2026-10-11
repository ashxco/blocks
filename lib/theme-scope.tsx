import * as React from "react"

import { themeScopeProps, type ThemeId, type ThemeMode } from "@/lib/themes"
import { cn } from "@/lib/utils"

/**
 * Scopes a subtree to a theme preset and/or a mode, whatever the page uses:
 *
 *   <ThemeScope theme="ocean" mode="dark">…</ThemeScope>
 *
 * Every token inside resolves for that theme and mode, nested scopes
 * included, and the subtree takes the theme's fonts. Omit `theme` or `mode` to
 * inherit it. Text colour and background are inherited like any element's;
 * add `bg-background text-copy` for a standalone surface. A server component:
 * use it anywhere. For another element, spread themeScopeProps() instead.
 */
export function ThemeScope({
  theme,
  mode,
  className,
  ...props
}: React.ComponentProps<"div"> & { theme?: ThemeId; mode?: ThemeMode }) {
  const scope = themeScopeProps(theme, mode)
  return (
    <div
      data-slot="theme-scope"
      {...props}
      {...scope}
      className={cn(scope.className, className)}
    />
  )
}
