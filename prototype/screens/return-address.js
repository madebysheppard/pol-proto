import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";
import { getSelectedAddress, setSelectedAddress } from "../utils/address-selection.js";

registerScreen("return-address", ({ address = "" } = {}) => {
  const selectedAddress = address || getSelectedAddress("return");
  setSelectedAddress("return", selectedAddress);
  const section = document.createElement("section");
  section.className = "screen screen--return-address";
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

    <div class="return-address-body">
      <div class="return-address-content">
        <div class="return-address-heading-group">
          <h2 class="return-address-heading">Where should we return the parcel?</h2>
          <p class="return-address-lead">
            Tell us where to return your parcel to if it can\u2019t be delivered
          </p>
        </div>

        <div class="return-address-form">
          <div class="address-search-field">
            <label class="address-search-field__label" for="return-address-input">
              Return address
            </label>
            <p class="address-search-field__helper">
              Search for an address, street or postcode
            </p>
            <div class="address-search-field__focus-wrap">
              <input
                id="return-address-input"
                class="address-search-field__input"
                type="text"
                placeholder="Type to search..."
                autocomplete="off"
              />
            </div>
          </div>

          <button type="button" class="link-button">Enter address manually</button>
        </div>
      </div>
    </div>

    <div class="return-address-footer"></div>
  `;

  const footer = section.querySelector(".return-address-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "disabled", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  const input = section.querySelector(".address-search-field__input");

  input.value = selectedAddress;

  const updateContinueState = () => {
    continueButton.disabled = input.value.trim().length === 0;
    setSelectedAddress("return", input.value.trim());
  };

  updateContinueState();

  input.addEventListener("input", updateContinueState);

  input.addEventListener("focus", () => {
    navigate("address-drawer", {
      mode: "return",
      query: input.value,
      savedAddress: getSelectedAddress("return"),
    }, { transition: "sheet-up" });
  });

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("confirm-delivery-details", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    if (!continueButton.disabled) {
      navigate("return-details");
    }
  });

  return section;
});
