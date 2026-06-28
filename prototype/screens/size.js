import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";
import { createChoiceButton } from "../components/choice-button.js";
import { bindSingleSelect } from "../utils/selection.js";

const options = [
  {
    id: "small",
    title: "Small parcel",
    dimensions: "45cm x 35cm x 16cm",
    weight: "Maximum weight 2kg",
    illustration: "parcel-box-open.svg",
    compact: false,
  },
  {
    id: "medium",
    title: "Medium parcel",
    dimensions: "61cm x 46cm x 46cm",
    weight: "Maximum weight 20kg",
    illustration: "drop-off.svg",
    compact: false,
  },
];

registerScreen("size", () => {
  const section = document.createElement("section");
  section.className = "screen screen--size";
  section.innerHTML = `
    <header class="feature-header">
      <button type="button" class="feature-header__back" aria-label="Back">
        <span class="feature-header__back-icon" aria-hidden="true"></span>
      </button>
      <h1 class="feature-header__title">Parcel details</h1>
    </header>

    <div class="progress-indicator" aria-hidden="true">
      <div class="progress-track">
        <div class="progress-track__indicator"></div>
      </div>
    </div>

    <div class="size-body">
      <h2 class="size-heading">What size is your parcel?</h2>

      <div class="parcel-size-list" role="group" aria-label="Parcel size"></div>
    </div>

    <div class="size-footer"></div>
  `;

  const footer = section.querySelector(".size-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "disabled", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  const list = section.querySelector(".parcel-size-list");
  const choiceButtons = options.map((option) =>
    createChoiceButton({
      title: option.title,
      dimensions: option.dimensions,
      weight: option.weight,
      illustration: option.illustration,
      compact: option.compact,
      value: option.id,
    }),
  );

  choiceButtons.forEach((button) => list.appendChild(button));

  bindSingleSelect(choiceButtons, {
    onChange: () => {
      continueButton.disabled = false;
    },
  });

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("send", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    if (!continueButton.disabled) {
      navigate("heavy");
    }
  });

  return section;
});
