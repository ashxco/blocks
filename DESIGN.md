# Blocks design system

Blocks is a design system, component library and template kit built on Next.js 16, React 19, Tailwind CSS v4, Base UI and shadcn/ui. Everything visual is controlled by design tokens. This document is the contract every component, molecule, template and viewer page follows.

## The look

Minimal, clean and immersive. White canvas, near-black ink, one violet accent, generous space and very bold type. Dark **panels** carry emphasis. Separation comes from hairline borders and tinted surfaces, never from depth effects.

| Always | Never |
|---|---|
| Extra-bold headings in full ink (`text-foreground`) with tight tracking | Grey, light-weight or italic headings |
| Pill buttons (`rounded-(--button-radius)`) | Shadows of any kind (`shadow-*`, `drop-shadow-*`, `box-shadow`) |
| 1px hairline borders (`border`, `border-border`) and tinted bands (`bg-subtle`) | Gradients (`bg-linear-*`, `bg-radial-*`, `*-gradient()`), glows or colour fades |
| Dark emphasis panels (`bg-panel text-panel-foreground`) | Eyebrow labels, small badges or pills above headings in marketing pages |
| Brand violet used sparingly: links, focus, active indicators, one highlighted word | Decorative numbering such as "01 / 02 / 03" or step counters |
| Real, plain-language placeholder copy | Lorem ipsum, emoji as decoration |
| Visible focus (`focus-visible:focus-ring`) | Glow rings (`ring-3 ring-ring/50`) as focus styles |

Badges exist in the system for **status and counts in app UI** (e.g. "Active", "3 new"). They are not used as section labels.

The only blur in the system is `backdrop-blur-glass`, for the sticky header once the page scrolls and for overlay backdrops. Every scrim (dialog, alert dialog, sheet, drawer, command dialog, mobile sidebar) is `bg-overlay backdrop-blur-glass`, and docs stages and thumbnails show it as it is: never switch the blur off in a preview.

## Tokens

Source of truth: `design-system/tokens/*.tokens.json` (W3C Design Tokens / DTCG format). `npm run tokens` compiles them with Style Dictionary into:

- `app/styles/tokens.css`: Tailwind v4 `@theme` plus `:root` and `.dark` variables. Tailwind's default palette, shadows, fonts, radii and type scale are removed, so **only Blocks tokens produce utilities**.
- `design-system/generated/tokens.ts`: typed list of every token, used by the viewer.

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

1. **Primitives** (`--bk-ink-*`, `--bk-violet-*`, `--bk-green-*`, `--bk-amber-*`, `--bk-red-*`, `--bk-sky-*`): raw OKLCH scales. Never used directly in components.
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
| `brand`, `brand-subtle` (+ `-foreground`) | `text-brand`, `bg-brand-subtle` | Violet accent |
| `destructive`, `success`, `warning`, `info` (+ `-subtle`, `-foreground`) | `text-success`, `bg-success-subtle` | Status |
| `border`, `border-strong`, `input`, `ring` | `border-border-strong`, `outline-ring` | Lines and focus |
| `popover-border` | `border-popover-border` | Edge of anchored overlays: menus, popovers, selects, hover cards, toasts, chart tooltips |
| `overlay` | `bg-overlay` | Dialog and sheet backdrop |
| `panel`, `panel-foreground`, `panel-muted`, `panel-raised`, `panel-border`, `panel-brand` | `bg-panel`, `text-panel-muted`, `text-panel-brand` | Dark emphasis surfaces; stay dark in both themes. Use `panel-brand` (not `brand`) for accents on panels |
| `panel-success`, `panel-warning`, `panel-destructive` | `text-panel-success`, `bg-panel-warning` | Status on panels: dots, checks, failed states. Use these, not `success` or a `.dark` scope, inside `bg-panel` |
| `terminal`, `terminal-foreground` | `bg-terminal` | Code and terminal windows |
| `tint-violet`, `tint-mint`, `tint-sand`, `tint-sky`, `tint-rose` | `bg-tint-sky` | Flat decorative fills for covers, avatars, placeholders |
| `chart-1` … `chart-5` | `fill-chart-1`, `var(--chart-1)` | Data series |
| `sidebar-*` | `bg-sidebar` | App sidebar |

Opacity modifiers work on every colour: `bg-primary/85`, `border-panel-foreground/60`.

Dark mode keeps one ladder, darkest to lightest: canvas (`background`), `card`, `subtle`, `muted` and `popover`, `secondary`, then `panel` and `panel-raised`. A panel is lighter than everything around it in dark mode, so it still reads as the emphasis surface; `terminal` sits a step above the canvas so code windows stay visible on it.

Themes: `.dark` on any element switches its subtree to dark values; `.light` forces light values, even inside `.dark`. `dark:` utilities follow the nearest scope the same way. Pages and previews accept `?theme=dark|light`, which forces the theme before first paint without saving it.

Overlays portal to `<body>`, outside any scope. Wrap a region whose theme differs from the page in `<PortalScope className="dark">` (`@/lib/portal-container`) and every menu, popover, select, tooltip, dialog or sheet opened inside renders with that theme. An overlay's own `container` prop still wins, and nested overlays follow their parent.

