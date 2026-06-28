import { assets } from "../utils/assets.js";

function resolveIllustrationSrc(illustration) {
  if (!illustration) {
    return null;
  }

  if (
    illustration.startsWith("./") ||
    illustration.startsWith("/") ||
    illustration.startsWith("http")
  ) {
    return illustration;
  }

  const file = illustration.endsWith(".svg") ? illustration : `${illustration}.svg`;
  return assets.illustration(file);
}

/**
 * Pattern Library Buttons/Choice — large card selection button.
 * State (Default, Selected, Disabled) is managed via CSS, aria-pressed, and :disabled.
 *
 * @param {Object} [options]
 * @param {string} [options.title="Medium parcel"]
 * @param {string} [options.dimensions="61cm x 46cm x 46cm"]
 * @param {string} [options.weight="Maximum weight 20kg"]
 * @param {string} [options.illustration="parcel-large.svg"] Illustration filename in /illustrations/.
 * @param {boolean} [options.disabled=false]
 * @param {boolean} [options.selected=false]
 * @param {boolean} [options.compact=false] Reduced padding for compact card layouts.
 * @param {string} [options.value] Optional value for `data-value`.
 * @param {string} [options.className=""] Additional classes.
 * @param {"button"|"submit"|"reset"} [options.type="button"]
 * @param {string} [options.ariaLabel] Accessible name; defaults to `title`.
 * @returns {HTMLButtonElement}
 */
export function createChoiceButton({
  title = "Medium parcel",
  dimensions = "61cm x 46cm x 46cm",
  weight = "Maximum weight 20kg",
  illustration = "parcel-large.svg",
  disabled = false,
  selected = false,
  compact = false,
  value,
  className = "",
  type = "button",
  ariaLabel,
} = {}) {
  const button = document.createElement("button");
  button.type = type;
  button.disabled = Boolean(disabled);
  button.className = [
    "choice-btn",
    compact ? "choice-btn--compact" : "",
    selected ? "choice-btn--selected" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  button.setAttribute("aria-pressed", String(Boolean(selected)));
  button.setAttribute("aria-label", ariaLabel || title);

  if (value !== undefined) {
    button.dataset.value = value;
  }

  const surface = document.createElement("span");
  surface.className = "choice-btn__surface";

  const illustrationSrc = resolveIllustrationSrc(illustration);
  if (illustrationSrc) {
    const illustrationEl = document.createElement("img");
    illustrationEl.className = "choice-btn__illustration";
    illustrationEl.src = illustrationSrc;
    illustrationEl.alt = "";
    illustrationEl.width = 120;
    illustrationEl.height = 120;
    surface.appendChild(illustrationEl);
  }

  const content = document.createElement("span");
  content.className = "choice-btn__content";

  const heading = document.createElement("span");
  heading.className = "choice-btn__heading";

  const titleEl = document.createElement("span");
  titleEl.className = "choice-btn__title";
  titleEl.textContent = title;

  const dimensionsEl = document.createElement("span");
  dimensionsEl.className = "choice-btn__dimensions";
  dimensionsEl.textContent = dimensions;

  heading.appendChild(titleEl);
  heading.appendChild(dimensionsEl);

  const weightEl = document.createElement("span");
  weightEl.className = "choice-btn__weight";
  weightEl.textContent = weight;

  content.appendChild(heading);
  content.appendChild(weightEl);
  surface.appendChild(content);
  button.appendChild(surface);

  return button;
}
