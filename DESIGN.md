# Blocks design system

Blocks is a design system, component library and template kit built on Next.js 16, React 19, Tailwind CSS v4, Base UI and shadcn/ui. Everything visual is controlled by design tokens. This document is the contract every component, molecule, template and viewer page follows.

## The look

Minimal, clean and immersive. White canvas, near-black ink, one accent from the theme (violet in the default theme), generous space and very bold type. Dark **panels** carry emphasis. Separation comes from hairline borders and tinted surfaces, never from depth effects.

| Always | Never |
|---|---|
| Extra-bold headings in full ink (`text-foreground`) with tight tracking | Grey, light-weight or italic headings |
| Buttons use `rounded-(--button-radius)` (pill in the default theme) | Shadows of any kind (`shadow-*`, `drop-shadow-*`, `box-shadow`) |
| 1px hairline borders (`border`, `border-border`) and tinted bands (`bg-subtle`) | Gradients (`bg-linear-*`, `bg-radial-*`, `*-gradient()`), glows or colour fades |
| Dark emphasis panels (`bg-panel text-panel-foreground`) | Eyebrow labels, small badges or pills above headings in marketing pages |
| The theme's accent (`brand`) used sparingly: links, focus, active indicators, one highlighted word | Decorative numbering such as "01 / 02 / 03" or step counters |
| Real, plain-language placeholder copy | Lorem ipsum, emoji as decoration |
| Visible focus (`focus-visible:focus-ring`) | Glow rings (`ring-3 ring-ring/50`) as focus styles |

Badges exist in the system for **status and counts in app UI** (e.g. "Active", "3 new"). They are not used as section labels.

The only blur in the system is `backdrop-blur-glass`, for the sticky header once the page scrolls and for overlay backdrops. Every scrim (dialog, alert dialog, sheet, drawer, command dialog, mobile sidebar) is `bg-overlay backdrop-blur-glass`, and docs stages and thumbnails show it as it is: never switch the blur off in a preview.

These rules hold in every theme (see Themes): a theme changes the accent, the neutrals' tint, the shapes and the fonts, never the look's principles.

## Tokens

Source of truth: `design-system/tokens/*.tokens.json` (W3C Design Tokens / DTCG format) for the default theme, and `design-system/themes/<id>.tokens.json` for the theme presets. `npm run tokens` compiles them with Style Dictionary into:

- `app/styles/tokens.css`: Tailwind v4 `@theme`, the `:root` variables, the mode scopes (`.dark`, `.light`) and the theme scopes (`[data-theme]`). Tailwind's default palette, shadows, fonts, radii and type scale are removed, so **only Blocks tokens produce utilities**.
- `design-system/generated/tokens.ts`: typed list of every token and every theme, used by the viewer.
- `design-system/generated/themes.json`: every semantic colour resolved per theme and mode, read by the contrast check.

Never edit the generated files. Only the design-system owner edits token sources. If you need a token that does not exist, use the closest existing one and say so in your final report.

### Breakpoint values

