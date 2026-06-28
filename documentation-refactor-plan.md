# Documentation Refactoring Plan — AI-Driven HTML Prototype Project

Status: **Planning report only. No documentation files have been modified.**

Scope reviewed: `docs/prototype-constitution.md`, `docs/prototype-setup.md`, `docs/implement-screen.md`, `docs/visual-qa.md`, `docs/prompt-notes.md`, `docs/PERSCREEN.md`, plus a brief inspection of `/specs/*.spec.json`, `/prototype/app.js`, `/prototype/utils/router.js` and `/prototype/components/` to verify claims against real project data rather than assumption.

A material finding precedes the requested structure because it changes how the plan should be sequenced: a nested directory **`docs/docs/`** already exists, containing nine files with identical timestamps (2026-06-26 14:23:26) — draft, RFC-style skeletons of `prototype-constitution.md`, `prototype-setup.md`, `implement-screen.md`, `visual-qa.md`, `prompt-notes.md`, `PERSCREEN.md`, and, critically, the three *new* target files the brief asks for: `project-config.md`, `spec-contract.md`, and `missing-information.md`. These are not duplicates of the canonical `docs/*.md` files — they are shorter, MUST/MUST NOT-style rewrites with placeholder values (e.g. `FIGMA_FILE_KEY=<replace>`). This is addressed in §8 (Open Questions) and folded into Phase 0 of the plan, but it materially affects scope: a first-pass draft of the target state may already exist and should not be silently overwritten or ignored.

---

## 1. Current Documentation Summary

**`prototype-constitution.md`** — The project's standing rule set. Covers objective, the Figma Pattern Library link, a six-level source-of-truth hierarchy, the zero-assumption policy (with a "never infer" list), existing-project reuse rules, token policy, asset policy, component-reuse process, one-screen-at-a-time scope control, code quality, validation, and a required-output table. This is currently the project's most authoritative document and is treated as such by the other files.

**`prototype-setup.md`** — Project setup and layout reference. Covers what already exists on disk (`/tokens`, `/fonts`, `/icons`, `/illustrations`, `/images`, `/specs`), how to run the static server locally, the `prototype/` directory structure, token generation and naming, asset symlink conventions and helper functions, screen-spec loading, the steps for adding a new screen, a note on shared components, a list of working assumptions, and a list of unresolved questions (including viewport, which remains undecided here).

**`implement-screen.md`** — A second, overlapping implementation standard. Defines inputs, a *separate* source-priority order, a *separate* zero-assumption "never guess" list, pre-coding verification, implementation rules, design-fidelity matching criteria, token policy, asset policy (including a verbatim repeat of the Figma icon normalisation steps), navigation scope, and required output.

**`visual-qa.md`** — The mandatory post-implementation QA standard. Defines review categories (layout, spacing, typography, colour, components, assets, interaction, missing information), three QA outcomes (PASS / PASS WITH DIFFERENCES / BLOCKED), and a confidence statement requirement.

**`prompt-notes.md`** — Human-facing guidance for writing per-screen prompts. Contains a verbose recommended prompt template (Figma link, spec path, viewport, notes, acceptance checklist), screen-ID conventions, a "what to provide" table, an eight-step "what the agent should do" workflow, flow-building guidance, usability-testing notes, and token/asset reminders.

**`PERSCREEN.md`** — The current reusable per-screen prompt template. Asks for screen ID, a Figma link, a specification file, and an explicit navigation block, and lists seven implementation requirements. It references `docs/project-constitution.md`, which does not exist (the real file is `prototype-constitution.md`) — a broken cross-reference in the document Cursor is meant to follow on every screen.

---

## 2. Gap Analysis

**Duplicated instructions**

