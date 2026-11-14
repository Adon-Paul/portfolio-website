# Homepage guide folders

Owner requested React Bits Folder within the homepage Guides preview on November 13, 2026, then rejected the initial simplified/small version and asked for the original effects with better readability. This document describes the revised interaction. Existing Sunset/Bootcamp/Bandit featured cards and guide-index link remain intact.

Four folders each contain three existing guides: Linux foundations, Linux systems, Bandit lessons, and labs/references. Together they expose the same twelve additional published notes. Article bodies, original copy, static URLs and the full guide index are unchanged.

Source: https://github.com/DavidHDev/react-bits/tree/main/src/content/Components/Folder . Copyright David Haz; license in `docs/licenses/react-bits-TechText-LICENSE.txt`. Solid/flap material is used. The unused WebGL glass compositor is omitted to preserve the existing JS budget; this does not affect the configured solid material.

Restored upstream effects: scroll-in entrance, hover peek, localized tilt, spring flap/page motion, dragging papers out/back and click-to-zoom/put-back. Selecting a paper shows its actual full title/description and a native Read guide link beneath the visual. Dragging does not navigate or select. The optional All guides disclosure is independent of opening the folder; it retains direct links and no-JavaScript browsing. No new dependency or cursor follower.

Readability: two columns on larger screens, larger folder/paper scale, no more than three papers per folder, concise topic labels on custom paper contents. Narrow containers use the original stack layout at a readable scale rather than shrinking a six-page spread. Zoomed paper content stays within its visual area; the selected-guide panel supplies full titles and comfortable reading/touch targets.

Accessibility/source adaptations: standalone native toggle before the papers in keyboard order; no interactive controls nested inside a button; custom-content paper names derive from their visible topic labels; closed papers leave the tab order. Escape closes the active collection and returns toggle focus. Read guide is a separate native link. Source hex parsing is deterministic during SSR, and palette changes update Accent/Project surface live. Motion pause/reduced motion snap animation to its current semantic state; hidden/offscreen suspension and cleanup guards remain in place. User request for original localized tilt/peek supersedes the prior disabled setting only within these folders.

Tests in `tests/guide-folders.spec.js` verify keyboard preview-to-article flow, no-JS lists, 320px/axe/palette, natural Tab order with paused motion, and drag-out without accidental navigation followed by zoom/selection. Desktop/mobile expanded/zoomed screenshots inspected. Safari/physical-device checks not performed.
