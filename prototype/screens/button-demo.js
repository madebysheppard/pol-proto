import { registerScreen } from "../utils/router.js";
import { createButtonFromSpec } from "../components/button.js";

registerScreen("button-demo", () => {
  const section = document.createElement("section");
  section.className = "screen screen--button-demo";

  section.innerHTML = `
    <div class="button-demo__intro">
      <h1 class="button-demo__title">Button</h1>
      <p class="button-demo__copy">Click the button to see interaction feedback.</p>
    </div>

    <div class="button-demo__stage">
      <p class="button-demo__status" aria-live="polite">Ready</p>
      <div class="button-demo__footer"></div>
    </div>
  `;

  const status = section.querySelector(".button-demo__status");
  const footer = section.querySelector(".button-demo__footer");

  const button = createButtonFromSpec({
    axisValues: { intent: "tertiary", iconPosition: "none", state: "default", size: "medium" },
    slots: { label: "Continue" },
  });

  footer.appendChild(button);

  let clickCount = 0;
  button.addEventListener("click", () => {
    clickCount += 1;
    status.textContent =
      clickCount === 1 ? "Clicked once" : `Clicked ${clickCount} times`;
  });

  return section;
});
