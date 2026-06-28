import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";
import { screenAsset } from "../utils/assets.js";

const ROYAL_MAIL_LOGO_URL =
  "/Users/jacshe/.cursor/projects/Users-jacshe-dev-UT-260626/assets/provider-logo-08772a2d-0441-4586-8cf4-d2c6d78470d2.png";

function statusBar() {
  return `
    <div class="status-bar" aria-hidden="true">
      <span class="status-bar__time">9:30</span>
      <span class="status-bar__camera"></span>
      <span class="status-bar__icons"></span>
    </div>
  `;
}

function successHeading() {
  return `
    <div class="order-confirmation-heading">
      <div class="order-confirmation-success-icon">
        <img
          class="order-confirmation-success-icon__illustration"
          src="${screenAsset("order-confirmation", "drop-off-80.png")}"
          alt=""
          width="80"
          height="80"
        />
        <span class="order-confirmation-success-icon__check" aria-hidden="true"></span>
      </div>
      <h1 class="order-confirmation-title">Payment successful. Your order’s confirmed</h1>
      <p class="order-confirmation-intro">
        Check your emails for your digital receipt, which includes your QR codes and labels
      </p>
    </div>
  `;
}

function orderCard({ expanded = false } = {}) {
  const expandedContent = expanded
    ? `
      <div class="order-confirmation-card__details">
        <section class="order-confirmation-card__section">
          <h3 class="order-confirmation-card__section-title">Item number</h3>
          <p class="order-confirmation-card__section-value">#1364838939</p>
        </section>

        <section class="order-confirmation-card__section">
          <h3 class="order-confirmation-card__section-title">Recipient</h3>
          <div class="order-confirmation-card__section-values">
            <p class="order-confirmation-card__section-value">Jack Stone</p>
            <p class="order-confirmation-card__section-value">Unit 315, Highgate Studios, NW5 1TL London</p>
            <p class="order-confirmation-card__section-value">jack.stone@postoffice.com</p>
            <p class="order-confirmation-card__section-value">07925000000</p>
          </div>
        </section>

        <section class="order-confirmation-card__section order-confirmation-card__section--cost">
          <h3 class="order-confirmation-card__section-title">Item cost</h3>
          <div class="order-confirmation-card__cost">
            <p class="order-confirmation-card__cost-main">£10.25</p>
            <p class="order-confirmation-card__cost-vat">£8.20 ex VAT</p>
          </div>
        </section>
      </div>
    `
    : "";

  return `
    <article class="order-confirmation-card${expanded ? " order-confirmation-card--expanded" : " order-confirmation-card--collapsed"}">
      <button type="button" class="order-confirmation-card__header" aria-expanded="${expanded}">
        <div class="order-confirmation-card__product">
          <img
            class="order-confirmation-card__logo"
            src="${ROYAL_MAIL_LOGO_URL}"
            alt=""
            width="40"
            height="26"
          />
          <p class="order-confirmation-card__name">Royal Mail Tracked 24</p>
        </div>

        <div class="order-confirmation-card__aside">
          <span class="order-confirmation-card__expand${expanded ? " order-confirmation-card__expand--expanded" : ""}" aria-hidden="true"></span>
          <p class="order-confirmation-card__price">£10.25</p>
        </div>
      </button>
      ${expandedContent}
    </article>
  `;
}

function whatNextSection() {
  return `
    <section class="order-confirmation-next">
      <h2 class="order-confirmation-section-title">What next?</h2>

      <div class="order-confirmation-next__row">
        <img
          class="order-confirmation-next__icon order-confirmation-next__icon--label"
          src="${screenAsset("order-confirmation", "label-printing-60.png")}"
          alt=""
          width="60"
          height="60"
        />
        <div class="order-confirmation-next__copy">
          <h3 class="order-confirmation-next__title">Choose who prints your labels</h3>
          <p class="order-confirmation-next__body">
            Print labels we’ve emailed to you at home, or bring your QR codes to branch and we’ll print them.
          </p>
        </div>
      </div>

      <div class="order-confirmation-next__row order-confirmation-next__row--counter">
        <img
          class="order-confirmation-next__icon order-confirmation-next__icon--counter"
          src="${screenAsset("order-confirmation", "counter-64.png")}"
          alt=""
          width="64"
          height="64"
        />
        <div class="order-confirmation-next__copy">
          <h3 class="order-confirmation-next__title">Drop your parcel off</h3>
          <p class="order-confirmation-next__body">
            Drop off parcels at any of thousands of participating Post Office branches
          </p>
        </div>
      </div>
    </section>
  `;
}

function infoBanner() {
  return `
    <div class="order-confirmation-info-banner" role="note">
      <span class="order-confirmation-info-banner__icon" aria-hidden="true"></span>
      <p class="order-confirmation-info-banner__text">
        You’ll have until end of 1st July to drop off your parcels
      </p>
    </div>
  `;
}

function footer() {
  return `
    <div class="order-confirmation-footer"></div>
  `;
}

function renderOrderConfirmationScreen({ expanded = false } = {}) {
  const section = document.createElement("section");
  section.className = `screen screen--order-confirmation${expanded ? " screen--order-confirmation-full-receipt" : ""}`;

  section.innerHTML = `
    ${statusBar()}
    <div class="order-confirmation-body">
      ${successHeading()}

      <section class="order-confirmation-order">
        <h2 class="order-confirmation-section-title">Your order</h2>
        ${orderCard({ expanded })}
      </section>

      ${whatNextSection()}
      ${infoBanner()}
    </div>
    ${footer()}
  `;

  const doneButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "default", size: "medium" },
    slots: { label: "I'm done for now" },
    className: "btn--done",
  });
  section.querySelector(".order-confirmation-footer").appendChild(doneButton);

  doneButton.addEventListener("click", () => {
    navigate("home-populated", {}, { transition: "slide-back" });
  });

  const cardHeader = section.querySelector(".order-confirmation-card__header");
  cardHeader.addEventListener("click", () => {
    navigate(expanded ? "confirmation" : "order-confirmation-full-receipt", {}, { transition: "fade" });
  });

  return section;
}

registerScreen("confirmation", () => renderOrderConfirmationScreen({ expanded: false }));

registerScreen("order-confirmation-full-receipt", () =>
  renderOrderConfirmationScreen({ expanded: true })
);
