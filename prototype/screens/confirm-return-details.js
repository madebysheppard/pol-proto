import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";

registerScreen("confirm-return-details", () => {
  const section = document.createElement("section");
  section.className = "screen screen--confirm-return-details";
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

    <div class="confirm-return-details-body">
      <h2 class="confirm-return-details-heading">Check the return details</h2>

      <div class="confirm-return-details-content">
        <section class="details-playback">
          <h3 class="details-playback__title">Who we\u2019ll return the parcel to</h3>

          <div class="details-playback__rows">
            <p class="details-playback__value">Liz Makes</p>
          </div>

          <button type="button" class="link-button link-button--edit-details">Edit details</button>
        </section>

        <section class="details-playback">
          <h3 class="details-playback__title">Where we\u2019ll return the parcel</h3>

          <div class="details-playback__rows details-playback__rows--return-address">
            <p class="details-playback__value details-playback__value--secondary">21 Farringdon Road</p>
            <p class="details-playback__value details-playback__value--secondary">London</p>
            <p class="details-playback__value details-playback__value--secondary">EC1M 3HE</p>
          </div>

          <button type="button" class="link-button link-button--edit-address">Edit return address</button>
        </section>
      </div>
    </div>

    <div class="confirm-return-details-footer"></div>
  `;

  const footer = section.querySelector(".confirm-return-details-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "default", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("return-details", {}, { transition: "slide-back" });
  });

  section.querySelector(".link-button--edit-details").addEventListener("click", () => {
    navigate("return-details", {}, { transition: "slide-back" });
  });

  section.querySelector(".link-button--edit-address").addEventListener("click", () => {
    navigate("return-address", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    navigate("basket", { expanded: false });
  });

  return section;
});