A token can change from a breakpoint up. Its `$value` is the phone value, and `$extensions.blocks.breakpoints` lists the overrides, mobile first, keyed by the system breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`):

```json
"control": {
  "$value": { "fontSize": "1rem", "lineHeight": "1.6", "…": "…" },
  "$extensions": { "blocks": { "breakpoints": {
    "md": { "fontSize": "0.875rem", "lineHeight": "1.45" }
  } } }
}
```

- A plain token takes one value per breakpoint (`"md": "3.5rem"`, or a reference such as `"md": "{radius.lg}"`). A typography token takes only the properties that change (`fontSize`, `lineHeight`, `letterSpacing`, and `fontWeight` for roles that set a weight); the rest carry over.
- The build writes the base value where the token always lives and the overrides in `@media (width >= <breakpoint>)` blocks at the end of `tokens.css`. The utility stays the same (`text-control`, `h-(--…)`), so never add `md:` variants to repeat what a token already does.
- Semantic colours cannot have breakpoint values; the build stops with an error.
- `tokens.ts` gives each token's `breakpoints` (its full value from each breakpoint up), the `breakpoints` list and `responsiveVars` (every variable involved, at its base and per breakpoint). Media queries only see the real window, so the viewer's in-page previews (an example's Desktop, Tablet and Mobile canvas, and index thumbnails) apply them for the previewed width with `viewportStyle(width)` from `components/viewer/devices.ts`, alongside the `vw` recomputation. Template previews are real iframes and need nothing.
- The Tokens page lists each breakpoint value under the base value; the Typography page shows them under the role.

### Three tiers

1. **Primitives**: raw OKLCH scales, never used directly in components. Fixed scales: neutrals `--bk-ink-*` (default), `--bk-slate-*`, `--bk-sage-*`, `--bk-stone-*`, `--bk-grey-*`; accents `--bk-violet-*` (default), `--bk-blue-*`, `--bk-emerald-*`, `--bk-orange-*`; status `--bk-green-*`, `--bk-amber-*`, `--bk-red-*`, `--bk-sky-*`. Accent and status scales have steps 50 … 950 plus `dim` (the quiet dark-mode fill); neutrals have 0 … 1000. On top sit the **theme scales** `--bk-accent-*` and `--bk-neutral-*` (`theme.accent.*`, `theme.neutral.*` in the sources): aliases that point at violet and ink by default and at another scale in each theme. Semantic colours reference the theme scales, never violet or ink by name.
2. **Semantic** roles, with light and dark values. These are the colour utilities:

| Role | Utilities | Use |
|---|---|---|
| `background` / `foreground` | `bg-background`, `text-foreground` | Canvas; headings and primary text |
| `copy` | `text-copy` | Paragraphs |
| `muted-foreground` | `text-muted-foreground` | Meta, captions, placeholders, inactive icons |
| `subtle` | `bg-subtle` | Tinted page bands |
| `card`, `popover` (+ `-foreground`) | `bg-card`, `bg-popover` | Cards; menus, popovers, dialogs |
| `primary` (+ `-foreground`) | `bg-primary` | Primary actions (ink) |
| `secondary`, `muted`, `accent` | `bg-secondary`, `bg-muted`, `bg-accent` | Secondary buttons; input fills; hover/selected rows |
| `brand`, `brand-subtle` (+ `-foreground`) | `text-brand`, `bg-brand-subtle` | The theme's accent |
| `destructive`, `success`, `warning`, `info` (+ `-subtle`, `-foreground`) | `text-success`, `bg-success-subtle` | Status |
| `border`, `border-strong`, `input`, `ring` | `border-border-strong`, `outline-ring` | Lines and focus |
| `popover-border` | `border-popover-border` | Edge of anchored overlays: menus, popovers, selects, hover cards, toasts, chart tooltips |
| `overlay` | `bg-overlay` | Dialog and sheet backdrop |
| `panel`, `panel-foreground`, `panel-muted`, `panel-raised`, `panel-border`, `panel-brand` | `bg-panel`, `text-panel-muted`, `text-panel-brand` | Dark emphasis surfaces; stay dark in both modes. Use `panel-brand` (not `brand`) for accents on panels |
| `panel-success`, `panel-warning`, `panel-destructive` | `text-panel-success`, `bg-panel-warning` | Status on panels: dots, checks, failed states. Use these, not `success` or a `.dark` scope, inside `bg-panel` |
| `terminal`, `terminal-foreground` | `bg-terminal` | Code and terminal windows |
| `tint-violet`, `tint-mint`, `tint-sand`, `tint-sky`, `tint-rose` | `bg-tint-sky` | Flat decorative fills for covers, avatars, placeholders |
| `chart-1` … `chart-5` | `fill-chart-1`, `var(--chart-1)` | Data series |
| `sidebar-*` | `bg-sidebar` | App sidebar |

Opacity modifiers work on every colour: `bg-primary/85`, `border-panel-foreground/60`.

Dark mode keeps one ladder, darkest to lightest: canvas (`background`), `card`, `subtle`, `muted` and `popover`, `secondary`, then `panel` and `panel-raised`. A panel is lighter than everything around it in dark mode, so it still reads as the emphasis surface; `terminal` sits a step above the canvas so code windows stay visible on it.

Modes: `.dark` on any element switches its subtree to dark values; `.light` forces light values, even inside `.dark`. `dark:` utilities follow the nearest scope the same way. Pages and previews accept `&mode=dark|light` (and the older `?theme=dark|light`), which forces the mode before first paint without saving it. In the UI, light and dark is called **Appearance**.

Overlays portal to `<body>`, outside any scope. Wrap a region whose mode or theme differs from the page in `<PortalScope className="dark">` (or `<PortalScope theme="mono" className="dark">`, from `@/lib/portal-container`) and every menu, popover, select, tooltip, dialog or sheet opened inside renders with that mode and theme. An overlay's own `container` prop still wins, and nested overlays follow their parent.

3. **Component tokens** (`--button-height-md`, `--button-radius`, `--button-radius-sm|xs` (small buttons; follow `--button-radius` unless a theme tightens them), `--badge-radius`, `--card-radius`, `--panel-radius`, `--dialog-radius`, `--control-height-xs|sm|md|lg`, `--control-radius`, `--selection-size`, `--switch-width(-sm)`, `--otp-slot-width`, `--calendar-cell-size`, `--card-padding(-sm)`, `--panel-padding(-sm)`, `--overlay-radius`, `--popover-width(-sm|-lg)`, `--hover-card-width`, `--menu-min-width(-lg)`, `--tooltip-max-width`, `--toast-width`, `--dialog-width(-sm|-lg)`, `--command-input-height|item-height|footer-height`, `--sheet-width`, `--table-row-height(-sm)`, `--header-height(-sm)`, `--sidebar-width(-icon|-mobile)`, `--scrollbar-size`, `--kern-pull`, `--link-decoration-line`, `--brand-mark-ring`, …). The full list is on the viewer's Tokens page. Read them with Tailwind's variable syntax: `h-(--button-height-md)`, `rounded-(--control-radius)`, `p-(--card-padding)`.

### Typography

Fonts come from the theme's font tokens: `--font-sans` (`font-sans`, and `font-heading`, which follows it) and `--font-mono` (`font-mono`). In the default theme they are Plus Jakarta Sans and Geist Mono; each theme names its own (see Themes). Never name a font family in a component.

Type **roles** set size, line height, tracking and weight in one utility:

| Utility | Use |
|---|---|
| `text-hero` | Oversized showcase statement (800), for the viewer overview and similar |
| `text-display` | Hero headline, one per page (800) |
| `text-h1` | Inner page title (800) |
| `text-h2` | Section heading (800) |
| `text-h3` | Sub-section heading (700) |
| `text-h4` | Card and dialog titles (700) |
| `text-title` | Small titles: list items, tiles (700) |
| `text-lead` | Intro paragraph |
| `text-body` | Paragraph |
| `text-label` | Labels, buttons, navigation (600) |
| `text-control` | Text typed into inputs, selects, comboboxes and textareas: 16px on phones, so iOS does not zoom into a focused field, and 14px from `md` (a breakpoint value) |
| `text-caption` | Meta and helper text |
| `text-code` | Code (pair with `font-mono`) |

A theme can retune a role's tracking for its font (`--text-<role>--letter-spacing`), never its size, line height or weight. Display headings (`text-hero`, `text-display`, `text-h1`, `text-h2`) wrap their text in `<Kern>` (`@/components/ui/kern`), which pulls a word-ending comma or full stop back in by the theme's `--kern-pull` (`component.kern.pull`: 0.08em for Plus Jakarta Sans, 0.025em for Inter Tight, 0.02em for Manrope and DM Sans, none for Geist). Roles are registered with `cn()` as font sizes, so `cn("text-control text-foreground")` keeps both classes and a later role or size step replaces an earlier one. The size scale `text-xs` … `text-7xl` also exists for dense UI. Available weights: `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `font-extrabold`. There are no light weights.

