import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";
import { iconImg } from "../utils/assets.js";

const ROYAL_MAIL_LOGO_URL =
  "/Users/jacshe/.cursor/projects/Users-jacshe-dev-UT-260626/assets/provider-logo-08772a2d-0441-4586-8cf4-d2c6d78470d2.png";

const options = [
  {
    id: "tracked-48",
    provider: "Royal Mail",
    product: "Tracked 48",
    price: "£9.05",
    priceExVat: "£7.24 excl. VAT",
    arrival: "Estimated arrival in 2-3 days",
    benefits: ["Photo on delivery", "Up to £75 cover included"],
    compactBorder: false,
    benefitTone: "dark",
  },
  {
    id: "tracked-24",
    provider: "Royal Mail",
    product: "Tracked 24",
    price: "£10.25",
    priceExVat: "£8.20 excl. VAT",
    arrival: "Estimated arrival in 1–2 days",
    benefits: ["Photo on delivery", "Up to £75 cover included"],
    compactBorder: false,
    benefitTone: "dark",
  },
  {
    id: "tracked-48-signature",
    provider: "Royal Mail",
    product: "Tracked 48 with signature",
    price: "£10.65",
    priceExVat: "£8.52 excl. VAT",
    arrival: "Estimated arrival in 2-3 days",
    benefits: ["Photo and Signature on delivery", "Up to £75 compensation cover"],
    compactBorder: false,
    benefitTone: "primary",
  },
  {
    id: "tracked-24-signature",
    provider: "Royal Mail",
    product: "Tracked 24 with signature",
    price: "£11.85",
    priceExVat: "£9.48 excl. VAT",
    arrival: "Estimated arrival in 1–2 days",
    benefits: ["Photo and Signature on delivery", "Up to £75 compensation cover"],
    compactBorder: false,
    benefitTone: "primary",
  },
];

function postageOption(option) {
  const borderClass = option.compactBorder
    ? "postage-option--compact-border"
    : "postage-option--wide-border";
  const benefitClass =
    option.benefitTone === "primary"
      ? "postage-option__benefit-text"
      : "postage-option__benefit-text postage-option__benefit-text--dark";

  return `
    <div class="postage-option-wrap">
      <button
        type="button"
        class="postage-option ${borderClass}"
        data-value="${option.id}"
        aria-pressed="false"
      >
        <div class="postage-option__header">
          <img
            class="postage-option__logo"
            src="${ROYAL_MAIL_LOGO_URL}"
            alt=""
            width="51"
            height="34"
          />
        </div>

        <div class="postage-option__info">
          <div class="postage-option__row">
            <div class="postage-option__product">
              <span class="postage-option__provider">${option.provider}</span>
              <span class="postage-option__name">${option.product}</span>
            </div>
            <div class="postage-option__price">
              <span class="postage-option__price-main">${option.price}</span>
              <span class="postage-option__price-vat">${option.priceExVat}</span>
            </div>
          </div>

          <div class="postage-option__estimate">
            ${iconImg("van.svg", { className: "postage-option__van" })}
            <span class="postage-option__estimate-text">${option.arrival}</span>
          </div>
        </div>

        <ul class="postage-option__benefits">
          ${option.benefits
            .map(
              (benefit) => `
            <li class="postage-option__benefit">
              <span class="postage-option__check" aria-hidden="true"></span>
              <span class="${benefitClass}">${benefit}</span>
            </li>
          `
            )
            .join("")}
        </ul>
      </button>
    </div>
  `;
}

registerScreen("choose-postage", () => {
  const section = document.createElement("section");
  section.className = "screen screen--choose-postage";
  section.innerHTML = `
    <header class="feature-header">
      <button type="button" class="feature-header__back" aria-label="Back">
        <span class="feature-header__back-icon" aria-hidden="true"></span>
      </button>
      <h1 class="feature-header__title">Postage options</h1>
    </header>

    <div class="progress-indicator" aria-hidden="true">
      <div class="progress-track">
        <div class="progress-track__indicator"></div>
      </div>
    </div>

    <div class="choose-postage-body">
      <h2 class="choose-postage-heading">Select a delivery option</h2>

      <div class="postage-option-list" role="group" aria-label="Delivery options">
        ${options.map((option) => postageOption(option)).join("")}
      </div>
    </div>

    <div class="choose-postage-footer"></div>
  `;

  const footer = section.querySelector(".choose-postage-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "disabled", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  const optionWraps = section.querySelectorAll(".postage-option-wrap");
  const optionButtons = section.querySelectorAll(".postage-option");

  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      optionWraps.forEach((wrap) => {
        wrap.classList.remove("postage-option-wrap--selected");
      });

      optionButtons.forEach((item) => {
        item.setAttribute("aria-pressed", "false");
      });

      button.closest(".postage-option-wrap").classList.add("postage-option-wrap--selected");
      button.setAttribute("aria-pressed", "true");
      continueButton.disabled = false;
    });
  });

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("heavy", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    if (!continueButton.disabled) {
      navigate("compensation");
    }
  });

  return section;
});
