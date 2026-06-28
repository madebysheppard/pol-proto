import { createInput } from "./input.js";

function createWarningIcon() {
  const icon = document.createElement("span");
  icon.className = "text-input-field__error-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.5L2.5 19.5H21.5L12 2.5Z" fill="currentColor"/><path d="M12 9V13" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.5" r="1" fill="#fff"/></svg>';
  return icon;
}

/**
 * Pattern Library — Forms/Text input
 * Label, optional badge, description, error message, and Forms/input control.
 *
 * @param {Object} [options]
 * @param {string} [options.id] — applied to the input; label `for` when set
 * @param {string} [options.label="Label"]
 * @param {boolean} [options.optional]
 * @param {boolean} [options.showDescription]
 * @param {string} [options.description="Helper text"]
 * @param {boolean} [options.error]
 * @param {string} [options.errorMessage="Please fix this"]
 * @param {boolean} [options.hasPrefix]
 * @param {string} [options.prefix]
 * @param {boolean} [options.hasSuffix]
 * @param {string} [options.suffix]
 * @param {string} [options.className]
 * @returns {HTMLElement}
 */
export function createTextInput(options = {}) {
  const {
    id,
    label = "Label",
    optional = false,
    showDescription = false,
    description = "Helper text",
    error = false,
    errorMessage = "Please fix this",
    className = "",
    ...inputOptions
  } = options;

  const field = document.createElement("div");
  field.className = ["text-input-field", className].filter(Boolean).join(" ");

  if (error) {
    field.classList.add("text-input-field--error");
  }

  if (inputOptions.hasPrefix) {
    field.classList.add("text-input-field--has-prefix");
  }

  if (inputOptions.hasSuffix) {
    field.classList.add("text-input-field--has-suffix");
  }

  const labelRow = document.createElement("div");
  labelRow.className = "text-input-field__label-row";

  const labelEl = document.createElement("label");
  labelEl.className = "text-input-field__label";
  labelEl.textContent = label;

  if (id) {
    labelEl.htmlFor = id;
  }

  labelRow.appendChild(labelEl);

  if (optional) {
    const optionalEl = document.createElement("span");
    optionalEl.className = "text-input-field__optional";
    optionalEl.textContent = "(optional)";
    labelRow.appendChild(optionalEl);
  }

  field.appendChild(labelRow);

  if (error && errorMessage) {
    const errorRow = document.createElement("div");
    errorRow.className = "text-input-field__error-row";
    errorRow.appendChild(createWarningIcon());

    const errorText = document.createElement("span");
    errorText.className = "text-input-field__error-text";
    errorText.textContent = errorMessage;
    errorRow.appendChild(errorText);

    field.appendChild(errorRow);
  }

  let descriptionEl = null;

  if (showDescription && description) {
    descriptionEl = document.createElement("p");
    descriptionEl.className = "text-input-field__description";
    if (id) {
      descriptionEl.id = `${id}-description`;
    }
    descriptionEl.textContent = description;
    field.appendChild(descriptionEl);
  }

  const { inputWrap, input } = createInput({
    id,
    error,
    ...inputOptions,
  });

  field.appendChild(inputWrap);

  if (descriptionEl && id) {
    input.setAttribute("aria-describedby", descriptionEl.id);
  }

  if (error && errorMessage) {
    const errorId = id ? `${id}-error` : undefined;
    if (errorId) {
      const errorTextEl = field.querySelector(".text-input-field__error-text");
      if (errorTextEl) {
        errorTextEl.id = errorId;
      }

      input.setAttribute("aria-describedby", [errorId, input.getAttribute("aria-describedby")].filter(Boolean).join(" "));
    }

    input.setAttribute("aria-invalid", "true");
  }

  field.inputElement = input;

  return field;
}

/**
 * @param {Object} specComponent — xray Forms/Text input component entry
 * @param {Object} [overrides]
 * @returns {HTMLElement}
 */
export function createTextInputFromSpec(specComponent, overrides = {}) {
  const props = specComponent?.properties || {};

  const axisValues = overrides.axisValues || {};
  const state = axisValues.State || "Default";
  const error = state === "Error" || state === "Error-Focus" || state === "Error-Focussed";

  return createTextInput({
    label: overrides.label ?? props["Label#247:12"]?.default ?? "Label",
    optional: overrides.optional ?? props["Optional#255:0"]?.default ?? false,
    showDescription: overrides.showDescription ?? props["Show description#247:0"]?.default ?? false,
    description: overrides.description ?? props["Description#247:18"]?.default ?? "Helper text",
    errorMessage: overrides.errorMessage ?? props["Error message#247:24"]?.default ?? "Please fix this",
    error,
    disabled: state === "Disabled",
    readOnly: state === "Read-only",
    ...overrides,
  });
}
