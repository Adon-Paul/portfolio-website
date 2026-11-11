# Small continuation tasks

Read PROGRESS first. The redesign, demos, certificate gallery, manuscript and lab summary are already implemented; do not recreate them.

1. **Visual feedback:** change only Home.jsx and relevant site.css rules for a specific owner-requested adjustment. Screenshot 390/1440 and run browser tests. No framework/theme rewrite.
2. **LumiSense demo:** accept an actual supplied recording. Add video/poster/demoSteps in project data and reuse ProjectMedia. Preserve both old videos. Check playback, failure, no eager fetch, keyboard and layout.
3. **Résumé updates:** the conservative, reviewed résumé is now public and linked in Contact. Update graduation/role dates only when the owner supplies them. Regenerate both PDF copies from docs/career HTML; no inflated skills or outcomes.
4. **Cross-browser QA:** run Safari/Firefox/physical-device checks when available. Report specific browser/version and reproduction; never imply Chromium covers them.
5. **Release:** after the design review, merge to main and deploy using existing workflow; inspect Action result, HTTPS and all routes. Owner has now authorized completing the release. Check PROGRESS before repeating it.

Prompt for Antigravity/OpenCode:
“Read AGENTS.md, handoff/START-HERE.md and handoff/PROGRESS.md. Work only on task N and the named files. Preserve DO-NOT-BREAK.md. Run the acceptance check and record exact changes/results/next action. Do not redo completed work, change hosting or deploy unless that is the assigned task.”
