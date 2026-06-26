# Yomp — Heritage Design System (DESIGN.md)

**What this is.** The single source of *visual* truth for Yomp's native app, used as the Claude Design organisation design system. Every screen Claude Design produces must look like it came from this world. The locked **Map screen + "closest place" ticket** is the standard — match its craft.

**Source of truth & how to read this file.** Exact colour, type and spacing **values** are authored in `github.com/Hike28/yomp-tokens` (DTCG → web CSS + Android Compose) — **that repo is the master.** This doc deliberately does **not** duplicate a full machine-readable token block: that would create a second source that drifts. It carries the *language, rules and rationale* and **links** yomp-tokens for precise values. If a value here ever disagrees with yomp-tokens, yomp-tokens wins and this file is refreshed in the same change. Never hardcode a hex; a missing colour is added to yomp-tokens first.

**Target & voice.** Native Android (Jetpack Compose), mobile portrait (~390×844). British English in all copy.

**Reference assets.** When designing, attach screenshots of the locked Map screen + ticket — finished assets convey the feel better than this doc alone.

---

## 1. The world (read this first)

Yomp is a UK dog-friendly places finder. The language is **illustrated, hand-drawn, e-ink, British heritage countryside** — textured parchment paper, engraved slightly-irregular ink linework, a warm and limited palette, characterful but precise. Cartoony yet unmistakably professional. Think a beautifully printed field guide or a vintage admission ticket, rendered as a modern app.

