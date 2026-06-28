# Prototype setup

This project contains design tokens, assets, and exported screen specs. The interactive HTML prototype lives in `/prototype` and is built screen-by-screen for usability testing.

**Project rules:** All work on this prototype follows [prototype-constitution.md](./prototype-constitution.md). Read it before every task.

**Canonical paths:** the folder paths below are documented here for context on what each folder contains. [project-config.md](./project-config.md) is the canonical source for the path values themselves (`TOKEN_FOLDER`, `IMAGE_FOLDER`, `ICON_FOLDER`, `ILLUSTRATION_FOLDER`, `FONT_FOLDER`, `SPEC_FOLDER`) — if a path ever changes, it is changed there first.

## What already exists

| Location | Contents |
|----------|----------|
| `/tokens/` | Design tokens (W3C format): `tokens.json` (combined export), plus legacy `primitives.json` / `semantic.json` |
| `/fonts/` | Nunito Sans (regular + italic), Post Office Digital HL |
| `/icons/` | SVG icon set (~50 files) |
| `/illustrations/` | SVG illustrations (~27 files) |
| `/images/` | Raster exports, including `/images/home/` for the home screen |
| `/specs/` | Exported screen specs (e.g. `prototype–home.spec.json`); shape defined in [spec-contract.md](./spec-contract.md) |

No framework or build tool was present — the prototype uses **plain HTML, CSS, and ES modules**.

## How to run locally

A local server is required (ES modules and spec loading need HTTP, not `file://`).

**Option A — Python (no install):**

```bash
cd /Users/jacshe/dev/UT-260626
python3 -m http.server 8080
```

