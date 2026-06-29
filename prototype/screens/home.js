import { registerScreen, navigate } from "../utils/router.js";
import { assets, figmaIcon, screenAsset } from "../utils/assets.js";

function roundButton(content, { iconOnly = false, ariaLabel, action } = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `round-button${iconOnly ? " round-button--icon" : ""}`;
  button.innerHTML = content;
  if (ariaLabel) {
    button.setAttribute("aria-label", ariaLabel);
  }
  if (action) {
    button.dataset.action = action;
  }
  return button;
}

function actionCard(label, intent) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `action-card action-card--${intent}`;
  card.innerHTML = `
    <span class="action-card__label">${label}</span>
    ${figmaIcon("ArrowRight", { className: "action-card__arrow" })}
  `;
  return card;
}

registerScreen("home", () => {
  const section = document.createElement("section");
  section.className = "screen screen--home";
  section.innerHTML = `
    <header class="header header--home">
      ${roundButton(
        `<img src="${screenAsset("home", "settings.png")}" alt="" width="20" height="20" />`,
        { iconOnly: true, ariaLabel: "Page select", action: "open-index" },
      ).outerHTML}
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
        <div class="parcels-empty">
          <img
            class="parcels-empty__illustration"
            src="${assets.illustration("parcels-empty.svg")}"
            alt=""
            width="120"
            height="120"
          />
          <p class="parcels-empty__text">
            You don’t have any parcels to drop off or collect.<br />
            When you send a parcel, you can find your QR codes here.
          </p>
        </div>
      </div>
    </div>
  `;

  section.querySelector(".action-card--tertiary").addEventListener("click", () => {
    navigate("send-addressfrom");
  });

  section.querySelector('[data-action="open-index"]')?.addEventListener("click", () => {
    navigate("index");
  });

  return section;
});
