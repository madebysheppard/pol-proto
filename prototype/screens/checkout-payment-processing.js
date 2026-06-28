import { registerScreen, navigate } from "../utils/router.js";
import { assets, iconImg } from "../utils/assets.js";

/** Prototype flow: advance to confirmation when payment processing completes. */
const PAYMENT_PROCESSING_DELAY_MS = 3000;

registerScreen("checkout-payment-processing", () => {
  const section = document.createElement("section");
  section.className = "screen screen--checkout-payment-processing";
  section.innerHTML = `
    <div class="checkout-payment-processing-body">
      <img
        class="checkout-payment-processing__illustration"
        src="${assets.illustration("coins-stack-80.svg")}"
        alt=""
        width="80"
        height="80"
      />

      <div class="checkout-payment-processing-content">
        <h1 class="checkout-payment-processing__heading">Payment processing</h1>
        <p class="checkout-payment-processing__message">
          Please wait while we securely process your payment
        </p>
      </div>

      ${iconImg("spinner-round.svg", {
        size: 48,
        className: "checkout-payment-processing__spinner",
      })}
    </div>
  `;

  window.setTimeout(() => {
    navigate("confirmation", {}, { transition: "fade" });
  }, PAYMENT_PROCESSING_DELAY_MS);

  return section;
});
