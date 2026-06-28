import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";

const ROYAL_MAIL_LOGO_URL =
  "/Users/jacshe/.cursor/projects/Users-jacshe-dev-UT-260626/assets/provider-logo-08772a2d-0441-4586-8cf4-d2c6d78470d2.png";

registerScreen("checkout", () => {
  const section = document.createElement("section");
  section.className = "screen screen--checkout";
  section.innerHTML = `
    <header class="feature-header">
      <button type="button" class="feature-header__back" aria-label="Back">
        <span class="feature-header__back-icon" aria-hidden="true"></span>
      </button>
      <h1 class="feature-header__title">Checkout</h1>
    </header>

    <div class="checkout-body">
      <div class="checkout-intro">
        <h2 class="checkout-heading">Checkout</h2>
        <p class="checkout-intro__subtitle">Review your order summary</p>
      </div>

      <div class="checkout-product">
        <div class="checkout-product__card">
          <img
            class="checkout-product__logo"
            src="${ROYAL_MAIL_LOGO_URL}"
            alt=""
            width="51"
            height="34"
          />

          <div class="checkout-product__details">
            <div class="checkout-product__row">
              <div class="checkout-product__label">
                <p class="checkout-product__provider">Royal Mail</p>
                <p class="checkout-product__name">Tracked 24 Medium</p>
              </div>

              <div class="checkout-product__price">
                <p class="checkout-product__price-main">£10.25</p>
                <p class="checkout-product__price-vat">£8.20 excl. VAT</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="checkout-summary" aria-labelledby="checkout-order-total">
        <h3 id="checkout-order-total" class="checkout-summary__title">Order total</h3>

        <div class="checkout-summary__row">
          <span class="checkout-summary__label">Subtotal</span>
          <span class="checkout-summary__value">£8.20</span>
        </div>

        <div class="checkout-summary__row">
          <span class="checkout-summary__label">VAT</span>
          <span class="checkout-summary__value">£2.05</span>
        </div>

        <hr class="checkout-summary__divider" />

        <div class="checkout-summary__row checkout-summary__row--total">
          <span class="checkout-summary__label">Total</span>
          <span class="checkout-summary__value">£10.25</span>
        </div>
      </section>

      <div class="checkout-info-banner">
        <span class="checkout-info-banner__icon" aria-hidden="true"></span>
        <p class="checkout-info-banner__text">
          Continue to payment to be redirected to our secure payment provider
        </p>
      </div>
    </div>

    <div class="checkout-footer"></div>
  `;

  const footer = section.querySelector(".checkout-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "default", size: "medium" },
    slots: { label: "Continue to payment" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("confirm-billing-information", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    navigate("payment");
  });

  return section;
});
