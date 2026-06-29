import { registerScreen, navigate } from "../utils/router.js";
import { getSelectedAddress, setSelectedAddress } from "../utils/address-selection.js";

const DELIVERY_POSTCODE_RESULTS = [
  {
    id: "nw5-1tl",
    type: "group",
    title: "NW5 1TL, London",
    subtitle: "17 Addresses",
  },
  {
    id: "nw5-1aa-1",
    type: "group",
    title: "NW5 1AA, London",
    subtitle: "17 Addresses",
  },
  {
    id: "po-34240",
    type: "plain",
    text: "Po Box 34240, London NW5 1WB",
  },
  {
    id: "po-34234",
    type: "plain",
    text: "Po Box 34234, London NW5 1YE",
  },
  ...Array.from({ length: 8 }, (_, index) => ({
    id: `nw5-1aa-${index + 2}`,
    type: "group",
    title: "NW5 1AA, London",
    subtitle: "17 Addresses",
  })),
];

const DELIVERY_ADDRESS_RESULTS = [
  "Highgate Childrens Centre Highgate Studios 53-79 Highgate Road, London NW51TL",
  "Unit 442, Highgate Studios 53-57 Highgate Road, London NW51TL",
  "Unit 431, Highgate Studios 53-57 Highgate Road, London NW51TL",
  "Unit 315, Highgate Studios 53-57 Highgate Road, London NW51TL",
  "Unit 605, Highgate Studios 53-57 Highgate Road, London NW51TL",
  "Unit 110, Highgate Studios 53-57 Highgate Road, London NW51TL",
  "Unit 325, Highgate Studios 53-57 Highgate Road, London NW51TL",
  "Unit 325, Highgate Studios 53-57 Highgate Road, London NW51TL",
  "Unit 325, Highgate Studios 53-57 Highgate Road, London NW51TL",
  "Unit 325, Highgate Studios 53-57 Highgate Road, London NW51TL",
];

const RETURN_POSTCODE_RESULTS = [
  {
    id: "ec1m",
    type: "group",
    title: "EC1M, London",
    subtitle: "17 Addresses",
  },
  {
    id: "ec1m-3he",
    type: "group",
    title: "EC1M 3HE, London",
    subtitle: "17 Addresses",
  },
  {
    id: "ec2m",
    type: "group",
    title: "EC2M, London",
    subtitle: "17 Addresses",
  },
  {
    id: "ec3m",
    type: "group",
    title: "EC3M, London",
    subtitle: "17 Addresses",
  },
  {
    id: "ec4m",
    type: "group",
    title: "EC4M, London",
    subtitle: "17 Addresses",
  },
  {
    id: "ec5m",
    type: "group",
    title: "EC5M, London",
    subtitle: "17 Addresses",
  },
  {
    id: "charterhouse-6ha",
    type: "plain",
    text: "Charterhouse Street, London EC1 6HA",
  },
  {
    id: "charterhouse-6hj",
    type: "plain",
    text: "Charterhouse Street, London EC1 6HJ",
  },
];

const RETURN_ADDRESS_RESULTS = [
  "11 Farringdon Road, London EC1M 3HE",
  "13 Farringdon Road, London EC1M 3HE",
  "15 Farringdon Road, London EC1M 3HE",
  "17 Farringdon Road, London EC1M 3HE",
  "19 Farringdon Road, London EC1M 3HE",
  "21 Farringdon Road, London EC1M 3HE",
  "23 Farringdon Road, London EC1M 3HE",
  "25 Farringdon Road, London EC1M 3HE",
  "27 Farringdon Road, London EC1M 3HE",
  "29 Farringdon Road, London EC1M 3HE",
];

