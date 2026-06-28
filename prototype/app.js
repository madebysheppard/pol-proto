import { mountRouter } from "./utils/router.js";
import "./screens/index.js";
import "./screens/home.js";
import "./screens/home-populated.js";
import "./screens/qr-code.js";
import "./screens/drop-off.js";
import "./screens/send-addressfrom.js";
import "./screens/send-addressto.js";
import "./screens/size.js";
import "./screens/heavy.js";
import "./screens/choose-postage.js";
import "./screens/compensation.js";
import "./screens/delivery-address.js";
import "./screens/address-drawer.js";
import "./screens/confirm-delivery-details.js";
import "./screens/recipient-details.js";
import "./screens/return-details.js";
import "./screens/return-address.js";
import "./screens/confirm-return-details.js";
import "./screens/basket.js";
import "./screens/confirm-billing-information.js";
import "./screens/contact-details.js";
import "./screens/checkout.js";
import "./screens/checkout-payment-processing.js";
import "./screens/payment.js";
import "./screens/order-confirmation.js";
import "./screens/button-demo.js";
import "./screens/choice-button-demo.js";
import "./screens/form-fields-demo.js";

const app = document.getElementById("app");
const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]';

function markContinueFooters(root) {
  if (!root) {
    return;
  }

  const footers = root.querySelectorAll('.screen > [class$="-footer"]');
  footers.forEach((footer) => {
    const hasContinueButton = Boolean(footer.querySelector(".btn--continue"));
    footer.classList.toggle("screen-footer--continue", hasContinueButton);
  });
}

function updateViewportSurface(root) {
  const screen = root?.querySelector(".screen");
  const usesCanvasSurface = screen?.classList.contains("screen--home");
  const surface = usesCanvasSurface ? "canvas" : "raised";
  const themeColor = usesCanvasSurface ? "#f5f3f8" : "#ffffff";

  document.body.dataset.screenSurface = surface;

  const themeColorMeta = document.querySelector(THEME_COLOR_META_SELECTOR);
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", themeColor);
  }
}

mountRouter(app);
markContinueFooters(app);
updateViewportSurface(app);

const footerClassObserver = new MutationObserver(() => {
  markContinueFooters(app);
  updateViewportSurface(app);
});

footerClassObserver.observe(app, { childList: true, subtree: true });
