import { registerScreen } from "../utils/router.js";
import { createInput } from "../components/input.js";
import { createTextInput } from "../components/text-input.js";
import { createRadio } from "../components/radio.js";
import { createRadioOption } from "../components/radio-option.js";
import { createRadioGroup } from "../components/radio-group.js";
import { createCheckbox } from "../components/checkbox.js";
import { createCheckboxOption } from "../components/checkbox-option.js";
import { createCheckboxGroup } from "../components/checkbox-group.js";

function addSection(container, heading, buildContent) {
  const row = document.createElement("section");
  row.className = "form-fields-demo__row";

  const title = document.createElement("h2");
  title.className = "form-fields-demo__heading";
  title.textContent = heading;
  row.appendChild(title);

  const stack = document.createElement("div");
  stack.className = "form-fields-demo__stack";
  buildContent(stack);
  row.appendChild(stack);

  container.appendChild(row);
}

function addControlSample(container, label, control) {
  const sample = document.createElement("div");
  sample.className = "form-fields-demo__control-sample";

  const caption = document.createElement("span");
  caption.className = "form-fields-demo__control-label";
  caption.textContent = label;

  sample.appendChild(caption);
  sample.appendChild(control);
  container.appendChild(sample);
}

registerScreen("form-fields-demo", () => {
  const section = document.createElement("section");
  section.className = "screen screen--form-fields-demo";

  section.innerHTML = `
    <div class="form-fields-demo__intro">
      <h1 class="form-fields-demo__title">Form fields</h1>
      <p class="form-fields-demo__copy">
        Pattern Library inputs — tab to focus, type to edit, and select radio or checkbox options.
      </p>
      <p class="form-fields-demo__status" aria-live="polite">Ready</p>
    </div>
  `;

  const status = section.querySelector(".form-fields-demo__status");

  const shell = document.createElement("div");
  shell.className = "form-fields-demo__shell";

  const body = document.createElement("div");
  body.className = "form-fields-demo__body";

  addSection(body, "Text input — default", (stack) => {
    stack.appendChild(
      createTextInput({
        id: "demo-text-default",
        label: "Label",
        placeholder: "Enter text",
      })
    );
  });

  addSection(body, "Text input — optional", (stack) => {
    stack.appendChild(
      createTextInput({
        id: "demo-text-optional",
        label: "Email address",
        optional: true,
        placeholder: "you@example.com",
      })
    );
  });

  addSection(body, "Text input — prefix & suffix", (stack) => {
    stack.appendChild(
      createTextInput({
        id: "demo-text-affixes",
        label: "Weight",
        hasPrefix: true,
        prefix: "£",
        hasSuffix: true,
        suffix: "kg",
        placeholder: "0.00",
      })
    );
  });

  addSection(body, "Text input — disabled", (stack) => {
    stack.appendChild(
      createTextInput({
        id: "demo-text-disabled",
        label: "Reference",
        value: "EVR123456789GB",
        disabled: true,
      })
    );
  });

  addSection(body, "Text input — read-only", (stack) => {
    stack.appendChild(
      createTextInput({
        id: "demo-text-readonly",
        label: "Tracking number",
        value: "EVR123456789GB",
        readOnly: true,
      })
    );
  });

  addSection(body, "Text input — error", (stack) => {
    stack.appendChild(
      createTextInput({
        id: "demo-text-error",
        label: "Postcode",
        value: "INVALID",
        error: true,
        errorMessage: "Enter a valid UK postcode",
      })
    );
  });

  addSection(body, "Bare input", (stack) => {
    const { root } = createInput({
      id: "demo-bare-input",
      placeholder: "Bare forms/input",
    });
    stack.appendChild(root);
  });

  addSection(body, "Radio control", (stack) => {
    const row = document.createElement("div");
    row.className = "form-fields-demo__control-row";

    addControlSample(row, "Default", createRadio({ name: "demo-radio-control", ariaLabel: "Default" }));
    addControlSample(row, "Selected", createRadio({ name: "demo-radio-control", checked: true, ariaLabel: "Selected" }));
    addControlSample(row, "Disabled", createRadio({ name: "demo-radio-control", disabled: true, ariaLabel: "Disabled" }));
    addControlSample(row, "Error", createRadio({ name: "demo-radio-control", error: true, ariaLabel: "Error" }));

    stack.appendChild(row);
  });

  addSection(body, "Radio option", (stack) => {
    stack.appendChild(
      createRadioOption({
        name: "demo-radio-option-default",
        label: "Standard delivery",
        value: "standard",
      })
    );
    stack.appendChild(
      createRadioOption({
        name: "demo-radio-option-selected",
        label: "Express delivery",
        value: "express",
        checked: true,
      })
    );
    stack.appendChild(
      createRadioOption({
        name: "demo-radio-option-disabled",
        label: "Unavailable option",
        value: "unavailable",
        disabled: true,
      })
    );
    stack.appendChild(
      createRadioOption({
        name: "demo-radio-option-error",
        label: "Invalid selection",
        value: "invalid",
        error: true,
      })
    );
  });

  addSection(body, "Radio group — interactive", (stack) => {
    const group = createRadioGroup({
      name: "demo-delivery-speed",
      legend: "Delivery speed",
      options: [
        { label: "2nd Class", value: "2nd" },
        { label: "1st Class", value: "1st", checked: true },
        { label: "Special Delivery", value: "special" },
      ],
    });

    group.addEventListener("change", (event) => {
      if (event.target.matches('input[type="radio"]')) {
        status.textContent = `Delivery speed: ${event.target.value}`;
      }
    });

    stack.appendChild(group);
  });

  addSection(body, "Checkbox control", (stack) => {
    const row = document.createElement("div");
    row.className = "form-fields-demo__control-row";

    addControlSample(row, "Default", createCheckbox({ name: "demo-checkbox-control", ariaLabel: "Default" }));
    addControlSample(row, "Checked", createCheckbox({ name: "demo-checkbox-control", checked: true, ariaLabel: "Checked" }));
    addControlSample(row, "Disabled", createCheckbox({ name: "demo-checkbox-control", disabled: true, ariaLabel: "Disabled" }));
    addControlSample(row, "Error", createCheckbox({ name: "demo-checkbox-control", error: true, ariaLabel: "Error" }));

    stack.appendChild(row);
  });

  addSection(body, "Checkbox option", (stack) => {
    stack.appendChild(
      createCheckboxOption({
        name: "demo-checkbox-option-default",
        label: "Email me delivery updates",
        value: "email",
      })
    );
    stack.appendChild(
      createCheckboxOption({
        name: "demo-checkbox-option-checked",
        label: "Save address for next time",
        value: "save",
        checked: true,
      })
    );
    stack.appendChild(
      createCheckboxOption({
        name: "demo-checkbox-option-disabled",
        label: "Marketing preferences",
        value: "marketing",
        disabled: true,
      })
    );
    stack.appendChild(
      createCheckboxOption({
        name: "demo-checkbox-option-error",
        label: "Accept terms and conditions",
        value: "terms",
        error: true,
      })
    );
  });

  addSection(body, "Checkbox group — interactive", (stack) => {
    const group = createCheckboxGroup({
      legend: "Notification preferences",
      options: [
        { name: "demo-notify-email", label: "Email", value: "email", checked: true },
        { name: "demo-notify-sms", label: "SMS", value: "sms" },
        { name: "demo-notify-push", label: "Push notification", value: "push" },
      ],
    });

    group.addEventListener("change", (event) => {
      if (event.target.matches('input[type="checkbox"]')) {
        const selected = [...group.querySelectorAll('input[type="checkbox"]:checked')]
          .map((input) => input.value)
          .join(", ");
        status.textContent = selected ? `Notifications: ${selected}` : "No notifications selected";
      }
    });

    stack.appendChild(group);
  });

  shell.appendChild(body);
  section.appendChild(shell);
  return section;
});