const ADDRESS_DATA_BY_MODE = {
  delivery: {
    label: "Recipient\u2019s address",
    postcodeResults: DELIVERY_POSTCODE_RESULTS,
    addressResults: DELIVERY_ADDRESS_RESULTS,
    showMoreAddresses: true,
  },
  return: {
    label: "Return address",
    postcodeResults: RETURN_POSTCODE_RESULTS,
    addressResults: RETURN_ADDRESS_RESULTS,
    showMoreAddresses: true,
  },
};

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function postcodeResultRow(result) {
  if (result.type === "plain") {
    return `
      <button
        type="button"
        class="address-result-row address-result-row--plain address-result-row--selectable"
        data-address="${escapeHtml(result.text)}"
      >
        <p class="address-result-row__text">${result.text}</p>
      </button>
    `;
  }

  return `
    <button
      type="button"
      class="address-result-row address-result-row--group address-result-row--navigable"
      data-postcode-id="${result.id}"
    >
      <div class="address-result-row__content">
        <p class="address-result-row__title">${result.title}</p>
        <p class="address-result-row__subtitle">${result.subtitle}</p>
      </div>
      <span class="address-result-row__arrow" aria-hidden="true"></span>
    </button>
  `;
}

function addressResultRow(text) {
  return `
    <button
      type="button"
      class="address-result-row address-result-row--plain address-result-row--selectable"
      data-address="${escapeHtml(text)}"
    >
      <p class="address-result-row__text">${text}</p>
    </button>
  `;
}

function showMoreAddressesRow() {
  return `
    <div class="address-result-row address-result-row--show-more">
      <span class="address-result-row__arrow address-result-row__arrow--down" aria-hidden="true"></span>
      <p class="address-result-row__text">Show 65 more addresses</p>
    </div>
  `;
}

const CLOSE_TARGET_BY_MODE = {
  delivery: "delivery-address",
  return: "return-address",
  billing: "confirm-billing-information",
};

const SELECT_TARGET_BY_MODE = {
  delivery: "delivery-address",
  return: "return-address",
};

function renderBillingManualEntry() {
  return `
    <section class="screen screen--address-drawer screen--address-drawer-billing">
      <header class="address-drawer-header">
        <button type="button" class="address-drawer-header__close" aria-label="Close">
          <span class="address-drawer-header__close-icon" aria-hidden="true"></span>
        </button>
      </header>

      <div class="address-drawer-manual-panel">
        <h2 class="address-drawer-manual-heading">Billing address</h2>

        <div class="address-search-field">
          <label class="address-search-field__label" for="billing-address-search">
            Search for an address, street or postcode
          </label>
          <div class="address-search-field__focus-wrap">
            <input
              id="billing-address-search"
              class="address-search-field__input"
              type="text"
              placeholder="Type to search..."
              autocomplete="off"
            />
          </div>
        </div>

        <div class="text-input-field">
          <label class="text-input-field__label" for="billing-address-line1">Address line 1</label>
          <div class="text-input-field__input-wrap">
            <input
              id="billing-address-line1"
              class="text-input-field__input"
              type="text"
              value="21 Farringdon Road"
              autocomplete="address-line1"
            />
          </div>
        </div>

        <div class="text-input-field">
          <div class="text-input-field__label-row">
            <label class="text-input-field__label" for="billing-address-line2">Address line 2</label>
            <span class="text-input-field__optional">(optional)</span>
          </div>
          <div class="text-input-field__input-wrap">
            <input
              id="billing-address-line2"
              class="text-input-field__input"
              type="text"
              autocomplete="address-line2"
            />
          </div>
        </div>

        <div class="text-input-field">
          <label class="text-input-field__label" for="billing-address-town">Town or city</label>
          <div class="text-input-field__input-wrap">
            <input
              id="billing-address-town"
              class="text-input-field__input"
              type="text"
              value="London"
              autocomplete="address-level2"
            />
          </div>
        </div>

        <div class="text-input-field">
          <div class="text-input-field__label-row">
            <label class="text-input-field__label" for="billing-address-county">County</label>
            <span class="text-input-field__optional">(optional)</span>
          </div>
          <div class="text-input-field__input-wrap">
            <input
              id="billing-address-county"
              class="text-input-field__input"
              type="text"
              autocomplete="address-level1"
            />
          </div>
        </div>
      </div>

    </section>
  `;
}

