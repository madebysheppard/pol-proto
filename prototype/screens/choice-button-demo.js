import { registerScreen } from "../utils/router.js";
import { createChoiceButton } from "../components/choice-button.js";
import { bindSingleSelect } from "../utils/selection.js";

function addStack(container, heading, choices) {
  const row = document.createElement("section");
  row.className = "choice-button-demo__row";

  const title = document.createElement("h2");
  title.className = "choice-button-demo__heading";
  title.textContent = heading;
  row.appendChild(title);

  const stack = document.createElement("div");
  stack.className = "choice-button-demo__stack";
  choices.forEach((choice) => stack.appendChild(choice));
  row.appendChild(stack);

  container.appendChild(row);
}

registerScreen("choice-button-demo", () => {
  const section = document.createElement("section");
  section.className = "screen screen--choice-button-demo";

  section.innerHTML = `
    <div class="choice-button-demo__intro">
      <h1 class="choice-button-demo__title">Buttons/Choice</h1>
      <p class="choice-button-demo__copy">
        Large card choice buttons — click to select, tab to focus, and compare states.
      </p>
    </div>
  `;

  const shell = document.createElement("div");
  shell.className = "choice-button-demo__shell";

  const body = document.createElement("div");
  body.className = "choice-button-demo__body";

  addStack(body, "Default", [
    createChoiceButton({
      title: "Medium parcel",
      dimensions: "61cm x 46cm x 46cm",
      weight: "Maximum weight 20kg",
      illustration: "parcel-large.svg",
    }),
  ]);

  addStack(body, "Selected", [
    createChoiceButton({
      title: "Medium parcel",
      dimensions: "61cm x 46cm x 46cm",
      weight: "Maximum weight 20kg",
      illustration: "parcel-large.svg",
      selected: true,
    }),
  ]);

  addStack(body, "Disabled", [
    createChoiceButton({
      title: "Medium parcel",
      dimensions: "61cm x 46cm x 46cm",
      weight: "Maximum weight 20kg",
      illustration: "parcel-large.svg",
      disabled: true,
    }),
  ]);

  addStack(body, "Compact", [
    createChoiceButton({
      title: "Small parcel",
      dimensions: "45cm x 35cm x 16cm",
      weight: "Maximum weight 2kg",
      illustration: "parcel-medium.svg",
      compact: true,
    }),
  ]);

  const interactiveRow = document.createElement("section");
  interactiveRow.className = "choice-button-demo__row";

  const interactiveHeading = document.createElement("h2");
  interactiveHeading.className = "choice-button-demo__heading";
  interactiveHeading.textContent = "Interactive";
  interactiveRow.appendChild(interactiveHeading);

  const interactiveStack = document.createElement("div");
  interactiveStack.className = "choice-button-demo__stack";
  interactiveStack.setAttribute("role", "group");
  interactiveStack.setAttribute("aria-label", "Parcel size preview");

  const interactiveChoices = [
    createChoiceButton({
      title: "Small parcel",
      dimensions: "45cm x 35cm x 16cm",
      weight: "Maximum weight 2kg",
      illustration: "parcel-medium.svg",
      compact: true,
      value: "small",
    }),
    createChoiceButton({
      title: "Medium parcel",
      dimensions: "61cm x 46cm x 46cm",
      weight: "Maximum weight 20kg",
      illustration: "parcel-large.svg",
      value: "medium",
    }),
  ];

  interactiveChoices.forEach((button) => interactiveStack.appendChild(button));
  interactiveRow.appendChild(interactiveStack);
  body.appendChild(interactiveRow);

  bindSingleSelect(interactiveChoices);

  shell.appendChild(body);
  section.appendChild(shell);
  return section;
});
