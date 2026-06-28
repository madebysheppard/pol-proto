import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";

registerScreen("contact-details", () => {
  const section = document.createElement("section");
  section.className = "screen screen--contact-details";
  section.innerHTML = `
    <header class="feature-header">
      <button type="button" class="feature-header__back" aria-label="Back">
        <span class="feature-header__back-icon" aria-hidden="true"></span>
      </button>
      <h1 class="feature-header__title">Checkout</h1>
    </header>

    <div class="contact-details-body">
      <div class="contact-details-form-inputs">
        <div class="contact-details-intro">
          <h2 class="contact-details-heading">Contact details</h2>
          <p class="contact-details-intro__body">
            Enter the contact details we should send your receipts and tracking details to
          </p>
        </div>

        <div class="contact-details-form">
          <div class="text-input-field">
            <label class="text-input-field__label" for="contact-first-name">First name</label>
            <div class="text-input-field__input-wrap">
              <input
                id="contact-first-name"
                class="text-input-field__input"
                type="text"
                autocomplete="given-name"
              />
            </div>
          </div>

          <div class="text-input-field">
            <label class="text-input-field__label" for="contact-last-name">Last name</label>
            <div class="text-input-field__input-wrap">
              <input
                id="contact-last-name"
                class="text-input-field__input"
                type="text"
                autocomplete="family-name"
              />
            </div>
          </div>

          <div class="text-input-field">
            <label class="text-input-field__label text-input-field__label--semibold" for="contact-email">
              Your email address
            </label>
            <div class="text-input-field__input-wrap">
              <input
                id="contact-email"
                class="text-input-field__input"
                type="email"
                autocomplete="email"
              />
            </div>
          </div>

          <div class="text-input-field">
            <div class="text-input-field__label-row">
              <label class="text-input-field__label text-input-field__label--semibold" for="contact-mobile">
                Your mobile number
              </label>
              <span class="text-input-field__optional">(optional)</span>
            </div>
            <div class="text-input-field__input-wrap">
              <input
                id="contact-mobile"
                class="text-input-field__input"
                type="tel"
                autocomplete="tel"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="contact-details-terms">
        <div class="checkbox-group">
          <div class="checkbox-option">
            <button
              type="button"
              class="form-checkbox"
              aria-pressed="false"
              aria-label="I confirm I have read and understood the Terms and Conditions"
            >
              <span class="form-checkbox__box" aria-hidden="true">
                <span class="form-checkbox__tick" aria-hidden="true"></span>
              </span>
            </button>
            <div class="checkbox-option__label">
              <p class="checkbox-option__text">
                I confirm I have read and understood the Terms and Conditions
              </p>
              <button type="button" class="link-button">Read terms and conditions</button>
              <p class="checkbox-option__text">
                By agreeing to the terms and conditions I have understood how my information will be used.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="contact-details-footer"></div>
  `;

  const footer = section.querySelector(".contact-details-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "disabled", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  const firstNameInput = section.querySelector("#contact-first-name");
  const lastNameInput = section.querySelector("#contact-last-name");
  const emailInput = section.querySelector("#contact-email");
  const checkbox = section.querySelector(".form-checkbox");

  const updateContinueState = () => {
    const hasRequiredFields =
      firstNameInput.value.trim().length > 0 &&
      lastNameInput.value.trim().length > 0 &&
      emailInput.value.trim().length > 0;
    const isTermsAccepted = checkbox.getAttribute("aria-pressed") === "true";
    continueButton.disabled = !(hasRequiredFields && isTermsAccepted);
  };

  firstNameInput.addEventListener("input", updateContinueState);
  lastNameInput.addEventListener("input", updateContinueState);
  emailInput.addEventListener("input", updateContinueState);

  checkbox.addEventListener("click", () => {
    const isChecked = checkbox.getAttribute("aria-pressed") === "true";
    checkbox.setAttribute("aria-pressed", String(!isChecked));
    checkbox.classList.toggle("form-checkbox--checked", !isChecked);
    updateContinueState();
  });

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("basket", { expanded: false }, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    if (!continueButton.disabled) {
      navigate("confirm-billing-information");
    }
  });

  return section;
});
