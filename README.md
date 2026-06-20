# yomp-tokens

The single source of truth for the Yomp **Heritage palette**, authored once as
[DTCG](https://design-tokens.github.io/community-group/format/)-format JSON and
built by [Style Dictionary](https://styledictionary.com) into per-platform
outputs.

## Three tiers

1. **Primitives** (`tokens/primitives.tokens.json`) — raw palette values
   (`brand/forest`, `space/4`, `overlay/parchment/94`).
2. **Semantic** (`tokens/semantic.tokens.json`) — role aliases that reference
   primitives (`page/bg → {brand.forest}`). Components consume these.
3. **Component** — deferred; not authored yet.

> The current token set is a **placeholder** that exercises naming and
> value-verbatim output. Real Heritage values land in the authoring slice.

## Build

```
npm run build
```

This runs Style Dictionary (`config.js`) and writes:

- `build/web/theme.css` — a Tailwind v4 `@theme { … }` block of CSS custom
  properties (`--brand-forest`, `--space-4`, …).
- `build/android/Tokens.kt` — a `dog.yomp.tokens.Tokens` object (String stub;
  Compose typing is a later slice).

## Distribution

Built outputs in **`build/` are committed** and consumed by the app repos via a
git submodule. Consumers read the generated files directly — they never run
Style Dictionary. In particular, the Android app never runs npm.
