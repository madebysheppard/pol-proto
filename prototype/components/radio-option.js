/**
 * Pattern Library — Forms/Radio option
 * Labelled radio row: control + option text.
 */

/**
 * @param {Object} [options]
 * @param {string} options.label
 * @param {string} [options.id]
 * @param {string} [options.name]
 * @param {string} [options.value]
 * @param {boolean} [options.checked]
 * @param {boolean} [options.disabled]
 * @param {boolean} [options.error]
 * @returns {HTMLLabelElement}
 */
export function createRadioOption(options = {}) {
  const {
    label,
    id,
    name,
    value,
    checked = false,
    disabled = false,
    error = false,
  } = options;

  const root = document.createElement("label");
  root.className = "radio-option";

  if (error) {
    root.classList.add("radio-option--error");
  }

  if (disabled) {
    root.classList.add("radio-option--disabled");
  }

  const input = document.createElement("input");
  input.type = "radio";
  input.className = "radio-option__input";

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

  const control = document.createElement("span");
  control.className = "radio-control";
  control.setAttribute("aria-hidden", "true");

  const dot = document.createElement("span");
  dot.className = "radio-control__dot";
  control.appendChild(dot);

  const labelText = document.createElement("span");
  labelText.className = "radio-option__label";
  labelText.textContent = label;

  root.appendChild(input);
  root.appendChild(control);
  root.appendChild(labelText);

  root.inputElement = input;

  return root;
}

/**
 * @param {Object} specComponent — xray Forms/Radio option component entry
 * @param {Object} [overrides]
 * @returns {HTMLLabelElement}
 */
export function createRadioOptionFromSpec(specComponent, overrides = {}) {
  const props = specComponent?.properties || {};
  const axisValues = overrides.axisValues || {};
  const state = axisValues.State || "Default";
  const selected = axisValues.Selected === "True";

  return createRadioOption({
    label: overrides.label ?? props["Label#207:0"]?.default ?? "Option 1",
    checked: selected,
    disabled: state === "Disabled",
    error: state === "Error",
    ...overrides,
  });
}
