import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";
import { getSelectedAddress, setSelectedAddress } from "../utils/address-selection.js";

registerScreen("delivery-address", ({ address = "" } = {}) => {
  const selectedAddress = address || getSelectedAddress("delivery");
  setSelectedAddress("delivery", selectedAddress);

  const section = document.createElement("section");
  section.className = "screen screen--delivery-address";
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

    <div class="delivery-address-body">
      <h2 class="delivery-address-heading">Where's your parcel being sent to?</h2>

      <div class="delivery-address-form">
        <div class="address-search-field">
          <label class="address-search-field__label" for="delivery-address-input">
            Recipient\u2019s address
          </label>
          <p class="address-search-field__helper">
            Search for an address, street or postcode
          </p>
          <div class="address-search-field__focus-wrap">
            <input
              id="delivery-address-input"
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

    <div class="delivery-address-footer"></div>
  `;

  const footer = section.querySelector(".delivery-address-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "disabled", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  const input = section.querySelector(".address-search-field__input");

  input.value = selectedAddress;

  const updateContinueState = () => {
    const hasValue = input.value.trim().length > 0;
    continueButton.disabled = !hasValue;
    setSelectedAddress("delivery", input.value.trim());
  };

  updateContinueState();

  input.addEventListener("input", updateContinueState);

  input.addEventListener("focus", () => {
    navigate("address-drawer", {
      mode: "delivery",
      query: input.value,
      savedAddress: getSelectedAddress("delivery"),
    }, { transition: "sheet-up" });
  });

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("recipient-details", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    if (!continueButton.disabled) {
      navigate("confirm-delivery-details");
    }
  });

  return section;
});
