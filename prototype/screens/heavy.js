import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";

const weightBands = [
  { id: "upto-2", prefix: "Up to", value: "2kg" },
  { id: "over-2", prefix: "Over", value: "2kg" },
  { id: "over-10", prefix: "Over", value: "10kg" },
  { id: "over-20", prefix: "Over", value: "20kg" },
];

const exactOption = {
  id: "exact",
  label: "I know the exact weight",
};

function weightChoice(option) {
  return `
    <div class="weight-choice-wrap">
      <button
        type="button"
        class="weight-choice"
        data-value="${option.id}"
        aria-pressed="false"
      >
        <span class="weight-choice__content">
          <span class="weight-choice__prefix">${option.prefix}</span>
          <span class="weight-choice__value">${option.value}</span>
        </span>
      </button>
    </div>
  `;
}

function exactWeightChoice() {
  return `
    <div class="weight-choice-wrap weight-choice-wrap--exact">
      <button
        type="button"
        class="weight-choice weight-choice--exact"
        data-value="${exactOption.id}"
        aria-pressed="false"
      >
        <span class="weight-choice__content">
          <span class="weight-choice__label">${exactOption.label}</span>
        </span>
      </button>
    </div>
  `;
}

registerScreen("heavy", () => {
  const section = document.createElement("section");
  section.className = "screen screen--heavy";
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

    <div class="heavy-body">
      <div class="heavy-heading">
        <h2 class="heavy-heading__title">How heavy is the parcel?</h2>
        <p class="heavy-heading__text">
          This should be the parcel's total weight including all packaging
        </p>
      </div>

      <div class="weight-band-list" role="group" aria-label="Parcel weight">
        ${weightBands.map((option) => weightChoice(option)).join("")}
        ${exactWeightChoice()}
      </div>

      <div class="heavy-exact-input" hidden>
        <div class="text-input-field text-input-field--has-suffix">
          <label class="text-input-field__label" for="heavy-weight-input">Parcel weight</label>
          <div class="text-input-field__input-wrap">
            <div class="text-input-field__box">
              <input
                class="text-input-field__input"
                id="heavy-weight-input"
                type="text"
                inputmode="decimal"
                autocomplete="off"
              />
              <span class="text-input-field__suffix" aria-hidden="true">kg</span>
            </div>
          </div>
        </div>
        <button type="button" class="link-button heavy-unit-toggle">Switch to grams</button>
      </div>
    </div>

    <div class="heavy-footer"></div>
  `;

  const footer = section.querySelector(".heavy-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "disabled", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);
  const choiceWraps = section.querySelectorAll(".weight-choice-wrap");
  const choiceButtons = section.querySelectorAll(".weight-choice");
  const exactInputSection = section.querySelector(".heavy-exact-input");
  const weightInput = section.querySelector("#heavy-weight-input");
  const weightSuffix = section.querySelector(".text-input-field__suffix");
  const unitToggle = section.querySelector(".heavy-unit-toggle");

  let weightUnit = "kg";

  const resetWeightUnit = () => {
    weightUnit = "kg";
    weightSuffix.textContent = "kg";
    unitToggle.textContent = "Switch to grams";
  };

  const updateContinueState = () => {
    const selected = section.querySelector(".weight-choice-wrap--selected");
    if (!selected) {
      continueButton.disabled = true;
      return;
    }

    const isExact = selected.querySelector('[data-value="exact"]');
    if (isExact) {
      continueButton.disabled = weightInput.value.trim().length === 0;
      return;
    }

    continueButton.disabled = false;
  };

  choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isExact = button.dataset.value === "exact";

      choiceWraps.forEach((wrap) => {
        wrap.classList.remove("weight-choice-wrap--selected");
      });

      choiceButtons.forEach((item) => {
        item.setAttribute("aria-pressed", "false");
      });

      button.closest(".weight-choice-wrap").classList.add("weight-choice-wrap--selected");
      button.setAttribute("aria-pressed", "true");

      exactInputSection.hidden = !isExact;
      if (isExact) {
        weightInput.focus();
      } else {
        weightInput.value = "";
        resetWeightUnit();
      }

      updateContinueState();
    });
  });

  unitToggle.addEventListener("click", () => {
    if (weightUnit === "kg") {
      weightUnit = "g";
      weightSuffix.textContent = "g";
      unitToggle.textContent = "Switch to kilograms";
    } else {
      resetWeightUnit();
    }
  });

  weightInput.addEventListener("input", updateContinueState);

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("size", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    if (!continueButton.disabled) {
      navigate("choose-postage");
    }
  });

  return section;
});
