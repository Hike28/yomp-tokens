# yomp-tokens — Claude Code instructions

## Purpose

This repo is the single DTCG source of the Yomp Heritage palette. Tokens are
authored once as JSON and built by Style Dictionary (`config.js`) into
per-platform outputs: a Tailwind v4 `@theme` stylesheet for web and a Compose
Kotlin object for Android. Theme data only — no application code lives here.

## Three-tier rule

- **Primitives** — raw palette values (`tokens/primitives.tokens.json`).
- **Semantic** — role aliases that reference primitives
  (`tokens/semantic.tokens.json`).
- **Component** — deferred, not yet authored.

Components consume **semantic** tokens, never raw primitives.

## Build outputs are committed

`build/web/theme.css` and `build/android/Tokens.kt` are checked in. App repos
read them via a git submodule and never run Style Dictionary (the Android app
never runs npm). After changing any token or format, run `npm run build` and
commit the regenerated `build/` files alongside the source change.

## The no-op constraint (web names)

The `name/yomp-css` transform must regenerate yomp-next's **exact existing**
`globals.css` custom-property names, so the upcoming swap in yomp-next is a
provable no-op:

| token path             | emitted name             |
| ---------------------- | ------------------------ |
| `brand/forest`         | `--brand-forest`         |
| `space/4`              | `--space-4`              |
| `overlay/parchment/94` | `--overlay-parchment-94` |

Values pass through **verbatim** — no value/colour transform runs, so authored
hex / rgba / px strings reach the output unchanged.

## Marker anchors (carry into the authoring slice)

The authoring slice must preserve these test-coupled names and values exactly:

- `--verified-accent` → `#b8893a`
- `--community-sage` → `#5a6b3f`
- `--brand-forest-tint` → `#3b4a2f`
- `--brand-parchment` → `#f5efe0`

And `--brand-gold` (`#c8a078`) must stay **absent** from the markers.

## Conventions

- British English in any descriptions and comments.
- No application code; this repo holds theme data and its build pipeline only.
