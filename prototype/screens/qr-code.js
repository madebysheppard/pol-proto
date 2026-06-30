import { registerScreen, navigate } from "../utils/router.js";
import { assets, figmaIcon, screenAsset } from "../utils/assets.js";

const QR_IMAGE_URL = assets.image("qr-code.png");
const PROVIDER_LOGO_URL = screenAsset("home", "royal_mail_logo.png");
const SCALE_ICON_URL =
  "https://www.figma.com/api/mcp/asset/8e564014-b292-4cb6-b4fb-636d263dfd0a";
const TAPE_ICON_URL =
  "https://www.figma.com/api/mcp/asset/4d302ac8-db86-4a8c-a476-24cc6f716e44";

const QR_ENTRIES = [
  {
    code: "098765432109",
    heading: "Ready for drop off before 22 April",
    postcode: "NW5 1TL",
    service: "Royal Mail Tracked 24",
    itemNumber: "#1364838940",
    weightLabel: "Medium parcel",
    weightValue: "1.2kg",
    dimensions: "61 x 46 x 46 cm",
    maxWeight: "20kg",
    recipient: ["Sam Greene", "42 Parkway", "London", "NW1 7AA"],
  },
  {
    code: "012345678910",
    heading: "Ready for drop off before 21 April",
    postcode: "NW5 1TL",
    service: "Royal Mail Tracked 24",
    itemNumber: "#1364838939",
    weightLabel: "Small parcel",
    weightValue: "0.7kg",
    dimensions: "45 x 35 x 16 cm",
    maxWeight: "2kg",
    recipient: ["Jack Stone", "Unit 315, Highgate Studios", "London", "NW5 1TL"],
  },
];

function qrCard(entry) {
  return `
    <article class="qr-card">
      <div class="qr-card__header">
        <img class="qr-card__provider-logo" src="${PROVIDER_LOGO_URL}" alt="" width="33" height="22" />
        <p class="qr-card__service">Royal Mail Tracked 24</p>
      </div>
      <div class="qr-card__body">
        <img class="qr-card__image" src="${QR_IMAGE_URL}" alt="" width="200" height="198" />
        <p class="qr-card__id">${entry.code}</p>
      </div>
    </article>
  `;
}

function parcelDetailsCard(entry) {
  return `
    <article class="details-card">
      <div class="details-card__top">
        <img class="details-card__provider-logo" src="${PROVIDER_LOGO_URL}" alt="" width="33" height="22" />
        <div class="details-card__delivery">
          <p class="details-card__postcode">${entry.postcode}</p>
          <p class="details-card__service">${entry.service}</p>
        </div>
      </div>
      <div class="details-card__body">
        <div class="details-card__row">
          <p class="details-card__label">Item number</p>
          <p class="details-card__value">${entry.itemNumber}</p>
        </div>
        <div class="details-card__row">
          <p class="details-card__label">Your parcel weight</p>
          <div class="details-card__split">
            <p class="details-card__value">${entry.weightLabel}</p>
            <p class="details-card__value details-card__value--icon">
              <img src="${SCALE_ICON_URL}" alt="" width="16" height="16" />
              <span>${entry.weightValue}</span>
            </p>
          </div>
        </div>
        <div class="details-card__row">
          <p class="details-card__label">Maximum dimensions</p>
          <div class="details-card__split">
            <p class="details-card__value details-card__value--icon">
              <img src="${TAPE_ICON_URL}" alt="" width="16" height="16" />
              <span>${entry.dimensions}</span>
            </p>
            <p class="details-card__value details-card__value--icon">
              <img src="${SCALE_ICON_URL}" alt="" width="16" height="16" />
              <span>${entry.maxWeight}</span>
            </p>
          </div>
        </div>
        <div class="details-card__row">
          <p class="details-card__label">Recipient</p>
          <p class="details-card__value">
            ${entry.recipient.join("<br />")}
          </p>
        </div>
      </div>
    </article>
  `;
}

registerScreen("qr-code", () => {
  const section = document.createElement("section");
  section.className = "screen screen--qr-code";
  section.innerHTML = `
    <header class="qr-app-bar">
      <button type="button" class="qr-app-bar__back" aria-label="Back to home">
        <span class="qr-app-bar__back-icon" aria-hidden="true">
          ${figmaIcon("ArrowRight", { size: 24 })}
        </span>
      </button>
      <div class="qr-app-bar__title" aria-hidden="true"></div>
    </header>

    <div class="qr-pager qr-pager--top">
      <p class="qr-pager__text">Showing 1 of ${QR_ENTRIES.length}</p>
      <div class="qr-pager__dots" aria-hidden="true">
        <span class="qr-pager__dot qr-pager__dot--active" data-dot-index="0"></span>
        <span class="qr-pager__dot" data-dot-index="1"></span>
      </div>
    </div>

    <div class="qr-content">
      <div class="qr-carousel" aria-label="QR codes">
        <div class="qr-carousel__track">
          ${QR_ENTRIES.map(
            (entry) => `
              <section class="qr-slide">
                <section class="qr-hero">
                  <h1 class="qr-hero__title">${entry.heading}</h1>
                  <div class="qr-hero__card-wrap">
                    ${qrCard(entry)}
                  </div>
                </section>
                <section class="qr-details">
                  ${parcelDetailsCard(entry)}
                </section>
                <button type="button" class="qr-help">
                  <span class="qr-help__icon" aria-hidden="true"></span>
                  <span>Get help with this parcel</span>
                </button>
              </section>
            `,
          ).join("")}
        </div>
      </div>
    </div>
  `;

  section.querySelector(".qr-app-bar__back").addEventListener("click", () => {
    navigate("home-populated", {}, { transition: "slide-back" });
  });

  const track = section.querySelector(".qr-carousel__track");
  const pagerText = section.querySelector(".qr-pager__text");
  const dots = [...section.querySelectorAll(".qr-pager__dot")];
  let currentIndex = 0;
  let touchStartX = 0;
  const threshold = 40;

  function setIndex(nextIndex) {
    const bounded = Math.max(0, Math.min(nextIndex, QR_ENTRIES.length - 1));
    currentIndex = bounded;
    track.style.transform = `translateX(-${bounded * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("qr-pager__dot--active", i === bounded);
    });
    pagerText.textContent = `Showing ${bounded + 1} of ${QR_ENTRIES.length}`;
  }

  track.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true },
  );

  track.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      if (deltaX <= -threshold) {
        setIndex(currentIndex + 1);
      } else if (deltaX >= threshold) {
        setIndex(currentIndex - 1);
      }
    },
    { passive: true },
  );

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => setIndex(i));
  });

  return section;
});
