import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";

registerScreen("recipient-details", () => {
  const section = document.createElement("section");
  section.className = "screen screen--recipient-details";
  section.innerHTML = `
    <header class="feature-header">
      <button type="button" class="feature-header__back" aria-label="Back">
        <span class="feature-header__back-icon" aria-hidden="true"></span>
      </button>
      <h1 class="feature-header__title">Delivery details</h1>
    </header>

    <div class="progress-indicator" aria-hidden="true">
      <div class="progress-track">
        <div class="progress-track__indicator"></div>
      </div>
    </div>

    <div class="recipient-details-body">
      <h2 class="recipient-details-heading">Who\u2019s receiving the parcel?</h2>

      <div class="recipient-details-form">
        <div class="text-input-field">
          <label class="text-input-field__label" for="recipient-first-name">First name</label>
          <div class="text-input-field__input-wrap">
            <input
              id="recipient-first-name"
              class="text-input-field__input"
              type="text"
              autocomplete="given-name"
            />
          </div>
        </div>

        <div class="text-input-field">
          <label class="text-input-field__label" for="recipient-last-name">Last name</label>
          <div class="text-input-field__input-wrap">
            <input
              id="recipient-last-name"
              class="text-input-field__input"
              type="text"
              autocomplete="family-name"
            />
          </div>
        </div>

        <div class="text-input-field">
          <div class="text-input-field__label-row">
            <label class="text-input-field__label" for="recipient-business-name">Business name</label>
            <span class="text-input-field__optional">(optional)</span>
          </div>
          <div class="text-input-field__input-wrap">
            <input
              id="recipient-business-name"
              class="text-input-field__input"
              type="text"
              autocomplete="organization"
            />
          </div>
        </div>

        <div class="text-input-field">
          <div class="text-input-field__label-row">
            <label class="text-input-field__label" for="recipient-email">Recipient\u2019s email address</label>
            <span class="text-input-field__optional">(optional)</span>
          </div>
          <div class="text-input-field__input-wrap">
            <input
              id="recipient-email"
              class="text-input-field__input"
              type="email"
              autocomplete="email"
            />
          </div>
        </div>

        <div class="text-input-field">
          <div class="text-input-field__label-row">
            <label class="text-input-field__label" for="recipient-phone">Recipient\u2019s phone number</label>
            <span class="text-input-field__optional">(optional)</span>
          </div>
          <div class="text-input-field__input-wrap">
            <input
              id="recipient-phone"
              class="text-input-field__input"
              type="tel"
              autocomplete="tel"
            />
          </div>
        </div>
      </div>

      <div class="info-alert" role="note">
        <div class="info-alert__content">
          <span class="info-alert__icon" aria-hidden="true"></span>
          <p class="info-alert__text">
            If you enter the recipient\u2019s email or phone number they\u2019ll also get tracking updates
          </p>
        </div>
      </div>
    </div>

    <div class="recipient-details-footer"></div>
  `;

  const footer = section.querySelector(".recipient-details-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "disabled", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  const firstNameInput = section.querySelector("#recipient-first-name");
  const lastNameInput = section.querySelector("#recipient-last-name");

  const updateContinueState = () => {
    const hasRequiredFields =
      firstNameInput.value.trim().length > 0 && lastNameInput.value.trim().length > 0;
    continueButton.disabled = !hasRequiredFields;
  };

  firstNameInput.addEventListener("input", updateContinueState);
  lastNameInput.addEventListener("input", updateContinueState);

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("delivery-address", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    if (!continueButton.disabled) {
      navigate("confirm-delivery-details");
    }
  });

  return section;
});
