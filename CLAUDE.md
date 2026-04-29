# Career-Ops — AI Job Search Pipeline

## Session Startup (run silently every session)

```bash
node update-system.mjs check
```
- `update-available` → tell user: "career-ops update available (v{local} → v{remote}). Your data will NOT be touched. Want me to update?" → `apply` or `dismiss`
- `up-to-date` / `dismissed` / `offline` → say nothing

Then check: `cv.md`, `config/profile.yml`, `modes/_profile.md`, `portals.yml` exist.
If `modes/_profile.md` missing → copy from `modes/_profile.template.md` silently.
If any other file missing → enter onboarding. See `@docs/claude/onboarding.md`.

---

## Data Contract (CRITICAL)

**User layer (NEVER auto-updated):** `cv.md`, `config/profile.yml`, `modes/_profile.md`, `article-digest.md`, `portals.yml`, `data/*`, `reports/*`, `output/*`, `interview-prep/*`

**System layer (auto-updatable):** `modes/_shared.md`, `modes/oferta.md`, all other modes, `CLAUDE.md`, `*.mjs`, `templates/*`, `batch/*`

**THE RULE:** User customizations (archetypes, narrative, comp, negotiation, location) → always write to `modes/_profile.md` or `config/profile.yml`. NEVER edit `modes/_shared.md` for user-specific content.

---

## Skill Routing

| User action | Mode |
|-------------|------|
| Pastes JD or URL | `auto-pipeline` (eval + report + PDF + tracker) |
| Evaluate offer | `oferta` |
| Compare offers | `ofertas` |
| LinkedIn outreach | `contacto` |
| Company research | `deep` |
| Interview prep | `interview-prep` |
| Generate CV/PDF | `pdf` |
| LaTeX export | `latex` |
| Evaluate course/cert | `training` |
| Evaluate portfolio project | `project` |
| Application status | `tracker` |
| Fill application form | `apply` |
| Scan portals | `scan` |
| Process pending URLs | `pipeline` |
| Batch process | `batch` |
| Rejection patterns | `patterns` |
| Follow-up cadence | `followup` |

Language modes (`modes/de/`, `modes/fr/`, `modes/ja/`, `modes/pt/`, `modes/ru/`) activate when user targets that market or sets `language.modes_dir` in `config/profile.yml`. Details: `@docs/claude/language-modes.md`.

---

## Critical Rules

**Ethics:** Never submit an application without user review. Recommend against applying if score < 4.0/5.

**Offer verification:** ALWAYS verify with Playwright (`browser_navigate` → `browser_snapshot`), not WebFetch. Exception: batch mode (`claude -p`) → use WebFetch + mark `**Verification:** unconfirmed (batch mode)`.

**CV source of truth:** Read `cv.md` and `article-digest.md` at evaluation time. NEVER hardcode metrics.

**Tracker — NEVER add entries directly to `applications.md`.** Write TSV to `batch/tracker-additions/{num}-{slug}.tsv`. Run `node merge-tracker.mjs` after each batch.

**Tracker — NEVER create a new entry if company+role already exists.** Update the existing row.

**Pipeline integrity:** Reports must include `**URL:**` and `**Legitimacy:** {tier}`. All statuses must be canonical (source: `templates/states.yml`). Health check: `node verify-pipeline.mjs`.

---

## Canonical Statuses

`Evaluated` · `Applied` · `Responded` · `Interview` · `Offer` · `Rejected` · `Discarded` · `SKIP`

Rules: no bold, no dates, no extra text in the status field.

---

## On-Demand Docs

Load only when needed:
- `@docs/claude/onboarding.md` — full first-run setup flow
- `@docs/claude/conventions.md` — file list, TSV format, health commands
- `@docs/claude/language-modes.md` — language mode details
- `@docs/claude/platform-commands.md` — OpenCode and Gemini CLI command tables
- `@docs/claude/TOKEN_USAGE.md` — token hygiene guide
- `@DATA_CONTRACT.md` — full data contract