- The zero-assumption "never infer / never guess" list appears, in two non-identical forms, in both `prototype-constitution.md` and `implement-screen.md`. The two lists do not match item-for-item (e.g. `implement-screen.md` adds shadows, border radius, icons and illustrations; `prototype-constitution.md` adds accessibility changes, loading states and error states). Maintaining two divergent copies of the same policy is a correctness risk.
- The Figma icon normalisation procedure (`node scripts/normalize-svg-icons.js`, use `iconImg()`/`logoImg()`, stretching caveat) is written out in full in both `prototype-setup.md` ("Figma icon exports") and `implement-screen.md` ("Figma icon exports").
- The "required output" set (files created/modified, verification summary, missing-information report, confidence assessment) is defined in `prototype-constitution.md`, redefined with different wording in `implement-screen.md`, and referenced a third time, partially, in `PERSCREEN.md`.
- The implementation workflow ("read the constitution → inspect Figma/spec → build → register in app.js → don't touch tokens/assets") is described in full in `prompt-notes.md` ("What the agent should do") and again, differently scoped, in `implement-screen.md` ("Before Coding" / "Implementation Rules").
- Per-screen input requirements (screen ID, Figma link, spec, navigation, notes) are listed independently in `implement-screen.md`, `prompt-notes.md`, and `PERSCREEN.md`, with no single document owning the definition.

**Contradictory instructions**

- **Source hierarchy conflict (significant).** `prototype-constitution.md` defines six levels: Figma frame → Pattern Library → existing assets → existing tokens → exported specification → explicit instructions. `implement-screen.md` defines five levels: Figma frame → existing assets → existing tokens → exported specification → explicit instructions — it omits the Pattern Library entirely and ranks specification differently. Both documents claim to be authoritative for "source priority." This directly contradicts the brief's intent that the specification become the canonical implementation contract for identity, routing and interactions: under both current hierarchies, specification sits below assets and tokens, with no field-level carve-out stating that routing/interaction/identity data must come *only* from the specification regardless of general priority order.
- **Broken cross-reference.** `PERSCREEN.md` instructs Cursor to follow `docs/project-constitution.md`, which does not exist on disk. Any Cursor session following this prompt literally will fail to locate the file or will silently fall back to guessing which document was meant — itself a zero-assumption violation triggered by the documentation's own error.
- **Component governance vs reality.** `prototype-setup.md` states that reusable fragments belong in `prototype/components/`. Inspection of the repository shows `prototype/components/` is empty despite 22 screens already being implemented under `prototype/screens/`. The documentation describes a component-reuse discipline that is not evidenced in the current codebase, meaning either component extraction has not happened or shared markup has been duplicated per screen. The current docs have no mechanism (e.g. a Component Audit) that would have caught this.

**Missing canonical configuration**

- No document defines a single `FIGMA_FILE_KEY` for the main design file. `prototype-constitution.md` hardcodes a Pattern Library URL (with its own file key) inline in prose — this is the *pattern library's* key, not the screens file's key, and embedding it as a markdown link rather than a config value means it cannot be referenced programmatically or updated in one place.
- No document defines the specification folder, asset folders, token folder, or default viewport as named configuration values. `prototype-setup.md` lists these as prose facts under "What already exists," which is descriptive documentation, not canonical configuration Cursor can read deterministically.
- `prototype-setup.md`'s own "Unresolved questions" section says the target viewport is undecided. The draft `docs/docs/project-config.md` asserts `DEFAULT_VIEWPORT=390x844` as a fact. Neither is confirmed against real data: inspection of `specs/prototype–checkout.spec.json` shows `dimensions: "402 × 874"` for that screen — a different figure from both. This is flagged in §8 and must not be silently resolved by this refactor.

**Missing spec contract rules**

- No current document defines the exported specification's JSON shape, required fields, or per-field failure behaviour. `implement-screen.md` says "read the exported specification" but never states what must be present in it.
- Direct inspection of `specs/prototype–checkout.spec.json` shows the real top-level screen object has the keys `name`, `layout`, `tree`, `dimensions`, `assets`, `interactions` — there is no `screenId` or `screenNodeId` field. Per-element Figma node IDs exist only inside `tree[].nodeId`, and navigation targets are expressed as `interactions[].destinationId` (a node ID) plus `interactions[].route` (a path string, e.g. `"/payment"`). The draft `docs/docs/spec-contract.md` (see §8) assumes fields called `screenId`, `screenNodeId` and `routes`, none of which exist in the real export. Any spec contract written against the brief's assumed field names, without verification against real exports, will be wrong on day one.
- There is no documented rule mapping a spec's `route` value (e.g. `"/payment"`) onto the router's hash-based screen IDs (e.g. `payment`, registered via `registerScreen("payment", …)` in `prototype/utils/router.js`). This mapping is currently done implicitly by whoever writes the screen module, which is itself an undocumented assumption.

