# GradientASCII homepage opening

Requested November 13, 2026. React Bits JavaScript/CSS GradientASCII source:
https://github.com/DavidHDev/react-bits/tree/main/src/content/Backgrounds/GradientASCII

Copyright David Haz; license included in `docs/licenses/react-bits-TechText-LICENSE.txt` (same React Bits license used by the existing TechText integration).

`OpeningTransition` mounts on the homepage after hydration. It uses the saved palette's accent-dark, accent, accent-hover and text values; published defaults are unchanged. The component decodes its horizon for 2.4 seconds, then the wrapper begins a 1100ms upward feathered mask reveal 2.7 seconds after the first rendered frame. A 5.5-second deadline and CSS fallback prevent an indefinite cover. Skip, Escape and Tab immediately remove the opening. System reduced motion, saved motion pause and homepage fragments bypass it; switching to reduced motion, pausing or hiding the tab dismisses it. Guide/project pages and no-JavaScript documents open directly.

The page remains mounted and interactive underneath. The artwork receives no pointer interaction; click waves and cursor scrambling are disabled. The opening is decorative, with a native Skip button. The button is removed before the veil clears so it does not linger over the revealed page. Cleanup cancels frames, removes observers/listeners and releases GPU resources through the upstream lifecycle.

Local changes to upstream: first-frame and unavailable-context callbacks, context-loss dismissal, license attribution, and wall-clock intro timing so slower frames do not stretch the decode beyond the transition. No new dependencies. DPR is capped at 1.5 for this integration. Source shader rendering and intro behavior are retained. The exit animates a vertical alpha mask with an 80–160px opaque-to-translucent-to-clear band; the canvas and underlying homepage remain stationary. The initial band sits below the viewport so the beginning stays fully covered.

Browser checks: `tests/opening.spec.js`, alongside the existing full suite. Physical-device/Safari rendering remains untested. The sequence's GPU startup time depends on the device; it is not a network-loading indicator.

November 15: opening now reflects loading readiness, rather than a fixed 2.7-second hold. Hero loads concurrently; splash exits once its first frame, document fonts, and hero ready/fallback state are available. Failed hero import or unsupported graphics resolves to fallback. Existing 5.5-second hard deadline, skip/Escape/Tab, reduced motion, deep-link bypass and feathered exit remain. Videos are not loading prerequisites.

November 15 follow-up: owner requested full playback even when loading completes early. Minimum artwork playback is 2700ms from first rendered frame (decode intro is 2400ms). Normal exit requires playback complete AND fonts/hero ready, followed by the existing 1100ms feather. At 8 seconds the graceful exit starts even if loading stalls; CSS emergency removal is at 10 seconds so it cannot clip that exit. Skip and accessibility bypasses remain immediate. Status text fades during exit. Browser regression measures minimum playback and exit duration.

November 16: initial HTML contains critical inline loading-layer CSS and a small prepaint bootstrap. Eligible homepage visits show an opaque cover before the application bundle loads. The cover hands off only after the animated splash's first frame; no homepage reveal occurs between layers. Initial Skip/Escape/Tab work even while the module is stalled, with a 10-second bundle-failure escape. No-JS, reduced-motion, paused-motion and deep-link browsing remain direct. Animated splash blocks pointer access to underlying controls until its graceful reveal, and its stacking level is above the floating explorer.
