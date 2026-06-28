#!/usr/bin/env node
/**
 * Normalizes SVG icon files exported from Figma so they keep aspect ratio
 * when displayed at fixed sizes in the prototype.
 *
 * Figma MCP exports often set preserveAspectRatio="none" and width/height="100%",
 * which stretches icons when used in <img width="24" height="24">.
 *
 * Run from project root after adding or updating icons:
 *   node scripts/normalize-svg-icons.js
 *   node scripts/normalize-svg-icons.js icons/van.svg
 *
 * No npm dependencies required.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ICONS_DIR = path.join(ROOT, "icons");

function parseViewBox(viewBox) {
  const parts = viewBox.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return null;
  }

  return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}

function normalizeSvgMarkup(source) {
  let svg = source;
  let changed = false;

  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? parseViewBox(viewBoxMatch[1]) : null;

  if (/preserveAspectRatio="none"/.test(svg)) {
    svg = svg.replace(/preserveAspectRatio="none"/g, 'preserveAspectRatio="xMidYMid meet"');
    changed = true;
  }

  if (!/preserveAspectRatio=/.test(svg) && viewBox) {
    svg = svg.replace(/<svg\b/, '<svg preserveAspectRatio="xMidYMid meet"');
    changed = true;
  }

  const widthIsPercent = /\swidth="100%"/.test(svg);
  const heightIsPercent = /\sheight="100%"/.test(svg);

  if ((widthIsPercent || heightIsPercent) && viewBox) {
    const size = Math.max(viewBox.width, viewBox.height);
    svg = svg.replace(/\swidth="100%"/, ` width="${size}"`);
    svg = svg.replace(/\sheight="100%"/, ` height="${size}"`);
    changed = true;
  }

  if (/\sstyle="[^"]*display:\s*block[^"]*"/.test(svg)) {
    svg = svg.replace(/\sstyle="[^"]*display:\s*block;?\s*"/, "");
    changed = true;
  }

  return { svg, changed };
}

function collectTargets(args) {
  if (args.length > 0) {
    return args.map((entry) => path.resolve(process.cwd(), entry));
  }

  return fs
    .readdirSync(ICONS_DIR)
    .filter((file) => file.endsWith(".svg"))
    .map((file) => path.join(ICONS_DIR, file));
}

function main() {
  const args = process.argv.slice(2);
  const targets = collectTargets(args);
  let updated = 0;

  for (const filePath of targets) {
    if (!fs.existsSync(filePath)) {
      console.warn(`skip: file not found — ${filePath}`);
      continue;
    }

    const source = fs.readFileSync(filePath, "utf8");
    const { svg, changed } = normalizeSvgMarkup(source);

    if (!changed) {
      continue;
    }

    fs.writeFileSync(filePath, svg);
    updated += 1;
    console.log(`normalized: ${path.relative(ROOT, filePath)}`);
  }

  console.log(updated === 0 ? "all icons already normalized" : `updated ${updated} icon(s)`);
}

main();
