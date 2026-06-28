import { createButtonFromSpec } from "../components/button.js";
import { registerScreen, navigate } from "../utils/router.js";

const branches = [
  {
    distance: "0.6 miles",
    name: "Moorgare Post Office",
    address: "45 London Wall, EC2M 5TE",
    rows: [{ type: "open", hours: "08:00-18:30" }],
  },
  {
    distance: "0.6 miles",
    name: "Moorgare Post Office",
    address: "45 London Wall, EC2M 5TE",
    rows: [{ type: "open", hours: "08:00-18:30" }],
  },
  {
    distance: "0.6 miles",
    name: "Moorgare Post Office",
    address: "45 London Wall, EC2M 5TE",
    rows: [
      { type: "closed" },
      { type: "next", label: "Next opens tomorrow ", hours: "08:00-18:30" },
    ],
  },
  {
    distance: "0.6 miles",
    name: "Moorgare Post Office",
    address: "45 London Wall, EC2M 5TE",
    rows: [{ type: "open", hours: "08:00-18:30" }],
  },
];

function statusRow(row) {
  if (row.type === "open") {
    return `
      <div class="branch-status-row">
        <span class="branch-status-row__label branch-status-row__label--open">
          <span class="branch-status-row__dot branch-status-row__dot--open" aria-hidden="true"></span>
          Open today
        </span>
        <span class="branch-status-row__hours">${row.hours}</span>
      </div>
    `;
  }

  if (row.type === "closed") {
    return `
      <div class="branch-status-row">
        <span class="branch-status-row__label branch-status-row__label--closed">
          <span class="branch-status-row__dot branch-status-row__dot--closed" aria-hidden="true"></span>
          Closed
        </span>
      </div>
    `;
  }

  return `
    <div class="branch-status-row">
      <span class="branch-status-row__label">${row.label}</span>
      <span class="branch-status-row__hours">${row.hours}</span>
    </div>
  `;
}

function branchOption(branch, { showDivider = true } = {}) {
  return `
    <article class="branch-option">
      <p class="branch-option__distance">${branch.distance}</p>
      <div class="branch-option__details">
        <p class="branch-option__name">${branch.name}</p>
        <p class="branch-option__address">${branch.address}</p>
      </div>
      ${branch.rows.map((row) => statusRow(row)).join("")}
    </article>
    ${showDivider ? '<hr class="branch-divider" />' : ""}
  `;
}

registerScreen("drop-off", () => {
  const section = document.createElement("section");
  section.className = "screen screen--drop-off";
  section.innerHTML = `
    <header class="feature-header">
      <button type="button" class="feature-header__back" aria-label="Back">
        <span class="feature-header__back-icon" aria-hidden="true"></span>
      </button>
      <h1 class="feature-header__title">Drop-off location</h1>
    </header>

    <div class="progress-indicator" aria-hidden="true">
      <div class="progress-track">
        <div class="progress-track__indicator"></div>
      </div>
    </div>

    <div class="drop-off-body">
      <div class="drop-off-heading">
        <h2 class="drop-off-heading__title">Find a drop-off location</h2>
        <p class="drop-off-heading__text">
          Drop your parcel at any participating Post Office branch. There are thousands across the UK
        </p>
      </div>

      <h3 class="drop-off-subheading">Your nearest Post Office branches to ‘EC1M 3HE’</h3>

      <div class="branches-list">
        ${branches.map((branch) => branchOption(branch, { showDivider: true })).join("")}
      </div>

      <button type="button" class="link-button">Show more branches</button>
    </div>

    <div class="drop-off-footer"></div>
  `;

  const footer = section.querySelector(".drop-off-footer");
  const continueButton = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "default", size: "medium" },
    slots: { label: "Continue" },
    className: "btn--continue",
  });
  footer.appendChild(continueButton);

  section.querySelector(".feature-header__back").addEventListener("click", () => {
    navigate("home-populated", {}, { transition: "slide-back" });
  });

  continueButton.addEventListener("click", () => {
    navigate("home-populated");
  });

  return section;
});
