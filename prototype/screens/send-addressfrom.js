import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";

const options = [
  { id: "ews", label: "England, Wales or Scotland", checked: true },
  { id: "ni", label: "Northern Ireland", checked: false },
];

function radioOption(option, { showDivider = false } = {}) {
  return `
    <label class="radio-option">
      <input
        class="radio-option__input"
        type="radio"
        name="send-origin"
        value="${option.id}"
        ${option.checked ? "checked" : ""}
      />
      <span class="radio-control" aria-hidden="true">
        <span class="radio-control__dot"></span>
      </span>
      <span class="radio-option__label">${option.label}</span>
    </label>
    ${showDivider ? '<hr class="radio-divider" />' : ""}
  `;
}

registerScreen("send-addressfrom", () => {
  const section = document.createElement("section");
  section.className = "screen screen--send-addressfrom";
  section.innerHTML = `
    <header class="feature-header">
      <button type="button" class="feature-header__back" aria-label="Back">
        <span class="feature-header__back-icon" aria-hidden="true"></span>
      </button>
      <h1 class="feature-header__title">Send a parcel</h1>
    </header>

    <div class="progress-indicator" aria-hidden="true">
      <div class="progress-track">
        <div class="progress-track__indicator"></div>
      </div>
    </div>

    <div class="send-addressfrom-body">
      <div class="send-addressfrom-content">
        <div class="send-addressfrom-intro">
          <h2 class="send-addressfrom-heading">Where will you send your parcel from?</h2>

          <fieldset class="radio-group">
            <legend class="visually-hidden">Where will you send your parcel from?</legend>
            ${options
              .map((option, index) =>
                radioOption(option, { showDivider: index < options.length - 1 }),
              )
              .join("")}
          </fieldset>
        </div>
      </div>
    </div>

    <div class="send-addressfrom-footer"></div>
  `;

  const footer = section.querySelector(".send-addressfrom-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "default", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("home-populated", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    navigate("send");
  });

  return section;
});
