# HTML Prototype Project Constitution

This document defines the rules for this project. These instructions apply to **every future task** unless explicitly overridden.

For setup, tokens, assets, and screen workflow, see [prototype-setup.md](./prototype-setup.md). For per-screen prompt structure, see [prompt-notes.md](./prompt-notes.md).

---

## Documentation Map

Each document below owns exactly one concern. If a rule appears to be missing from this constitution, it has not been removed from the project — check the document that owns it before asking.

| Document | Owns |
|----------|------|
| `prototype-constitution.md` (this file) | Project principles, source hierarchy, zero-assumption policy, validation, required output. |
| `prototype-setup.md` | Directory structure, running locally, token generation, asset path conventions. |
| `project-config.md` | Canonical configuration values (Figma keys, folders, router, viewport). |
| `spec-contract.md` | The exported specification's required fields and failure behaviour. |
| `implement-screen.md` | The step-by-step implementation workflow for a single screen. |
| `visual-qa.md` | Post-implementation verification and the PASS/PASS WITH DIFFERENCES/BLOCKED outcome. |
| `missing-information.md` | The structure of the Missing Information Report. |
| `prompt-notes.md` | Human guidance for writing prompts; contains no implementation rules. |
| `PERSCREEN.md` | The reusable per-screen prompt template. |

---

## Objective

Build a high-fidelity interactive HTML prototype that reproduces the supplied Figma designs as accurately as possible.

The finished prototype will be used for moderated and unmoderated usability testing.

This is **not** a production application.

Optimise for:

- visual fidelity
- rapid iteration
- maintainability
- realistic interactions
- design accuracy

Do **not** optimise for production engineering patterns.

---

## Figma Pattern Library

The canonical component library for shared UI patterns is identified by `PATTERN_LIBRARY_FILE_KEY` in [project-config.md](./project-config.md).

Use this file for buttons, inputs, cards, navigation, and other reusable components. Match variants, states, and spacing as defined in the library. Do not invent component styles that contradict it.

---

## Source of Truth

This is the **only** source hierarchy for this project. No other document defines or restates this order — `implement-screen.md` references this section rather than repeating it.

Responsibility is separated by concern, not ranked as one flat list:

1. **Project configuration** ([project-config.md](./project-config.md)) — which file, folders and viewport apply. Read first, always.
2. **Specification JSON** ([spec-contract.md](./spec-contract.md)) — authoritative for screen identity, routing, interactions, actions and copy where present. Never overridden by Figma or instruction for these concerns.
3. **Figma screen frame** — authoritative for appearance: layout, spacing, sizing, alignment, typography, colour, imagery placement.
4. **Figma Pattern Library** — authoritative for reusable component appearance, variants and states.
5. **Existing project components** — authoritative for what has already been implemented; must be searched before building anything new.
6. **Existing project assets** — authoritative for which concrete files may be used.
7. **Design tokens** — authoritative for concrete values once appearance has been determined.
8. **Explicit user instruction** — lowest precedence for design decisions; may override process choices (e.g. which screen to build next).

If two sources disagree **within the same concern** (e.g. an apparent Figma prototype link contradicts the specification's `route`):

- The source that owns that concern wins, per the list above.
- The disagreement must still be reported as a Design Conflict — resolving it by precedence does not excuse leaving it unrecorded.
- Do not invent a compromise.

---

## Zero-Assumption Policy

Never invent design decisions.

If any property cannot be verified from the available inputs, stop implementing that element and produce a Missing Information Report per [missing-information.md](./missing-information.md).

Never infer:

- spacing
- sizing
- typography
- colours
- iconography
- imagery
- interaction behaviour
- animations
- copy
- accessibility changes
- responsive behaviour
- loading states
- error states
- routing destinations or back behaviour

If it cannot be verified, ask.

This is the single canonical list for this project. `implement-screen.md` does not maintain a separate copy.

---

## Existing Project

Before every task:

- inspect existing code
- reuse existing components
- reuse existing assets
- reuse existing utilities
- reuse existing routing

Never duplicate functionality.

Never recreate assets that already exist.

Never regenerate tokens unless requested.

---

## Design Tokens

Always use semantic tokens where available.

Never hardcode colours, typography, spacing or radius if a token exists.

See [prototype-setup.md — Tokens](./prototype-setup.md#tokens) for naming and regeneration.

---

## Assets

Only use assets contained within the project.

Never substitute icons.

Never generate placeholder artwork.

Never replace images.

If an asset is missing:

1. Stop.
2. Report the missing asset per [missing-information.md](./missing-information.md).

See [prototype-setup.md — Assets](./prototype-setup.md#assets) for path helpers and symlink layout.

---

## Components

Before creating a component:

1. Check the [Figma Pattern Library](#figma-pattern-library) for the canonical pattern.
2. Search for an existing prototype implementation under `prototype/components/` and `prototype/screens/`.
3. Reuse if appropriate.
4. Extend only if necessary.

Avoid duplicate implementations.

Every implementation MUST include a Component Audit (see [Required Output](#required-output)) recording which existing components were reused, which new reusable components were created, which parts were screen-only, and why.

---

## Screen Development

Screens are implemented one at a time.

Do not build future screens.

Do not anticipate future flows.

Do not add functionality that has not yet been requested.

---

## Scope Control

Only modify files required for the requested task.

Do not perform unrelated refactoring.

Do not rename files.

Do not reorganise the project.

Do not change architecture unless explicitly instructed.

---

## Code Quality

Produce readable HTML, CSS and JavaScript.

Avoid unnecessary abstraction.

Avoid unnecessary dependencies.

Prefer clarity over cleverness.

---

## Validation

Before completing any task verify:

- visual fidelity (against Figma)
- specification alignment (against the exported spec)
- token usage
- asset usage
- navigation and routing
- spacing
- typography
- component reuse

If confidence is below 100%, explain exactly why.

---

## Required Output

For every task provide:

| Section | Description |
|---------|-------------|
| **Files created** | New files added for the task |
| **Files modified** | Existing files changed |
| **Verification summary** | What was checked against configuration, specification, Figma, tokens, and assets |
| **Component Audit** | Existing components reused, new reusable components created, screen-only implementations, and reasoning |
| **Missing Information Report** | Required when any property could not be verified — see [missing-information.md](./missing-information.md) |
| **Design conflicts** | Required when sources disagree |
| **Confidence assessment** | Percentage and rationale if below 100% |
