# Project Configuration

This document is the single canonical source for project-level configuration. Cursor MUST read this document before reading the specification or Figma for any screen. No other document in `docs/` MAY restate these values — if a value needs to change, it is changed here only.

---

## Figma

| Key | Value | Status |
|-----|-------|--------|
| `FIGMA_FILE_KEY` | `b3ce7t98y32D7vCLdJ1fOy` |
| `PATTERN_LIBRARY_FILE_KEY` | `NhsYcHAlPhYHoh3ts7366N` | Confirmed (from existing Pattern Library link below). |

**Pattern Library file:** [WIP PO Pattern Library](https://www.figma.com/design/NhsYcHAlPhYHoh3ts7366N/-WIP-PO--Pattern-Library?node-id=878-13)

Cursor MUST use `PATTERN_LIBRARY_FILE_KEY` for shared component lookup and MUST use `FIGMA_FILE_KEY` for screen frame resolution. Cursor MUST NOT use the Pattern Library file as a substitute for the main screens file, and MUST NOT use a per-prompt Figma URL when both keys are present here — a URL is only required while `FIGMA_FILE_KEY` remains unresolved.

## Specification

| Key | Value |
|-----|-------|
| `SPEC_FOLDER` | `/specs` |

Exported screen specifications live under `SPEC_FOLDER` as `prototype–<screen>.spec.json`. See [spec-contract.md](./spec-contract.md) for the required shape of these files. As of the current export set, files are written against `schemaVersion: 2.0.0` (generator `xray-specs`); if a newer schema version is observed, `spec-contract.md` MUST be re-verified before being trusted.

## Assets and tokens

| Key | Value |
|-----|-------|
| `TOKEN_FOLDER` | `/tokens` |
| `IMAGE_FOLDER` | `/images` |
| `ICON_FOLDER` | `/icons` |
| `ILLUSTRATION_FOLDER` | `/illustrations` |
| `FONT_FOLDER` | `/fonts` |

See [prototype-setup.md](./prototype-setup.md) for how these folders map into `prototype/assets/` and for path-helper usage.

## Routing and screen location

| Key | Value |
|-----|-------|
| `ROUTER` | Hash-based (`prototype/utils/router.js`); screens are registered with a plain ID and navigated via `#<screen-id>` |
| `SCREEN_MODULE_FOLDER` | `prototype/screens/` |
| `SHARED_COMPONENT_FOLDER` | `prototype/components/` |

Specification interactions express navigation as a `route` value such as `"/payment"`. The router registers plain IDs such as `payment`. Cursor MUST derive the candidate screen ID by removing the leading `/` from `route`. If the resulting ID has no matching `registerScreen(...)` call, Cursor MUST stop and produce a Missing Information Report rather than registering a new, unconfirmed screen ID — see [spec-contract.md](./spec-contract.md) and [missing-information.md](./missing-information.md).

## Default viewport

**Status: unresolved — do not treat any single value below as settled.**

Three different figures exist in the project today:

- `prototype-setup.md` previously listed the viewport as an open question.
- `402 × 874` has been observed in at least one real export (`specs/prototype–checkout.spec.json`).
- Other screens in `/specs/` carry their own `dimensions` value, which is not necessarily identical across screens.

Until confirmed otherwise, Cursor MUST take `dimensions` from the specification of the screen being implemented, on a per-screen basis, rather than relying on a single project-wide constant. If a fixed app-shell viewport is later confirmed, this section MUST be updated to state it as `DEFAULT_VIEWPORT` and this paragraph MUST be removed.

## Open items

- `FIGMA_FILE_KEY` for the main screens file has not been recorded anywhere in the project's documentation. Cursor MUST NOT guess it. Until it is supplied, any task requiring direct Figma frame inspection MUST be treated as blocked on configuration and reported via [missing-information.md](./missing-information.md).
- Default viewport is unresolved (see above).
