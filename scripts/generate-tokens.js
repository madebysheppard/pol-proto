#!/usr/bin/env node
/**
 * Converts design tokens into CSS custom properties at prototype/styles/tokens.css.
 *
 * Source: tokens/tokens.json (combined primitives + semantic export)
 * Fallback: tokens/primitives.json + tokens/semantic.json
 *
 * Run from project root: node scripts/generate-tokens.js
 * No npm dependencies required.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TOKEN_DIR = path.join(ROOT, "tokens");
const OUTPUT = path.join(ROOT, "prototype", "styles", "tokens.css");

const UNIT_TYPES = new Set([
  "fontSizes",
  "spacing",
  "borderRadius",
  "borderWidth",
  "sizing",
  "dimension",
]);

function flattenTokens(obj, prefix = "") {
  const result = {};
  for (const [key, node] of Object.entries(obj)) {
    const pathKey = prefix ? `${prefix}.${key}` : key;
    if (node && typeof node === "object" && "value" in node && "type" in node) {
      result[pathKey] = { value: node.value, type: node.type };
    } else if (node && typeof node === "object") {
      Object.assign(result, flattenTokens(node, pathKey));
    }
  }
  return result;
}

function loadTokenSets() {
  const combinedPath = path.join(TOKEN_DIR, "tokens.json");
  if (fs.existsSync(combinedPath)) {
    const combined = JSON.parse(fs.readFileSync(combinedPath, "utf8"));
    return {
      primitives: combined.primitives,
      semantic: combined.semantic,
    };
  }

  return {
    primitives: JSON.parse(
      fs.readFileSync(path.join(TOKEN_DIR, "primitives.json"), "utf8")
    ),
    semantic: JSON.parse(
      fs.readFileSync(path.join(TOKEN_DIR, "semantic.json"), "utf8")
    ),
  };
}

function composeBorderTokens(tokens) {
  const groups = {};

  for (const key of Object.keys(tokens)) {
    const match = key.match(/^border\.([^.]+)\.(width|color|style)$/);
    if (!match) continue;
    const [, name, prop] = match;
    if (!groups[name]) groups[name] = {};
    groups[name][prop] = tokens[key];
  }

  for (const [name, parts] of Object.entries(groups)) {
    if (parts.width && parts.color && parts.style) {
      tokens[`border.${name}`] = {
        type: "border",
        value: {
          width: parts.width.value,
          color: parts.color.value,
          style: parts.style.value,
        },
      };
    }
  }
}

function composeShadowTokens(tokens) {
  const groups = {};

  for (const key of Object.keys(tokens)) {
    const match = key.match(/^shadow\.([^.]+)\.(\d+)\.(x|y|blur|spread|color)$/);
    if (!match) continue;
    const [, category, num, prop] = match;
    const groupKey = `shadow.${category}.${num}`;
    if (!groups[groupKey]) groups[groupKey] = {};
    groups[groupKey][prop] = tokens[key].value;
  }

  for (const [groupKey, parts] of Object.entries(groups)) {
    if (
      parts.x !== undefined &&
      parts.y !== undefined &&
      parts.blur !== undefined &&
      parts.color !== undefined
    ) {
      tokens[groupKey] = {
        type: "boxShadow",
        value: {
          x: parts.x,
          y: parts.y,
          blur: parts.blur,
          spread: parts.spread || "0",
          color: parts.color,
        },
      };
    }
  }
}

function resolveValue(value, type, tokens, depth = 0) {
  if (depth > 20) throw new Error("Token reference depth exceeded");

  if (typeof value === "string" && /^\{[^}]+\}$/.test(value)) {
    const key = value.replace(/^\{|\}$/g, "");
    if (!tokens[key]) {
      throw new Error(`Unresolved token reference: {${key}}`);
    }
    return resolveValue(tokens[key].value, tokens[key].type, tokens, depth + 1);
  }

  if (type === "boxShadow" && value && typeof value === "object") {
    const { x, y, blur, spread, color } = value;
    return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
  }

  if (type === "border" && value && typeof value === "object") {
    const widthRaw = resolveValue(value.width, "borderWidth", tokens, depth + 1);
    const color = resolveValue(value.color, "color", tokens, depth + 1);
    const style = value.style || "solid";
    const width =
      typeof widthRaw === "string" && widthRaw.endsWith("px")
        ? widthRaw
        : `${widthRaw}px`;
    return `${width} ${style} ${color}`;
  }

  if (UNIT_TYPES.has(type) && typeof value === "string" && !value.endsWith("%")) {
    return `${value}px`;
  }

  return value;
}

function toCssVarName(tokenPath) {
  return `--${tokenPath
    .replace(/\./g, "-")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()}`;
}

function formatCssValue(value, type) {
  if (type === "fontFamilies" && typeof value === "string" && /\s/.test(value)) {
    return `"${value}"`;
  }
  return value;
}

function generateCss(tokens) {
  const lines = [
    "/*",
    " * Design tokens — auto-generated from tokens/tokens.json",
    " * Do not edit by hand. Run: node scripts/generate-tokens.js",
    " */",
    "",
    ":root {",
  ];

  const sortedPaths = Object.keys(tokens).sort();
  for (const tokenPath of sortedPaths) {
    const { value, type } = tokens[tokenPath];
    try {
      const resolved = resolveValue(value, type, tokens);
      if (typeof resolved === "object") continue;
      lines.push(`  ${toCssVarName(tokenPath)}: ${formatCssValue(resolved, type)};`);
    } catch (err) {
      console.warn(`Skipping ${tokenPath}: ${err.message}`);
    }
  }

  lines.push("}", "");
  return lines.join("\n");
}

function main() {
  const { primitives, semantic } = loadTokenSets();

  const tokens = {
    ...flattenTokens(primitives),
    ...flattenTokens(semantic),
  };

  composeBorderTokens(tokens);
  composeShadowTokens(tokens);

  const css = generateCss(tokens);
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, css, "utf8");
  console.log(`Wrote ${Object.keys(tokens).length} tokens to ${OUTPUT}`);
}

main();
