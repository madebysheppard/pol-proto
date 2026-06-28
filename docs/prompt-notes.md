# Prompt notes for screen-by-screen prototyping

This document is human guidance only. It contains no implementation rules — those live in [implement-screen.md](./implement-screen.md), [spec-contract.md](./spec-contract.md) and [visual-qa.md](./visual-qa.md). If you find yourself adding a "Cursor must…" rule here, it belongs in one of those documents instead.

All work follows [prototype-constitution.md](./prototype-constitution.md).

## Why prompts are minimal now

Project configuration ([project-config.md](./project-config.md)) and the specification ([spec-contract.md](./spec-contract.md)) together supply everything Cursor previously needed spelled out per prompt: the Figma file key, the screen's identity, its routing, and its interactions. A per-screen prompt should normally provide little more than a specification path — see [PERSCREEN.md](./PERSCREEN.md) for the template.

You do **not** need to provide a Figma link, a viewport, or an explicit navigation block per screen any more, unless `FIGMA_FILE_KEY` in `project-config.md` is still unresolved (in which case the task is blocked on configuration, not on your prompt).

## Screen ID convention

Use kebab-case matching the flow: `home`, `posting-options`, `parcel-details`, etc.

Register in `app.js` and route via `#<screen-id>`. Per [project-config.md](./project-config.md), this ID is normally derived automatically from the specification's `interactions[].route` (leading slash stripped) — you only need to give an explicit screen-ID override when that derivation would be wrong or ambiguous.

## What to provide per screen

| Input | Purpose |
|-------|---------|
| Exported spec JSON path | Everything structural: layout, tokens, interactions, routing, assets |
| Screen ID override | Only if the derived ID would be wrong |
| Notes | Anything not yet captured in Figma or the spec (e.g. final copy, moderation context) |

## Flow building (later)

After individual screens exist, a follow-up prompt can connect them if the specification's routing needs a human sanity-check:

```
Connect prototype flow:
- home → posting-options (tap "Send a parcel")
- posting-options → home (back)
- ...
```

Keep flow prompts separate from screen-build prompts. In the normal case, routing should already be resolvable from the specification per `spec-contract.md` — use this only to confirm or correct it, not as the primary source.

## Usability testing notes

- **Unmoderated:** Ensure all paths are reachable without hidden shortcuts; include a start screen and clear CTAs.
- **Moderated:** Optional debug panel or screen jumper can be added later in `app.js` for facilitator use.
- Prefer real `<button>` and `<a>` elements over div click handlers for accessibility during testing.

## Token and asset reminders

- CSS: `var(--surface-canvas)`, `var(--text-primary)`, `var(--spacing-stack-md)`, etc.
- JS paths: `import { assets, screenAsset } from "../utils/assets.js"`
- Regenerate tokens after `/tokens/` changes: `node scripts/generate-tokens.js`
- Folder paths themselves are defined in [project-config.md](./project-config.md), not here.
