# Kinetic editorial iteration

Owner requests: remove green, continuous visible motion, no cursor effects, richer creative content. Standing implementation/release authorization continues. Palette preference question is optional; recommended default charcoal/ivory/orange.

Approach: CSS/SVG motion on the existing visual system rather than a WebGL rebuild or autoplay video. Keep a small moving signature and global pause control available throughout the page. Respect reduced motion; pause while the tab is hidden. No pointer listeners, scroll hijack, requestAnimationFrame loops or animation dependencies. This explicit owner request supersedes the old handoff's ban on continuous decorative animation.

Content: expand actual engineering decisions on home; add labelled interactive explanations of shared queue state and basic text profiling, grounded in existing project documents. These are portfolio illustrations, not remote connections to the apps. Static explanations remain available without JS. No invented metrics, functionality or credentials.

Files: MotionFrame.jsx manages motion preferences/visibility; Workbench.jsx manages the two mini studies; Home.jsx incorporates richer evidence; SignalStudy.jsx adds motion groups; site.css owns palette/animation; App.jsx wraps the whole site. Update favicon/share image/theme colour and handoff.

Checks: failing-to-passing behavioural tests for pause state, queue synchronisation and text counts (including empty input). Browser motion/pause/reduced-motion/live preference checks plus existing mobile, keyboard, axe, playback, no-JS and static routes. Inspect desktop/mobile screenshots. Run full Chromium/Firefox suites and build budgets, then commit/push/deploy and verify the live revision.