Open [http://localhost:8080/prototype/](http://localhost:8080/prototype/)

**Option B — npx serve:**

```bash
npx --yes serve . -p 8080
```

Open [http://localhost:8080/prototype/](http://localhost:8080/prototype/)

You should see a “Prototype ready” page with brand colour swatches confirming tokens and fonts loaded.

## Directory structure

```
prototype/
  index.html          Entry point
  app.js              Registers screens and starts the router
  screens/            One module per screen (add here)
  components/         Reusable UI fragments shared across screens
  styles/
    base.css          Reset, font faces, global layout
    tokens.css        Generated CSS custom properties (do not edit by hand)
    components.css    Shared component styles
  assets/             Symlinks to project-root asset folders (no duplication)
    images/    → ../../images
    icons/     → ../../icons
    illustrations/ → ../../illustrations
    fonts/     → ../../fonts
  utils/
    assets.js         Path helpers for images, icons, illustrations, fonts
    router.js         Hash-based screen navigation
    specs.js          Fetch helpers for /specs JSON files

scripts/
  generate-tokens.js  Regenerates prototype/styles/tokens.css from /tokens

docs/
  prototype-constitution.md  Project rules for every task (read first)
  prototype-setup.md         This file
  project-config.md          Canonical configuration values
  spec-contract.md           Exported specification field contract
  implement-screen.md        Step-by-step implementation workflow
  visual-qa.md                Post-implementation verification standard
  missing-information.md     Missing Information Report structure
  prompt-notes.md            How to structure future screen prompts
  PERSCREEN.md               Reusable per-screen prompt template
```

## Tokens

Design tokens live in `/tokens/tokens.json` (combined primitives + semantic export) and are converted to CSS custom properties. The generator also accepts the legacy split files `primitives.json` and `semantic.json` if `tokens.json` is absent.

**Regenerate after token changes:**

```bash
node scripts/generate-tokens.js
```

**Naming:** Token path `surface.canvas` becomes `--surface-canvas`. Use in CSS:

```css
.card {
  background: var(--surface-raised);
  border-radius: var(--radius-md);
  padding: var(--spacing-density-md);
}
```

Semantic tokens (colours, spacing, typography, radius) are preferred over primitive tokens in screen CSS.

## Assets

Assets are **not copied** into the prototype. Symlinks in `prototype/assets/` point to the project-root folders.

**In JavaScript:**

```js
import { assets, screenAsset } from "../utils/assets.js";

assets.icon("chevron-up.svg");
assets.illustration("parcels-empty.svg");
figmaIcon("ArrowRight");
screenAsset("home", "nav_home.png");
```

**In HTML/CSS:**

```html
<img src="./assets/images/home/postage_hero.png" alt="" />
```

```css
/* From prototype/styles/screens/<screen>.css */
background-image: url("../../assets/icons/chevron-down.svg");

/* From prototype/styles/base.css */
background-image: url("../assets/icons/chevron-down.svg");
```

Paths are relative to the file referencing them. Screen stylesheets live one directory deeper than `base.css` and therefore need `../../assets/`, not `../assets/`.

After adding or changing screen CSS asset references:

```bash
node scripts/verify-screen-assets.js <screen-css-basename>
```

### Figma icon exports

Figma MCP exports can stretch in fixed-size boxes. After adding icons to `/icons/`:

```bash
node scripts/normalize-svg-icons.js
```

Use the safe render helpers in screen modules:

```js
import { figmaIcon, iconImg, logoImg } from "../utils/assets.js";

figmaIcon("ArrowRight"); // Figma component name → arrow-right.svg
figmaIcon("ArrowLeft");  // → arrow-back.svg
iconImg("van.svg");
logoImg({ screen: "choose-postage", file: "provider-logo.png" }, { width: 51, height: 34 });
```

Figma component names (e.g. `ArrowLeft`, `Check`, `Van`) map to shape-based filenames via `FIGMA_ICONS` in `utils/assets.js`. Spec JSON still uses Figma variant names like `Size=24` — those are component metadata, not file paths.

All `<img>` tags with explicit `width` and `height` get `object-fit: contain` via `base.css`.

## Screen specs

Exported specs in `/specs/` describe layout, tokens, interactions, and assets for individual screens. Load them at runtime:

```js
import { loadSpec } from "../utils/specs.js";

const spec = await loadSpec("prototype–home.spec.json");
```

When serving from the project root, specs are available at `/specs/…`.

## Adding a new screen

1. Create `prototype/screens/<screen-id>.js` that exports a render function or calls `registerScreen`.
2. Import and register it in `app.js`.
3. Add screen-specific styles to `styles/components.css` or a dedicated CSS file if needed.
4. Reference assets via `utils/assets.js` or direct paths under `./assets/`.
5. Navigate with `navigate("<screen-id>")` or `#<screen-id>` in the URL.

**Example screen module:**

```js
// prototype/screens/home.js
import { registerScreen, navigate } from "../utils/router.js";
import { screenAsset } from "../utils/assets.js";

registerScreen("home", () => {
  const el = document.createElement("section");
  el.className = "screen screen--home";
  el.innerHTML = `<img src="${screenAsset("home", "postage_hero.png")}" alt="" />`;
  return el;
});
```

```js
// In app.js — add:
import "./screens/home.js";
```

## Shared components

Place reusable fragments in `prototype/components/` (nav bars, buttons, cards). Import them from screen modules. Keep styles in `styles/components.css` unless a component is large enough to warrant its own file.

Every screen implementation must record which components were reused versus newly created — see the Component Audit requirement in [prototype-constitution.md — Components](./prototype-constitution.md#components). As of this revision, `prototype/components/` is empty despite 22 screens existing under `prototype/screens/`; this is a known gap, not an example to follow, and should be addressed by a future audit pass rather than assumed correct for new screens.

## Assumptions

- **Plain static site** — no bundler, no framework; fastest path for screen-by-screen iteration.
- **Hash routing** — `#home`, `#checkout`, etc.; sufficient for usability test flows without server-side routing.
- **Node for token generation only** — `generate-tokens.js` uses built-in modules; no `npm install` required.
- **Serve from project root** — so `/specs/` and `/prototype/` are both reachable.
- **Post Office / Royal Mail brand** — tokens and fonts match the existing design system export.
- **Mobile-first app shell** — future screens will likely target a phone viewport; base styles do not constrain width yet.

## Unresolved questions

- Target viewport for the app shell — tracked centrally in [project-config.md — Default viewport](./project-config.md#default-viewport); do not resolve this here.
- Whether screen specs will include resolved token values or require runtime mapping — current spec has partial token data.
- Icon and illustration assets use shape-based kebab-case filenames (e.g. `chevron-left.svg`, `parcels-empty.svg`).
