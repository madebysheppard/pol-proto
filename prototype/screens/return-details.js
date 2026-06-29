import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";

registerScreen("return-details", () => {
  const section = document.createElement("section");
  section.className = "screen screen--return-details";
  section.innerHTML = `
    <header class="feature-header">
      <button type="button" class="feature-header__back" aria-label="Back">
        <span class="feature-header__back-icon" aria-hidden="true"></span>
      </button>
      <h1 class="feature-header__title">Return details</h1>
    </header>

    <div class="progress-indicator" aria-hidden="true">
      <div class="progress-track">
        <div class="progress-track__indicator"></div>
      </div>
    </div>

    <div class="return-details-body">
      <div class="return-details-content">
        <div class="return-details-heading-group">
          <h2 class="return-details-heading">Who we’ll return the parcel to</h2>
          <p class="return-details-lead">
            Tell us who to return your parcel to if it can’t be delivered
          </p>
        </div>

        <div class="return-details-form">
          <div class="text-input-field">
            <label class="text-input-field__label" for="return-first-name">First name</label>
            <div class="text-input-field__input-wrap">
              <input
                id="return-first-name"
                class="text-input-field__input"
                type="text"
                autocomplete="given-name"
              />
            </div>
          </div>

          <div class="text-input-field">
            <label class="text-input-field__label" for="return-last-name">Last name</label>
            <div class="text-input-field__input-wrap">
              <input
                id="return-last-name"
                class="text-input-field__input"
                type="text"
                autocomplete="family-name"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="return-details-footer"></div>
  `;

  const footer = section.querySelector(".return-details-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "disabled", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  const firstNameInput = section.querySelector("#return-first-name");
  const lastNameInput = section.querySelector("#return-last-name");

  const updateContinueState = () => {
    const hasRequiredFields =
      firstNameInput.value.trim().length > 0 && lastNameInput.value.trim().length > 0;
    continueButton.disabled = !hasRequiredFields;
  };

  firstNameInput.addEventListener("input", updateContinueState);
  lastNameInput.addEventListener("input", updateContinueState);

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("confirm-delivery-details", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    if (!continueButton.disabled) {
      navigate("return-address");
    }
  });

  return section;
});
