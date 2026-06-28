import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";
import { iconImg } from "../utils/assets.js";

const ROYAL_MAIL_LOGO_URL =
  "/Users/jacshe/.cursor/projects/Users-jacshe-dev-UT-260626/assets/provider-logo-08772a2d-0441-4586-8cf4-d2c6d78470d2.png";

registerScreen("basket", ({ expanded = false } = {}) => {
  let isExpanded = Boolean(expanded);

  const section = document.createElement("section");
  section.className = "screen screen--basket";
  section.innerHTML = `
    <header class="feature-header">
      <button type="button" class="feature-header__back" aria-label="Back">
        <span class="feature-header__back-icon" aria-hidden="true"></span>
      </button>
      <h1 class="feature-header__title">Basket</h1>
    </header>

    <div class="basket-body">
      <div class="basket-heading">
        <h2 class="basket-heading__title">Order summary</h2>
        <p class="basket-heading__summary">
          <span>1</span> items: Total <strong>£10.25</strong>
        </p>
      </div>

      <div class="basket-accordion">
        <article class="basket-card">
          <button type="button" class="basket-item-header" aria-expanded="${isExpanded}">
            <div class="basket-item-header__main">
              <div class="basket-item-header__product">
                <img
                  class="basket-item-header__logo"
                  src="${ROYAL_MAIL_LOGO_URL}"
                  alt=""
                  width="40"
                  height="26"
                />
                <p class="basket-item-header__name">Royal Mail Tracked 24</p>
              </div>

              <div class="basket-item-header__aside">
                <span class="basket-item-header__expand${isExpanded ? " basket-item-header__expand--expanded" : ""}" aria-hidden="true"></span>
                <div class="basket-item-header__price">
                  <p class="basket-item-header__price-main">£10.25</p>
                  <p class="basket-item-header__price-vat">£8.20 ex VAT</p>
                </div>
              </div>
            </div>
          </button>

          <div class="basket-item-details${isExpanded ? " basket-item-details--expanded" : ""}">
            <div class="basket-item-details__inner">
              <section class="basket-item-section basket-item-section--recipient">
                <h3 class="basket-item-section__title">Recipient</h3>
                <div class="basket-item-section__details">
                  <p class="basket-item-section__value">Jack Stone</p>
                  <p class="basket-item-section__value">Unit 315, Highgate Studios, NW5 1TL London</p>
                  <p class="basket-item-section__value">jack.stone@postoffice.com</p>
                  <p class="basket-item-section__value">07925000000</p>

                  <div class="basket-item-highlight">
                    <div class="basket-item-estimate">
                      ${iconImg("van.svg", { className: "basket-item-estimate__icon" })}
                      <span class="basket-item-estimate__text">Estimated arrival in 1–2 days</span>
                    </div>

                    <ul class="basket-item-benefits">
                      <li class="basket-item-benefit">
                        <span class="basket-item-benefit__check" aria-hidden="true"></span>
                        <span class="basket-item-benefit__text">Photo on delivery</span>
                      </li>
                      <li class="basket-item-benefit">
                        <span class="basket-item-benefit__check" aria-hidden="true"></span>
                        <span class="basket-item-benefit__text">Up to £75 cover included</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section class="basket-item-section">
                <h3 class="basket-item-section__title">Medium parcel</h3>
                <p class="basket-item-section__value">61cm x 46cm x 46cm, over 2kg</p>
              </section>

              <section class="basket-item-section">
                <h3 class="basket-item-section__title">Return details</h3>
                <div class="basket-item-section__details">
                  <p class="basket-item-section__value">Liz Makes</p>
                  <p class="basket-item-section__value">21 Farringdon Road, London, EC1M 3HE</p>
                </div>
              </section>

              <div class="basket-item-actions">
                <button type="button" class="link-button">Edit parcel</button>
                <button type="button" class="link-button">Delete parcel</button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="basket-footer"></div>
  `;

  const footer = section.querySelector(".basket-footer");
  const checkoutButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "default", size: "medium" },
    slots: { label: "Continue to checkout" },
    className: "btn--checkout",
  });
  footer.appendChild(checkoutButton);

  const headerBack = section.querySelector(".feature-header__back");
  const itemHeader = section.querySelector(".basket-item-header");
  const details = section.querySelector(".basket-item-details");
  const chevron = section.querySelector(".basket-item-header__expand");

  const setExpanded = (nextExpanded) => {
    isExpanded = Boolean(nextExpanded);
    itemHeader.setAttribute("aria-expanded", String(isExpanded));
    details.classList.toggle("basket-item-details--expanded", isExpanded);
    chevron.classList.toggle("basket-item-header__expand--expanded", isExpanded);
  };

  headerBack.addEventListener("click", () => {
    if (isExpanded) {
      setExpanded(false);
    } else {
      navigate("confirm-return-details", {}, { transition: "slide-back" });
    }
  });

  itemHeader.addEventListener("click", () => {
    setExpanded(!isExpanded);
  });

  checkoutButton.addEventListener("click", () => {
    navigate("checkout");
  });

  return section;
});
