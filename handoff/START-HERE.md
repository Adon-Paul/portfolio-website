# Portfolio continuation — read this first

## Current user request
The live personal-workshop redesign was rejected as too generic and insufficiently focused on actual work. User wants ambitious studio-level visual craft, prominent Melody + Style Transfer AI videos, no mismatched portrait/photos, stronger work/cybersecurity positioning, curated certificates, and explicit instructions for lower-cost models. Awards/perfection are aspirations, never claims.

## Live and working state
- Repo `/home/adon/Projects/Repositiories/portfolio-website`; live `https://adonpaultomy.tech` on GitHub Pages.
- Live baseline `66d67ac` on main. Previous design `566a261` remains historical rollback.
- Current iteration branch `feat/evidence-led-portfolio`. Check git status and `handoff/PROGRESS.md` before touching anything. Never assume the last assistant's plan is the implementation.
- Existing stack React 18/Vite 6, static prerendered route directories. No router or backend required.
- Owner subsequently said “do what is needed,” continuing the earlier push/deploy authorization. Local review and checks are complete; finish release to main and verify GitHub Pages. See PROGRESS for actual deployment status.

## Read in order
1. `handoff/PROGRESS.md` — what is actually done, test results and next task.
2. `docs/research/2026-11-11-evidence-and-direction.md` — sources, limits, new direction.
3. `handoff/DO-NOT-BREAK.md` — hard constraints and protected behavior.
4. `handoff/TASKS.md` — small bounded tasks for Antigravity/OpenCode.
5. Relevant source files only, not the whole repo or history.

## Working contract for every model
- Make one bounded change at a time. State files you will change and the acceptance check.
- Use the configured `agy` CLI for small tasks when available. Do not change model settings or bypass permissions. Headless command denial: supply selected context to a tool-free prompt instead.
- Never run downloaded shell snippets, install arbitrary plugins, rewrite the framework, or upgrade dependencies wholesale to solve a styling task.
- Preserve unrelated user edits. No force push, reset --hard, git clean, or branch deletion.
- After a task, update PROGRESS with actual files, commands/results, limitations and exact next action. Never mark skipped checks as passed.
- If context/usage runs low, finish or revert the individual incomplete edit, record the state, and leave the branch reviewable. Do not fabricate a finished design to satisfy a deadline.
