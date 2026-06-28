/**
 * Pattern Library — Forms/Checkbox
 * Standalone checkbox control (box + tick).
 */

/**
 * @param {Object} [options]
 * @param {string} [options.id]
 * @param {string} [options.name]
 * @param {string} [options.value]
 * @param {boolean} [options.checked]
 * @param {boolean} [options.disabled]
 * @param {boolean} [options.error]
 * @param {string} [options.ariaLabel]
 * @returns {HTMLElement}
 */
export function createCheckbox(options = {}) {
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
  root.className = "forms-checkbox";

  if (error) {
    root.classList.add("forms-checkbox--error");
  }

  if (disabled) {
    root.classList.add("forms-checkbox--disabled");
  }

  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "forms-checkbox__input";

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

  const controlWrap = document.createElement("span");
  controlWrap.className = "checkbox-control-wrap";

  const control = document.createElement("span");
  control.className = "checkbox-control";
  control.setAttribute("aria-hidden", "true");

  const tick = document.createElement("span");
  tick.className = "checkbox-control__tick";
  tick.innerHTML =
    '<svg viewBox="0 0 26 19" fill="none" aria-hidden="true"><path d="M2 10.0769L8.94737 17L24 2" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  control.appendChild(tick);

  controlWrap.appendChild(control);

  root.appendChild(input);
  root.appendChild(controlWrap);

  root.inputElement = input;

  return root;
}

/**
 * @param {Object} specComponent — xray Forms/Checkbox component entry
 * @param {Object} [overrides]
 * @returns {HTMLElement}
 */
export function createCheckboxFromSpec(specComponent, overrides = {}) {
  const axisValues = overrides.axisValues || {};
  const state = axisValues.State || "Default";
  const checked = axisValues.Checked === "True";

  return createCheckbox({
    checked,
    disabled: state === "Disabled",
    error: state === "Error",
    ...overrides,
  });
}
