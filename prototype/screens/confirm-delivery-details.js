import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";

registerScreen("confirm-delivery-details", () => {
  const section = document.createElement("section");
  section.className = "screen screen--confirm-delivery-details";
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

    <div class="confirm-delivery-details-body">
      <h2 class="confirm-delivery-details-heading">Check the recipient\u2019s details</h2>

      <div class="confirm-delivery-details-content">
        <section class="details-playback">
          <h3 class="details-playback__title">Contact information</h3>

          <div class="details-playback__rows">
            <p class="details-playback__value">Jack Stone</p>
            <p class="details-playback__value">jack.stone@postoffice.com</p>
            <p class="details-playback__value">07925000000</p>
          </div>

          <button type="button" class="link-button link-button--edit-recipient">Edit recipient</button>
        </section>

        <section class="details-playback">
          <h3 class="details-playback__title">Address</h3>

          <div class="details-playback__rows details-playback__rows--address">
            <p class="details-playback__value details-playback__value--secondary">Unit 315</p>
            <p class="details-playback__value details-playback__value--secondary">53-79 Highgate Road</p>
            <p class="details-playback__value details-playback__value--secondary">London</p>
            <p class="details-playback__value details-playback__value--secondary">NW5 1TL</p>
          </div>

          <button type="button" class="link-button link-button--edit-address">Edit address</button>
        </section>
      </div>
    </div>

    <div class="confirm-delivery-details-footer"></div>
  `;

  const footer = section.querySelector(".confirm-delivery-details-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "default", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("delivery-address", {}, { transition: "slide-back" });
  });

  section.querySelector(".link-button--edit-recipient").addEventListener("click", () => {
    navigate("recipient-details", {}, { transition: "slide-back" });
  });

  section.querySelector(".link-button--edit-address").addEventListener("click", () => {
    navigate("delivery-address", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    navigate("return-details");
  });

  return section;
});
