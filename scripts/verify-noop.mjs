#!/usr/bin/env node
/**
 * verify-noop.mjs — proves the generated web output reproduces yomp-next's
 * globals.css :root custom properties EXACTLY at value level, so the eventual
 * swap (Slice 3) is a provable no-op.
 *
 * Compares:
 *   A) build/web/tokens.css                         (this repo, generated)
 *   B) <yomp-next>/src/app/globals.css :root blocks (ground truth, read-only)
 *      — EXCLUDING the scoped `.heritage-v1` block and any @media blocks.
 *
 * Normalisation per token value: strip ALL whitespace, lowercase. This means
 * cosmetic spacing differences (e.g. `rgba(245, 239, 224, 0.94)` in globals.css
 * vs `rgba(245,239,224,0.94)` here) do not register as drift — only genuine
 * value differences do.
 *
 * Asserts: identical SET of names, and equal normalised value for every shared
 * name. Exits non-zero (1) on any difference. Reusable — safe to re-run.
 *
 * Usage:  node scripts/verify-noop.mjs [path-to-globals.css]
 * Default ground-truth path is the sibling yomp-next checkout.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const GENERATED = fileURLToPath(
  new URL("../build/web/tokens.css", import.meta.url)
);
const GLOBALS =
  process.argv[2] ?? "C:/Users/Tom/yomp-next/src/app/globals.css";

/** Strip /* … *​/ block comments (none appear inside any token value). */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Parse `--name: value;` declarations from a chunk of CSS into a Map. */
function parseDecls(chunk, into) {
  const re = /--([\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(chunk)) !== null) {
    into.set(m[1], m[2]);
  }
  return into;
}

/** Generated file: a single :root block — parse every declaration in it. */
function parseGenerated(path) {
  const css = stripComments(readFileSync(path, "utf8"));
  return parseDecls(css, new Map());
}

/**
 * Ground truth: only the `:root { … }` blocks. After comment stripping, :root
 * blocks contain no nested braces, so `:root\s*\{([^}]*)\}` captures each block
 * body precisely; `@media`/`.heritage-v1` selectors are naturally skipped
 * because they are not `:root`.
 */
function parseGlobalsRoot(path) {
  const css = stripComments(readFileSync(path, "utf8"));
  const out = new Map();
  const blockRe = /:root\s*\{([^}]*)\}/g;
  let block;
  while ((block = blockRe.exec(css)) !== null) {
    parseDecls(block[1], out);
  }
  return out;
}

const norm = (v) => v.replace(/\s+/g, "").toLowerCase();

const gen = parseGenerated(GENERATED);
const css = parseGlobalsRoot(GLOBALS);

const genNames = new Set(gen.keys());
const cssNames = new Set(css.keys());

const onlyInGenerated = [...genNames].filter((n) => !cssNames.has(n)).sort();
const onlyInCss = [...cssNames].filter((n) => !genNames.has(n)).sort();

const mismatches = [];
for (const name of [...genNames].filter((n) => cssNames.has(n)).sort()) {
  const g = norm(gen.get(name));
  const c = norm(css.get(name));
  if (g !== c) mismatches.push({ name, generated: gen.get(name), css: css.get(name) });
}

console.log(`Generated (build/web/tokens.css): ${genNames.size} names`);
console.log(`Ground truth (globals.css :root): ${cssNames.size} names`);
console.log(
  `Shared names compared: ${[...genNames].filter((n) => cssNames.has(n)).length}`
);

let ok = true;

if (onlyInCss.length) {
  ok = false;
  console.log(`\n✗ ${onlyInCss.length} name(s) only in globals.css (missing from generated):`);
  for (const n of onlyInCss) console.log(`    --${n}`);
}
if (onlyInGenerated.length) {
  ok = false;
  console.log(`\n✗ ${onlyInGenerated.length} name(s) only in generated (not in globals.css):`);
  for (const n of onlyInGenerated) console.log(`    --${n}`);
}
if (mismatches.length) {
  ok = false;
  console.log(`\n✗ ${mismatches.length} value mismatch(es):`);
  for (const { name, generated, css: c } of mismatches) {
    console.log(`    --${name}`);
    console.log(`        generated: ${generated}`);
    console.log(`        globals:   ${c}`);
  }
}

if (ok) {
  console.log(
    `\n✓ NO-OP VERIFIED — identical name sets, zero value mismatches (${genNames.size} tokens).`
  );
  process.exit(0);
} else {
  console.log(`\n✗ NO-OP FAILED — see differences above.`);
  process.exit(1);
}
