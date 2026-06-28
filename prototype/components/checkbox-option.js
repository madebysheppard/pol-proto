/**
 * Pattern Library — Forms/Checkbox option
 * Labelled checkbox row: control + option text.
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
export function createCheckboxOption(options = {}) {
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
  root.className = "checkbox-option";

  if (error) {
    root.classList.add("checkbox-option--error");
  }

  if (disabled) {
    root.classList.add("checkbox-option--disabled");
  }

  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "checkbox-option__input";

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

  const labelWrap = document.createElement("span");
  labelWrap.className = "checkbox-option__label";

  const labelText = document.createElement("span");
  labelText.className = "checkbox-option__text";
  labelText.textContent = label;
  labelWrap.appendChild(labelText);

  root.appendChild(input);
  root.appendChild(controlWrap);
  controlWrap.appendChild(control);
  root.appendChild(labelWrap);

  root.inputElement = input;

  return root;
}

/**
 * @param {Object} specComponent — xray Forms/Checkbox option component entry
 * @param {Object} [overrides]
 * @returns {HTMLLabelElement}
 */
export function createCheckboxOptionFromSpec(specComponent, overrides = {}) {
  const props = specComponent?.properties || {};
  const axisValues = overrides.axisValues || {};
  const state = axisValues.State || "Default";
  const checked = axisValues.Checked === "True";

  return createCheckboxOption({
    label: overrides.label ?? props["Label#212:0"]?.default ?? "Option 1",
    checked,
    disabled: state === "Disabled",
    error: state === "Error",
    ...overrides,
  });
}
