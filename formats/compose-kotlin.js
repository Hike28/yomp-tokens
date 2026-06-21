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
// Standalone rgba(r,g,b,a) only — anchored so composites that merely CONTAIN an
// rgba() (gradients, shadows) never match and stay String. r/g/b are 0–255 ints,
// a is a 0.0–1.0 float; whitespace-tolerant.
const RGBA =
  /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*\.?\d+)\s*\)$/;
const byteHex = (n) =>
  Math.min(255, Math.max(0, n)).toString(16).toUpperCase().padStart(2, "0");

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
      } else if (RGBA.test(value)) {
        // Compose Color is 0xAARRGGBB — alpha is the LEADING byte.
        const [, r, g, b, a] = value.match(RGBA);
        const alpha = Math.round(parseFloat(a) * 255);
        emitted = `Color(0x${byteHex(alpha)}${byteHex(+r)}${byteHex(
          +g
        )}${byteHex(+b)})`;
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
