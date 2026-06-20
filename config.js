import StyleDictionary from "style-dictionary";

import tailwindTheme from "./formats/tailwind-theme.js";
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
 */
StyleDictionary.registerTransform({
  name: "name/yomp-kotlin",
  type: "name",
  transform: (token) =>
    token.path
      .map((part, i) =>
        i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join(""),
});

StyleDictionary.registerFormat(tailwindTheme);
StyleDictionary.registerFormat(composeKotlin);

export default {
  source: ["tokens/**/*.tokens.json"],
  platforms: {
    web: {
      // Name transform only — values pass through verbatim (no value/colour group).
      transforms: ["name/yomp-css"],
      buildPath: "build/web/",
      files: [{ destination: "theme.css", format: "yomp/tailwind-theme" }],
    },
    android: {
      transforms: ["name/yomp-kotlin"],
      buildPath: "build/android/",
      files: [{ destination: "Tokens.kt", format: "yomp/compose-kotlin" }],
    },
  },
};
