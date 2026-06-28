import { registerScreen, navigate } from "../utils/router.js";
import { logoImg } from "../utils/assets.js";

registerScreen("payment", () => {
  const section = document.createElement("section");
  section.className = "screen screen--payment";
  section.innerHTML = `
    <header class="feature-header">
      <button type="button" class="feature-header__back" aria-label="Back">
        <span class="feature-header__back-icon" aria-hidden="true"></span>
      </button>
      <h1 class="feature-header__title">Payment</h1>
    </header>

    <div class="payment-details-header">
      <h2 class="payment-details-header__title">Payment details </h2>
    </div>

    <div class="payment-body">
      <button type="button" class="payment-apple-pay">
        ${logoImg(
          { screen: "payment", file: "apple-pay-icon.svg" },
          { width: 18, height: 18, className: "payment-apple-pay__icon", alt: "" }
        )}
        <span class="payment-apple-pay__text">Pay</span>
      </button>

      <div class="payment-divider">
        ${logoImg(
          { screen: "payment", file: "divider.svg" },
          { width: 370, height: 16, className: "payment-divider__rule", alt: "" }
        )}
        <p class="payment-divider__label">Or pay with card</p>
      </div>

      <div class="payment-form">
        <div class="text-input-field">
          <div class="text-input-field__label-row">
            <label class="text-input-field__label" for="payment-card-number">Card Number</label>
            <div class="payment-badges" aria-hidden="true">
              ${logoImg({ screen: "payment", file: "amex.png" }, { width: 45, height: 30, className: "payment-badges__item" })}
              ${logoImg({ screen: "payment", file: "visa.png" }, { width: 45, height: 30, className: "payment-badges__item" })}
              ${logoImg({ screen: "payment", file: "mastercard.png" }, { width: 45, height: 30, className: "payment-badges__item" })}
            </div>
          </div>
          <div class="text-input-field__input-wrap">
            <input
              id="payment-card-number"
              class="text-input-field__input"
              type="text"
              inputmode="numeric"
              autocomplete="cc-number"
              placeholder="Card Number"
            />
          </div>
        </div>

        <div class="text-input-field">
          <label class="text-input-field__label" for="payment-expiry">Expiry </label>
          <div class="text-input-field__input-wrap">
            <input
              id="payment-expiry"
              class="text-input-field__input"
              type="text"
              inputmode="numeric"
              autocomplete="cc-exp"
              placeholder="MM/YY"
            />
          </div>
        </div>

        <div class="text-input-field">
          <label class="text-input-field__label" for="payment-security-code">Security code</label>
          <div class="text-input-field__input-wrap">
            <input
              id="payment-security-code"
              class="text-input-field__input"
              type="text"
              inputmode="numeric"
              autocomplete="cc-csc"
              placeholder="CVV"
            />
          </div>
        </div>

        <div class="text-input-field">
          <label class="text-input-field__label" for="payment-cardholder-name">Cardholder Name</label>
          <div class="text-input-field__input-wrap">
            <input
              id="payment-cardholder-name"
              class="text-input-field__input"
              type="text"
              autocomplete="cc-name"
              placeholder="Cardholder Name"
            />
          </div>
        </div>
      </div>

      <button type="button" class="btn btn--pay-now">PAY NOW</button>

      ${logoImg(
        { screen: "payment", file: "globalpayments-logo.png" },
        { width: 143, height: 62, className: "payment-secured-logo", alt: "" }
      )}
    </div>
  `;

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("checkout", {}, { transition: "slide-back" });
  });

  section.querySelector(".payment-apple-pay").addEventListener("click", () => {
    navigate("checkout-payment-processing", {}, { transition: "fade" });
  });

  section.querySelector(".btn--pay-now").addEventListener("click", () => {
    navigate("checkout-payment-processing", {}, { transition: "fade" });
  });

  return section;
});
