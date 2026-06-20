import StyleDictionary from "style-dictionary";

import webCssVars from "./formats/web-css-vars.js";
import composeKotlin from "./formats/compose-kotlin.js";

/**
 * name/yomp-css — reproduces yomp-next's EXACT globals.css custom-property
 * names so the eventual swap is a provable no-op.
 *   brand/forest         → --brand-forest
 *   space/4              → --space-4
 *   overlay/parchment/94 → --overlay-parchment-94
 */
StyleDictionary.registerTransform({
  name: "name/yomp-css",
  type: "name",
  transform: (token) => "--" + token.path.join("-"),
});

/**
 * name/yomp-kotlin — camelCase of the token path.
 *   brand/forest → brandForest
 *
 * Some leaf keys carry an embedded dash (e.g. `forest-tint`) where collapsing a
 * sub-segment was the only way to keep a token both a leaf AND a sibling of
 * longer names without making it a group — see tokens/primitives.tokens.json.
 * Splitting on `-` after the path join folds those into the camelCase too, so
 * every emitted Kotlin identifier stays valid (`brandForestTint`). This only
 * affects the Android name; the web `--brand-forest-tint` name is unchanged.
 */
StyleDictionary.registerTransform({
  name: "name/yomp-kotlin",
  type: "name",
  transform: (token) =>
    token.path
      .join("-")
      .split("-")
      .map((part, i) =>
        i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join(""),
});

StyleDictionary.registerFormat(webCssVars);
StyleDictionary.registerFormat(composeKotlin);

export default {
  source: ["tokens/**/*.tokens.json"],
  platforms: {
    web: {
      // Name transform only — values pass through verbatim (no value/colour group).
      transforms: ["name/yomp-css"],
      buildPath: "build/web/",
      files: [
        {
          destination: "tokens.css",
          format: "web/css-vars",
          // Emit aliases as `var(--target)` rather than the resolved value, so
          // the output matches globals.css's `var(--…)` aliases (no-op proof).
          options: { outputReferences: true },
        },
      ],
    },
    android: {
      transforms: ["name/yomp-kotlin"],
      buildPath: "build/android/",
      files: [{ destination: "Tokens.kt", format: "yomp/compose-kotlin" }],
    },
  },
};
