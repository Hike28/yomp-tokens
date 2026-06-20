/**
 * Custom Style Dictionary format: Tailwind v4 `@theme` block.
 *
 * Wraps every token as a CSS custom property inside a single `@theme { … }`
 * block. Values are emitted VERBATIM — no colour/dimension transform runs, so
 * the authored hex / rgba / px strings pass through unchanged. No `@import
 * "tailwindcss"` line is emitted: that import lives in the consuming app
 * (yomp-next), not in the generated theme data.
 *
 * Token names arrive already shaped by the `name/yomp-css` transform
 * (`--brand-forest`, `--space-4`, `--overlay-parchment-94`).
 */
export default {
  name: "yomp/tailwind-theme",
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map((token) => {
      // DTCG tokens resolve onto `$value`; fall back to `value` defensively.
      const value = token.$value ?? token.value;
      return `  ${token.name}: ${value};`;
    });
    return `@theme {\n${lines.join("\n")}\n}\n`;
  },
};
