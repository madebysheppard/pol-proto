import { createCheckboxOption } from "./checkbox-option.js";

/**
 * @param {Object} [options]
 * @param {string} [options.legend]
 * @param {Array<{ label: string, value: string, checked?: boolean, disabled?: boolean, error?: boolean, id?: string, name?: string }>} [options.options]
 * @param {boolean} [options.error]
 * @param {string} [options.className]
 * @returns {HTMLFieldSetElement}
 */
export function createCheckboxGroup(options = {}) {
  const {
    legend,
    options: optionList = [],
    error = false,
    className = "",
  } = options;

  const fieldset = document.createElement("fieldset");
  fieldset.className = ["checkbox-group", className].filter(Boolean).join(" ");

  if (error) {
    fieldset.classList.add("checkbox-group--error");
  }

  if (legend) {
    const legendEl = document.createElement("legend");
    legendEl.className = "visually-hidden";
    legendEl.textContent = legend;
    fieldset.appendChild(legendEl);
  }

  optionList.forEach((opt, index) => {
    if (index > 0) {
      const divider = document.createElement("hr");
      divider.className = "checkbox-divider";
      divider.setAttribute("aria-hidden", "true");
      fieldset.appendChild(divider);
    }

    const option = createCheckboxOption({
      name: opt.name,
      label: opt.label,
      value: opt.value,
      checked: opt.checked,
      disabled: opt.disabled,
      error: opt.error ?? error,
      id: opt.id,
    });

    fieldset.appendChild(option);
  });

  return fieldset;
}

/**
 * @param {Object} specComponent — xray Forms/Checkbox group component entry
 * @param {Object} [overrides]
 * @returns {HTMLFieldSetElement}
 */
export function createCheckboxGroupFromSpec(specComponent, overrides = {}) {
  const props = specComponent?.properties || {};
  const showFlags = [
    props["Show option 2#798:0"]?.default !== false,
    props["Show option 3#798:7"]?.default !== false,
    props["Show option 4#798:14"]?.default !== false,
    props["Show option 5#798:21"]?.default !== false,
    props["Show option 6#798:28"]?.default !== false,
  ];

  const options = (overrides.options || [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
    { label: "Option 4", value: "4" },
    { label: "Option 5", value: "5" },
    { label: "Option 6", value: "6" },
  ]).filter((_, i) => i === 0 || showFlags[i - 1]);

  return createCheckboxGroup({
    legend: overrides.legend ?? "Select options",
    options,
    ...overrides,
  });
}
