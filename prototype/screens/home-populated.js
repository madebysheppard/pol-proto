import { registerScreen, navigate } from "../utils/router.js";
import { figmaIcon, screenAsset } from "../utils/assets.js";

function roundButton(content, { iconOnly = false } = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `round-button${iconOnly ? " round-button--icon" : ""}`;
  button.innerHTML = content;
  return button;
}

function actionCard(label, intent) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `action-card action-card--${intent}`;
  card.innerHTML = `
    <span class="action-card__label">${label}</span>
    ${figmaIcon("ArrowRight", { size: 24, className: "action-card__arrow" })}
  `;
  return card;
}

function segmentedControl() {
  return `
    <div class="segmented-control" role="group" aria-label="Parcel type">
      <div class="segmented-control__track">
        <button type="button" class="segmented-control__option segmented-control__option--selected" aria-pressed="true">
          Drop-off
        </button>
        <button type="button" class="segmented-control__option" aria-pressed="false">
          Sent parcels
        </button>
      </div>
    </div>
  `;
}

function parcelCard() {
  return `
    <article class="parcel-card">
      <div class="parcel-card__body">
        <div class="parcel-card__details">
          <img
            class="parcel-card__provider"
            src="${screenAsset("home", "royal_mail_logo.png")}"
            alt=""
            width="56"
            height="37"
          />
          <div class="parcel-card__delivery">
            <p class="parcel-card__postcode">NW5 1TL</p>
            <p class="parcel-card__size">Medium parcel</p>
          </div>
          <div class="parcel-card__action" aria-hidden="true">
            ${figmaIcon("ArrowRight", { size: 24, className: "parcel-card__arrow" })}
          </div>
        </div>
        <p class="parcel-card__deadline">
          <span class="parcel-card__deadline-label">Drop off by 21 April</span>
        </p>
      </div>
    </article>
  `;
}

registerScreen("home-populated", () => {
  const section = document.createElement("section");
  section.className = "screen screen--home screen--home-populated";
  section.innerHTML = `
    <div class="status-bar" aria-hidden="true">
      <span class="status-bar__time">9:30</span>
      <span class="status-bar__camera"></span>
      <span class="status-bar__icons"></span>
    </div>

    <header class="header header--home">
      ${roundButton(figmaIcon("Settings", { size: 20 }), { iconOnly: true }).outerHTML}
      ${roundButton(figmaIcon("Cart", { size: 20 }), { iconOnly: true }).outerHTML}
    </header>

    <div class="app-container">
      <article class="marketing">
        <div class="marketing__content">
          <h2 class="marketing__heading">
            <span class="marketing__heading-accent">Buy postage<br />in-app and</span>
            <span class="marketing__heading-brand">drop-off to<br />a branch</span>
          </h2>
        </div>
        <div class="marketing__hero">
          <img src="${screenAsset("home", "postage_hero.png")}" alt="" />
        </div>
      </article>

      <div class="card-container">
        ${actionCard("Send a parcel", "tertiary").outerHTML}
        ${actionCard("Track a sent item", "secondary").outerHTML}
      </div>

      <div class="parcels-container">
        <h3 class="parcels-container__heading">Your parcels</h3>
        ${segmentedControl()}
        <div class="parcel-card-row">
          ${parcelCard()}
        </div>
      </div>
    </div>
  `;

  section.querySelector(".action-card--tertiary").addEventListener("click", () => {
    navigate("send-addressfrom");
  });

  section.querySelector(".parcel-card-row").addEventListener("click", () => {
    navigate("qr-code");
  });

  return section;
});
