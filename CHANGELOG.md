# Changelog

All notable changes to Blocks are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/).

Stability: tokens and themes are stable; component APIs are beta until 1.0 and may change in minor versions.

## [Unreleased]

## [0.1.0] - 2026-10-10

### Added

- Design tokens in W3C DTCG format and the Style Dictionary build that compiles them into Tailwind CSS v4 variables, in light and dark, with breakpoint values.
- Five themes (Blocks, Ocean, Forest, Ember and Mono), each gated for WCAG AA contrast and for uniqueness against the others.
- 65 components built on Base UI with the shadcn/ui API, including the layout primitives and the system grid.
- The viewer: foundations, component docs and the showcase.
- A shadcn-compatible registry served at `/r`, with `blocks.json` as the base item and one item per component.
- npm package `@ashxsf/blocks` with the same components, CSS and tokens, as an alternative to the registry.
- The Get started page.
- `llms.txt`, with the install commands, every page and the full design contract.