**Missing routing failure behaviour**

- `prototype-constitution.md` and `implement-screen.md` both say interaction/navigation behaviour must never be invented, but neither states what happens specifically when a spec's `route`/`destinationId` cannot be resolved to a registered screen ID, when an interaction is present but its trigger/action is unrecognised, or when a spec is silent on back-navigation. The brief's required "STOP → Missing Information Report" behaviour exists today only as a general principle, not as a routing-specific rule.

**Missing component governance**

- No document requires a Component Audit (existing components reused / new reusable components created / screen-only implementations / reasoning) as part of the implementation report. `prototype-constitution.md`'s "Components" section states a check-reuse-extend sequence but does not require evidence of that sequence having been followed in the output, which is consistent with the empty `components/` directory observed above.

**Unclear source hierarchy**

- Beyond the direct contradiction above, neither hierarchy separates *what each source is authoritative for* (identity/routing vs appearance vs reusable components vs raw assets/tokens). The brief is explicit that specification owns identity/routing/behaviour, Figma owns appearance/layout, and the Pattern Library owns reusable components — none of the current documents make this separation; they only rank sources against each other for unspecified "design decisions."

**Unclear Visual QA requirements**

- `visual-qa.md`'s review categories do not include an explicit **Routing** category (only "Interaction": navigation, button behaviour, scrolling, clickable regions) or an explicit **Specification alignment** category. The brief requires QA to compare against *both* the specification and Figma; the current document only ever says "compare against the supplied Figma frame" in its Objective, and never mentions checking implementation against the specification at all.

**Unclear Missing Information Report behaviour**

- Every document that mentions a "Missing Information Report" (the constitution, `implement-screen.md`, `visual-qa.md`, `PERSCREEN.md`) treats it as a known concept but none of them define its structure. There is no canonical list of required sections, so each document's idea of what the report contains is implicit and inconsistent (e.g. `visual-qa.md`'s "Missing Information" review category lists four bullet items; nothing else matches that list). The draft `docs/docs/missing-information.md` (Configuration / Specification / Assets / Conflicts) does not include a **Confidence** section, despite the brief explicitly requiring one.

---

## 3. Target Documentation Map

For each target document: purpose, content it should own, content moved in, content it must not duplicate, and source files affected.

**`prototype-constitution.md`**
- Purpose: standing project rules and principles only.
- Owns: objective, zero-assumption policy (single canonical version), visual fidelity rules, component reuse *policy* (not procedure), token policy (reference only), asset policy (reference only), routing policy (reference only — detail lives in `spec-contract.md`/`implement-screen.md`), implementation boundaries (scope control, one-screen-at-a-time), required outputs (reference, not redefinition).
- Moves in: nothing new; this document is trimmed, not expanded.
- Must not duplicate: setup detail, prompt templates, configuration values, the spec field contract, the QA category list.
- Source files affected: `prototype-constitution.md` (edited — remove configuration-shaped content such as the hardcoded Pattern Library URL, replace with a reference to `project-config.md`).

**`prototype-setup.md`**
- Purpose: project setup, layout and "how things run" reference.
- Owns: directory structure, runtime/server instructions, token generation mechanics, asset symlink conventions, adding-a-screen mechanics, shared-component placement convention.
- Moves in: nothing new from other files; tightened to stop repeating configuration facts that move to `project-config.md`.
- Must not duplicate: the FIGMA/pattern-library keys, spec folder path, default viewport (must reference `project-config.md` instead of restating values).
- Source files affected: `prototype-setup.md` (edited — replace prose configuration facts with a reference to `project-config.md`; resolve the viewport "unresolved question" or explicitly hand it to `project-config.md` as a tracked open item).

