/**
 * Custom Style Dictionary format: Android Compose Kotlin.
 *
 * Emits a `dog.yomp.tokens.Tokens` object with one `val` per token, camelCased
 * by the `name/yomp-kotlin` transform. The Kotlin TYPE is chosen by VALUE SHAPE
 * so a Compose theme can consume type-safe values without runtime parsing:
 *
 *   - a plain 6-digit hex colour (`#2c3320`) → `Color(0xFF2c3320)`
 *   - a clean number + px (`16px`)          → `16.dp`
 *   - everything else stays a String — rgba()/gradients/calc()/font shorthands/
 *     comma-RGB helpers/motion/easing/z-index/em letter-spacing/etc.
 *
 * Driven purely by the value regexes below (a composite that merely CONTAINS
 * `15px`, e.g. a font shorthand, stays a String). Both `Color` and `Dp` are
 * commonMain-safe under Compose Multiplatform.
 */
const HEX6 = /^#[0-9a-fA-F]{6}$/;
const PX = /^-?[0-9]+(\.[0-9]+)?px$/;

export default {
  name: "yomp/compose-kotlin",
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map((token) => {
      const value = token.$value ?? token.value;
      let emitted;
      if (HEX6.test(value)) {
        emitted = `Color(0xFF${value.slice(1)})`;
      } else if (PX.test(value)) {
        emitted = `${value.slice(0, -2)}.dp`;
      } else {
        emitted = `"${value}"`;
      }
      return `  val ${token.name} = ${emitted}`;
    });
    return `package dog.yomp.tokens\n\nimport androidx.compose.ui.graphics.Color\nimport androidx.compose.ui.unit.dp\n\nobject Tokens {\n${lines.join(
      "\n"
    )}\n}\n`;
  },
};
