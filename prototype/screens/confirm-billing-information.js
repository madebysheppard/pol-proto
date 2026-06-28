import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";

registerScreen("confirm-billing-information", () => {
  const section = document.createElement("section");
  section.className = "screen screen--confirm-billing-information";
  section.innerHTML = `
    <header class="feature-header">
      <button type="button" class="feature-header__back" aria-label="Back">
        <span class="feature-header__back-icon" aria-hidden="true"></span>
      </button>
      <h1 class="feature-header__title">Checkout</h1>
    </header>

    <div class="confirm-billing-information-body">
      <h2 class="confirm-billing-information-heading">Confirm billing information</h2>

      <div class="confirm-billing-information-content">
        <section class="details-playback">
          <h3 class="details-playback__title">Contact details</h3>

          <div class="details-playback__rows">
            <p class="details-playback__value details-playback__value--secondary">Liz Makes</p>
            <p class="details-playback__value details-playback__value--primary">liz.makes@postoffice.com</p>
            <p class="details-playback__value details-playback__value--primary">0795000000</p>
          </div>

          <button type="button" class="link-button link-button--edit-contact">Edit contact details</button>
        </section>

        <section class="details-playback">
          <h3 class="details-playback__title">Billing address</h3>

          <div class="details-playback__rows details-playback__rows--billing-address">
            <p class="details-playback__value details-playback__value--secondary">21 Farringdon Road</p>
            <p class="details-playback__value details-playback__value--secondary">London</p>
            <p class="details-playback__value details-playback__value--secondary">EC1M 3HE</p>
          </div>

          <button type="button" class="link-button link-button--edit-address">Edit billing address</button>
        </section>
      </div>

      <div class="confirm-billing-info-banner" role="note">
        <span class="confirm-billing-info-banner__icon" aria-hidden="true"></span>
        <p class="confirm-billing-info-banner__text">We’ve used your return address as the billing address</p>
        <p class="confirm-billing-info-banner__text">Check it’s correct before you continue as we’ll use it in your billing details</p>
      </div>
    </div>

    <div class="confirm-billing-information-footer"></div>
  `;

  const footer = section.querySelector(".confirm-billing-information-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "default", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("contact-details", {}, { transition: "slide-back" });
  });

  section.querySelector(".link-button--edit-contact").addEventListener("click", () => {
    navigate("contact-details", {}, { transition: "slide-back" });
  });

  section.querySelector(".link-button--edit-address").addEventListener("click", () => {
    navigate("address-drawer", { mode: "billing" }, { transition: "sheet-up" });
  });

  continueButton.addEventListener("click", () => {
    navigate("checkout");
  });

  return section;
});
