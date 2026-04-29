# Conventions & File Reference

## Key Files

| File | Purpose |
|------|---------|
| `cv.md` | Canonical CV (source of truth) |
| `article-digest.md` | Compact proof points |
| `config/profile.yml` | Profile, comp targets, archetypes |
| `modes/_profile.md` | User-specific framing (wins over _shared.md) |
| `modes/_shared.md` | System defaults — no user data here |
| `data/applications.md` | Application tracker |
| `data/pipeline.md` | Pending URL inbox |
| `data/scan-history.tsv` | Scanner dedup history |
| `portals.yml` | Portal queries and company config |
| `templates/cv-template.html` | HTML CV template |
| `templates/cv-template.tex` | LaTeX CV template |
| `templates/states.yml` | Canonical status definitions |
| `reports/` | Evaluation reports: `{###}-{slug}-{YYYY-MM-DD}.md` |
| `output/` | Generated PDFs (gitignored) |
| `jds/` | Local JD files (`local:jds/{file}`) |

## Stack

Node.js (`.mjs` modules), Playwright (PDF + scraping), YAML (config), HTML/CSS (template), Markdown (data).

## TSV Tracker Addition Format

Write `batch/tracker-additions/{num}-{company-slug}.tsv` — one line, 9 tab-separated columns:

```
{num}\t{date}\t{company}\t{role}\t{status}\t{score}/5\t{pdf_emoji}\t[{num}](reports/{...}.md)\t{note}
```

Column order: num → date → company → role → **status** → score → pdf → report → notes
Note: In `applications.md` score comes BEFORE status — `merge-tracker.mjs` handles the swap.

## Health Commands

```bash
node verify-pipeline.mjs    # integrity check
node normalize-statuses.mjs # fix non-canonical statuses
node dedup-tracker.mjs      # remove duplicate rows
node merge-tracker.mjs      # merge TSV additions into tracker
```

Run `node merge-tracker.mjs` after every batch of evaluations.
