# ATS Single-Page Reference Standard

Use this as the canonical structure for ATS-optimized CV output in `templates/cv-template.html`.

## Hard Layout Constraints

- Single-column layout only (no grids, sidebars, or multi-column blocks)
- Letter page size, optimized for compact output (1 to 1.5 pages acceptable)
- Margins: `0.45in` on all sides
- Typography:
  - Name: `20px` (Space Grotesk)
  - Section headers: `10.5px`, uppercase (Space Grotesk)
  - Body: `9.5px` (DM Sans)
- Line height:
  - Body: `1.4`
  - Bullets: `1.2`
- Vertical rhythm:
  - `8px` between sections
  - `4px` between list items/entries

## Required Section Order (ATS Standard)

1. Name + contact line (`phone | email | linkedin | portfolio | location`)
2. Summary (italic text, no "Summary" label)
3. Skills (plain text lines by category, e.g. `Languages: Python, SQL, R`)
4. Experience (reverse chronological)
5. Projects
6. Education
7. Certifications (inline list, not stacked rows)

## Content Completeness Rules

- Never truncate text with CSS (`ellipsis`, `line-clamp`, `overflow: hidden` on text content).
- Let content flow naturally across pages when needed.
- Limit bullet volume in content generation, not presentation styling.
- Experience bullets: max 3 bullets per role (enforced in mode/prompt logic, not CSS hiding).
- Keep sections complete; do not hide full entries in CSS.

## Visual Style Rules

- Keep accents only on:
  - Section headers (purple/teal family)
  - Company names (purple/teal family)
- Remove decorative UI patterns:
  - No gradient bars
  - No competency pills/tags
  - No project badges
  - No decorative separators beyond simple text delimiters

## ATS Compatibility Principles

- Keep semantic, text-first HTML that parses cleanly.
- Avoid icon-only metadata.
- Keep links visible as plain text labels.
- Prioritize consistent headings and chronological clarity over visual styling.
