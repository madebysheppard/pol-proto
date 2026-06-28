import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";

const options = [
  { id: "ews", label: "England, Wales or Scotland", checked: true },
  { id: "iom", label: "Isle of Man", checked: false },
];

function radioOption(option, { showDivider = false } = {}) {
  return `
    <label class="radio-option">
      <input
        class="radio-option__input"
        type="radio"
        name="send-destination"
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

registerScreen("send", () => {
  const section = document.createElement("section");
  section.className = "screen screen--send-addressto";
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

    <div class="send-addressto-body">
      <div class="send-addressto-content">
        <div class="send-addressto-intro">
          <h2 class="send-addressto-heading">Where do you want to send your parcel to?</h2>

          <fieldset class="radio-group">
            <legend class="visually-hidden">Where do you want to send your parcel to?</legend>
            ${options
              .map((option, index) =>
                radioOption(option, { showDivider: index < options.length - 1 }),
              )
              .join("")}
          </fieldset>
        </div>

        <button type="button" class="info-tooltip">
          <span class="info-tooltip__icon" aria-hidden="true"></span>
          <span class="info-tooltip__text">
            Sending to Northern Ireland, the Channel Islands, or internationally?
          </span>
        </button>
      </div>
    </div>

    <div class="send-addressto-footer"></div>

    <div class="info-modal" hidden>
      <div class="info-modal__panel">
        <h2 class="info-modal__heading">
          Sending to Northern Ireland, the Channel Islands, or internationally?
        </h2>
        <p class="info-modal__body">
          You’ll need to complete a customs form, which can’t be done in this app yet. Visit the
          Post Office website or a branch to buy postage to these destinations
        </p>
      </div>
    </div>
  `;

  const footer = section.querySelector(".send-addressto-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "default", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  const closeButton = createButtonFromSpec({
    axisValues: { intent: "secondary", iconPosition: "none", state: "default", size: "medium" },
    slots: { label: "Close" },
    className: "info-modal__close",
  });
  section.querySelector(".info-modal__panel").appendChild(closeButton);

  const infoModal = section.querySelector(".info-modal");
  const modalPanel = section.querySelector(".info-modal__panel");
  const infoTooltip = section.querySelector(".info-tooltip");
  let closeTimer = null;

  const finishClose = () => {
    infoModal.hidden = true;
    infoModal.classList.remove("is-closing");
  };

  const openModal = () => {
    window.clearTimeout(closeTimer);
    infoModal.hidden = false;
    infoModal.classList.remove("is-closing");
    infoModal.classList.add("is-opening");
    infoTooltip.blur();
  };

  const closeModal = () => {
    if (infoModal.hidden) {
      return;
    }

    window.clearTimeout(closeTimer);
    infoModal.classList.remove("is-opening");
    infoModal.classList.add("is-closing");
    closeTimer = window.setTimeout(finishClose, 260);
  };

  modalPanel.addEventListener("animationend", (event) => {
    if (event.animationName !== "drawer-slide-down") {
      return;
    }

    window.clearTimeout(closeTimer);
    finishClose();
  });

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("send-addressfrom", {}, { transition: "slide-back" });
  });

  infoTooltip.addEventListener("click", () => {
    openModal();
  });

  closeButton.addEventListener("click", () => {
    closeModal();
  });

  infoModal.addEventListener("click", (event) => {
    if (event.target === infoModal) {
      closeModal();
    }
  });

  section.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  continueButton.addEventListener("click", () => {
    navigate("size");
  });

  return section;
});
