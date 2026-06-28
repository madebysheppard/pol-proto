/**
 * Pattern Library — Forms/Radio
 * Standalone radio control (circle + dot). Pair with createRadioOption for labelled fields.
 */

/**
 * @param {Object} [options]
 * @param {string} [options.id]
 * @param {string} [options.name]
 * @param {string} [options.value]
 * @param {boolean} [options.checked]
 * @param {boolean} [options.disabled]
 * @param {boolean} [options.error]
 * @param {string} [options.ariaLabel] — required when used without visible label
 * @returns {HTMLElement}
 */
export function createRadio(options = {}) {
  const {
    id,
    name,
    value,
    checked = false,
    disabled = false,
    error = false,
    ariaLabel,
  } = options;

  const root = document.createElement("span");
  root.className = "forms-radio";

  if (error) {
    root.classList.add("forms-radio--error");
  }

  if (disabled) {
    root.classList.add("forms-radio--disabled");
  }

  const input = document.createElement("input");
  input.type = "radio";
  input.className = "forms-radio__input";

  if (id) {
    input.id = id;
  }

  if (name) {
    input.name = name;
  }

  if (value != null) {
    input.value = value;
  }

  if (checked) {
    input.checked = true;
  }

  if (disabled) {
    input.disabled = true;
  }

  if (error) {
    input.setAttribute("aria-invalid", "true");
  }

  if (ariaLabel) {
    input.setAttribute("aria-label", ariaLabel);
  }

  const control = document.createElement("span");
  control.className = "radio-control";
  control.setAttribute("aria-hidden", "true");

  const dot = document.createElement("span");
  dot.className = "radio-control__dot";
  control.appendChild(dot);

  root.appendChild(input);
  root.appendChild(control);

  root.inputElement = input;

  return root;
}

/**
 * @param {Object} specComponent — xray Forms/Radio component entry
 * @param {Object} [overrides]
 * @returns {HTMLElement}
 */
export function createRadioFromSpec(specComponent, overrides = {}) {
  const axisValues = overrides.axisValues || {};
  const state = axisValues.State || "Default";
  const selected = axisValues.Selected === "True";

  return createRadio({
    checked: selected,
    disabled: state === "Disabled",
    error: state === "Error",
    ...overrides,
  });
}
