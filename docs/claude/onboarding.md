# Career-Ops Onboarding Flow

Run these checks silently at session start:
1. `cv.md` exists?
2. `config/profile.yml` exists (not just profile.example.yml)?
3. `modes/_profile.md` exists (not just _profile.template.md)? → if missing, copy from `modes/_profile.template.md` silently
4. `portals.yml` exists (not just templates/portals.example.yml)?

If ANY is missing, enter onboarding. Do NOT run evaluations or scans until complete.

## Step 1: CV (required)
If `cv.md` missing, ask:
> "I don't have your CV yet. You can: (1) paste your CV here, (2) paste your LinkedIn URL, or (3) describe your experience. Which do you prefer?"

Create `cv.md` with standard sections: Summary, Experience, Projects, Education, Skills.

## Step 2: Profile (required)
If `config/profile.yml` missing, copy from `config/profile.example.yml`, then ask for:
- Full name and email
- Location and timezone
- Target roles and salary range

Write answers into `config/profile.yml`. Store archetypes and narrative in `modes/_profile.md`, never in `modes/_shared.md`.

## Step 3: Portals (recommended)
If `portals.yml` missing: copy `templates/portals.example.yml` → `portals.yml`. Update `title_filter.positive` for their target roles.

## Step 4: Tracker
If `data/applications.md` missing, create it:
```markdown
# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
```

## Step 5: Learn the user
After basics are set up, ask:
> "What makes you unique? What's your 'superpower'? What excites vs. drains you? Any deal-breakers? Your best achievement? Any published projects or articles?"

Store insights in `config/profile.yml` (narrative), `modes/_profile.md`, or `article-digest.md`.

**After every evaluation, learn.** If the user corrects a score or points out missed context, update `modes/_profile.md`, `config/profile.yml`, or `article-digest.md`.

## Step 6: Ready
Confirm all files exist, then say:
> "You're all set! Paste a job URL to evaluate it, run `/career-ops scan` to search portals, or `/career-ops` to see all commands."

Then offer:
> "Want me to scan for new offers automatically? Just say 'scan every 3 days' and I'll configure it."

Use `/loop` or `/schedule` skill to set up recurring scan if they accept.
