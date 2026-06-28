# Missing Information Report

This document defines the single canonical structure for a Missing Information Report. Every other document that requires this report (`prototype-constitution.md`, `implement-screen.md`, `visual-qa.md`, `spec-contract.md`) MUST reference this document rather than redefining the report's structure.

A Missing Information Report MUST be produced whenever Cursor stops implementing a screen, or an element of a screen, because a required property cannot be verified from project configuration, the specification, Figma, the Pattern Library, existing components, existing assets, or design tokens. Producing this report is not optional and is not a substitute for asking — it is the documented record of having stopped rather than guessed.

---

## Configuration

List any project-level configuration value that is required but unresolved (see [project-config.md](./project-config.md)).

Example:

- `FIGMA_FILE_KEY` is not recorded in `project-config.md`; the screen frame for `<screen name>` could not be opened directly.

## Specification

List any required specification field that is missing, empty, or ambiguous, per [spec-contract.md](./spec-contract.md).

Example:

- `screens[0].tree` is empty in `prototype–<screen>.spec.json`; there is nothing to implement.
- `screens[0].name` does not match any frame in the Figma file identified by `FIGMA_FILE_KEY` (zero or multiple candidates).

## Assets

List any asset referenced by the specification that cannot be matched to an existing project file.

Example:

- `screens[0].assets[0]` has `intendedPath: null` and no file under `IMAGE_FOLDER` matches `sourceNodeId` `229:8061`.

## Routing

List any interaction whose destination cannot be resolved.

Example:

- `screens[0].interactions[0]` has `action: "navigate"` with no `destinationId` and no `route`.
- `screens[0].interactions[1]` has `route: "/checkout-summary"`, which does not match any screen registered in `prototype/utils/router.js`.

## Interactions

List any interaction whose `trigger`/`action` combination is not recognised, or whose behaviour cannot be confirmed from the specification alone (e.g. an overlay or back-navigation behaviour implied but not stated).

## Conflicts

List any disagreement between sources that own different concerns (see [prototype-constitution.md — Source of Truth](./prototype-constitution.md#source-of-truth)), even if precedence resolved which source was used.

Example:

- Specification `route` implies a destination Figma does not show a corresponding prototype link for.
- Figma frame shows a component variant that does not match the Pattern Library's defined states.

## Confidence

State a confidence percentage for the implementation as a whole, or for the specific element(s) this report concerns.

- **100%** — every required property was verified against its owning source; this report exists only to record assets/configuration that were out of scope, not appearance or behaviour uncertainty.
- **Below 100%** — state exactly which property is uncertain and why, per [prototype-constitution.md — Validation](./prototype-constitution.md#validation). A percentage without a stated reason is not acceptable.