function renderAddressDrawer(query = "", mode = "delivery") {
  const safeQuery = escapeHtml(query);
  const addressData = ADDRESS_DATA_BY_MODE[mode] || ADDRESS_DATA_BY_MODE.delivery;
  const moreAddressesRow = addressData.showMoreAddresses ? showMoreAddressesRow() : "";

  return `
    <section
      class="screen screen--address-drawer"
      data-state="search"
    >
      <header class="address-drawer-header">
        <button type="button" class="address-drawer-header__close" aria-label="Close">
          <span class="address-drawer-header__close-icon" aria-hidden="true"></span>
        </button>
      </header>

      <div class="address-drawer-search-panel">
        <div class="address-search-field address-search-field--focused">
          <label class="address-search-field__label" for="address-drawer-input">
            ${addressData.label}
          </label>
          <p class="address-search-field__helper">
            Search for an address, street or postcode
          </p>
          <div class="address-search-field__focus-wrap">
            <input
              id="address-drawer-input"
              class="address-search-field__input"
              type="text"
              value="${safeQuery}"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
        </div>

        <button type="button" class="link-button">Enter address manually</button>

        <div class="address-drawer-results address-drawer-results--postcode" hidden>
          <div class="address-list">
            ${addressData.postcodeResults.map(postcodeResultRow).join("")}
          </div>
        </div>

        <div class="address-drawer-address-panel" hidden>
          <div class="address-list">
            <button type="button" class="address-result-row address-result-row--back">
              <span class="address-result-row__arrow address-result-row__arrow--back" aria-hidden="true"></span>
              <span class="address-result-row__text">Back</span>
            </button>
            ${addressData.addressResults.map(addressResultRow).join("")}
            ${moreAddressesRow}
          </div>
        </div>
      </div>
    </section>
  `;
}

function resolveSearchState(query) {
  if (query.trim().length > 0) {
    return "postcode-results";
  }
  return "search";
}

function syncAddressDrawerView(container, state) {
  const section = container.querySelector(".screen--address-drawer");
  const postcodeResults = container.querySelector(".address-drawer-results--postcode");
  const addressPanel = container.querySelector(".address-drawer-address-panel");

  if (!section) {
    return;
  }

  section.dataset.state = state;
  postcodeResults.hidden = state !== "postcode-results";
  addressPanel.hidden = state !== "address-results";
}

function mountAddressDrawer(
  container,
  initialState = "search",
  initialQuery = "",
  mode = "delivery",
  savedAddress = "",
) {
  let state = initialState;

  const selectAddress = (address) => {
    setSelectedAddress(mode, address);
    const target = SELECT_TARGET_BY_MODE[mode];
    if (target) {
      navigate(target, { address }, { transition: "sheet-down" });
    }
  };

  if (mode === "billing") {
    container.innerHTML = renderBillingManualEntry();
    container.querySelector(".address-drawer-header__close").addEventListener("click", () => {
      navigate(CLOSE_TARGET_BY_MODE[mode], {}, { transition: "sheet-down" });
    });
    return container;
  }

  container.innerHTML = renderAddressDrawer(initialQuery, mode);
  const input = container.querySelector("#address-drawer-input");
  input.focus();

  const updateFromInput = () => {
    state = resolveSearchState(input.value);
    syncAddressDrawerView(container, state);
  };

  syncAddressDrawerView(container, state);

  input.addEventListener("input", updateFromInput);

  container.addEventListener("click", (event) => {
    if (event.target.closest(".address-drawer-header__close")) {
      const target = CLOSE_TARGET_BY_MODE[mode];
      navigate(target, { address: savedAddress }, { transition: "sheet-down" });
      return;
    }

    const postcodeButton = event.target.closest("[data-postcode-id]");
    if (postcodeButton) {
      state = "address-results";
      syncAddressDrawerView(container, state);
      return;
    }

    if (event.target.closest(".address-result-row--back")) {
      state = resolveSearchState(input.value);
      syncAddressDrawerView(container, state);
      input.focus();
      return;
    }

    const addressButton = event.target.closest("[data-address]");
    if (addressButton) {
      selectAddress(addressButton.dataset.address);
    }
  });

  return container;
}

registerScreen("address-drawer", ({ mode = "delivery", query = "", savedAddress = "" } = {}) => {
  const wrapper = document.createElement("div");
  const initialState = query.trim().length > 0 ? "postcode-results" : "search";
  mountAddressDrawer(wrapper, initialState, query, mode, savedAddress);
  return wrapper;
});
