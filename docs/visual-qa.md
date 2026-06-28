# Visual QA Standard

Every implemented screen must be reviewed before the task is considered complete.

This QA is mandatory.

---

# Objective

Verify that the implementation is equivalent to **both** the supplied Figma frame and the exported specification.

Figma is authoritative for appearance; the specification is authoritative for identity, routing and interactions — see [prototype-constitution.md — Source of Truth](./prototype-constitution.md#source-of-truth). A screen that matches Figma visually but does not implement the specification's routing, or vice versa, has not passed QA.

The review should compare the implementation against the design and the specification — not against assumptions.

---

# Review Categories

Verify each category individually.

## Layout

* Screen dimensions
* Positioning
* Alignment
* Container sizes

Status:

* Exact Match
* Verified Difference
* Blocked

---

## Spacing

Verify:

* margins
* padding
* gaps
* safe areas

---

## Typography

Verify:

* font family
* weight
* size
* line height
* letter spacing

---

## Colour

Verify:

* background
* text
* borders
* icons

Confirm all colours come from design tokens.

---

## Components

Verify:

* buttons
* cards
* inputs
* navigation
* reusable components

---

## Assets

Verify:

* images
* illustrations
* icons
* icons are not stretched or squashed in fixed-size boxes

Confirm project assets were reused, and that any new Figma icon was normalised per [prototype-setup.md — Figma icon exports](./prototype-setup.md#figma-icon-exports) rather than used as exported.

### Automated asset verification (required)

Before assigning a QA result, run:

```bash
node scripts/verify-screen-assets.js <screen-css-basename>
```

Example: for `prototype/styles/screens/send-addressto.css`, run `node scripts/verify-screen-assets.js send-addressto`.

The script MUST exit 0. Any failure is **BLOCKED** — do not assign PASS or PASS WITH DIFFERENCES until resolved.

Also run `node scripts/verify-screen-assets.js` (no argument) before merging project-wide asset or icon map changes — it checks all screen CSS files and every `FIGMA_ICONS` entry.

### CSS asset paths

Stylesheets under `prototype/styles/screens/` MUST reference assets as `url("../../assets/…")`. The path `url("../assets/…")` resolves to `prototype/styles/assets/` (which does not exist) and produces silently missing icons.

Prefer `figmaIcon()` / `iconImg()` from `utils/assets.js` in screen JavaScript for icons. Use CSS `mask-image` / `background-image` only when a token-based recolor is required; when you do, use the `../../assets/` prefix.

### Icon and typography inventory (required)

For the screen under review, produce a short checklist in the implementation report:

| Spec `tree` element | Figma component / style token | Implementation |
|---------------------|------------------------------|----------------|
| e.g. Header title | `typography/heading-large` | `.feature-header__title` tokens |
| e.g. Help_Outline | `Help_Outline` → `help-outline.svg` | visible at `#<screen-id>` |

Every icon row MUST be confirmed visible in the browser at the screen's hash route. Every typography row MUST map to the spec token — do not inherit global styles without checking (e.g. `.feature-header__title` in `drop-off.css`).

Fixable typography or missing-icon differences are **BLOCKED**, not PASS WITH DIFFERENCES.

---

## Interaction

Verify:

* navigation
* button behaviour
* scrolling
* clickable regions

---

## Routing

Verify against [spec-contract.md — Interactions](./spec-contract.md#interactions-screensinteractions):

* every `interactions[]` entry with `action: "navigate"` resolves to the screen ID derived from its `route`, per `project-config.md`
* the registered screen ID matches an existing `registerScreen(...)` call — not a newly invented one
* no interaction is implemented that does not appear in the specification
* no interaction present in the specification has been silently dropped

---

## Specification

Verify the implementation against `spec-contract.md`'s contract directly, not only against Figma's appearance:

* the screen's `tree` elements are all represented (no descendant silently omitted)
* `assets[]` entries are all resolved to an existing project file, or reported as missing
* the screen's `dimensions` (or the resolved project-wide viewport, once confirmed) has been used

---

## Missing Information

List every blocked item, using the structure defined in [missing-information.md](./missing-information.md). Do not redefine the report's structure here.

---

# QA Result

Assign one overall status.

## PASS

Every implemented property matches the supplied design.

## PASS WITH DIFFERENCES

Differences exist.

List every difference.

Explain why.

## BLOCKED

Implementation could not be verified.

List everything preventing completion.

---

# Confidence

100%

Every implemented property has been verified.

Anything below 100% requires justification.
