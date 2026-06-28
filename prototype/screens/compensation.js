import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";

registerScreen("compensation", () => {
  const section = document.createElement("section");
  section.className = "screen screen--compensation";
  section.innerHTML = `
    <header class="feature-header">
      <button type="button" class="feature-header__back" aria-label="Back">
        <span class="feature-header__back-icon" aria-hidden="true"></span>
      </button>
      <h1 class="feature-header__title">Compensation</h1>
    </header>

    <div class="progress-indicator" aria-hidden="true">
      <div class="progress-track">
        <div class="progress-track__indicator"></div>
      </div>
    </div>

    <div class="compensation-body">
      <h2 class="compensation-heading">Compensation cover</h2>

      <div class="info-alert">
        <div class="info-alert__content">
          <span class="info-alert__icon" aria-hidden="true"></span>
          <p class="info-alert__text">
            Your chosen postage option covers your parcel up to £75
          </p>
        </div>
        <button type="button" class="link-button">Check items we don’t cover</button>
      </div>

      <div class="compensation-content">
        <p class="compensation-info">
          If you need more cover, visit the Post Office website or one of our branches for other posting options
        </p>

        <div class="checkbox-group">
          <div class="checkbox-option">
            <button
              type="button"
              class="form-checkbox"
              aria-pressed="false"
              aria-label="I confirm my parcel complies with sending restrictions and doesn't contain prohibited items"
            >
              <span class="form-checkbox__box" aria-hidden="true">
                <span class="form-checkbox__tick" aria-hidden="true"></span>
              </span>
            </button>
            <div class="checkbox-option__label">
              <p class="checkbox-option__text">
                I confirm my parcel complies with sending restrictions and doesn't contain prohibited items
              </p>
              <button type="button" class="link-button link-button--block">
                Check prohibited and restricted items list
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="compensation-footer"></div>
  `;

  const footer = section.querySelector(".compensation-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "disabled", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  const checkbox = section.querySelector(".form-checkbox");

  const updateContinueState = () => {
    const isChecked = checkbox.getAttribute("aria-pressed") === "true";
    continueButton.disabled = !isChecked;
  };

  checkbox.addEventListener("click", () => {
    const isChecked = checkbox.getAttribute("aria-pressed") === "true";
    checkbox.setAttribute("aria-pressed", String(!isChecked));
    checkbox.classList.toggle("form-checkbox--checked", !isChecked);
    updateContinueState();
  });

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("choose-postage", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    if (!continueButton.disabled) {
      navigate("delivery-address");
    }
  });

  return section;
});
