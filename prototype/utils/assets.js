/**
 * Asset path helpers — all assets live in project-root folders
 * and are exposed via prototype/assets/ symlinks (no duplication).
 */

const ASSET_ROOT = "./assets";

/** Figma icon component name → shape-based kebab-case filename in /icons/ */
export const FIGMA_ICONS = {
  ArrowLeft: "arrow-back.svg",
  ArrowRight: "arrow-right.svg",
  "ArrowRight/24": "arrow-right.svg",
  Cart: "shopping-cart.svg",
  Check: "check.svg",
  Close: "close.svg",
  ExpandMore: "chevron-down.svg",
  Help_Outline: "help-outline.svg",
  Help_Filled: "help.svg",
  Information: "info.svg",
  Plus: "add.svg",
  Settings: "settings.svg",
  Van: "van.svg",
};

export const assets = {
  image: (file) => `${ASSET_ROOT}/images/${file}`,
  icon: (file) => `${ASSET_ROOT}/icons/${file}`,
  illustration: (file) => `${ASSET_ROOT}/illustrations/${file}`,
  font: (file) => `${ASSET_ROOT}/fonts/${file}`,
};

/** Screen-specific exported images (e.g. images/home/nav_home.png) */
export const screenAsset = (screen, file) =>
  `${ASSET_ROOT}/images/${screen}/${file}`;

/**
 * Render a fixed-size icon <img> that preserves aspect ratio.
 * Prefer this over raw <img> tags for icons exported from Figma.
 */
export function iconImg(file, { size = 24, className = "", alt = "" } = {}) {
  const classes = ["proto-asset-icon", className].filter(Boolean).join(" ");
  return `<img class="${classes}" src="${assets.icon(file)}" alt="${alt}" width="${size}" height="${size}" />`;
}

/** Resolve a Figma icon component name to an iconImg() call. */
export function figmaIcon(componentName, options = {}) {
  const file = FIGMA_ICONS[componentName];
  if (!file) {
    throw new Error(`Unknown Figma icon component: ${componentName}`);
  }

  return iconImg(file, options);
}

/**
 * Render a logo <img> that preserves aspect ratio inside a fixed box.
 */
export function logoImg(source, { width, height, className = "", alt = "" } = {}) {
  const classes = ["proto-asset-logo", className].filter(Boolean).join(" ");
  const src =
    typeof source === "string"
      ? source
      : screenAsset(source.screen, source.file);

  return `<img class="${classes}" src="${src}" alt="${alt}" width="${width}" height="${height}" />`;
}