**`project-config.md` (new)**
- Purpose: single canonical machine-readable configuration block.
- Owns: `FIGMA_FILE_KEY`, `PATTERN_LIBRARY_FILE_KEY`, specification folder, asset folders (image/icon/illustration), token folder, default viewport, router type, screen module location.
- Content moved in: the Pattern Library URL/key currently embedded in `prototype-constitution.md`; the folder facts currently in `prototype-setup.md`'s "What already exists" table; the router description currently split across `prototype-setup.md`.
- Must not duplicate: setup mechanics (how to run the server), implementation workflow.
- Source files affected: `prototype-constitution.md`, `prototype-setup.md` (both lose configuration prose, replaced with references). Note: a draft of this file already exists at `docs/docs/project-config.md` with placeholder values — see §8.

**`spec-contract.md` (new)**
- Purpose: the canonical definition of the exported specification JSON shape, per the *actual* exporter, not an assumed shape.
- Owns: for every real field (`name`, `layout`, `tree[].nodeId`, `dimensions`, `assets`, `interactions[].trigger/action/destinationId/route`, `tokens`, `components`, `capabilities`) — purpose, required/optional, example, implementation responsibility, and failure behaviour (STOP vs Report).
- Content moved in: the "Source Priority" and "Inputs" sections of `implement-screen.md` that describe what the specification is expected to contain; the implicit route → screen-id mapping currently undocumented anywhere.
- Must not duplicate: Figma resolution steps (owned by `implement-screen.md`), QA verification steps (owned by `visual-qa.md`).
- Source files affected: `implement-screen.md` (loses its informal description of spec contents, replaced with a reference). Note: a draft exists at `docs/docs/spec-contract.md` but its assumed field names (`screenId`, `screenNodeId`, `routes`) do not match the real exported JSON inspected in this review — it must be rewritten against actual spec files, not adopted as-is.

