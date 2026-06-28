/**
 * Pattern Library — Forms/input
 * Bare text input with optional prefix/suffix. States via CSS (:disabled, :focus, :read-only, aria-invalid).
 */

/**
 * @param {Object} [options]
 * @param {string} [options.id]
 * @param {string} [options.name]
 * @param {string} [options.type="text"]
 * @param {string} [options.value]
 * @param {string} [options.placeholder]
 * @param {boolean} [options.disabled]
 * @param {boolean} [options.readOnly]
 * @param {boolean} [options.error]
 * @param {boolean} [options.hasPrefix]
 * @param {string} [options.prefix="£"]
 * @param {boolean} [options.hasSuffix]
 * @param {string} [options.suffix="kg"]
 * @param {string} [options.className]
 * @param {Record<string, string>} [options.attrs]
 * @returns {{ root: HTMLElement, input: HTMLInputElement, inputWrap: HTMLElement }}
 */
export function createInput(options = {}) {
  const {
    id,
    name,
    type = "text",
    value,
    placeholder,
    disabled = false,
    readOnly = false,
    error = false,
    hasPrefix = false,
    prefix = "£",
    hasSuffix = false,
    suffix = "kg",
    className = "",
    attrs = {},
  } = options;

  const root = document.createElement("div");
  root.className = ["forms-input", className].filter(Boolean).join(" ");

  if (hasPrefix) {
    root.classList.add("text-input-field--has-prefix");
  }

  if (hasSuffix) {
    root.classList.add("text-input-field--has-suffix");
  }

  if (error) {
    root.classList.add("text-input-field--error");
  }

  const inputWrap = document.createElement("div");
  inputWrap.className = "text-input-field__input-wrap";

  const input = document.createElement("input");
  input.className = "text-input-field__input";
  input.type = type;

  if (id) {
    input.id = id;
  }

  if (name) {
    input.name = name;
  }

  if (value != null && value !== "") {
    input.value = value;
  }

  if (placeholder) {
    input.placeholder = placeholder;
  }

  if (disabled) {
    input.disabled = true;
  }

  if (readOnly) {
    input.readOnly = true;
  }

  if (error) {
    input.setAttribute("aria-invalid", "true");
  }

  Object.entries(attrs).forEach(([key, val]) => {
    if (val != null) {
      input.setAttribute(key, String(val));
    }
  });

  if (hasPrefix || hasSuffix) {
    const box = document.createElement("div");
    box.className = "text-input-field__box";

    if (hasPrefix) {
      const prefixEl = document.createElement("span");
      prefixEl.className = "text-input-field__prefix";
      prefixEl.textContent = prefix;
      box.appendChild(prefixEl);
    }

    box.appendChild(input);

    if (hasSuffix) {
      const suffixEl = document.createElement("span");
      suffixEl.className = "text-input-field__suffix";
      suffixEl.textContent = suffix;
      box.appendChild(suffixEl);
    }

    inputWrap.appendChild(box);
  } else {
    inputWrap.appendChild(input);
  }

  root.appendChild(inputWrap);

  return { root, input, inputWrap };
}

/**
 * @param {Object} [options]
 * @returns {HTMLElement}
 */
export function createInputElement(options = {}) {
  return createInput(options).root;
}

/**
 * @param {Object} specComponent — xray Forms/input component entry
 * @param {Object} [overrides]
 * @returns {HTMLElement}
 */
export function createInputFromSpec(specComponent, overrides = {}) {
  const props = specComponent?.properties || {};
  const hasPrefix = overrides.hasPrefix ?? props["Has prefix#260:0"]?.default ?? false;
  const hasSuffix = overrides.hasSuffix ?? props["Has suffix#260:7"]?.default ?? false;
  const prefix = overrides.prefix ?? props["Prefix#260:14"]?.default ?? "£";
  const suffix = overrides.suffix ?? props["Suffix#260:21"]?.default ?? "kg";

  const axisValues = overrides.axisValues || {};
  const state = axisValues.State || "Default";
  const error = state === "Error" || state === "Error-Focussed";
  const disabled = state === "Disabled";
  const readOnly = state === "Read-only";

  return createInputElement({
    hasPrefix,
    hasSuffix,
    prefix,
    suffix,
    disabled,
    readOnly,
    error,
    ...overrides,
  });
}
