# Implement Screen Standard

This document defines the implementation workflow for every prototype screen. These instructions apply to every screen unless explicitly overridden.

This document does not restate project principles, the source hierarchy, the zero-assumption "never infer" list, or the specification field contract — those are owned by [prototype-constitution.md](./prototype-constitution.md) and [spec-contract.md](./spec-contract.md) respectively. Read both before using this document.

---

## Objective

Implement exactly one screen from the supplied specification.

The implementation must reproduce the supplied design as accurately as possible.

This project is a design prototype, not a production application.

---

## Inputs

**Required:**

- Specification path (e.g. `specs/prototype–checkout.spec.json`)

**Optional:**

- Screen ID override (if the router ID should differ from the one derived per `project-config.md`)
- Implementation notes

A Figma link is **not** required input. Project configuration ([project-config.md](./project-config.md)) supplies `FIGMA_FILE_KEY`; the specification supplies the screen's `name` for frame resolution (see [spec-contract.md](./spec-contract.md)). A Figma link is only needed while `FIGMA_FILE_KEY` remains unresolved, in which case the task is blocked on configuration — report it rather than proceeding on a one-off URL.

---

## Implementation Sequence

Follow this sequence for every screen, in order:

1. Read [prototype-constitution.md](./prototype-constitution.md).
2. Read [project-config.md](./project-config.md).
3. Read the specification at the supplied path, validating it against [spec-contract.md](./spec-contract.md).
4. Extract screen identity (`screens[].name`).
5. Resolve the Figma frame by matching `name` within `FIGMA_FILE_KEY` (no frame-level node ID is exported — see `spec-contract.md`). Stop and report if no unique match is found.
6. Inspect the Figma Pattern Library (`PATTERN_LIBRARY_FILE_KEY`) for any component referenced in the screen's `tree`.
7. Search existing components (`prototype/components/`) and existing screens (`prototype/screens/`) for reusable implementations before writing anything new.
8. Extract routing from `screens[].interactions[]` per `spec-contract.md`'s failure rules. Stop and report any interaction whose destination cannot be resolved.
9. Implement only this screen.
10. Run [Visual QA](./visual-qa.md), including `node scripts/verify-screen-assets.js <screen-css-basename>` (must exit 0).
11. Produce the implementation report required by [prototype-constitution.md — Required Output](./prototype-constitution.md#required-output), including the Component Audit and, if applicable, a Missing Information Report per [missing-information.md](./missing-information.md).

Do not skip ahead to step 9 before steps 1–8 are complete, even if the screen appears simple.

---

# Zero-Assumption Policy

Do not infer missing information. If any property cannot be verified, stop implementing that element and report it per [missing-information.md](./missing-information.md).

The full list of properties that must never be guessed is defined once, in [prototype-constitution.md — Zero-Assumption Policy](./prototype-constitution.md#zero-assumption-policy). This document does not maintain a second copy of that list.

---

# Implementation Rules

Implement only the requested screen.

Do not implement future screens.

Do not create additional flows.

Do not perform unrelated refactoring.

Reuse existing:

* components
* assets
* utilities
* router
* styling

Only create new code where necessary.

---

# Design Fidelity

The implementation should be visually indistinguishable from Figma.

Match:

* spacing
* layout
* sizing
* alignment
* typography
* colours
* borders
* radius
* shadows
* imagery
* icons
* scroll behaviour

Do not improve the design.

Do not simplify the design.

---

# Design Tokens

Always use semantic tokens.

Never hardcode values where tokens exist.

---

# Assets

Use only project assets.

Never replace or recreate assets.

If an asset is missing, report it per [missing-information.md](./missing-information.md). Asset resolution rules (matching `sourceNodeId`/`imageHash` against existing files) are defined in [spec-contract.md — Assets](./spec-contract.md#assets-screensassets).

**Icons:** prefer `figmaIcon()` / `iconImg()` in the screen module (`utils/assets.js`). CSS `url(...)` references from `prototype/styles/screens/` MUST use the `../../assets/` prefix — see [visual-qa.md — CSS asset paths](./visual-qa.md#css-asset-paths).

**Existing screens:** if a screen module already exists, treat it as unverified until Visual QA (including `verify-screen-assets.js`) passes for the current specification — do not assume prior work is correct.

Figma icon normalisation (saving under `/icons/`, running `node scripts/normalize-svg-icons.js`, rendering via `iconImg()`/`logoImg()`) is defined once, in [prototype-setup.md — Figma icon exports](./prototype-setup.md#figma-icon-exports). This document does not repeat those steps.

---

# Navigation

Implement only the navigation explicitly present in the specification, resolved per [spec-contract.md — Interactions](./spec-contract.md#interactions-screensinteractions).

Do not anticipate future flows.

Do not invent routing, node IDs, or back behaviour.

---

# Output

After implementation, produce the report required by [prototype-constitution.md — Required Output](./prototype-constitution.md#required-output):

* Files created
* Files modified
* Verification summary
* Component Audit
* Missing Information Report (if applicable)
* Design conflicts (if applicable)
* Confidence assessment

Do not consider the task complete until [Visual QA](./visual-qa.md) has returned PASS or PASS WITH DIFFERENCES with every difference explained.