**`implement-screen.md`**
- Purpose: the single implementation workflow, sequenced exactly as in the brief.
- Owns: required/optional inputs (now just specification path + optional screen-ID override + optional notes), the numbered implementation sequence (read constitution → read config → read spec → extract identity → resolve Figma node → inspect Pattern Library → search existing components → extract routing → implement → run QA → report), Figma node resolution method, component reuse process, routing extraction method, reporting requirements (by reference to the constitution's output table).
- Content moved in: the deterministic workflow currently scattered across `prompt-notes.md` ("what the agent should do") and `PERSCREEN.md`.
- Must not duplicate: the zero-assumption "never guess" list (delete the second copy; reference the constitution), the Figma icon normalisation steps (move to `prototype-setup.md` only, reference from here), project rules (objective, fidelity philosophy — owned by the constitution).
- Source files affected: `implement-screen.md` (substantially restructured, de-duplicated against the constitution and `prototype-setup.md`).

**`visual-qa.md`**
- Purpose: verification standard, expanded to explicitly cover specification alignment and routing.
- Owns: layout, spacing, typography, colour, asset, **routing** (new — checked against `interactions[].route`/`destinationId`), **specification verification** (new — checked against the spec, not only Figma), interaction verification, and the PASS / PASS WITH DIFFERENCES / BLOCKED outcomes with confidence statement.
- Content moved in: nothing structural; this document gains two explicit categories and an explicit "compare against both spec and Figma" instruction in its Objective.
- Must not duplicate: the Missing Information Report's structure (reference `missing-information.md` instead of restating four ad hoc bullet items under "Missing Information").
- Source files affected: `visual-qa.md` (edited — add categories, fix Objective wording, replace inline missing-information bullets with a reference).

**`missing-information.md` (new)**
- Purpose: the single canonical Missing Information Report template.
- Owns: Configuration / Specification / Assets / Routing / Interactions / Conflicts / Confidence sections, each with example entries and the STOP-vs-Report distinction per category.
- Content moved in: the ad hoc "Missing Information" bullet list in `visual-qa.md`; the implicit report expectations in `prototype-constitution.md`, `implement-screen.md`, `PERSCREEN.md`.
- Must not duplicate: QA pass/fail logic (owned by `visual-qa.md`).
- Source files affected: `visual-qa.md`, `implement-screen.md`, `prototype-constitution.md` (all replace inline report descriptions with a reference). Note: a draft exists at `docs/docs/missing-information.md` but omits the Confidence section required by the brief — see §8.

**`prompt-notes.md`**
- Purpose: human guidance only — how a person should prepare a prompt, common mistakes, examples.
- Owns: screen-ID conventions, flow-building guidance (connecting screens after individual builds), usability-testing notes (moderated/unmoderated), examples of good vs bad prompts.
- Content removed: the verbose "recommended prompt structure" (Figma link, viewport, acceptance checklist) and the "what the agent should do" workflow — both are implementation rules, not human guidance, and both are superseded by the brief's minimal-prompt target.
- Must not duplicate: the implementation workflow (owned by `implement-screen.md`), the per-screen template itself (owned by `PERSCREEN.md`).
- Source files affected: `prompt-notes.md` (substantially trimmed).

**`PERSCREEN.md`**
- Purpose: the reusable per-screen prompt, reduced to the brief's minimal form.
- Owns: required input (specification path), optional inputs (screen-ID override, notes), a one-line instruction to follow project documentation.
- Content removed: the explicit Figma-link field, the explicit navigation block, the seven-item requirements list (these are now implementation rules owned by `implement-screen.md`, not prompt content).
- Must not duplicate: anything already stated in `implement-screen.md`.
- Source files affected: `PERSCREEN.md` (rewritten; also fixes the broken `docs/project-constitution.md` reference). Note: a draft exists at `docs/docs/PERSCREEN.md` that is already close to this target shape — see §8.

---

## 4. Proposed Source Hierarchy

A single hierarchy, replacing the two conflicting ones in `prototype-constitution.md` and `implement-screen.md`, with responsibility separated by concern rather than one flat list governing every kind of decision:

1. **Project configuration** (`project-config.md`) — MUST be read first. Resolves which Figma file, Pattern Library file, folders and viewport apply. Authoritative for *where to look*, not for any design decision itself.
2. **Specification JSON** (`spec-contract.md`) — Authoritative for screen identity, routing, interactions, actions, copy (where present), and transitions where available. Cursor MUST treat the specification as the only source for these concerns; it MUST NOT fall back to Figma or instruction for routing/identity even if Figma appears to suggest something different.
3. **Figma screen frame** — Authoritative for appearance: layout, spacing, sizing, alignment, typography, colour, imagery placement. Resolved using the node ID found via the specification and the file key found via project configuration, not via a per-prompt URL.
4. **Figma Pattern Library** — Authoritative for reusable component appearance and variant/state behaviour. Consulted before any new component is built.
5. **Existing project components** — Authoritative for what has already been implemented; MUST be searched before creating anything new, regardless of whether the Pattern Library has a matching pattern.
6. **Existing project assets** — Authoritative for which concrete files may be used; MUST NOT be substituted or regenerated.
7. **Design tokens** — Authoritative for concrete values (colour, spacing, typography, radius) once appearance has been determined from Figma; MUST be used in place of hardcoded values wherever a token exists.
8. **Explicit user instruction** — Lowest precedence for design decisions, but MAY override process-level choices (e.g. which screen to build next, optional notes) and MUST be used to resolve a logged conflict if the user explicitly chooses one.

Rule for conflicts: if two sources disagree within the same concern (e.g. specification route vs an apparent Figma prototype link), the source that owns that concern wins (per the separation above), and the disagreement MUST still be logged as a Design Conflict — it is not silently discarded just because precedence resolved it.

---

## 5. Refactoring Plan

**Phase 0 — Triage the existing `docs/docs/` drafts**
- Objective: establish whether the nine files in `docs/docs/` are usable source material, abandoned scratch work, or an accidental artefact, before any target file is written, to avoid overwriting or duplicating work that may already reflect intent.
- Files changed: none (read-only triage).
- Specific actions: confirm with the project owner (see §8) whether `docs/docs/` was generated intentionally; if it is confirmed as draft material, treat its content as a starting point for Phase 2/3 rather than writing target files from scratch; if abandoned, delete the directory in this phase so it cannot be confused with canonical docs during the refactor.
- Risks: proceeding to write `project-config.md` or `spec-contract.md` from scratch while an inconsistent draft sits unreferenced in the repo risks a third, divergent version existing simultaneously.
- Validation: directory listing of `docs/` contains no nested `docs/docs/` once this phase closes.

**Phase 1 — Fix correctness defects (no structural change)**
- Objective: remove the broken reference and the direct hierarchy contradiction without yet restructuring anything, since these are active correctness bugs Cursor could act on today.
- Files changed: `PERSCREEN.md`, `implement-screen.md`.
- Specific edits: correct `docs/project-constitution.md` → `docs/prototype-constitution.md` in `PERSCREEN.md`; align `implement-screen.md`'s "Source Priority" section to match `prototype-constitution.md`'s hierarchy (or remove the section and reference the constitution) so the two documents stop disagreeing.
- Risks: low; these are textual corrections, not behavioural changes.
- Validation: grep the `docs/` tree for `project-constitution.md` (zero matches expected); confirm only one source-hierarchy definition exists across the two files.

**Phase 2 — Introduce `project-config.md`**
- Objective: create the single canonical configuration file and remove configuration prose from the constitution and setup docs.
- Files changed: `project-config.md` (new), `prototype-constitution.md` (edited), `prototype-setup.md` (edited).
- Specific edits: populate `FIGMA_FILE_KEY`, `PATTERN_LIBRARY_FILE_KEY` (move the existing Pattern Library URL/key here), `SPEC_FOLDER`, `TOKEN_FOLDER`, image/icon/illustration folders, router type, and viewport (pending resolution — see §8); replace the corresponding prose in `prototype-constitution.md`'s "Figma Pattern Library" section and `prototype-setup.md`'s "What already exists" table with references to this file.
- Risks: if the real `FIGMA_FILE_KEY` for the screens file (as opposed to the Pattern Library file) is not actually known yet, this file will ship with a placeholder, which must be flagged rather than guessed.
- Validation: no Figma URL or file key appears anywhere in `prototype-constitution.md` or `prototype-setup.md` after this phase; `project-config.md` is the only place either value is defined.

**Phase 3 — Introduce `spec-contract.md`, verified against real exports**
- Objective: define the specification contract against the actual exported JSON shape, not an assumed one.
- Files changed: `spec-contract.md` (new), `implement-screen.md` (edited to remove its informal "Inputs"/spec description).
- Specific edits: enumerate the real top-level screen fields (`name`, `layout`, `tree`, `dimensions`, `assets`, `interactions`) and sub-fields (`tree[].nodeId`, `interactions[].trigger`, `.action`, `.destinationId`, `.route`); define the route → router-screen-ID mapping rule explicitly; define STOP-vs-Report failure behaviour per field; spot-check this contract against a sample of the 28 files in `/specs/` (not only the one inspected here) before finalising.
- Risks: this review only inspected one spec file in depth; other specs may include fields not seen here (e.g. multiple screens per file, transition metadata). The contract must not be finalised from a single sample.
- Validation: every field listed in `spec-contract.md` can be located in at least one real file under `/specs/`; no field name appears in the contract that cannot be found in any export.

**Phase 4 — Introduce `missing-information.md` and wire references**
- Objective: create the single Missing Information Report template, including the Confidence section the brief requires, and point every other document at it instead of restating it.
- Files changed: `missing-information.md` (new), `visual-qa.md` (edited), `implement-screen.md` (edited), `prototype-constitution.md` (edited).
- Specific edits: define Configuration / Specification / Assets / Routing / Interactions / Conflicts / Confidence sections with example entries; replace `visual-qa.md`'s inline "Missing Information" bullet list with a reference; replace the constitution's "Missing Information Report" row in its output table with a reference.
- Risks: low.
- Validation: the phrase "Missing Information Report" appears with a defined structure in exactly one document.

**Phase 5 — Restructure `implement-screen.md` into the deterministic workflow**
- Objective: make `implement-screen.md` the single owner of the numbered implementation sequence, de-duplicated against the constitution.
- Files changed: `implement-screen.md` (substantially rewritten).
- Specific edits: replace the current "Inputs / Source Priority / Zero-Assumption Policy / Before Coding / Implementation Rules / Design Fidelity / Design Tokens / Assets / Navigation / Output" structure with the brief's numbered workflow; remove the second "never guess" list (reference the constitution's single copy instead); remove the duplicated Figma icon normalisation steps (reference `prototype-setup.md`).
- Risks: this is the largest single edit in the plan; review carefully to confirm no rule is dropped rather than relocated (cross-check every removed bullet against its new home before deleting).
- Validation: every rule present in the current `implement-screen.md` exists in exactly one place after the edit (either still there or demonstrably moved); none are silently lost.

