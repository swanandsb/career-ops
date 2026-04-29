# Token Hygiene Guide — career-ops

## When to use /clear

- After finishing an evaluation batch (reports are in files; no need to keep them in context)
- When switching tasks (e.g., from scanning to CV generation)
- When context has grown to 50k+ tokens and feels slow

## When to use /compact

- Mid-session when the conversation is long but you're continuing the same task
- Before starting a large operation (batch eval, multi-company scan) to free headroom

## When to use /model

- Use a faster/cheaper model (`haiku`) for quick tracker lookups or status checks
- Use `sonnet` (default) for evaluations and CV generation
- Use `opus` only for nuanced negotiation scripts or high-stakes offer comparisons

## When to use @file references

Instead of pasting large file content into the chat, reference it directly:
```
@cv.md                         # your CV
@modes/_profile.md             # your profile/archetypes
@config/profile.yml            # comp targets and narrative
@reports/001-company-date.md   # a specific report
```

Claude Code reads these at the point they're referenced, not upfront — saving tokens when the file isn't needed.

## When to use /context

Run `/context` to see what's currently loaded in your context window. If it's large, consider /compact or /clear before the next task.

## Mode file loading

Modes (`modes/oferta.md`, etc.) are loaded on-demand by the skill — they don't load unless you invoke `/career-ops`. Avoid pasting mode file contents into chat; let the skill load them.

## Conversation hygiene

- Don't paste entire JDs into chat — paste the URL and let the skill fetch it
- Don't paste your full CV — use `@cv.md`
- Keep reports in `reports/` and reference by number; don't paste them back
- After a scan run, `/clear` before evaluating to start fresh

## Docs are on-demand

Reference these files only when needed:
- `@docs/claude/onboarding.md` — first-time setup details
- `@docs/claude/language-modes.md` — language mode details
- `@docs/claude/platform-commands.md` — OpenCode/Gemini command tables
- `@docs/claude/conventions.md` — TSV format, file list, health commands
