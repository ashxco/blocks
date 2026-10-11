/** Every Foundations page by its registry slug (lib/registry.ts). */
import type { ComponentType } from "react"

import { ColorsFoundation } from "./colors"
import { IconographyFoundation } from "./iconography"
import type { FoundationPageProps } from "./layout"
import { MotionFoundation } from "./motion"
import { ShapeFoundation } from "./shape"
import { SpacingFoundation } from "./spacing"
import { ThemesFoundation } from "./themes"
import { TokensFoundation } from "./tokens"
import { TypographyFoundation } from "./typography"

export const foundationPages: Record<
  string,
  ComponentType<FoundationPageProps>
> = {
  themes: ThemesFoundation,
  colors: ColorsFoundation,
  typography: TypographyFoundation,
  spacing: SpacingFoundation,
  shape: ShapeFoundation,
  motion: MotionFoundation,
  iconography: IconographyFoundation,
  tokens: TokensFoundation,
}