**Phase 6 — Expand `visual-qa.md`**
- Objective: add the Routing and Specification verification categories the brief requires.
- Files changed: `visual-qa.md` (edited).
- Specific edits: add a "Routing" category checked against `interactions[].route`/`destinationId`; add a "Specification" category requiring comparison against the spec, not only Figma; update the Objective statement to say the implementation must be compared against both the specification and Figma.
- Risks: low.
- Validation: `visual-qa.md` contains an explicit instruction to check against both sources, and a routing-specific category exists.

**Phase 7 — Trim `prompt-notes.md` and rewrite `PERSCREEN.md`**
- Objective: reduce human guidance to guidance only, and reduce the per-screen prompt to the brief's minimal form.
- Files changed: `prompt-notes.md` (trimmed), `PERSCREEN.md` (rewritten).
- Specific edits: remove the verbose prompt template, acceptance checklist and "what the agent should do" workflow from `prompt-notes.md`, retaining only screen-ID conventions, flow-building guidance and usability-testing notes; rewrite `PERSCREEN.md` to require only a specification path, with optional screen-ID override and notes, referencing the full documentation set rather than restating any rule.
- Risks: existing prompts already in flight (e.g. anyone mid-task using the old `PERSCREEN.md` format) will need to switch to the new minimal form; this should be called out to the user, not silently changed.
- Validation: `PERSCREEN.md` contains no Figma-link field and no explicit navigation block; `prompt-notes.md` contains no implementation workflow.