3. **Component tokens** (`--button-height-md`, `--control-height-xs|sm|md|lg`, `--control-radius`, `--selection-size`, `--switch-width(-sm)`, `--otp-slot-width`, `--calendar-cell-size`, `--card-padding(-sm)`, `--panel-padding(-sm)`, `--overlay-radius`, `--popover-width(-sm|-lg)`, `--hover-card-width`, `--menu-min-width(-lg)`, `--tooltip-max-width`, `--toast-width`, `--dialog-width(-sm|-lg)`, `--command-input-height|item-height|footer-height`, `--sheet-width`, `--table-row-height(-sm)`, `--header-height(-sm)`, `--sidebar-width(-icon|-mobile)`, `--scrollbar-size`, …). The full list is on the viewer's Tokens page. Read them with Tailwind's variable syntax: `h-(--button-height-md)`, `rounded-(--control-radius)`, `p-(--card-padding)`.

### Typography

Fonts: Plus Jakarta Sans (`font-sans`, `font-heading`) and Geist Mono (`font-mono`).

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

Roles are registered with `cn()` as font sizes, so `cn("text-control text-foreground")` keeps both classes and a later role or size step replaces an earlier one. The size scale `text-xs` … `text-7xl` also exists for dense UI. Available weights: `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `font-extrabold`. There are no light weights.

### Space, shape, layout, motion

- Spacing unit `--spacing` (0.25rem): `p-4`, `gap-6`. Named: `px-gutter` (page side padding), `py-section` (section rhythm), `py-section-sm`, `gap-stack`.
- Containers: `container-page`, `container-wide`, `container-narrow` utilities (centred, with gutters), or `max-w-narrow|page|wide`. Tailwind's container scale (`max-w-xs` … `max-w-7xl`, `@sm:` … `@7xl:`) is available, plus `@prose:` (42rem), `@narrow:`, `@page:` and `@wide:` container queries. Note that `max-w-prose` is Tailwind's fixed 65ch.
- Radius: `rounded-xs` (6px), `sm` (8), `md` (12: controls, menus), `lg` (18: cards), `xl` (22: dialogs), `2xl` (28: panels), `3xl`, `4xl`, `full`.
- Motion: durations `duration-(--duration-fast|base|slow|slower)`, easings `ease-standard|out|in|in-out`. Everything respects `prefers-reduced-motion` (globals.css). Keep motion subtle: fades, small translates, height reveals.
- Borders: `--border-width-hairline` (1px), `--border-width-strong` (2px).
- Z: `z-(--z-header)`, `z-(--z-overlay)`, `z-(--z-toast)`.
- Breakpoints: `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem. Use container queries (`@container`, `@md:`, `@prose:`) for components that live in variable-width slots. Tokens can carry their own breakpoint values (see Breakpoint values above).

## Components (components/ui)

shadcn/ui components on **Base UI** primitives (`@base-ui/react`), restyled to Blocks. Their APIs stay shadcn-compatible; only styling changes.

- Compose with the **render prop**, not `asChild`: `<Button nativeButton={false} render={<Link href="/pricing" />}>Pricing</Button>`. Set `nativeButton={false}` whenever a Button renders a non-button element. Triggers work the same way: `<DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>`.
- Merge classes with `cn` from `@/lib/utils`.
- Keep `data-slot` attributes; add `data-variant` / `data-size` where useful.
- Overlays (menus, popovers, selects, dialogs, sheets, tooltips): `bg-popover`, 1px `border` (`border-popover-border` on anchored overlays, plain `border` on dialogs and sheets), `rounded-(--overlay-radius)` (dialogs `rounded-(--dialog-radius)`), no shadow, enter/exit with fade and a 4px slide or 98% scale using `--duration-base` and `ease-out`. Widths come from tokens: `w-(--popover-width)`, `min-w-(--menu-min-width)`, `max-w-(--tooltip-max-width)`, `max-w-(--dialog-width-sm)`.
- Overlay portals: every wrapper renders its Base UI Portal through `ScopedPortal` (`@/lib/portal-container`), which resolves the container from the `container` prop, then the nearest `PortalScope` or `PortalContainerProvider`, then Base UI's default. Content components that portal take a `container` prop for pinning into a preview stage.
- Controls (input, select, textarea, combobox, OTP): `h-(--control-height-md)`, `rounded-(--control-radius)`, `bg-muted` fill with `border-input`; on focus `border-ring` plus `focus-ring` outline; invalid uses `border-destructive`. Typed text in the default size is `text-control` (never `text-base md:text-sm`); the `sm` size uses `text-sm` and `lg` uses `text-base`.
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

Runs the token build, TypeScript and the design-system lint (`scripts/lint-ds.mjs`), which rejects raw colours, gradients, shadows, Tailwind's default palette, light or italic type and `asChild`.

Screenshots for review:

```bash
node scripts/shot.mjs <url> <out.png> [width=1440] [height=2400] [light|dark] [wait=15000]
```

It captures in real time once the page has hydrated and gone quiet; `wait` (or `SHOT_WAIT`) is the most it waits, in milliseconds. Widths under 600 are emulated as a phone at that exact width.
