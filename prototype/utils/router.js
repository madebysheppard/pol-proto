/**
 * Minimal hash router for screen-by-screen prototyping.
 * Screens register themselves; navigation uses location.hash.
 */

import { getProgressPct } from "./progress.js";

const DEFAULT_TRANSITION = "slide-forward";
const ALLOWED_TRANSITIONS = new Set([
  "slide-forward",
  "slide-back",
  "fade",
  "sheet-up",
  "sheet-down",
  "none",
]);

function normalizeTransition(transition) {
  if (ALLOWED_TRANSITIONS.has(transition)) {
    return transition;
  }
  return DEFAULT_TRANSITION;
}

export function createRouter({ defaultScreenId = "index" } = {}) {
  const screens = new Map();
  let currentParams = {};
  let pendingTransition = null;
  let hasRendered = false;
  let activeContainer = null;
  let hashListener = null;

  const getCurrentScreenId = () => {
    const id = window.location.hash.replace(/^#/, "") || defaultScreenId;
    return id;
  };

  const getCurrentParams = () => currentParams;

  const registerScreen = (id, render) => {
    screens.set(id, render);
  };

  const renderScreen = (container, id, render) => {
    container.innerHTML = "";

    if (render) {
      const screenEl = render(currentParams);
      container.appendChild(screenEl);
      const indicator = screenEl.querySelector(".progress-track__indicator");
      if (indicator) {
        const pct = getProgressPct(id);
        if (pct !== null) indicator.style.width = pct + "%";
      }
      return;
    }

    container.innerHTML = `
      <section class="screen-placeholder" data-screen="${id}">
        <p>Screen <strong>${id}</strong> is not registered yet.</p>
      </section>
    `;
  };

  const renderCurrent = async () => {
    if (!activeContainer) {
      return;
    }

    const id = getCurrentScreenId();
    const render = screens.get(id);
    const transition = hasRendered ? normalizeTransition(pendingTransition) : "none";
    pendingTransition = null;

    const renderNext = () => renderScreen(activeContainer, id, render);

    if (transition === "none" || !document.startViewTransition) {
      renderNext();
      hasRendered = true;
      return;
    }

    document.documentElement.setAttribute("data-transition", transition);
    try {
      const viewTransition = document.startViewTransition(renderNext);
      await viewTransition.finished;
    } finally {
      document.documentElement.removeAttribute("data-transition");
      hasRendered = true;
    }
  };

  /**
   * params are in-memory only (not encoded in the hash) — they do not
   * survive a manual reload, which is acceptable for this prototype.
   */
  const navigate = (id, params = {}, options = {}) => {
    currentParams = params;
    const sameScreen = getCurrentScreenId() === id;
    const transition =
      options.transition ?? (sameScreen ? "fade" : DEFAULT_TRANSITION);
    pendingTransition = normalizeTransition(transition);

    if (sameScreen) {
      renderCurrent();
    } else {
      window.location.hash = id;
    }
  };

  const mountRouter = (container) => {
    if (hashListener) {
      window.removeEventListener("hashchange", hashListener);
    }

    activeContainer = container;
    hasRendered = false;
    hashListener = () => {
      renderCurrent();
    };
    window.addEventListener("hashchange", hashListener);
    renderCurrent();

    return () => {
      if (hashListener) {
        window.removeEventListener("hashchange", hashListener);
      }
      hashListener = null;
      activeContainer = null;
    };
  };

  return {
    registerScreen,
    navigate,
    getCurrentScreenId,
    getCurrentParams,
    mountRouter,
  };
}

const defaultRouter = createRouter();

export const registerScreen = (...args) => defaultRouter.registerScreen(...args);
export const navigate = (...args) => defaultRouter.navigate(...args);
export const getCurrentScreenId = (...args) =>
  defaultRouter.getCurrentScreenId(...args);
export const getCurrentParams = (...args) =>
  defaultRouter.getCurrentParams(...args);
export const mountRouter = (...args) => defaultRouter.mountRouter(...args);
/**
 * @deprecated Use createRouter() for isolated router instances.
 */
export const router = defaultRouter;