**Phase 8 — Add component governance**
- Objective: make the existing "search, reuse, extend" policy in the constitution auditable.
- Files changed: `prototype-constitution.md` (edited — output table gains a Component Audit row), `implement-screen.md` (edited — workflow step references the audit requirement).
- Specific edits: add a required "Component Audit" output (existing components reused / new reusable components created / screen-only implementations / reasoning) to the constitution's output table; reference it from the implementation workflow's reporting step.
- Risks: retroactive — the empty `prototype/components/` directory suggests this has not been practised on the 22 screens already built; this phase only fixes the documentation, it does not retrofit existing screens.
- Validation: the constitution's output table includes a Component Audit row; `implement-screen.md`'s final workflow step references it.

---

## 6. Necessary Improvements

Improvements implied by the project's stated goals but not explicitly itemised in the brief:

- **Validate `spec-contract.md` against more than one export before finalising it.** This review found that the brief's assumed field names (`screenId`, `screenNodeId`, `routes`) do not match the one real spec file inspected. The actual refactor work MUST sample multiple files across the 28 in `/specs/` — including any that contain more than one screen per file, since the `screens` field is an array — before the contract is treated as settled.
- **Document the spec-route-to-router-ID mapping rule explicitly.** Real interactions carry `route: "/payment"`-style values; the router registers plain IDs (`payment`). Without a written rule, this translation will continue to be performed implicitly and inconsistently by whoever implements each screen.
- **Reconcile the viewport question rather than letting two answers coexist.** `prototype-setup.md` calls the viewport unresolved; the `docs/docs/` draft asserts `390x844`; the one inspected spec reports `402 × 874` for its screen. `project-config.md` MUST state a single resolved value (or explicitly state that viewport is per-screen and sourced from the spec's `dimensions` field, not from configuration at all).
- **Add a retrospective note about the empty `components/` directory.** Given 22 screens already exist with no shared component extraction, the new Component Audit requirement (Phase 8) should be accompanied by a one-off note (in `prompt-notes.md` or as a tracked task) recommending a future audit pass over existing screens, even though that is implementation work, not documentation work.
- **Cross-reference every new document from the constitution.** The brief asks for internal cross-references; the cleanest way to guarantee this is for `prototype-constitution.md` to carry a short "Documentation Map" list near its top (one line per document, stating what it owns), so Cursor — and humans — always have one place that explains where every rule lives.
- **Version or date-stamp the specification contract.** Real exports already carry a `schemaVersion` and `generator` field (seen in the inspected file) — `spec-contract.md` should record which `schemaVersion` it was written against, so a future exporter change is detectable rather than silently breaking the contract.

---

## 7. Acceptance Criteria

The refactor is complete when:

- Every target document in §3 exists, with the single-responsibility boundaries described, and no canonical project rule exists in more than one document.
- `prototype-constitution.md` and `implement-screen.md` state one, identical, source hierarchy (or `implement-screen.md` contains no hierarchy and references the constitution instead).
- `project-config.md` is the only document containing `FIGMA_FILE_KEY`, `PATTERN_LIBRARY_FILE_KEY`, folder paths, and viewport.
- `spec-contract.md`'s field list has been checked against real files in `/specs/` (not assumed from the brief) and matches at least the sampled set.
- `missing-information.md` is the only document defining the Missing Information Report structure, and it includes a Confidence section.
- `visual-qa.md` explicitly requires comparison against both the specification and Figma, and includes a Routing category.
- `PERSCREEN.md` requires only a specification path as a mandatory input, with screen-ID override and notes as optional inputs, and contains no broken file references.
- `prompt-notes.md` contains no implementation rules — only human guidance.
- The nested `docs/docs/` directory no longer exists as an unresolved duplicate (either deleted or fully absorbed into the canonical files, per the Phase 0 decision).
- A grep across `docs/*.md` for each rule category (zero-assumption list, Figma icon normalisation steps, missing-information structure, output table) returns exactly one canonical hit.

---

## 8. Open Questions / Missing Information

The following must be confirmed before any file is edited:

1. **`docs/docs/` directory** — Is this nested directory intentional draft material for this exact refactor, a leftover from a previous session, or an accidental artefact (e.g. an unintended nested copy from an archive extraction)? This determines whether Phase 0 absorbs or deletes it.
2. **Real `FIGMA_FILE_KEY`** — No canonical document states the file key for the main screens design file (only the Pattern Library's key is present, embedded in a URL). This must be supplied before `project-config.md` can be populated with a real value rather than a placeholder.
3. **Target viewport** — Three different answers exist in the project right now (undecided per `prototype-setup.md`; `390x844` per the `docs/docs/` draft; `402 × 874` observed in one real spec file). Confirm whether viewport is a fixed project-wide constant or must be read per-screen from the specification's `dimensions` field.
4. **Specification contract scope** — This review sampled one of 28 files in `/specs/`. Confirm whether all exports share the same shape (single screen per file, same field set) or whether some contain multiple screens, optional transition metadata, or other variants not observed here.
5. **Existing component debt** — Is a retroactive audit/refactor of the 22 already-implemented screens (whose shared markup does not appear to have been extracted into `prototype/components/`) in scope for this engagement, or is the Component Audit requirement (Phase 8) intended to apply only going forward?
6. **In-flight prompts** — Are there screens currently being implemented using the existing verbose `PERSCREEN.md`/`prompt-notes.md` format that need to finish under the old format before the minimal format takes effect?

---

## 9. Recommended Next Cursor Prompt

Once the above is reviewed and the open questions in §8 are answered, use the following prompt to authorise implementation:

```
Implement the documentation refactor described in documentation-refactor-plan.md.

Follow the phased plan exactly, in order (Phase 0 through Phase 8).

Constraints:
- Do not delete or overwrite docs/docs/ until Phase 0's triage question has been
  answered; treat its content as draft material to verify, not to adopt as-is.
- Do not finalise spec-contract.md from a single sample file — inspect a
  representative sample of /specs/*.json before writing required fields.
- Do not invent FIGMA_FILE_KEY, viewport, or any other unresolved configuration
  value; mark it as a placeholder requiring confirmation and list it explicitly
  in the implementation report.
- Preserve every existing rule from the current documents; if a rule is
  relocated, confirm its new location before removing it from its old one.
- After each phase, report: files changed, rules moved (from -> to), rules
  removed (and why), and any open question encountered that was not already
  listed in documentation-refactor-plan.md §8.

Produce a single implementation report at the end covering all phases.
```

---

**No files have been modified. This is a planning report only.**
