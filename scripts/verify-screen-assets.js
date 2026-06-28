#!/usr/bin/env node
/**
 * Verifies that CSS url(...) asset references resolve to files on disk.
 *
 * Screen CSS lives under prototype/styles/screens/ and MUST use ../../assets/
 * (not ../assets/, which resolves to a non-existent styles/assets/ path).
 *
 * Usage:
 *   node scripts/verify-screen-assets.js              # all screen CSS + FIGMA_ICONS
 *   node scripts/verify-screen-assets.js send-addressto # one screen stylesheet basename
 *
 * Exit code 0 = pass, 1 = failures found.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SCREENS_CSS_DIR = path.join(ROOT, "prototype/styles/screens");
const ASSETS_JS = path.join(ROOT, "prototype/utils/assets.js");
const ICONS_DIR = path.join(ROOT, "icons");

const URL_PATTERN = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
const WRONG_SCREEN_PREFIX = 'url("../assets/';

function collectFigmaIcons() {
  const source = fs.readFileSync(ASSETS_JS, "utf8");
  const files = [];
  const filePattern = /:\s*"([^"]+\.svg)"/g;
  let match;

  while ((match = filePattern.exec(source)) !== null) {
    files.push(match[1]);
  }

  return [...new Set(files)];
}

function resolveCssUrl(cssFile, urlValue) {
  const cleaned = urlValue.split("?")[0].split("#")[0];
  if (/^(?:https?:|data:)/.test(cleaned)) {
    return null;
  }

  return path.resolve(path.dirname(cssFile), cleaned);
}

function verifyCssFile(cssFile) {
  const content = fs.readFileSync(cssFile, "utf8");
  const errors = [];
  const relative = path.relative(ROOT, cssFile);

  if (relative.startsWith(`prototype${path.sep}styles${path.sep}screens${path.sep}`)) {
    if (content.includes(WRONG_SCREEN_PREFIX)) {
      errors.push(
        `${relative}: uses ../assets/ — screen CSS must use ../../assets/ (see docs/visual-qa.md)`,
      );
    }
  }

  let match;
  while ((match = URL_PATTERN.exec(content)) !== null) {
    const urlValue = match[1];
    const resolved = resolveCssUrl(cssFile, urlValue);

    if (!resolved) {
      continue;
    }

    if (!fs.existsSync(resolved)) {
      errors.push(`${relative}: missing asset for url("${urlValue}") → ${resolved}`);
    }
  }

  return errors;
}

function verifyFigmaIcons() {
  const files = collectFigmaIcons();
  const errors = [];

  for (const file of files) {
    const iconPath = path.join(ICONS_DIR, file);
    if (!fs.existsSync(iconPath)) {
      errors.push(`FIGMA_ICONS → icons/${file} (file not found)`);
    }
  }

  return errors;
}

function targetCssFiles(arg) {
  if (!arg || arg === "all") {
    return fs
      .readdirSync(SCREENS_CSS_DIR)
      .filter((file) => file.endsWith(".css"))
      .map((file) => path.join(SCREENS_CSS_DIR, file));
  }

  const basename = arg.endsWith(".css") ? arg : `${arg}.css`;
  const cssFile = path.join(SCREENS_CSS_DIR, basename);

  if (!fs.existsSync(cssFile)) {
    console.error(`Screen stylesheet not found: ${cssFile}`);
    process.exit(1);
  }

  return [cssFile];
}

function main() {
  const arg = process.argv[2];
  const cssFiles = targetCssFiles(arg);
  const errors = [];

  for (const cssFile of cssFiles) {
    errors.push(...verifyCssFile(cssFile));
  }

  if (!arg || arg === "all") {
    errors.push(...verifyFigmaIcons());
  }

  if (errors.length === 0) {
    const scope = arg && arg !== "all" ? arg : "all screen CSS + FIGMA_ICONS";
    console.log(`OK — ${scope}`);
    process.exit(0);
  }

  console.error("Asset verification failed:\n");
  for (const error of errors) {
    console.error(`  • ${error}`);
  }
  process.exit(1);
}

main();
