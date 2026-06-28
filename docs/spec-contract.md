# Specification Contract

This document defines the required shape of exported specification JSON files in `SPEC_FOLDER` (see [project-config.md](./project-config.md)) and the behaviour required when a field is missing or ambiguous.

This contract is written against `schemaVersion: 2.0.0` (generator `xray-specs`), verified by direct inspection of 26 files in `/specs/`. If a file is encountered with a different `schemaVersion`, this contract MUST be re-verified before being relied on — it MUST NOT be assumed to still apply.

The specification is the canonical source for screen identity, routing, interactions and actions, per [prototype-constitution.md — Source of Truth](./prototype-constitution.md#source-of-truth). Figma and the Pattern Library remain canonical for appearance; this contract does not cover appearance.

---

## File-level fields

| Field | Required | Purpose | Failure behaviour |
|-------|----------|---------|--------------------|
| `schemaVersion` | Yes | Identifies the export format this contract was written against. | If absent or unrecognised, STOP — do not assume the rest of this contract applies. |
| `generator` | Yes | Identifies the exporter. | Informational; no failure behaviour. |
| `exportedAt` | Yes | Export timestamp. | Informational; no failure behaviour. |
| `source.fileKey` | No | Has been observed as `null` in every sampled export. MUST NOT be relied on as the Figma file key. | Use `FIGMA_FILE_KEY` from `project-config.md` instead. |
| `source.fileName` / `source.pageName` | No | Descriptive only. | None. |
| `capabilities` | No | Declares which optional features this export includes (e.g. `interactionsIncluded`, `assetsContracted`). | Cursor MAY use this to decide whether absence of `interactions`/`assets` below is expected or a genuine gap. |
| `tokens` | Yes | Token data for the export. | If absent, fall back to `/tokens` per `project-config.md`; do not block the screen on this alone. |
| `components` | Yes | Component metadata for the export. | Cross-reference with the Pattern Library; do not block the screen on this alone. |
| `screens` | Yes | Array of one or more screen objects (see below). Multiple screens per file have been observed — e.g. overlay/empty-state/filled-state variants of the same flow. | If empty or absent, STOP — there is nothing to implement. |

## Screen object fields (`screens[]`)

There is no `screenId` or `screenNodeId` field in any sampled export. Screen identity and Figma frame resolution work as follows:

| Field | Required | Purpose | Failure behaviour |
|-------|----------|---------|--------------------|
| `name` | Yes | The screen's identity. Used as the human-readable screen name and as the basis for Figma frame resolution (see below). | If absent, STOP — the screen cannot be identified. |
| `layout` | Yes | Layout data for the screen. | If absent, STOP. |
| `tree` | Yes | Array of node objects describing the screen's contents. Each entry has at minimum `kind` and `nodeId`; instances also carry `component`, `axisValues`, and `slots`. These are descendant node IDs, not a single frame-level node ID. | If absent or empty, STOP — there is nothing to implement. |
| `dimensions` | Yes | A `"<width> × <height>"` string for this specific screen. | If absent, STOP — see `project-config.md` — Default viewport for how this is used. |
| `assets` | No | Present only when the screen contains image-type elements. Absence is normal for text/control-only screens, not an error. See Assets below. | If present but empty, treat as no image assets. |
| `interactions` | No | Present only when the screen contains actionable elements. Absence is normal for static screens, not an error. See Interactions below. | If present but empty, treat as no interactions; do not invent any. |

### Figma frame resolution (no frame-level node ID is exported)

Because no field gives the screen's own frame node ID, Cursor MUST resolve the Figma frame for a screen by matching `name` against frame names within the file identified by `FIGMA_FILE_KEY`. If no frame matches `name` uniquely (zero matches, or more than one candidate), Cursor MUST stop and produce a Missing Information Report rather than guessing which frame is intended. This is a known gap relative to the project's original intent of resolving frames purely from a node ID, and MUST be flagged as such in any report that depends on it.

### Assets (`screens[].assets[]`)

Each entry has been observed with: `id`, `sourceNodeId`, `type`, `imageHash`, `intendedPath`, `alt`, `decorative`.

`intendedPath` has been observed as `null` in every sampled file — the export does not currently supply a resolved file path. Cursor MUST resolve each asset by matching `sourceNodeId` or `imageHash` against files already present under `IMAGE_FOLDER` / `ICON_FOLDER` / `ILLUSTRATION_FOLDER` (per `project-config.md`). If no existing file can be matched with confidence, Cursor MUST stop and report the asset as missing — it MUST NOT generate, substitute, or guess at the intended file.

### Interactions (`screens[].interactions[]`)

Each entry has been observed with up to four fields: `trigger`, `action`, `destinationId`, `route`.

| Field | Required | Notes |
|-------|----------|-------|
| `trigger` | Yes (when the entry exists) | e.g. `ON_CLICK`. |
| `action` | Yes (when the entry exists) | e.g. `navigate`. Non-navigation actions (e.g. expand/toggle) have been observed without `destinationId`/`route`. |
| `destinationId` | Conditional | A Figma node ID for the destination. Observed alongside `route` for navigation actions. |
| `route` | Conditional | A path string, e.g. `"/payment"`. Observed alongside `destinationId` for navigation actions. |

**Failure behaviour — this is the routing contract the project's zero-assumption policy depends on:**

- If `action` is `navigate` and **both** `destinationId` and `route` are absent (this has been observed in a real export), Cursor MUST stop and produce a Missing Information Report. Cursor MUST NOT invent a destination, and MUST NOT assume "back" or any other default behaviour.
- If `route` is present, Cursor MUST derive the candidate router screen ID by stripping the leading `/` (e.g. `/payment` → `payment`) per `project-config.md`. If no screen is registered under that ID, Cursor MUST stop and report rather than registering a new, unconfirmed screen.
- If `action` is present but unrecognised (neither `navigate` nor a previously confirmed non-navigation action), Cursor MUST stop and report rather than guessing the intended behaviour.

## Transitions

No sampled export under `schemaVersion: 2.0.0` includes transition metadata. Transitions MUST currently be treated as **not available**, not as an oversight to fill in. If a future export includes a `transitions` field, this contract MUST be updated before that field is relied on.

## Cross-reference

Failures of any kind described above MUST be recorded using the format defined in [missing-information.md](./missing-information.md). Conflicts between this contract's data and Figma's apparent visual intent MUST be recorded as a Design Conflict per [prototype-constitution.md](./prototype-constitution.md), not silently resolved in either direction.
