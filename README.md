# Blocks

A design system and template kit: tokens, components, molecules and page templates, with a viewer that documents all of it.

- **Tokens:** W3C DTCG token files compiled by Style Dictionary into Tailwind CSS v4 theme variables, in light and dark.
- **Themes:** five presets (Blocks, Ocean, Forest, Ember, Mono) that change the accent, neutrals, radii and fonts, each in light and dark.
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

## Switch themes

Pick a theme from the **Theme** menu in the viewer header; light and dark is the **Appearance** toggle next to it (or press D). The choice is saved and shared by the viewer and the templates. To preview without saving, add `?theme=ocean` (or `forest`, `ember`, `mono`, `blocks`) to any URL, and `&mode=dark` or `&mode=light` for the mode, for example http://localhost:3000/live?theme=ember&mode=dark.

In code, `data-theme="<id>"` scopes a theme to any subtree. Theme sources live in `design-system/themes/<id>.tokens.json` and hold only what they change; [DESIGN.md](DESIGN.md#themes) explains how to add one.

## Check

```bash
npm run check
```

## Structure

| Path | What |
|---|---|
| `design-system/tokens/` | Token sources (DTCG JSON) |
| `design-system/themes/` | Theme presets: only what each changes |
| `design-system/build.mjs` | Token build (Style Dictionary) |
| `app/styles/tokens.css` | Generated Tailwind theme and CSS variables |
| `components/ui/` | Components |
| `components/blocks/` | Molecules |
| `components/viewer/` | Viewer UI |
| `docs/` | Docs pages for components and molecules |
| `lib/registry.ts` | Everything the viewer lists |
| `app/(viewer)/` | Viewer routes |
| `app/(live)/live/` | Live templates |