**This must NOT look AI-generated — for each default, do the opposite:**
- Generic rounded-card layout as the primary pattern → instead, printed/illustrated surfaces with paper grain and an inked edge.
- Inter / DM Sans / Nunito / system sans for display → instead, Libre Baskerville (serif) + Plus Jakarta Sans.
- Soft purple/teal gradients, glassmorphism, neon → instead, flat warm Heritage tones with one soft warm shadow.
- Pure black (#000) / pure white (#fff) → instead, forest ink and parchment.
- Clean geometric Material icons → instead, engraved hand-drawn glyphs in the pin hand.

---

## 2. Voice & copy

British English, always. Warm, friendly, plain-spoken, a little playful — written for dog owners, never corporate. From the standard: *"Find a dog-friendly spot…"*, *"Dogs welcome"*, *"Swipe up for 8 nearby places"*, *"YOMP ADMITS · DOG & OWNER"*. Labels/eyebrows are short, uppercase, wide-tracked. The dog is **Frank**; the wordmark is an italic serif **Y.**

---

## 3. Colour (snapshot — yomp-tokens is canonical for exact names & values)

**Surfaces**
- `forest` `#2C3320` — dark green ink; nav bar, dark surfaces, primary text on light.
- `parch` `#FBF6E9` · `parch-2` `#F5EFE0` · `parch-dim` `#F0E9D2` — parchment tiers; light surfaces.
- `cream` `#E8DEC8` · `sand` `#D4C9A8` — warm neutrals.

**Warm accents**
- `ochre` `#C08A4A` — the **primary accent** (active states, highlights).
- `gold` `#A07A3C` · `brass` `#B8860B` · `clay` `#8B5A3C` · `tan` `#7A6545` · `rust` `#B85A3E`.

**Greens**
- `sage` `#7C9B5E` — leaf/park green (and the Dogs-welcome family) · `community-sage` `#5A6B3F` · `tag-tx` `#2E4A28`.
- `teal` `#2D6D80` — Beaches accent (and the cool note in an otherwise warm palette).

**Ink & utility**
- `pin-ink` `#3A3322` — engraved line/ink for every glyph, pin and stamp.
- `nav-dormant` `rgba(212,201,168,0.55)` — inactive nav tab tone.
- `meta` `rgba(58,51,34,0.6)` — muted metadata ink.

**Category colours** are defined per category in yomp-tokens — `category.{pubs,cafes,parks,beaches}` (chip fill/border) and `category-dot.*` (the chip dot / pin accent). All four exist; nothing is pending. Example: Beaches dot = `accent.teal` `#2d6d80`. Use these tokens directly — never approximate a category colour.

> Token **names** above are indicative — use the exact names as defined in yomp-tokens.

---

## 4. Typography

- **Serif / display — Libre Baskerville** (Google Font). *Italic* for place names and headings.
- **Sans — Plus Jakarta Sans** (Google Font). Body, UI, metadata.
- Both are Google Fonts — no substitution needed; do not swap for system sans.
- **Scale (observed from the standard; YompTypography / yomp-tokens is canonical):** display/heading ~26px Libre Baskerville italic 700 · place name ~21px italic · section/name ~16px · body ~13px · labels & eyebrows ~12px **uppercase**, tracking 0.08–0.15em · micro ~9.5px. Use the canonical type tokens for exact steps.

---

## 5. Shape, shadow, texture, motion

- **Radii:** card **12px** (`--r-card`) for interactive surfaces · pill **999px** (`--r-pill`) for tags/badges/chips only · stamps 2–5px.
- **Shadow:** one soft, warm, two-layer `--sh-heritage` = `0 12px 30px rgba(44,51,32,0.20), 0 3px 8px rgba(60,40,20,0.12)`. No hard or cool drop shadows.
- **Texture:** parchment **paper grain** + a **worn** ink quality. ⚠️ The web source uses CSS `feTurbulence` (web-only) — native needs a **packaged tiling texture asset**, not procedural noise.
- **Spacing:** use the yomp-tokens spacing scale; never bare integers. (Exact steps per yomp-tokens.)
- **Motion:** calm and subtle — gentle fades/slides. Nothing flashy, bouncy or attention-seeking.

---

## 6. Accessibility

- Forest ink on parchment is high-contrast; use forest / `meta` for body and metadata. Treat `ochre` as an accent — verify ochre-on-parchment meets WCAG AA before using it for text.
- Tap targets ≥ **48dp**; keep nav labels legible at small size.
- Never rely on colour alone — category dots also carry a glyph/label; the active nav tab changes colour **and** weight.

---

## 7. Component patterns (callable — match these)

- **Header** — circular dark-forest **Y.** badge + a parchment **search pill** with an italic-serif placeholder ("Find a dog-friendly spot…").
- **Category Chip** — `--r-pill`, parchment fill, a coloured category dot; **selected** = filled `forest` with light text.
- **Map Pin** — white teardrop body + category glyph (pint / coffee cup / tree / waves) in the category colour, `pin-ink` linework. Engraved, hand-drawn. Selected pin reads distinctly (scale/ring), unique per place.
- **Closest Ticket** (the hero) — a vintage **ADMIT ONE** ticket on parchment + paper grain, `--sh-heritage`: a perforated left **stub** (ADMIT ONE, serial "No. 0314", a **RATINGS** block with **Y.** Yomp + **G.** Google), an uppercase **eyebrow**, the **serif-italic place name**, a metadata line, a green stamped **DOGS WELCOME** clause, a diagonal **VISITED** stamp, the **attribute-stamp system**, and a **swipe-up** affordance. The resting bar sits on a lower layer; the tapped-place detail card rises above it.
- **Attribute stamps** — a fixed-slot "passport corner": one distinct inked passport-style stamp per attribute (varied shapes, slight rotation, light wear, `pin-ink` + a Heritage accent), shown **only when community-confirmed**. Six canonical attributes: enclosed garden (round), water bowl (box), inside allowed (shield), treats (oval), off-lead (diamond), dog menu (rounded square).
- **Bottom Nav** — `forest` bar; **hairline outline** icons (Home · Saved · Map · Soon · Me); inactive `nav-dormant`, active `ochre`. Wayfinding marks, NOT miniature pins.
- **Map controls** — circular parchment zoom (+/−) and locate-me buttons with `--sh-heritage`.

---

## 8. Rules (don't drift)

1. **Tokens only.** No hardcoded hex/rgba. Missing colour → STOP, add to yomp-tokens first. yomp-tokens is canonical; this file links it and is a snapshot.
2. **Don't fabricate missing values.** If a token doesn't exist, flag and stop — never invent one to "finish".
3. **British English** in all user-facing copy.
4. `--r-card` 12px interactive; `--r-pill` 999px tags/badges/chips only.
5. **Match the job per surface** — nav icons are wayfinding, not shrunken pins; don't transplant one surface's treatment onto another.
6. **Lock components.** Once locked, don't redesign a component while working on another. Lock components separately and combine in the build.
7. **Textures and illustrations are assets** on native, not procedural effects.
8. When iterating: show genuinely different directions (not tints), converge with single targeted tweaks, then lock.
