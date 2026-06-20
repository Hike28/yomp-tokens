/**
 * Custom Style Dictionary format: Android Compose Kotlin (STUB).
 *
 * Emits a `dog.yomp.tokens.Tokens` object with one `val` per token, camelCased
 * by the `name/yomp-kotlin` transform. Values are raw String literals for now.
 *
 * Proper Compose typing — wrapping colours as `Color(0xFF…)` and dimensions as
 * `Dp` — is deliberately deferred to the parked Compose slice. This stub only
 * proves the toolchain emits syntactically valid Kotlin from the shared source.
 */
export default {
  name: "yomp/compose-kotlin",
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map((token) => {
      const value = token.$value ?? token.value;
      return `  val ${token.name} = "${value}"`;
    });
    return `package dog.yomp.tokens\n\nobject Tokens {\n${lines.join(
      "\n"
    )}\n}\n`;
  },
};
