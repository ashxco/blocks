# Blocks

One component library, five real products.

Blocks is a design system and component library built on Next.js 16, React 19, Tailwind CSS v4 and Base UI. Its 65 components follow the shadcn/ui API, so they install with the shadcn CLI, or from npm as `@ashxsf/blocks`, and drop into any app that uses it. Everything visual comes from design tokens, and five themes, each with its own accent, neutrals, shapes and fonts, change the whole look of the same components in light and dark.

## Use it in your app

```bash
npx shadcn@latest init -d
```

```bash
npx shadcn@latest add https://<your-blocks-origin>/r/blocks.json --overwrite
```

```bash
npx shadcn@latest add https://<your-blocks-origin>/r/button.json --overwrite
```

`blocks.json` installs the CSS, utilities, portal container, hooks and primitives every component relies on. After it, make `app/globals.css` exactly `@import "tailwindcss";` followed by `@import "./styles/blocks.css";`. `init` writes shadcn's own `lib/utils.ts` and `components/ui/button.tsx`, which `--overwrite` replaces; every other component installs with no flag, one at a time from `/r/<slug>.json`. The registry index is at `/r/registry.json`. The site's **Get started** page (`/foundations/get-started`) has the full steps, including the font variables each theme reads.

### Or from npm

```bash
npm install @ashxsf/blocks
```

```css
@import "tailwindcss";
@import "@ashxsf/blocks/css";
@source "../node_modules/@ashxsf/blocks/dist";
```

```tsx
import { Button } from "@ashxsf/blocks"
```

The same components, CSS and tokens as a dependency instead of owned source. The three lines are `app/globals.css`; `@source` is relative to that file and lets Tailwind scan the package's class names. One file at a time: `@ashxsf/blocks/ui/button`. Fonts and themes work as with the registry.

## Themes

Blocks, Ocean, Forest, Ember and Mono. Pick one from the **Theme** menu at the foot of the sidebar; light and dark is the **Appearance** toggle beside it, or press D. The choice is saved in the browser. To preview without saving, add `?theme=ember&mode=dark` to any URL. In code, `data-theme="<id>"` scopes a theme to any subtree.

## For agents

`/llms.txt` on the deployed site lists the install commands, every component and foundation page with its registry item, and the full design contract. [DESIGN.md](DESIGN.md) is that contract: the rules, every token tier, the themes and how to add one.

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

| Script                        | What it does                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`                 | Builds the tokens, then starts the dev server                                         |
| `npm run tokens`              | Compiles `design-system/` into `app/styles/tokens.css` and `design-system/generated/` |
| `npm run registry`            | Builds the shadcn-compatible registry served at `/r`                                  |
| `npm run package`             | Builds the npm package into `dist-pkg/`                                               |
| `npm run check`               | Tokens, contrast gate, theme uniqueness gate, TypeScript and the design-system lint   |
| `npm run lint`                | ESLint                                                                                |
| `npm run verify`              | `check`, `lint` and a production build: run it before every deploy                    |
| `npm run build` / `npm start` | Production build and server                                                           |

## Deploy

The site is built for Vercel: import the repository and deploy. Absolute URLs (metadata, `sitemap.xml`, `robots.txt`, `llms.txt` and the registry) use `NEXT_PUBLIC_SITE_URL` when it is set, otherwise Vercel's production URL, otherwise localhost. Set `NEXT_PUBLIC_SITE_URL` to the public origin (for example `https://blocks.example.com`) when the site has a custom domain. On any other host, run:

```bash
npm run verify
```

```bash
npm start
```

Every page is static, so the build output works on any Next.js host.

## Change the look

Edit the token files in `design-system/tokens/` (or a theme in `design-system/themes/`), then run `npm run tokens`. Every component and viewer page follows, because none of them use raw values. [DESIGN.md](DESIGN.md) is the contract: the rules, every token tier, the themes and how to add one.

## Structure

| Path                      | What                                                           |
| ------------------------- | -------------------------------------------------------------- |
| `design-system/tokens/`   | Token sources (DTCG JSON)                                      |
| `design-system/themes/`   | Theme presets, holding only what each changes                  |
| `design-system/build.mjs` | Token build                                                    |
| `app/styles/tokens.css`   | Generated Tailwind theme and CSS variables                     |
| `components/ui/`          | Components                                                     |
| `components/viewer/`      | Viewer UI                                                      |
| `docs/components/`        | Docs page for each component                                   |
| `docs/sample/`            | Acme sample data shared by the docs                            |
| `lib/registry.ts`         | Everything the viewer lists                                    |
| `app/(viewer)/`           | Viewer routes                                                  |
| `app/llms.txt/`           | The `/llms.txt` route                                          |
| `scripts/`                | Contrast and uniqueness gates, design-system lint, screenshots |

## License

MIT. See [LICENSE](LICENSE).
