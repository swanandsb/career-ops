# Platform Commands Reference

All platforms share the same `modes/*` files and `.claude/skills/career-ops/SKILL.md`.

## Claude Code

| Skill command | Description |
|---------------|-------------|
| `/career-ops` | Menu or evaluate JD |
| `/career-ops scan` | Scan portals |
| `/career-ops oferta` | Evaluate offer |
| `/career-ops ofertas` | Compare offers |
| `/career-ops pdf` | Generate CV/PDF |
| `/career-ops latex` | Export LaTeX |
| `/career-ops pipeline` | Process pending URLs |
| `/career-ops deep` | Company research |
| `/career-ops contacto` | LinkedIn outreach |
| `/career-ops apply` | Application assistant |
| `/career-ops tracker` | Status overview |
| `/career-ops training` | Evaluate course/cert |
| `/career-ops project` | Evaluate portfolio project |
| `/career-ops batch` | Batch processing |
| `/career-ops patterns` | Rejection pattern analysis |
| `/career-ops followup` | Follow-up cadence |
| `/career-ops interview-prep` | Interview prep |

## OpenCode — same commands, defined in `.opencode/commands/`

Prefix: `/career-ops-{mode}` (e.g. `/career-ops-scan`, `/career-ops-evaluate`)

## Gemini CLI — same commands, defined in `.gemini/commands/`

Same prefix pattern as OpenCode. Context auto-loaded from `GEMINI.md`.
