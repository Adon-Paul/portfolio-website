# Small continuation tasks

Read PROGRESS first. The redesign, demos, certificate gallery, manuscript and lab summary are already implemented; do not recreate them.

1. **Palette/visual feedback:** use Palette studio for local experiments. Preserve all published defaults unless explicitly changed by owner. A future published palette change belongs in src/content/palette.js, followed by regenerating sharing artwork and normal verification. No framework/theme rewrite.
2. **LumiSense demo:** accept an actual supplied recording. Add video/poster/demoSteps in project data and reuse ProjectMedia. Preserve both old videos. Check playback, failure, no eager fetch, keyboard and layout.
3. **Résumé updates:** the conservative, reviewed résumé is now public and linked in Contact. Update graduation/role dates only when the owner supplies them. Regenerate both PDF copies from docs/career HTML; no inflated skills or outcomes.
4. **Cross-browser QA:** run Safari/Firefox/physical-device checks when available. Report specific browser/version and reproduction; never imply Chromium covers them.
5. **Future releases:** the current release is complete. For subsequent authorized changes, use the existing workflow and verify Action result, HTTPS and routes. Do not repeat the completed redesign/deployment.

Prompt for Antigravity/OpenCode:
“Read AGENTS.md, handoff/START-HERE.md and handoff/PROGRESS.md. Work only on task N and the named files. Preserve DO-NOT-BREAK.md. Run the acceptance check and record exact changes/results/next action. Do not redo completed work, change hosting or deploy unless that is the assigned task.”
