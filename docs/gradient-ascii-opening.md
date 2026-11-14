# GradientASCII homepage opening

Requested November 13, 2026. React Bits JavaScript/CSS GradientASCII source:
https://github.com/DavidHDev/react-bits/tree/main/src/content/Backgrounds/GradientASCII

Copyright David Haz; license included in `docs/licenses/react-bits-TechText-LICENSE.txt` (same React Bits license used by the existing TechText integration).

`OpeningTransition` mounts on the homepage after hydration. It uses the saved palette's accent-dark, accent, accent-hover and text values; published defaults are unchanged. The component decodes its horizon for 2.4 seconds, then the wrapper begins a 1100ms upward feathered mask reveal 2.7 seconds after the first rendered frame. A 5.5-second deadline and CSS fallback prevent an indefinite cover. Skip, Escape and Tab immediately remove the opening. System reduced motion, saved motion pause and homepage fragments bypass it; switching to reduced motion, pausing or hiding the tab dismisses it. Guide/project pages and no-JavaScript documents open directly.

The page remains mounted and interactive underneath. The artwork receives no pointer interaction; click waves and cursor scrambling are disabled. The opening is decorative, with a native Skip button. The button is removed before the veil clears so it does not linger over the revealed page. Cleanup cancels frames, removes observers/listeners and releases GPU resources through the upstream lifecycle.

Local changes to upstream: first-frame and unavailable-context callbacks, context-loss dismissal, license attribution, and wall-clock intro timing so slower frames do not stretch the decode beyond the transition. No new dependencies. DPR is capped at 1.5 for this integration. Source shader rendering and intro behavior are retained. The exit animates a vertical alpha mask with an 80–160px opaque-to-translucent-to-clear band; the canvas and underlying homepage remain stationary. The initial band sits below the viewport so the beginning stays fully covered.

Browser checks: `tests/opening.spec.js`, alongside the existing full suite. Physical-device/Safari rendering remains untested. The sequence's GPU startup time depends on the device; it is not a network-loading indicator.
