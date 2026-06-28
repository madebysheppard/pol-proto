import { assets, FIGMA_ICONS } from "../utils/assets.js";

const INTENT_CLASSES = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  success: "btn--success",
  tertiary: "btn--tertiary",
};

const ICON_POSITION_CLASSES = {
  none: "",
  leading: "btn--icon-leading",
  trailing: "btn--icon-trailing",
  only: "btn--icon-only",
};

function normalizeIntent(intent) {
  const key = String(intent || "primary").toLowerCase();
  return INTENT_CLASSES[key] ? key : "primary";
}

function normalizeIconPosition(iconPosition, { showLeadingIcon, showTrailingIcon } = {}) {
  if (iconPosition) {
    const key = String(iconPosition).toLowerCase();
    if (ICON_POSITION_CLASSES[key] !== undefined) {
      return key;
    }
  }

  if (showLeadingIcon && showTrailingIcon) {
    return "leading";
  }

  if (showLeadingIcon) {
    return "leading";
  }

  if (showTrailingIcon) {
    return "trailing";
  }

  return "none";
}

function resolveIconFile(icon) {
  if (!icon) {
    return null;
  }

  if (icon.endsWith(".svg")) {
    return icon;
  }

  return FIGMA_ICONS[icon] || null;
}

function createIconElement(icon, position) {
  const file = resolveIconFile(icon);
  if (!file) {
    return null;
  }

  const wrapper = document.createElement("span");
  wrapper.className = `btn__icon btn__icon--${position}`;
  wrapper.setAttribute("aria-hidden", "true");

  const glyph = document.createElement("span");
  glyph.className = "btn__icon-glyph";
  glyph.style.setProperty("--btn-icon-src", `url("${assets.icon(file)}")`);
  wrapper.appendChild(glyph);

  return wrapper;
}

/**
 * Pattern Library Buttons/Button — Medium size, four intents, CSS-managed states.
 *
 * @param {Object} [options]
 * @param {"primary"|"secondary"|"success"|"tertiary"|string} [options.intent="primary"]
 * @param {"none"|"leading"|"trailing"|"only"|string} [options.iconPosition="none"]
 * @param {string} [options.label="Label"] Label text (maps to spec `slots.label`).
 * @param {string} [options.icon] Icon filename or Figma icon component name.
 * @param {boolean} [options.disabled=false]
 * @param {boolean} [options.fullWidth=true] Full-width button; set false for content-width.
 * @param {string} [options.className=""] Additional classes (e.g. btn--continue).
 * @param {"button"|"submit"|"reset"} [options.type="button"]
 * @param {string} [options.ariaLabel] Required when `iconPosition` is `only`.
 * @param {boolean} [options.showLeadingIcon=false] Deprecated — use `iconPosition: "leading"`.
 * @param {boolean} [options.showTrailingIcon=false] Deprecated — use `iconPosition: "trailing"`.
 * @param {boolean} [options.inline=false] Deprecated — use `fullWidth: false`.
 * @returns {HTMLButtonElement}
 */
export function createButton({
  intent = "primary",
  iconPosition,
  label = "Label",
  icon,
  disabled = false,
  fullWidth = true,
  className = "",
  type = "button",
  ariaLabel,
  showLeadingIcon = false,
  showTrailingIcon = false,
  inline = false,
} = {}) {
  const normalizedIntent = normalizeIntent(intent);
  const normalizedIconPosition = normalizeIconPosition(iconPosition, {
    showLeadingIcon,
    showTrailingIcon,
  });
  const showLabel = normalizedIconPosition !== "only";
  const resolvedFullWidth = inline ? false : fullWidth;

  const button = document.createElement("button");
  button.type = type;
  button.disabled = Boolean(disabled);
  button.className = [
    "btn",
    INTENT_CLASSES[normalizedIntent],
    ICON_POSITION_CLASSES[normalizedIconPosition],
    resolvedFullWidth ? "" : "btn--inline",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (ariaLabel) {
    button.setAttribute("aria-label", ariaLabel);
  } else if (!showLabel) {
    button.setAttribute("aria-label", label);
  }

  const content = document.createElement("span");
  content.className = "btn__content";

  if (normalizedIconPosition === "leading" || normalizedIconPosition === "only") {
    const leadingIcon = createIconElement(icon, "leading");
    if (leadingIcon) {
      content.appendChild(leadingIcon);
    }
  }

  if (showLabel) {
    const labelEl = document.createElement("span");
    labelEl.className = "btn__label";
    labelEl.textContent = label;
    content.appendChild(labelEl);
  }

  if (normalizedIconPosition === "trailing") {
    const trailingIcon = createIconElement(icon, "trailing");
    if (trailingIcon) {
      content.appendChild(trailingIcon);
    }
  }

  button.appendChild(content);
  return button;
}

/**
 * Create a Button from a spec tree instance node.
 *
 * @param {Object} [options]
 * @param {Object} [options.axisValues] Spec variant axes (`intent`, `iconPosition`, `state`, `size`).
 * @param {Object} [options.slots] Spec slots (`label`, `icon`).
 * @param {string} [options.className=""] Additional classes.
 * @param {"button"|"submit"|"reset"} [options.type="button"]
 * @param {string} [options.ariaLabel] Override accessible name.
 * @returns {HTMLButtonElement}
 */
export function createButtonFromSpec({
  axisValues = {},
  slots = {},
  className = "",
  type = "button",
  ariaLabel,
} = {}) {
  const { intent = "primary", iconPosition = "none", state = "default" } = axisValues;

  return createButton({
    intent,
    iconPosition,
    label: slots.label ?? "Label",
    icon: slots.icon,
    disabled: state === "disabled",
    className,
    type,
    ariaLabel,
  });
}
