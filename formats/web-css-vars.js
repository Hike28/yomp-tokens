/**
 * Custom Style Dictionary format: plain CSS `:root { … }` block.
 *
 * Wraps every token as a CSS custom property inside a single `:root { … }`
 * block (NOT a Tailwind `@theme` block). Primitive values are emitted VERBATIM
 * — no colour/dimension transform runs on the web platform, so the authored
 * hex / rgba / px / calc / composite strings pass through unchanged.
 *
 * Aliases (semantic.tokens.json references like `{suite.ink.soft}`) are emitted
 * as `var(--suite-ink-soft)` — i.e. the CSS-variable indirection is PRESERVED
 * rather than flattened to the resolved value. This is what makes the output a
 * value-level no-op against globals.css, whose aliases are literally
 * `--ink-secondary: var(--suite-ink-soft);`. Driven by `outputReferences` on
 * the web file config (see config.js).
 *
 * Token names arrive already shaped by the `name/yomp-css` transform
 * (`--brand-forest`, `--space-4`, `--overlay-parchment-94`).
 */
import { usesReferences, getReferences } from "style-dictionary/utils";

export default {
  name: "web/css-vars",
  format: ({ dictionary, options }) => {
    const outputReferences = options?.outputReferences ?? false;
    const lines = dictionary.allTokens.map((token) => {
      // DTCG tokens resolve onto `$value`; fall back to `value` defensively.
      let value = token.$value ?? token.value;
      const original = token.original?.$value ?? token.original?.value;

      if (outputReferences && original != null && usesReferences(original)) {
        // Rebuild from the original string, swapping each `{a.b.c}` reference
        // for `var(--a-b-c)` using the referenced token's transformed name.
        value = original;
        for (const ref of getReferences(original, dictionary.tokens)) {
          value = value.replace(`{${ref.path.join(".")}}`, `var(${ref.name})`);
        }
      }

      return `  ${token.name}: ${value};`;
    });
    return `:root {\n${lines.join("\n")}\n}\n`;
  },
};
