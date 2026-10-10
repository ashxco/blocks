# Blocks

A design system and template kit: tokens, components, molecules and page templates, with a viewer that documents all of it.

- **Tokens:** W3C DTCG token files compiled by Style Dictionary into Tailwind CSS v4 theme variables, in light and dark.
- **Components:** shadcn/ui on Base UI, restyled to Blocks.
- **Molecules:** marketing sections and app patterns built from the components.
- **Templates:** marketing, auth and app pages for Acme Inc., a sample work-management SaaS company.
- **Viewer:** the design-system site at `/`.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000 for the viewer and http://localhost:3000/live for the templates.

## Change the look

Edit the token files in `design-system/tokens/`, then rebuild:

```bash
npm run tokens
```

Every component, molecule, template and viewer page updates, because none of them use raw values. See [DESIGN.md](DESIGN.md) for the rules.

## Check

```bash
npm run check
```

## Structure

| Path | What |
|---|---|
| `design-system/tokens/` | Token sources (DTCG JSON) |
| `design-system/build.mjs` | Token build (Style Dictionary) |
| `app/styles/tokens.css` | Generated Tailwind theme and CSS variables |
| `components/ui/` | Components |
| `components/blocks/` | Molecules |
| `components/viewer/` | Viewer UI |
| `docs/` | Docs pages for components and molecules |
| `lib/registry.ts` | Everything the viewer lists |
| `app/(viewer)/` | Viewer routes |
| `app/(live)/live/` | Live templates |
