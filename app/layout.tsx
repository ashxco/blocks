import type { Metadata } from "next"
import { DM_Sans, Geist, Geist_Mono, Inter_Tight, Manrope, Plus_Jakarta_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/*
 * Fonts. Each one sets a CSS variable on <html> that the font tokens read
 * (font.family.sans and .mono in design-system/tokens and design-system/themes).
 * The default theme's fonts are preloaded; a theme's own font downloads when a
 * page first uses that theme.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

/** Ocean. */
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter-tight",
  preload: false,
})

/** Forest. */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  preload: false,
})

/** Ember. */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  preload: false,
})

/** Mono. */
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-geist",
  preload: false,
})

export const metadata: Metadata = {
  title: {
    default: "Blocks",
    template: "%s · Blocks",
  },
  description:
    "Blocks is a design system and template kit: tokens, components, molecules and page templates.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        jakarta.variable,
        geistMono.variable,
        interTight.variable,
        manrope.variable,
        dmSans.variable,
        geist.variable
      )}
    >
      <body>
        <ThemeProvider defaultTheme="light">
          <Toaster>
            <TooltipProvider>{children}</TooltipProvider>
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  )
}
