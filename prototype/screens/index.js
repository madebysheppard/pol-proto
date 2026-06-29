import { registerScreen } from "../utils/router.js";

const SCREEN_IDS = [
  "home",
  "home-populated",
  "qr-code",
  "drop-off",
  "send-addressfrom",
  "send-addressto",
  "size",
  "heavy",
  "choose-postage",
  "compensation",
  "recipient-details",
  "delivery-address",
  "address-drawer",
  "confirm-delivery-details",
  "return-details",
  "return-address",
  "confirm-return-details",
  "basket",
  "confirm-billing-information",
  "contact-details",
  "checkout",
  "checkout-payment-processing",
  "payment",
  "order-confirmation",
  "button-demo",
  "choice-button-demo",
  "form-fields-demo",
];

function toTitle(screenId) {
  return screenId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

registerScreen("index", () => {
  const section = document.createElement("section");
  section.className = "screen screen--index";

  const links = SCREEN_IDS.map(
    (id) => `
      <li class="screen-index__item">
        <a class="screen-index__link" href="#${id}">${toTitle(id)}</a>
      </li>
    `,
  ).join("");

  section.innerHTML = `
    <main class="screen-index">
      <h1 class="screen-index__title">Prototype Screens</h1>
      <p class="screen-index__description">Select a screen to open it.</p>
      <ul class="screen-index__list">
        ${links}
      </ul>
    </main>
  `;

  return section;
});