### Space, shape, layout, motion

- Spacing unit `--spacing` (0.25rem): `p-4`, `gap-6`. Named: `px-gutter` (page side padding), `py-section` (section rhythm), `py-section-sm`, `gap-stack`.
- Containers: `container-page`, `container-wide`, `container-narrow` utilities (centred, with gutters), or `max-w-narrow|page|wide`. Tailwind's container scale (`max-w-xs` … `max-w-7xl`, `@sm:` … `@7xl:`) is available, plus `@prose:` (42rem), `@narrow:`, `@page:` and `@wide:` container queries. Note that `max-w-prose` is Tailwind's fixed 65ch.
- Radius: `rounded-xs` (6px), `sm` (8), `md` (12: controls, menus), `lg` (18: cards), `xl` (22: dialogs), `2xl` (28: panels), `3xl`, `4xl`, `full`, in the default theme; themes change the scale. Shapes a theme may change read the component tokens (`rounded-(--button-radius)`, `rounded-(--control-radius)`, `rounded-(--card-radius)`, `rounded-(--panel-radius)`, `rounded-(--overlay-radius)`, `rounded-(--dialog-radius)`, `rounded-(--badge-radius)`) or the scale. `rounded-full` is for avatars, dots, switches and other shapes that stay round in every theme, never for buttons.
- Motion: durations `duration-(--duration-fast|base|slow|slower)`, easings `ease-standard|out|in|in-out`. Everything respects `prefers-reduced-motion` (globals.css). Keep motion subtle: fades, small translates, height reveals.
- Borders: `--border-width-hairline` (1px), `--border-width-strong` (2px).
- Z: `z-(--z-header)`, `z-(--z-overlay)`, `z-(--z-toast)`.
- Breakpoints: `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem. Use container queries (`@container`, `@md:`, `@prose:`) for components that live in variable-width slots. Tokens can carry their own breakpoint values (see Breakpoint values above).

## Themes

A theme is a full preset: the accent scale, the neutral scale (its tint), the radius scale and the component radii that follow from it, the fonts, and type tracking where a font needs it, always in both light and dark. Mode stays independent: any theme works in either mode. A theme never changes spacing, sizes, type sizes or weights, motion, or what the status colours mean (it may retune `success`, `warning`, `destructive` and `info` only for contrast). Every theme meets the whole contract in this document, not only the default.

| Theme | id | Look |
|---|---|---|
| Blocks | `blocks` | The default: violet accent on faint-violet ink, pill buttons, generous radii, Plus Jakarta Sans and Geist Mono |
| Ocean | `ocean` | A confident blue accent on cool slate, pill buttons with crisp 8px controls and 14px cards, Inter Tight |
| Forest | `forest` | A deep emerald accent on soft green-grey, rounded-square buttons, medium radii, Manrope |
| Ember | `ember` | A warm orange accent on warm stone, soft and generous radii, pill buttons, DM Sans |
| Mono | `mono` | No hue at all: an ink accent on pure greys, sharp radii (6px controls and buttons, 8px cards), Geist and Geist Mono. With no hue to tell them apart, links and the active mobile menu item underline at rest, the logo's accent point gets a canvas-coloured ring, and the light-mode focus ring is graphite rather than ink so it still shows on dark panels |

In the UI the picker is labelled **Theme**; light and dark is **Appearance**.

### Applying a theme

- `data-theme="<id>"` on any element scopes that theme to its subtree, the way `.dark` and `.light` scope the mode. No attribute means `blocks`; `data-theme="blocks"` resets the default inside another theme. Scopes nest in every combination (a theme inside `.dark`, `.dark` inside a theme, a theme inside a theme, `.light` inside a dark theme scope): each subtree gets the nearest theme and the nearest mode.
- In React, `<ThemeScope theme="ocean" mode="dark">` (`@/lib/theme-scope`, works in server components) or `themeScopeProps(theme, mode)` (`@/lib/themes`) for any element. A scope sets its font but inherits text colour and background; add `bg-background text-copy` for a standalone surface, and `<PortalScope theme="ocean" className="dark">` so its overlays follow.
- The URL: `?theme=<id>` forces a theme for the page and `&mode=dark|light` forces the mode, without saving either. `?theme=dark|light` keeps meaning the mode. `withLook(href, { theme, mode })` builds such links.
- The visitor's chosen theme is saved in `localStorage` (`blocks-theme`) and applied before first paint by an inline script, like the mode, so a page never flashes the wrong theme. The viewer and the templates share it, and open tabs follow a change. `useThemePreset()` (`@/components/theme-provider`) returns `{ theme, setTheme, themes, forced, savedTheme }`; choosing a theme on a page whose URL forces one releases it. Viewer code reads the active theme and mode with `useSitePreset()`, `useSiteMode()` or `useSiteLook()` (`components/viewer/site-theme.ts`).
- Components never branch on the theme. They use tokens, and the tokens change.

### Adding a theme

1. Create `design-system/themes/<id>.tokens.json`. It holds only what it changes, plus `$description` and `$extensions.blocks.theme` (`name`, `order`, `modes`). A theme may set: `theme.accent.*` and `theme.neutral.*` (point every step at a fixed scale in the primitives, as every preset does), `radius.*`, `component.*` (e.g. `component.button.radius`, `component.button.radius-sm`, `component.kern.pull` for its font's punctuation, `component.link.decoration-line`), `font.family.*` (with `$extensions.blocks.name`), `type.<role>` with only `{ "letterSpacing": … }`, and individual semantic colours per mode under `light.color.*` and `dark.color.*`. The build rejects anything else.
2. A new scale goes into `design-system/tokens/primitives.tokens.json`; `node scripts/color-scale.mjs accent <hue> <peak-chroma>` or `… neutral <hue> <chroma-factor>` prints one built like the others.
3. A new font: load it with `next/font/google` in `app/layout.tsx` with a `variable` and `preload: false`, add the variable's class to `<html>`, and reference `var(--font-…)` in the theme's `font.family.sans`.
4. Run `npm run tokens`, then `npm run contrast`. The theme is in `themes` (tokens.ts), in `data-theme`, in `?theme=` and in the picker.

### Contrast gate

`npm run contrast` (`scripts/check-contrast.mjs`, part of `npm run check`) checks every theme in light and dark against WCAG AA and fails the build otherwise: 4.5:1 for `foreground`, `copy` and `muted-foreground` on `background`, `card`, `subtle`, `muted` and `popover`; `primary-foreground` on `primary`; `secondary-foreground` on `secondary`; `brand` on `background` and `card`; `brand-foreground` on `brand`; `panel-foreground`, `panel-muted` and `panel-brand` on `panel` and `panel-raised`; each status colour on `background` and on its `-subtle`; and 3:1 for `ring` against `background`. `--all` prints every ratio.

Lines (`border`, `border-strong`, `input`) are not gated. Blocks separates with hairlines on purpose, and they outline components that a label, fill or text already identifies, which WCAG 1.4.11 does not ask to reach 3:1. Gating `border-strong` would darken every outline button, dashed empty state and strong separator in every theme.

## Components (components/ui)

shadcn/ui components on **Base UI** primitives (`@base-ui/react`), restyled to Blocks. Their APIs stay shadcn-compatible; only styling changes.

- Compose with the **render prop**, not `asChild`: `<Button nativeButton={false} render={<Link href="/pricing" />}>Pricing</Button>`. Set `nativeButton={false}` whenever a Button renders a non-button element. Triggers work the same way: `<DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>`.
- Merge classes with `cn` from `@/lib/utils`.
- Keep `data-slot` attributes; add `data-variant` / `data-size` where useful.
- Overlays (menus, popovers, selects, dialogs, sheets, tooltips): `bg-popover`, 1px `border` (`border-popover-border` on anchored overlays, plain `border` on dialogs and sheets), `rounded-(--overlay-radius)` (dialogs `rounded-(--dialog-radius)`), no shadow, enter/exit with fade and a 4px slide or 98% scale using `--duration-base` and `ease-out`. Widths come from tokens: `w-(--popover-width)`, `min-w-(--menu-min-width)`, `max-w-(--tooltip-max-width)`, `max-w-(--dialog-width-sm)`.
- Overlay portals: every wrapper renders its Base UI Portal through `ScopedPortal` (`@/lib/portal-container`), which resolves the container from the `container` prop, then the nearest `PortalScope` or `PortalContainerProvider`, then Base UI's default. Content components that portal take a `container` prop for pinning into a preview stage.
- Controls (input, select, textarea, combobox, OTP): `h-(--control-height-md)`, `rounded-(--control-radius)`, `bg-muted` fill with `border-input`; on focus `border-ring` plus `focus-ring` outline; invalid uses `border-destructive`. Typed text in the default size is `text-control` (never `text-base md:text-sm`); the `sm` size uses `text-sm` and `lg` uses `text-base`.
- Text links in the accent (`text-brand`) take `link-underline` (globals.css), not `hover:underline`: it underlines on hover, and at rest where the theme's `--link-decoration-line` says so (Mono), so a link never depends on hue alone.
- Selection controls (checkbox, radio, switch, slider): ink when on (`bg-primary`), brand only for focus.
- Tabs: underline style by default (ink 2px indicator), plus a segmented variant.
- Cards: flat, `bg-card`, `border`, `rounded-(--card-radius)`, `p-(--card-padding)`.
- Tables: hairline rows, `text-caption` uppercase-free headers in `text-muted-foreground font-semibold`, comfortable `h-(--table-row-height)`.

## Molecules (components/blocks)

Composed sections and app patterns built **only** from `components/ui` and tokens. One file per molecule, named by its registry slug (`components/blocks/pricing-plans.tsx`). Props are typed, with realistic defaults so `<PricingPlans />` renders a complete example. Export the main component as a named export in PascalCase.

## Templates (app/(live)/live)

Full pages built from molecules, filled with the sample content below. Marketing templates share `app/(live)/live/(marketing)/layout.tsx` (site header + footer); auth templates share `app/(live)/live/(auth)/layout.tsx`; app templates share `app/(live)/live/app/layout.tsx` (app shell).

## Sample content

All sample content (templates, molecule defaults, docs examples, viewer copy) uses one fictional company, **Acme Inc.**, and its product **Acme**: a work-management SaaS where teams plan projects, track tasks, write docs, automate busywork and report on progress in one workspace. Pitch: "Plan, track and ship your team's work in one place." Keep every page consistent with these facts, and invent anything else so it fits them. The product is about managing work only: no builds, hosting, server regions, release pipelines or preview URLs.

- **Company**: acme.com, app at `app.acme.com/<workspace>`, emails `firstname@acme.com`, `support@acme.com`, `sales@acme.com`. Founded 2019, remote-first, offices in San Francisco and London. Trust facts, and only these: 12,000+ teams, 4.8M tasks completed every month, SOC 2 Type II, GDPR, 99.9% uptime SLA on Business and Enterprise.
- **Product areas**: Projects (list, board, timeline and calendar views), Tasks (assignees, due dates, priorities Urgent, High, Medium, Low, subtasks, comments), Docs, Automations (metered runs, e.g. "When a task moves to Done, notify the owner"), Reports (workload, on-time delivery, cycle time), Integrations (Slack, Google Drive, GitHub, Figma, Zoom, HubSpot; names only, no real logos), Admin and security (SSO/SAML, roles Owner, Admin, Member, Guest, audit log, two-factor authentication).

| Plan | Price | Includes |
|---|---|---|
| Free | $0 | Up to 3 members, 5 projects, 1,000 automation runs a month, 2 GB storage |
| Pro | $12 per member/month billed annually ($15 monthly) | Unlimited projects, 10,000 automation runs, 100 GB storage, guests, integrations |
| Business | $24 per member/month billed annually ($29 monthly) | Everything in Pro, SSO/SAML, advanced permissions, audit log, 50,000 automation runs, 1 TB storage, 99.9% uptime SLA |
| Enterprise | Custom | Everything in Business, dedicated success manager, custom contracts, data residency |

Annual billing saves about 20%. Pro has a 14-day free trial; Free needs no card.

- **Team**: Hana Kim (Co-founder and CEO), Daniel Brooks (Co-founder and CTO), Maya Patel (Head of Product, the signed-in user in app templates), Jordan Lee (Engineering Lead), Sofia Alvarez (Design Lead), Sam Okafor (Customer Success), Priya Raman (Marketing), Lucas Moreau (Operations). Time zones: San Francisco, New York, London, Lisbon, Bengaluru, Tokyo.
- **Workspace**: Acme Inc. at `app.acme.com/acme`, 18 members and 6 guests, Pro plan billed annually: 18 seats, $216 a month, next invoice Nov 1, 2026, Visa ending 4242, invoices on the 1st. Usage: automation runs 7,240 of 10,000, storage 42 GB of 100 GB, guests 6 of 10.
- **Projects**: Website relaunch (On track), Mobile app 2.0 (At risk), Q4 planning (On track), Customer portal (Off track), Onboarding redesign (Completed), Brand refresh (On track), Billing migration (At risk), Help center (Paused). Badges: On track `success`, At risk `warning`, Off track `destructive`, Completed and Paused neutral.
- **Dashboard**: Active projects 24 (+3 this month), Tasks completed 1,284 this month (+12%), On-time delivery 92% (+4 pts), Average cycle time 3.4 days (−0.6); the main chart is tasks completed per day over 30 days against the previous period. Onboarding templates: Product roadmap, Marketing calendar, Client projects, Sprint planning.
- **Customers** (fictional only): Northwind, Globex, Initech, Brightline, Fieldstone, Copperleaf, Harbor & Co., Meridian Health. Example quote: "We replaced three tools and our weekly planning meeting with Acme." Elena Ruiz, COO, Northwind.
- **Marketing**: changelog 2026: Automations 2.0 (Oct 1), Timeline view (Sep 17), Guest access (Sep 3), Shared dashboards (Aug 20), Recurring tasks (Aug 6). Blog categories Product, Guides, Company, Customers.
- **Developers**: only the API and SDK for integrating Acme, e.g. `npm install @acme/sdk` and `acme.tasks.create({ title, projectId, assignee })`. No hosting or release commands.
- **Visuals** illustrate the product: boards, task lists, timelines, report charts, automation rules, inboxes, built from `components/ui` and tokens. A terminal shows only SDK code.

## Viewer (app/(viewer))

The design-system site: Foundations, Components, Molecules and Templates, generated from `lib/registry.ts`. Docs modules live at `docs/components/<slug>.tsx` and `docs/molecules/<slug>.tsx` and use `docs/kit.tsx` (`Examples`, `Example`, `Guidelines`, `ApiTable`). See `docs/components/button.tsx` for the reference docs module.

## Writing

Plain, specific, active voice. Buttons say what happens ("Create project", "Invite members", "Start free trial"). Errors say what went wrong and how to fix it. No exclamation marks, no "simply", no "seamless".

## Checks

```bash
npm run check
```

Runs the token build, the contrast gate (`scripts/check-contrast.mjs`), TypeScript and the design-system lint (`scripts/lint-ds.mjs`), which rejects raw colours, gradients, shadows, Tailwind's default palette, light or italic type and `asChild`.

Screenshots for review:

```bash
node scripts/shot.mjs <url> <out.png> [width=1440] [height=2400] [light|dark] [wait=15000] [theme]
```

It captures in real time once the page has hydrated and gone quiet; `wait` (or `SHOT_WAIT`) is the most it waits, in milliseconds. The mode argument adds `&mode=`; `theme` (or `SHOT_THEME`, or `?theme=<id>` in the URL) forces a theme preset. Widths under 600 are emulated as a phone at that exact width.
