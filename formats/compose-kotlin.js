/**
 * Custom Style Dictionary format: Android Compose Kotlin.
 *
 * Emits a `dog.yomp.tokens.Tokens` object with one `val` per token, camelCased
 * by the `name/yomp-kotlin` transform. The Kotlin TYPE is chosen by VALUE SHAPE
 * so a Compose theme can consume type-safe values without runtime parsing:
 *
 *   - a DTCG composite `$type: "shadow"`     → `ShadowSpec(offsetX = …dp, …, color = Color(…))`
 *   - a plain 6-digit hex colour (`#2c3320`) → `Color(0xFF2c3320)`
 *   - a clean number + px (`16px`)          → `16.dp`
 *   - everything else stays a String — rgba()/gradients/calc()/font shorthands/
 *     comma-RGB helpers/motion/easing/z-index/em letter-spacing/etc.
 *
 * Scalar types are driven purely by the value regexes below (a composite that
 * merely CONTAINS `15px`, e.g. a font shorthand, stays a String). Shadows are
 * driven by `$type` because their `$value` is an OBJECT, not a string. Both
 * `Color` and `Dp` are commonMain-safe under Compose Multiplatform.
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

// rgba(r,g,b,a) → Compose `Color(0xAARRGGBB)` (alpha is the LEADING byte).
// Returns null if the string is not a standalone rgba().
const rgbaToColor = (str) => {
  const m = String(str).match(RGBA);
  if (!m) return null;
  const [, r, g, b, a] = m;
  const alpha = Math.round(parseFloat(a) * 255);
  return `Color(0x${byteHex(alpha)}${byteHex(+r)}${byteHex(+g)}${byteHex(+b)})`;
};

// "4px" → "4.dp" (caller guarantees a PX-shaped string).
const pxToDp = (str) => `${String(str).slice(0, -2)}.dp`;

export default {
  name: "yomp/compose-kotlin",
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map((token) => {
      const value = token.$value ?? token.value;
      let emitted;
      if (token.$type === "shadow") {
        // DTCG single-layer shadow composite → structured ShadowSpec.
        const s = value;
        emitted =
          `ShadowSpec(offsetX = ${pxToDp(s.offsetX)}, ` +
          `offsetY = ${pxToDp(s.offsetY)}, ` +
          `blur = ${pxToDp(s.blur)}, ` +
          `spread = ${pxToDp(s.spread)}, ` +
          `color = ${rgbaToColor(s.color)})`;
      } else if (HEX6.test(value)) {
        emitted = `Color(0xFF${value.slice(1)})`;
      } else if (PX.test(value)) {
        emitted = `${value.slice(0, -2)}.dp`;
      } else if (RGBA.test(value)) {
        emitted = rgbaToColor(value);
      } else {
        emitted = `"${value}"`;
      }
      return `  val ${token.name} = ${emitted}`;
    });
    return (
      `package dog.yomp.tokens\n\n` +
      `import androidx.compose.ui.graphics.Color\n` +
      `import androidx.compose.ui.unit.Dp\n` +
      `import androidx.compose.ui.unit.dp\n\n` +
      `data class ShadowSpec(\n` +
      `  val offsetX: Dp,\n` +
      `  val offsetY: Dp,\n` +
      `  val blur: Dp,\n` +
      `  val spread: Dp,\n` +
      `  val color: Color,\n` +
      `)\n\n` +
      `object Tokens {\n${lines.join("\n")}\n}\n`
    );
  },
};
