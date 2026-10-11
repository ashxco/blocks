# Blocks

A design system: design tokens, five themes and 64 components, documented in one viewer.

- **Tokens:** W3C DTCG files compiled by Style Dictionary into Tailwind CSS v4 variables, in light and dark, with per-breakpoint values where a token needs them.
- **Themes:** Blocks, Ocean, Forest, Ember and Mono. Each sets its own accent, neutrals, shapes and fonts, works in light and dark, and passes the contrast and uniqueness gates.
- **Components:** built on Base UI and following shadcn/ui's component API, with no shadcn dependency, including the layout primitives (Container, Stack, Inline, Grid) and a 4 / 8 / 12-column grid.
- **Viewer:** the site at `/`, with Foundations, Components and Themes. Examples use Acme Inc., a fictional work-management company.

## Requirements

Node.js 20.9 or later.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Builds the tokens, then starts the dev server |
| `npm run tokens` | Compiles `design-system/` into `app/styles/tokens.css` and `design-system/generated/` |
| `npm run check` | Tokens, contrast gate, theme uniqueness gate, TypeScript and the design-system lint |
| `npm run lint` | ESLint |
| `npm run verify` | `check`, `lint` and a production build: run it before every deploy |
| `npm run build` / `npm start` | Production build and server |

## Deploy

Set `NEXT_PUBLIC_SITE_URL` to the public origin (for example `https://blocks.example.com`) in the build environment: it is read when the site is built, so metadata, `sitemap.xml` and `robots.txt` point at it. Without it they fall back to localhost. Then:

```bash
npm run verify
```

```bash
npm start
```

Every page is static, so the build output works on any Next.js host.

## Change the look

Edit the token files in `design-system/tokens/` (or a theme in `design-system/themes/`), then run `npm run tokens`. Every component and viewer page follows, because none of them use raw values. [DESIGN.md](DESIGN.md) is the contract: the rules, every token tier, the themes and how to add one.

## Themes

Pick a theme from the **Theme** menu at the foot of the sidebar. Light and dark is the **Appearance** toggle beside it, or press D. The choice is saved in the browser. To preview without saving, add `?theme=ember&mode=dark` to any URL. In code, `data-theme="<id>"` scopes a theme to any subtree.

## Structure

| Path | What |
|---|---|
| `design-system/tokens/` | Token sources (DTCG JSON) |
| `design-system/themes/` | Theme presets, holding only what each changes |
| `design-system/build.mjs` | Token build |
| `app/styles/tokens.css` | Generated Tailwind theme and CSS variables |
| `components/ui/` | Components |
| `components/viewer/` | Viewer UI |
| `docs/components/` | Docs page for each component |
| `docs/sample/` | Acme sample data shared by the docs |
| `lib/registry.ts` | Everything the viewer lists |
| `app/(viewer)/` | Viewer routes |
| `scripts/` | Contrast and uniqueness gates, design-system lint, screenshots |
